package org.egov.encryption.audit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.LongNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import org.egov.common.contract.request.User;
import org.egov.encryption.config.DecryptionPolicyConfiguration;
import org.egov.encryption.config.EncProperties;
import org.egov.encryption.models.AuditObject;
import org.egov.encryption.models.SecurityPolicyUniqueIdentifier;
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

    public void audit(JsonNode json, String model, String purpose, User user) {
        AuditObject auditObject = AuditObject.builder().build();
        auditObject.setId(UUID.randomUUID().toString());
        auditObject.setTimestamp(System.currentTimeMillis());
        auditObject.setUserId(user.getUuid());
        auditObject.setModel(model);
        auditObject.setPurpose(purpose);

        SecurityPolicyUniqueIdentifier uniqueIdentifier =
                decryptionPolicyConfiguration.getUniqueIdentifierForKey(model);
        List<String> entityIds = new ArrayList<>();
        for(JsonNode node : json) {
            entityIds.add(node.at(uniqueIdentifier.getJsonPath()).asText());
        }
        auditObject.setEntityIds(entityIds);

        producer.push(encProperties.getAuditTopicName(), auditObject.getId(), objectMapper.valueToTree(auditObject).toString());
    }

    public void audit(JsonNode data, User user) {
        AuditObject auditObject = AuditObject.builder().build();
        auditObject.setData(data);
        auditObject.setTimestamp(System.currentTimeMillis());
        auditObject.setUserId(user.getUuid());
        auditObject.setId(UUID.randomUUID().toString());

        producer.push(encProperties.getAuditTopicName(), auditObject.getId(), objectMapper.valueToTree(auditObject).toString());
    }

    public void audit(String userId, Long timestamp, String purpose, JsonNode abacParams, JsonNode data) {
        ObjectNode auditObject = objectMapper.createObjectNode();

        auditObject.set("id", TextNode.valueOf(UUID.randomUUID().toString()));
        auditObject.set("userId", TextNode.valueOf(userId));
        auditObject.set("timestamp", LongNode.valueOf(timestamp));
        auditObject.set("purpose", TextNode.valueOf(purpose));
        auditObject.set("abacParams", abacParams);
        auditObject.set("data", data);

        producer.push(encProperties.getAuditTopicName(), auditObject.get("id").asText(), auditObject);
    }

}
