package digit.validators;

import digit.repository.ServiceDefinitionRequestRepository;
import digit.repository.ServiceRequestRepository;
import digit.web.models.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

import static digit.error.ErrorCode.*;

@Slf4j
@Component
public class ServiceRequestValidator {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ServiceDefinitionRequestRepository serviceDefinitionRequestRepository;

    public void validateServiceRequest(ServiceRequest serviceRequest){
        List<ServiceDefinition> serviceDefinitions = validateServiceDefID(serviceRequest.getService().getTenantId(), serviceRequest.getService().getServiceDefId());
        validateAttributeValuesAgainstServiceDefinition(serviceDefinitions.get(0), serviceRequest.getService());
    }


    private void validateAttributeValuesAgainstServiceDefinition(ServiceDefinition serviceDefinition, Service service) {

        // Prepare map of attribute code vs attribute type and
        // validate uniqueness of attribute value codes being passed against service definition
        Map<String, AttributeDefinition.DataTypeEnum> attributeCodeVsDataType = new HashMap<>();
        Set<String> setOfRequiredAttributes = new HashSet<>();
        serviceDefinition.getAttributes().forEach(attributeDefinition -> {
            attributeCodeVsDataType.put(attributeDefinition.getCode(), attributeDefinition.getDataType());

            if(attributeDefinition.getRequired())
                setOfRequiredAttributes.add(attributeDefinition.getCode());
        });

        // Check if service has all the attribute values required as part of service definition
        Set<String> setOfAttributeValues = new HashSet<>();
        service.getAttributes().forEach(attributeValue -> {
            if(!attributeCodeVsDataType.keySet().contains(attributeValue.getAttributeCode())){
                throw new CustomException(SERVICE_REQUEST_UNRECOGNIZED_ATTRIBUTE_CODE, SERVICE_REQUEST_UNRECOGNIZED_ATTRIBUTE_MSG);
            }

            if(!setOfAttributeValues.contains(attributeValue.getAttributeCode()))
                setOfAttributeValues.add(attributeValue.getAttributeCode());
            else
                throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_VALUES_UNIQUENESS_ERR_CODE, SERVICE_REQUEST_ATTRIBUTE_VALUES_UNIQUENESS_ERR_MSG);
        });

        // Check if all required attributes have been provided as part of service
        setOfRequiredAttributes.forEach(requiredAttribute -> {
            if(!setOfAttributeValues.contains(requiredAttribute))
                throw new CustomException(SERVICE_REQUEST_REQUIRED_ATTRIBUTE_NOT_PROVIDED_ERR_CODE, SERVICE_REQUEST_REQUIRED_ATTRIBUTE_NOT_PROVIDED_ERR_MSG);
        });

        // Validate if value being passed is consistent in terms of data type provided as part of service definition
        service.getAttributes().forEach(attributeValue -> {
            if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.NUMBER)){
                if(!(attributeValue.getValue() instanceof Number)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_NUMBER_VALUE_MSG);
                }
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.STRING)){
                if(!(attributeValue.getValue() instanceof String)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_STRING_VALUE_MSG);
                }
                validateSizeOfString(attributeValue.getValue());
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.TEXT)){
                if(!(attributeValue.getValue() instanceof String)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_TEXT_VALUE_MSG);
                }
                validateSizeOfText(attributeValue.getValue());
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.DATETIME)){
                if(!(attributeValue.getValue() instanceof Long)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_DATETIME_VALUE_MSG);
                }
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.SINGLEVALUELIST)){
                if(!(attributeValue.getValue() instanceof String)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_SINGLE_VALUE_LIST_VALUE_MSG);
                }
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST)){
                if(!(attributeValue.getValue() instanceof List)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_MULTI_VALUE_LIST_VALUE_MSG);
                }
            }
        });
    }

    private void validateSizeOfString(Object value) {
        String incomingValue = (String) value;

        // Should this be made configurable?

        if(incomingValue.length() > 64){
            throw new CustomException(INVALID_SIZE_OF_STRING_CODE, INVALID_SIZE_OF_STRING_MSG);
        }
    }

    private void validateSizeOfText(Object value) {
        String incomingValue = (String) value;

        // Should this be made configurable?

        if(incomingValue.length() > 1024){
            throw new CustomException(INVALID_SIZE_OF_TEXT_CODE, INVALID_SIZE_OF_TEXT_MSG);
        }
    }

    private List<ServiceDefinition> validateServiceDefID(String tenantId, String serviceDefId) {
        List<ServiceDefinition> serviceDefinitions = serviceDefinitionRequestRepository.getServiceDefinitions(ServiceDefinitionSearchRequest.builder().serviceDefinitionCriteria(ServiceDefinitionCriteria.builder().tenantId(tenantId).ids(Arrays.asList(serviceDefId)).build()).build());

        if(serviceDefinitions.isEmpty())
            throw new CustomException(SERVICE_REQUEST_INVALID_SERVICE_DEF_ID_CODE, SERVICE_REQUEST_INVALID_SERVICE_DEF_ID_MSG);

        return serviceDefinitions;
    }

    public void validateUpdateRequest(ServiceRequest serviceRequest) {
    }

    public void validateServiceUpdateRequest(ServiceRequest serviceRequest) {
    }
}
