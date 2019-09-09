package org.egov.encryption;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.web.contract.EncReqObject;
import org.egov.encryption.web.contract.EncryptionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

@Slf4j
@Component
class EncryptionServiceRestConnection {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;


    Object callEncrypt(String tenantId, String type, Object value) throws IOException {

        EncReqObject encReqObject = new EncReqObject(tenantId, type, value);
        EncryptionRequest encryptionRequest = new EncryptionRequest();
        encryptionRequest.setEncryptionRequests(new ArrayList<>(Collections.singleton(encReqObject)));

        ResponseEntity<String> response = restTemplate.postForEntity(encProperties.getEgovEncHost() + encProperties.getEgovEncEncryptPath() ,
                encryptionRequest, String.class);
        return objectMapper.readTree(response.getBody()).get(0);
    }

    Object callDecrypt(Object ciphertext) throws IOException {
        ResponseEntity<String> response = restTemplate.postForEntity(encProperties.getEgovEncHost() + encProperties.getEgovEncDecryptPath(),
                ciphertext, String.class);
        return objectMapper.readTree(response.getBody());
    }

}