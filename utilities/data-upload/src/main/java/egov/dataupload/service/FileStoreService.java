package egov.dataupload.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.File;

@Service
@Slf4j
public class FileStoreService {
    @Value("${egov.filestore.host}")
    private String fileStoreHost;

    @Value("${egov.filestore.path}")
    private String fileStorePath;

    @Autowired
    private RestTemplate restTemplate;

    public String uploadFile(File file, String tenantId){
        String url = fileStoreHost + fileStorePath;
        try {
            LinkedMultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
            map.add("file", new FileSystemResource(file));
            map.add("tenantId", tenantId);
            map.add("module", "DATA-UPLOAD");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
            ResponseEntity<JsonNode> result = restTemplate.exchange(
                    url, HttpMethod.POST, requestEntity,
                    JsonNode.class);

            log.info("File store upload completed with response code: "+result.getStatusCode());
            if(result.getBody() != null)
                return result.getBody().at("/files/0/fileStoreId").textValue();
            else
                throw new CustomException("OUTPUT_FAILED", "Failed to upload output file to filestore.");
        }catch (HttpClientErrorException e) {
            log.error("Unable to process file!", e);
            throw new CustomException("OUTPUT_FAILED", "Failed to upload output file to filestore.");
        } catch (Exception e) {
            log.error("Failed to process file!", e);
            throw new CustomException("OUTPUT_FAILED", "Failed to upload output file to filestore.");
        }
    }
}
