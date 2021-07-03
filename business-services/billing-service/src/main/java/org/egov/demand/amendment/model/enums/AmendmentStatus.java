package org.egov.demand.amendment.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Gets or Sets status
 */
public enum AmendmentStatus {
	  
  ACTIVE("ACTIVE"),
  
  INACTIVE ("INACTIVE"),
  
  INWORKFLOW("INWORKFLOW"),
	
  CONSUMED ("CONSUMED");	

  private String value;

  AmendmentStatus(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static AmendmentStatus fromValue(String text) {
    for (AmendmentStatus b : AmendmentStatus.values()) {
      if (String.valueOf(b.value).equalsIgnoreCase(text)) {
        return b;
      }
    }
    return null;
  }
}
