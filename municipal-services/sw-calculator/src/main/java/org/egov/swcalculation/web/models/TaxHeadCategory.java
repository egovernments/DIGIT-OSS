package org.egov.swcalculation.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Category of demand like tax, fee, rebate, penalty etc.
 */
public enum TaxHeadCategory {

	TAX("TAX"),

	FEE("FEE"),

	REBATE("REBATE"),

	EXEMPTION("EXEMPTION"),

	ADVANCE_COLLECTION("ADVANCE_COLLECTION"),

	PENALTY("PENALTY"),

	FINES("FINES"),

	CHARGES("CHARGES");

	private String value;

	TaxHeadCategory(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static TaxHeadCategory fromValue(String text) {
		for (TaxHeadCategory b : TaxHeadCategory.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}
