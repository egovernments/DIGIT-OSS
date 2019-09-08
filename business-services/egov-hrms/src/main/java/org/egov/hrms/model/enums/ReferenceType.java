package org.egov.hrms.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReferenceType {
	HEADER("HEADER"), ASSIGNMENT("ASSIGNMENT"), JURISDICTION("JURISDICTION"), SERVICE("SERVICE"), 
	EDUCATION("EDUCATION"), TEST("TEST"), DEACTIVATION("DEACTIVATION");

	private String value;

	ReferenceType(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return name();
	}

	@JsonCreator
	public static ReferenceType fromValue(String passedValue) {
		for (ReferenceType obj : ReferenceType.values()) {
			if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
				return obj;
			}
		}
		return null;
	}
}
