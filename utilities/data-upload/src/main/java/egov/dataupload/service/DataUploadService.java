package egov.dataupload.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.wnameless.json.JacksonJsonValue;
import com.github.wnameless.json.flattener.JsonFlattener;
import egov.dataupload.models.DataUploadConfig;
import egov.dataupload.models.Mapping;
import egov.dataupload.models.Step;
import egov.dataupload.repository.ServiceRequestRepository;
import egov.dataupload.service.extensions.Transformer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.Charsets;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.*;

import static egov.dataupload.utils.Utils.getErrorMessages;

@Service
@Slf4j
public class DataUploadService {

    private final List<Transformer> transformers;
    private final Map<String, DataUploadConfig> configMap;
    private final ServiceRequestRepository serviceRequestRepository;
    private final FileStoreService fileStoreService;

    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, Object> extensions = new HashMap<>();

    @Autowired
    public DataUploadService(List<Transformer> transformers, Map<String, DataUploadConfig> configMap,
                             ServiceRequestRepository serviceRequestRepository, FileStoreService fileStoreService) {
        this.transformers = transformers;
        this.configMap = configMap;
        this.serviceRequestRepository = serviceRequestRepository;
        this.fileStoreService = fileStoreService;
    }

    @PostConstruct
    private void init(){
        transformers.forEach( t -> extensions.put(t.name(), t));
    }

    public String upload(String service, String template, String tenantId, MultipartFile file, RequestInfo requestInfo){
        Path outputTempFile = null;
        try {
            outputTempFile = Files.createTempFile("dataupload-results-",".csv");
            try (InputStreamReader input = new InputStreamReader(file.getInputStream(),
                    Charset.forName(Charsets.UTF_8.toString()));
                 BufferedWriter writer =new BufferedWriter(Files.newBufferedWriter(outputTempFile,
                         Charsets.UTF_8, StandardOpenOption.WRITE))) {
                Mapping mapping = getMappingForTemplate(service, template);

                CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(input);

                // validate headers by trimming and ignoring case
                validateHeaders(mapping.getHeaders(), csvParser.getHeaderNames());

                List<String> outputHeaders = getOutputHeaders(csvParser);
                CSVPrinter csvPrinter = new CSVPrinter(writer,
                        CSVFormat.DEFAULT.withHeader(outputHeaders.toArray(new String[0])));

                for (CSVRecord record : csvParser) {
                    Map<String, Object> scopes = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
                    scopes.putAll(extensions);
                    List<String> outputRecord = new ArrayList<>(record.toMap().values());

                    //trim, and then add
                    addToScopes(scopes, record.toMap());

                    scopes.put("RequestInfo", objectMapper.writeValueAsString(requestInfo));
                    scopes.put("tenantId", tenantId);
                    for (Step step : mapping.getSteps()) {
                        StringWriter stringWriter = new StringWriter();
                        step.getMustacheTemplate().execute(stringWriter, scopes);
                        String requestBody = stringWriter.toString();
                        JsonNode response = null;
                        try {
                            response = serviceRequestRepository.fetchResult(step.getUrl(), requestBody);
                            outputRecord.add("OK");
                        } catch (HttpClientErrorException e) {
                            outputRecord.add("FAIL");
                            outputRecord.add(getErrorMessages(e.getResponseBodyAsString()));
                        } catch (Exception e) {
                            outputRecord.add("FAIL");
                            outputRecord.add("SERVER_ERROR");
                        }
                        csvPrinter.printRecord(outputRecord);

                        if (response != null) {
                            if (mapping.getSteps().size() > 1) {
                                Map<String, Object> map = JsonFlattener.flattenAsMap(new JacksonJsonValue(response));
                                scopes.put(step.getId(), map);
                            }
                        }

                    }
                }
                csvPrinter.flush();
                return fileStoreService.uploadFile(outputTempFile.toFile(), tenantId);
            } catch (IOException e) {
                log.error("Failed to read multipart file or parse CSV");
                throw new CustomException("UPLOAD_FAILED", "Failed to process file!");
            }
        }catch (IOException e){
            log.error("Failed to read multipart file or parse CSV");
            throw new CustomException("UPLOAD_FAILED", "Failed to process file!");
        } finally {
            if(outputTempFile != null)
                outputTempFile.toFile().delete();
        }
    }

    private void addToScopes(Map<String, Object> scopes, Map<String, String> additives){
        additives.keySet().forEach( k -> {
            scopes.put(k.trim(), additives.get(k));
        });
    }

    private void validateHeaders(List<String> expectedHeaders, List<String> requestHeaders){
        for(String expectedHeader : expectedHeaders){
            boolean isMatched =
                    requestHeaders.stream().anyMatch( s -> s.trim().equalsIgnoreCase(expectedHeader.trim()));
            if(!isMatched)
                throw new CustomException("INVALID_HEADERS", "Invalid headers found. Please use the correct template " +
                        "for this operation");
        }
    }

    private List<String> getOutputHeaders(CSVParser csvParser){
        List<String> headers = new ArrayList<>(csvParser.getHeaderNames());
        headers.add("Status");
        headers.add("Reason");
        return headers;
    }

    private Mapping getMappingForTemplate(String service, String template){
        DataUploadConfig config = configMap.get(service);
        if(config != null) {
            for (Mapping mapping : config.getMappings()) {
                if (mapping.getId().equalsIgnoreCase(template))
                    return mapping;
            }
        }
        throw new CustomException("TEMPLATE_NOT_FOUND", "No template configured for given service and " +
                "template!");
    }

}
