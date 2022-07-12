package org.egov.auditservice.persisterauditclient.models.contract;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TypeEnum {
	
	ARRAY("ARRAY"), STRING("STRING"), INT("INT"), 
	DOUBLE("DOUBLE"), FLOAT("FLOAT"), DATE("DATE"), LONG("LONG"),
	BIGDECIMAL("BIGDECIMAL"),BOOLEAN("BOOLEAN"),CURRENTDATE("CURRENTDATE"),
	JSON("JSON"),JSONB("JSONB");
	
	private String value;

	TypeEnum(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static TypeEnum fromValue(String text) {
		for (TypeEnum b : TypeEnum.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}
