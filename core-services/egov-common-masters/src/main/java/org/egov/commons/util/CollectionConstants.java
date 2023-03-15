package org.egov.commons.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource(value = { "classpath:messages/messages.properties",
		"classpath:messages/errors.properties" }, ignoreResourceNotFound = true)
@Order(0)
public class CollectionConstants {
	@Autowired
	private Environment environment;

	public static final String INVALID_CATEGORY_REQUEST_MESSAGE = "Category is invalid";
	public static final String INVALID_DETAILS_REQUEST_MESSAGE = "Details is invalid";

	public static final String CATEGORY_NAME_MANDATORY_CODE = "collection.0001";
	public static final String CATEGORY_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String CATEGORY_NAME_MANADATORY_ERROR_MESSAGE = "Category Name is required";

	public static final String CATEGORY_CODE_MANDATORY_CODE = "collection.0002";
	public static final String CATEGORY_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String CATEGORY_CODE_MANADATORY_ERROR_MESSAGE = "Category Code is required";

	public static final String TENANT_MANDATORY_CODE = "collection.0003";
	public static final String TENANT_MANADATORY_FIELD_NAME = "tenantId";
	public static final String TENANT_MANADATORY_ERROR_MESSAGE = "Tenant Id is required";

	public static final String CATEGORY_CODE_UNIQUE_CODE = "collection.0004";
	public static final String CATEGORY_CODE_UNIQUE_FIELD_NAME = "code";
	public static final String CATEGORY_CODE_UNIQUE_ERROR_MESSAGE = "Entered Category Code already exist";

	public static final String CATEGORY_NAME_UNIQUE_CODE = "collection.0005";
	public static final String CATEGORY_NAME_UNIQUE_FIELD_NAME = "name";
	public static final String CATEGORY_NAME_UNIQUE_ERROR_MESSAGE = "Entered Category Name already exist";

	public static final String DETAILS_NAME_MANDATORY_CODE = "collection.0006";
	public static final String DETAILS_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String DETAILS_NAME_MANADATORY_ERROR_MESSAGE = "Details Name is required";

	public static final String DETAILS_CODE_MANDATORY_CODE = "collection.0007";
	public static final String DETAILS_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String DETAILS_CODE_MANADATORY_ERROR_MESSAGE = "Details Code is required";

	public static final String DETAILS_TYPE_MANDATORY_CODE = "collection.0008";
	public static final String DETAILS_TYPE_MANADATORY_FIELD_NAME = "businessType";
	public static final String DETAILS_TYPE_MANADATORY_ERROR_MESSAGE = "Details Type is required";

	public static final String DETAILS_FUND_MANDATORY_CODE = "collection.0009";
	public static final String DETAILS_FUND_MANADATORY_FIELD_NAME = "fund";
	public static final String DETAILS_FUND_MANADATORY_ERROR_MESSAGE = "Details Fund is required";

	public static final String DETAILS_FUNCTION_MANDATORY_CODE = "collection.0010";
	public static final String DETAILS_FUNCTION_MANADATORY_FIELD_NAME = "function";
	public static final String DETAILS_FUNCTION_MANADATORY_ERROR_MESSAGE = "Details Function is required";

	public static final String DETAILS_CATEGORY_MANDATORY_CODE = "collection.0011";
	public static final String DETAILS_CATEGORY_MANADATORY_FIELD_NAME = "businessCategory";
	public static final String DETAILS_CATEGORY_MANADATORY_ERROR_MESSAGE = "Details Category is required";

	public static final String DETAILS_NAME_UNIQUE_CODE = "collection.0012";
	public static final String DETAILS_NAME_UNIQUE_FIELD_NAME = "name";
	public static final String DETAILS_NAME_UNIQUE_ERROR_MESSAGE = "Entered Details Name already exist";

	public static final String DETAILS_CODE_UNIQUE_CODE = "collection.0013";
	public static final String DETAILS_CODE_UNIQUE_FIELD_NAME = "code";
	public static final String DETAILS_CODE_UNIQUE_ERROR_MESSAGE = "Entered Details Code already exist";

    public static final String DETAILS_VALID_BUSINESS_TYPE_CODE = "collection.0014";
    public static final String DETAILS_VALID_BUSINESS_TYPE_FIELD_NAME = "businesstype";
    public static final String DETAILS_VALID_BUSINESS_TYPE_CODE_MESSAGE = "Entered Business Type is not valid";

	public static final String DEPARTMENT_NAME_MANDATORY_CODE = "collection.0015";
	public static final String DEPARTMENT_NAME_MANADATORY_FIELD_NAME = "name";
	public static final String DEPARTMENT_NAME_MANADATORY_ERROR_MESSAGE = "Details Name is required";

	public static final String DEPARTMENT_NAME_UNIQUE_CODE = "collection.0016";
	public static final String DEPARTMENT_NAME_UNIQUE_ERROR_MESSAGE = "Name already exist";
	public static final String DEPARTMENT_NAME_UNIQUE_FIELD_NAME = "Name";

	public static final String DEPARTMENT_CODE_UNIQUE_CODE = "collection.0017";
	public static final String DEPAREMENT_CODE_UNIQUE_ERROR_MESSAGE = "Code Already Exist";
	public static final String DEPARTMENT_CODE_UNIQUE_FIELD_NAME = "Code";

	public static final String DEPARTMENT_CODE_MANDATORY_CODE = "collection.0018";
	public static final String DEPARTMENT_CODE_MANADATORY_FIELD_NAME = "code";
	public static final String DEPARTMEN_CODE_MANADATORY_ERROR_MESSAGE = "Details Code is required";


	public String getErrorMessage(final String property) {
		return environment.getProperty(property);
	}

}
