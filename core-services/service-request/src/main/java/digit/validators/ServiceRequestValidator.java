package digit.validators;

import digit.config.Configuration;
import digit.repository.ServiceDefinitionRequestRepository;
import digit.repository.ServiceRequestRepository;
import digit.web.models.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static digit.error.ErrorCode.*;

@Slf4j
@Component
public class ServiceRequestValidator {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ServiceDefinitionRequestRepository serviceDefinitionRequestRepository;

    @Autowired
    private Configuration config;

    public void validateServiceRequest(ServiceRequest serviceRequest){
        List<ServiceDefinition> serviceDefinitions = validateServiceDefID(serviceRequest.getService().getTenantId(), serviceRequest.getService().getServiceDefId());
        serviceRequest.getService().setCode(serviceDefinitions.get(0).getCode());
        serviceRequest.getService().setModule(serviceDefinitions.get(0).getModule());
        validateAttributeValuesAgainstServiceDefinition(serviceDefinitions.get(0), serviceRequest.getService());
        validateAccountId(serviceRequest.getService());
    }

    private void validateAccountId(Service service) {
        // TO DO
    }


    private void validateAttributeValuesAgainstServiceDefinition(ServiceDefinition serviceDefinition, Service service) {

        // Prepare map of attribute code vs attribute type and
        // validate uniqueness of attribute value codes being passed against service definition
        Map<String, AttributeDefinition.DataTypeEnum> attributeCodeVsDataType = new HashMap<>();
        Set<String> setOfRequiredAttributes = new HashSet<>();
        Map<String, Set<String>> attributeCodeVsValues = new HashMap<>();
        Map<String, String> attributeCodeVsRegexMap = new HashMap<>();
        serviceDefinition.getAttributes().forEach(attributeDefinition -> {
            attributeCodeVsDataType.put(attributeDefinition.getCode(), attributeDefinition.getDataType());

            if(attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.SINGLEVALUELIST) || attributeDefinition.getDataType().equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST)){
                attributeCodeVsValues.put(attributeDefinition.getCode(), new HashSet<>(attributeDefinition.getValues()));
            }

            if(attributeDefinition.getRequired())
                setOfRequiredAttributes.add(attributeDefinition.getCode());

            if(!ObjectUtils.isEmpty(attributeDefinition.getRegex())){
                attributeCodeVsRegexMap.put(attributeDefinition.getCode(), attributeDefinition.getRegex());
            }
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
                validateSize(attributeValue.getValue());
            }else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.TEXT)){
                if(!(attributeValue.getValue() instanceof String)){
                    throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_TEXT_VALUE_MSG);
                }
                validateSize(attributeValue.getValue());
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

        // Validate if value provided against attribute definition of single value list and multi value list is the same as the list of values provided during creation
        service.getAttributes().forEach(attributeValue -> {
            if(attributeCodeVsValues.containsKey(attributeValue.getAttributeCode())){
                if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.SINGLEVALUELIST)){
                    if(!attributeCodeVsValues.get(attributeValue.getAttributeCode()).contains(attributeValue.getValue())){
                        throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_SINGLEVALUELIST_MSG);
                    }
                } else if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST)){
                    List<String> providedAttributeValues = (List<String>) attributeValue.getValue();
                    providedAttributeValues.forEach(providedAttributeValue -> {
                        if(!attributeCodeVsValues.get(attributeValue.getAttributeCode()).contains(providedAttributeValue)){
                            throw new CustomException(SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE, SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_MULTIVALUELIST_MSG);
                        }
                    });
                }
            }
        });

        // Validate if all attribute values provided against service definition conform to the regex provided
        service.getAttributes().forEach(attributeValue -> {
            if(attributeCodeVsRegexMap.containsKey(attributeValue.getAttributeCode())){
                if(attributeCodeVsDataType.get(attributeValue.getAttributeCode()).equals(AttributeDefinition.DataTypeEnum.MULTIVALUELIST)){
                    List<String> providedAttributeValues = (List<String>) attributeValue.getValue();
                    providedAttributeValues.forEach(providedAttributeValue -> {
                        if(!providedAttributeValue.matches(attributeCodeVsRegexMap.get(attributeValue.getAttributeCode()))){
                            throw new CustomException(ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_CODE, ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_MSG);
                        }
                    });
                }else{
                    if(!String.valueOf(attributeValue.getValue()).matches(attributeCodeVsRegexMap.get(attributeValue.getAttributeCode()))){
                        throw new CustomException(ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_CODE, ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_MSG);
                    }
                }

            }
        });

    }

    private void validateSize(Object value) {
        String incomingValue = (String) value;

        if(incomingValue.length() > config.getMaxStringInputSize()){
            throw new CustomException(INVALID_SIZE_OF_INPUT_CODE, INVALID_SIZE_OF_TEXT_MSG);
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