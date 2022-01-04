package org.egov.chat.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

@Slf4j
@PropertySources({
        @PropertySource("classpath:xternal.properties"),
        @PropertySource("classpath:application.properties")
})
@Component
public class FileStore {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Value("${filestore.service.host}")
    private String fileStoreHost;
    @Value("${filestore.service.put.endpoint}")
    private String fileStorePutEndpoint;
    @Value("${filestore.service.get.url.endpoint}")
    private String fileStoreGetEndpoint;

    @Value("${module.name}")
    private String moduleName;
    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;

    public String downloadAndStore(String getLink) {
        String filename = FilenameUtils.getName(getLink);
        return downloadAndStore(getLink, filename);
    }

    public String downloadAndStore(String getLink, String filename) {
        return downloadAndStore(getLink, filename, stateLevelTenantId, moduleName);
    }

    public String convertFromBase64AndStore(String imageInBase64String) throws IOException {
        String tmpFileName = "pgr-whatsapp-" + System.currentTimeMillis() + ".jpeg";
        File tempFile = new File(tmpFileName);
        imageInBase64String = imageInBase64String.replaceAll(" ", "+");
        byte[] bytes = Base64.getDecoder().decode(imageInBase64String);
        FileUtils.writeByteArrayToFile(tempFile, bytes);
        String fileStoreId = saveToFileStore(tempFile);
        tempFile.delete();
        return fileStoreId;
    }

    public String downloadAndStore(String getLink, String filename, String tenantId, String module) {
        try {
            File tempFile = getFileAt(getLink, filename);
            String fileStoreId = saveToFileStore(tempFile, tenantId, module);
            tempFile.delete();
            return fileStoreId;
        } catch (Exception e) {
            log.error("Get File failed", e);
        }
        return null;
    }

    public String saveToFileStore(File file) {
        return saveToFileStore(file, stateLevelTenantId, moduleName);
    }

    public String saveToFileStore(File file, String tenantId, String module) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();

        formData.add("tenantId", tenantId);
        formData.add("module", module);
        formData.add("file", new FileSystemResource(file));

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(formData, headers);

        ResponseEntity<ObjectNode> response = restTemplate.exchange(fileStoreHost + fileStorePutEndpoint,
                HttpMethod.POST, request, ObjectNode.class);
        log.debug("File Store response : " + response.getBody().toString());
        return response.getBody().get("files").get(0).get("fileStoreId").asText();
    }

    public File getFileForFileStoreId(String fileStoreId) throws IOException {
        return getFileForFileStoreId(fileStoreId, stateLevelTenantId);
    }

    public File getFileForFileStoreId(String fileStoreId, String tenantId) throws IOException {
        /*if (fileStoreId.length() > 40) {                     // TODO : Check if direct link provided (If length > 40 then direct link is provided)
            String fileURL = fileStoreId;
            String refinedURL = getRefinedFileURL(fileURL);
            String filename = FilenameUtils.getName(refinedURL);
            filename = filename.substring(13, filename.indexOf("?"));
            return getFileAt(refinedURL, filename);
        }*/
        UriComponentsBuilder uriComponents = UriComponentsBuilder.fromUriString(fileStoreHost + fileStoreGetEndpoint);
        uriComponents.queryParam("tenantId", tenantId);
        uriComponents.queryParam("fileStoreIds", fileStoreId);
        String url = uriComponents.buildAndExpand().toUriString();

        ResponseEntity<ObjectNode> response = restTemplate.getForEntity(url, ObjectNode.class);

        String fileURL = getRefinedFileURL(response.getBody().get(fileStoreId).asText());
        String filename = FilenameUtils.getName(fileURL);
        filename = filename.substring(13, filename.indexOf("?"));       // TODO : 13 characters set by fileStore service
        return getFileAt(fileURL, filename);
    }

    public String getRefinedFileURL(String fileURL) {
        if (fileURL.contains(",")) {             // TODO : Because fileStore service returns , separated list of files
            return fileURL.substring(0, fileURL.indexOf(","));
        }
        return fileURL;
    }

    public File getFileAt(String getLink, String filename) throws IOException {
        File tempFile = new File(filename);
        URL url = new URL(getLink);
        FileUtils.copyURLToFile(url, tempFile);
        return tempFile;
    }

    public String getBase64EncodedStringOfFile(File file) throws IOException {
        return new String(Base64.getEncoder().encode(FileUtils.readFileToByteArray(file)));
    }

}
