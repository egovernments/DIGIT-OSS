package org.egov.land.web.models;

public enum OccupancyType {
	OWNER("OWNER"), 
	TENANT("TENANT");
	private String value;

	OccupancyType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	@Override
	public String toString() {
		return String.valueOf(value);
	}

	public static OccupancyType fromValue(String text) {
		for (OccupancyType b : OccupancyType.values()) {
			if (String.valueOf(b.value).equals(text)) {
				return b;
			}
		}
		return null;
	}
}
