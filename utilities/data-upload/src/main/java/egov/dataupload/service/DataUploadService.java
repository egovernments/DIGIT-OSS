package egov.dataupload.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.wnameless.json.JacksonJsonValue;
import com.github.wnameless.json.flattener.JsonFlattener;
import egov.dataupload.models.DataUploadConfig;
import egov.dataupload.models.Mapping;
import egov.dataupload.models.Step;
import egov.dataupload.repository.ServiceRequestRepository;
import egov.dataupload.service.extensions.Transformer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DataUploadService {

    private final List<Transformer> transformers;
    private final Map<String, DataUploadConfig> configMap;
    private final ServiceRequestRepository serviceRequestRepository;

    private Map<String, Object> extensions = new HashMap<>();

    @Autowired
    public DataUploadService(List<Transformer> transformers, Map<String, DataUploadConfig> configMap, ServiceRequestRepository serviceRequestRepository) {
        this.transformers = transformers;
        this.configMap = configMap;
        this.serviceRequestRepository = serviceRequestRepository;
    }



    @PostConstruct
    private void init(){
        transformers.forEach( t -> extensions.put(t.name(), t));
    }

    public void upload(String service, String template, MultipartFile file){
        try(InputStreamReader input = new InputStreamReader(file.getInputStream())) {
            Mapping mapping = getMappingForTemplate(service, template);


            CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(input);
            for (CSVRecord record : csvParser) {
                Map<String, Object> scopes = new HashMap<>(extensions);
                scopes.putAll(record.toMap());
                for(Step step : mapping.getSteps()){
                    StringWriter stringWriter = new StringWriter();
                    step.getBodyTemplate().execute(stringWriter, scopes);
                    String requestBody = stringWriter.toString();
                    JsonNode response = null;
                    try {
                        response = serviceRequestRepository.fetchResult(step.getUrl(), requestBody);
                    } catch(HttpClientErrorException e){
                        // do something
                    }

                    if(response !=null){
                        if(mapping.getSteps().size() > 1){
                            Map<String, Object> map = JsonFlattener.flattenAsMap(new JacksonJsonValue(response));
                            scopes.put(step.getId(), map);
                        }
                    }

                }
            }
        }catch (IOException e){
            log.error("Failed to read multipart file or parse CSV");
            throw new CustomException("UPLOAD_FAILED", "Failed to process file!");
        }
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
