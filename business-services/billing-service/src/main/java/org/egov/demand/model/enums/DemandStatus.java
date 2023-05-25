package org.egov.demand.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DemandStatus {

	ACTIVE("ACTIVE"),

	CANCELLED("CANCELLED"),

	ADJUSTED("ADJUSTED");

	private String value;

	DemandStatus(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static DemandStatus fromValue(String text) {
		for (DemandStatus b : DemandStatus.values()) {
			if (String.valueOf(b.value).equalsIgnoreCase(text)) {
				return b;
			}
		}
		return null;
	}
}
