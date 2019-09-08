package org.egov.id.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * status of request processing - to be enhanced in futuer to include INPROGRESS
 */
public enum ResponseStatusEnum {
	SUCCESSFUL("SUCCESSFUL"),

	FAILED("FAILED");

	private String value;

	ResponseStatusEnum(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static ResponseStatusEnum fromValue(String text) {
		for (ResponseStatusEnum b : ResponseStatusEnum.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}