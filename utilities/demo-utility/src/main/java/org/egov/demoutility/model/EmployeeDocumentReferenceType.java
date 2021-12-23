package org.egov.demoutility.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmployeeDocumentReferenceType {
	HEADER("HEADER"), ASSIGNMENT("ASSIGNMENT"), JURISDICTION("JURISDICTION"), SERVICE("SERVICE"), 
	EDUCATION("EDUCATION"), TEST("TEST"), DEACTIVATION("DEACTIVATION");

	private String value;

	EmployeeDocumentReferenceType(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return name();
	}

	@JsonCreator
	public static EmployeeDocumentReferenceType fromValue(String passedValue) {
		for (EmployeeDocumentReferenceType obj : EmployeeDocumentReferenceType.values()) {
			if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
				return obj;
			}
		}
		return null;
	}
}
