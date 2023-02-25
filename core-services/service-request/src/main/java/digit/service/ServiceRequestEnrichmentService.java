package digit.service;

import digit.models.coremodels.AuditDetails;
import digit.web.models.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Component;

import java.util.*;

import static digit.constants.Constants.*;

@Component
public class ServiceRequestEnrichmentService {

    public void enrichServiceDefinitionRequest(ServiceDefinitionRequest serviceDefinitionRequest) {
        ServiceDefinition serviceDefinition = serviceDefinitionRequest.getServiceDefinition();
        RequestInfo requestInfo = serviceDefinitionRequest.getRequestInfo();

        // Enrich ID for service definition
        serviceDefinition.setId(UUID.randomUUID().toString());

        // Prepare audit details
        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setCreatedBy(requestInfo.getUserInfo().getUuid());
        auditDetails.setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        auditDetails.setCreatedTime(System.currentTimeMillis());
        auditDetails.setLastModifiedTime(System.currentTimeMillis());

        // Enrich audit details for attributes
        serviceDefinition.getAttributes().forEach(attribute -> {
            attribute.setId(UUID.randomUUID().toString());
            attribute.setAuditDetails(auditDetails);
            attribute.setReferenceId(serviceDefinition.getId());
        });

        // Enrich audit details for service definition
        serviceDefinition.setAuditDetails(auditDetails);

        // Initialize values with empty strings in case of non-list type attribute definition values
        serviceDefinition.getAttributes().forEach(attributeDefinition -> {
            if(!(attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.SINGLEVALUELIST) || attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST))){
                List<String> emptyStringList = new ArrayList<>();
                emptyStringList.add("");
                attributeDefinition.setValues(emptyStringList);
            }
        });

    }

    public Map<String, Object> enrichServiceRequest(ServiceRequest serviceRequest) {
        Service service = serviceRequest.getService();
        RequestInfo requestInfo = serviceRequest.getRequestInfo();

        // Enrich id for service
        service.setId(UUID.randomUUID().toString());

        // Prepare audit details
        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setCreatedBy(requestInfo.getUserInfo().getUuid());
        auditDetails.setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        auditDetails.setCreatedTime(System.currentTimeMillis());
        auditDetails.setLastModifiedTime(System.currentTimeMillis());

        // Enrich audit details in attribute values
        service.getAttributes().forEach(attributeValue -> {
            attributeValue.setId(UUID.randomUUID().toString());
            attributeValue.setAuditDetails(auditDetails);
            attributeValue.setReferenceId(service.getId());
        });

        // Enrich audit details for service
        service.setAuditDetails(auditDetails);

        // Convert incoming attribute value into JSON object
        Map<String, Object> attributeCodeVsValueMap = convertAttributeValuesIntoJson(serviceRequest);

        return attributeCodeVsValueMap;

    }

    private Map<String, Object> convertAttributeValuesIntoJson(ServiceRequest serviceRequest) {
        Map<String, Object> attributeCodeVsValueMap = new HashMap<>();
        serviceRequest.getService().getAttributes().forEach(attributeValue -> {
            attributeCodeVsValueMap.put(attributeValue.getAttributeCode(), attributeValue.getValue());
            Map<String, Object> jsonObj = new HashMap<>();
            jsonObj.put(VALUE, attributeValue.getValue());
            attributeValue.setValue(jsonObj);
        });
        return attributeCodeVsValueMap;
    }

    public void setAttributeDefinitionValuesBackToNativeState(ServiceDefinition serviceDefinition) {
        // Initialize values with null in case of non-list type attribute definition values
        serviceDefinition.getAttributes().forEach(attributeDefinition -> {
            if(!(attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.SINGLEVALUELIST) || attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST))){
                attributeDefinition.setValues(null);
            }
        });
    }

    public void setAttributeValuesBackToNativeState(ServiceRequest serviceRequest, Map<String, Object> attributeCodeVsValueMap) {
        serviceRequest.getService().getAttributes().forEach(attributeValue -> {
            attributeValue.setValue(attributeCodeVsValueMap.get(attributeValue.getAttributeCode()));
        });
    }
}
