package egov.casemanagement.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.config.Configuration;
import egov.casemanagement.models.sign.SignRequest;
import egov.casemanagement.models.sign.SignResponse;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Base64;
import java.util.LinkedHashMap;

@Repository
@Slf4j
public class SignatureRepository {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Configuration configuration;

    public String sign(String tenantId, Object object){

        if(object == null)
            throw new IllegalStateException("Object to be signed cannot be null");

        String uri = configuration.getEncServiceHost() + configuration.getEncServicePath();

        try {
            String json = objectMapper.writeValueAsString(object);
            String payload = new String(Base64.getEncoder().encode(json.getBytes()));
            SignRequest signRequest = new SignRequest(tenantId, payload);

            LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, signRequest);
            SignResponse signResponse = objectMapper.convertValue(responseMap, SignResponse.class);
            return signResponse.getSignature();
        }catch (JsonProcessingException e) {
            log.error("Failed to convert object to JSON", e);
            throw new CustomException("SIGN_FAILED", "Unable to generate signature");
        }
    }

}
