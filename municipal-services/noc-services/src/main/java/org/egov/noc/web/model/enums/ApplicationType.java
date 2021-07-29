package org.egov.noc.web.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ApplicationType {
	
		PROVISIONAL("PROVISIONAL"),	NEW("NEW"), RENEW("RENEW");


		private String value;

		ApplicationType(String value) {
			this.value = value;	
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);	
		}

		@JsonCreator
		public static ApplicationType fromValue(String text) {
			for (ApplicationType type : ApplicationType.values()) {
				if (String.valueOf(type.value).equals(text)) {
					return type;
				}
			}
			return null;
		}
}
