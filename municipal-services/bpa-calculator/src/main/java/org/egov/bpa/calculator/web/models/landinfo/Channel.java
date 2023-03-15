package org.egov.bpa.calculator.web.models.landinfo;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Channel {
	SYSTEM("SYSTEM"), CFC_COUNTER("CFC_COUNTER"), CITIZEN("CITIZEN"), DATA_ENTRY("DATA_ENTRY"), MIGRATION("MIGRATION");

	private String value;

	Channel(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return name();
	}

	@JsonCreator
	public static Channel fromValue(String passedValue) {
		for (Channel obj : Channel.values()) {
			if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
				return obj;
			}
		}
		return null;
	}
}
