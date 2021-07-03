package org.egov.demand.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Type {
	
	ARREARS("ARREARS"),

	CURRENT("CURRENT"),

	DUES("DUES");

	private String value;

	Type(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static Type fromValue(String text) {
		for (Type type : Type.values()) {
			if (String.valueOf(type.value).equals(text)) {
				return type;
			}
		}
		return null;
	}
}