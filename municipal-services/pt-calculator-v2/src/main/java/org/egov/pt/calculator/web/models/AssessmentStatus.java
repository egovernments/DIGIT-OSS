package org.egov.pt.calculator.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * status of the Assesment
 */
public enum AssessmentStatus {
	
  ACTIVE("ACTIVE"),
  
  INACTIVE("INACTIVE"),

  INWORKFLOW("INWORKFLOW");

  private String value;

  AssessmentStatus(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static AssessmentStatus fromValue(String text) {
    for (AssessmentStatus b : AssessmentStatus.values()) {
      if (String.valueOf(b.value).equalsIgnoreCase(text)) {
        return b;
      }
    }
    return null;
  }
}
