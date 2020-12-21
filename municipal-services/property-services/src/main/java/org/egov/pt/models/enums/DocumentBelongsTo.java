package org.egov.pt.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DocumentBelongsTo {

	PROPERTY("PROPERTY"),

	OWNER("OWNER"),

	ASSESSMENT("ASSESSMENT");

	private String value;

	DocumentBelongsTo(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static DocumentBelongsTo fromValue(String text) {
		for (DocumentBelongsTo b : DocumentBelongsTo.values()) {
			if (String.valueOf(b.value).equalsIgnoreCase(text)) {
				return b;
			}
		}
		return null;
	}
}
