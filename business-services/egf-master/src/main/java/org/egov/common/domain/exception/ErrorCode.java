package org.egov.common.domain.exception;

import java.util.HashMap;
import java.util.Map;
/**
 * 
 * @author mani
 *  List of Domain Error codes with message and detailed description
 *  Donot auto format this file 
 */
public enum ErrorCode {
	
	KAFKA_TIMEOUT_ERROR(
			"org.egov.service.kafka.timeout",
			"time out while waiting for kafka",
			"Some required service is down. Please contact Administrator"), 
	NON_UNIQUE_VALUE(
					"non.unique.value",
					"the field {0} must be unique in the system",
					"The  value  {1} for the field {0} already exists in the system. Please provide different value"),
	NULL_VALUE("null.value",
			  "the field {0} must be not be null",
			  "The  value  {1} for the field {0} not allowed in the system. Please provide correct value"),
	MANDATORY_VALUE_MISSING("mandatory.value.missing",
			  "the field {0} must be not be null or empty",
			  "the field {0} is Mandatory .It cannot be not be null or empty.Please provide correct value"),
	NOT_NULL("NotNull",
			  "the field {0} must be not be null",
			  "The  value  {1} for the field {0} not allowed in the system. Please provide correct value"),
	INVALID_REF_VALUE("invalid.ref.value",
			  "the field {0} should have a valid value which exists in the system. ",
			  "The  value  {1} for the field {0} does exist in system. Please provide correct value"); 

	
	private final String code;
	private final String message;
	private final String description;
	private static final Map<String, ErrorCode> errorMap = new HashMap<String, ErrorCode>();

	static {
		for (ErrorCode error : ErrorCode.values()) {
			errorMap.put(error.code, error);
		}
	}

	ErrorCode(final String code, final String message, final String description) {
		this.code = code;
		this.message = message;
		this.description = description;
	}

	public static ErrorCode getError(String code) {
		return errorMap.get(code);
	}

	// add getters and setters here:
	public String getCode() {
		return this.code;
	}

	public String getMessage() {
		return this.message;
	}

	public String getDescription() {
		return this.description;
	}

}
