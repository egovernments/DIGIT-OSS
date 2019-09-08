package org.egov.pt.calculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PeriodCycle {

	MONTH("MONTH"),

	QUARTER("QUARTER"),

	HALFYEAR("HALFYEAR"),

	ANNUAL("ANNUAL");

	private String value;

	PeriodCycle(String value) {
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString() {
		return String.valueOf(value);
	}

	@JsonCreator
	public static PeriodCycle fromValue(String text) {
		for (PeriodCycle periodCycle : PeriodCycle.values()) {
			if (String.valueOf(periodCycle.value).equals(text)) {
				return periodCycle;
			}
		}
		return null;
	}
}
