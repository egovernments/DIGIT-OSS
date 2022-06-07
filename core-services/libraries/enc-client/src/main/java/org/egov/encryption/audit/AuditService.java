package org.egov.encryption.audit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.encryption.config.DecryptionPolicyConfiguration;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.models.AuditObject;
import org.egov.encryption.models.UniqueIdentifier;
import org.egov.encryption.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AuditService {

    @Autowired
    private Producer producer;
    @Autowired
    private EncProperties encProperties;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private DecryptionPolicyConfiguration decryptionPolicyConfiguration;

    public void audit(JsonNode json, String model, String purpose, RequestInfo requestInfo) {
        User user = requestInfo.getUserInfo();

        AuditObject auditObject = AuditObject.builder().build();
        auditObject.setId(UUID.randomUUID().toString());
        auditObject.setTimestamp(System.currentTimeMillis());
        auditObject.setUserId(user.getUuid());
        auditObject.setModel(model);
        auditObject.setPurpose(purpose);

        if(requestInfo.getPlainAccessRequest() != null) {
            auditObject.setPlainAccessRequest(requestInfo.getPlainAccessRequest());
        }

        UniqueIdentifier uniqueIdentifier =
                decryptionPolicyConfiguration.getUniqueIdentifierForModel(model);
        List<String> entityIds = new ArrayList<>();
        for(JsonNode node : json) {
            entityIds.add(node.get(uniqueIdentifier.getJsonPath()).asText());
        }
        auditObject.setEntityIds(entityIds);

        producer.push(encProperties.getAuditTopicName(), auditObject.getId(), objectMapper.valueToTree(auditObject).toString());
    }

}
