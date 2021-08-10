package org.egov.demand.amendment.model.enums;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Gets or Sets amendmentReason
 */
public enum AmendmentReason {

	COURT_CASE_SETTLEMENT("COURT_CASE_SETTLEMENT"),

	ARREAR_WRITE_OFF("ARREAR_WRITE_OFF"),

	DCB_CORRECTION("DCB_CORRECTION"),

	ONE_TIME_SETTLEMENT("ONE_TIME_SETTLEMENT"),

	REMISSION_FOR_PROPERTY_TAX("REMISSION_FOR_PROPERTY_TAX"),

	OTHERS("OTHERS");

	private String value;

	AmendmentReason(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@NotNull
	@JsonCreator
	public static AmendmentReason fromValue(String text) {
		for (AmendmentReason b : AmendmentReason.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}
