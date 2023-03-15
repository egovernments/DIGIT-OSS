package org.egov.hrms.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


public enum DeactivationType {
	SUSPENSION("SUSPENSION"), DEATH("DEATH"), RETIRED("RETIRED");

	private String value;

	DeactivationType(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return name();
	}

	@JsonCreator
	public static DeactivationType fromValue(String passedValue) {
		for (DeactivationType obj : DeactivationType.values()) {
			if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
				return obj;
			}
		}
		return null;
	}
}
