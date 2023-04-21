package digit.error;

import org.springframework.stereotype.Component;

@Component
public class ErrorCode {
    public static final String SERVICE_REQUEST_INVALID_SERVICE_DEF_ID_CODE = "SERVICE_REQUEST_INVALID_SERVICE_DEF_ID";

    public static final String SERVICE_REQUEST_INVALID_SERVICE_DEF_ID_MSG = "Invalid service definition id";

    public static final String SERVICE_REQUEST_INVALID_DATA_TYPE_CODE = "SERVICE_REQUEST_INVALID_DATA_TYPE";

    public static final String SERVICE_REQUEST_INVALID_DATA_TYPE_MSG = "Invalid data type";

    public static final String SERVICE_REQUEST_UNRECOGNIZED_ATTRIBUTE_CODE = "SERVICE_REQUEST_UNRECOGNIZED_ATTRIBUTE_CODE";

    public static final String SERVICE_REQUEST_UNRECOGNIZED_ATTRIBUTE_MSG = "Provided attribute code is not a part of the concerned service definition";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE = "SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_CODE";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_NUMBER_VALUE_MSG = "Attribute Value provided against the attribute definition of type Number must be a number";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_STRING_VALUE_MSG = "Attribute Value provided against the attribute definition of type String must be a string";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_TEXT_VALUE_MSG = "Attribute Value provided against the attribute definition of type Text must be a string";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_DATETIME_VALUE_MSG = "Attribute Value provided against the attribute definition of type DateTime must be an epoch value of type long";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_SINGLE_VALUE_LIST_VALUE_MSG = "Attribute Value provided against the attribute definition of type single value list must be an instance of String";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_MULTI_VALUE_LIST_VALUE_MSG = "Attribute Value provided against the attribute definition of type multi value list must be an instance of list";

    public static final String INVALID_SIZE_OF_INPUT_CODE = "INVALID_SIZE_OF_INPUT_CODE";

    public static final String INVALID_SIZE_OF_TEXT_MSG = "Text value cannot be of length greater than configured length ";

    public static final String SERVICE_DEFINITION_ALREADY_EXISTS_ERR_CODE = "SERVICE_DEFINITION_ALREADY_EXISTS_ERR_CODE";

    public static final String SERVICE_DEFINITION_ALREADY_EXISTS_ERR_MSG = "Service definition with the given tenantId and code combination already exists";

    public static final String ATTRIBUTE_CODE_UNIQUENESS_ERR_CODE = "ATTRIBUTE_CODE_UNIQUENESS_ERR_CODE";

    public static final String ATTRIBUTE_CODE_UNIQUENESS_ERR_MSG = "Attribute definitions provided as part of service definition must have unique codes";

    public static final String SERVICE_REQUEST_ATTRIBUTE_VALUES_UNIQUENESS_ERR_CODE = "SERVICE_REQUEST_ATTRIBUTE_VALUES_UNIQUENESS_ERR_CODE";

    public static final String SERVICE_REQUEST_ATTRIBUTE_VALUES_UNIQUENESS_ERR_MSG = "Attribute values being passed against a particular service definition must be unique";

    public static final String SERVICE_REQUEST_REQUIRED_ATTRIBUTE_NOT_PROVIDED_ERR_CODE = "SERVICE_REQUEST_REQUIRED_ATTRIBUTE_NOT_PROVIDED_ERR_CODE";

    public static final String SERVICE_REQUEST_REQUIRED_ATTRIBUTE_NOT_PROVIDED_ERR_MSG = "Mandatory attribute value not provided as part of service request";

    public static final String INVALID_ATTRIBUTE_DEFINITION_ERR_CODE = "INVALID_ATTRIBUTE_DEFINITION_ERR_CODE";

    public static final String INVALID_ATTRIBUTE_DEFINITION_ERR_MSG = "Values are only allowed in case of single value and multi value lists";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_SINGLEVALUELIST_MSG = "Values provided against single value type list must belong to the list of values provided during service definition creation.";

    public static final String SERVICE_REQUEST_ATTRIBUTE_INVALID_VALUE_MULTIVALUELIST_MSG = "Values provided against multi value type list must belong to the list of values provided during service definition creation.";

    public static final String INVALID_REGEX_ERR_CODE = "INVALID_REGEX_ERR_CODE";

    public static final String INVALID_REGEX_ERR_MSG = "The provided regex failed to compile for attribute definition with code - ";

    public static final String ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_CODE = "ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR";

    public static final String ATTRIBUTE_VALUE_REGEX_VALIDATION_ERR_MSG = "Provided attribute value does not conform with the regex provided against attribute definition";
}
