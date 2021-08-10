package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Category of demand like tax, fee, rebate, penalty etc.
 */
public enum Category {

	TAX("TAX"),

	FEE("FEE"),

	REBATE("REBATE"),
	
	EXEMPTION("EXEMPTION"),

	ADVANCE_COLLECTION("ADVANCE_COLLECTION"),

	PENALTY("PENALTY"),

	FINES("FINES"),
	
	CHARGES("CHARGES");

	private String value;

	Category(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static Category fromValue(String text) {
		for (Category b : Category.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}
