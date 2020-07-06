package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonValue;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Depicts the current status of the case
 */
public enum Status {
  
  ACTIVE("active"),
  
  ISOLATION_COMPLETED("isolation_completed"),
  
  COVID_POSITIVE("covid_positive"),
  
  CANCELLED("cancelled");

  private String value;

  Status(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Status fromValue(String text) {
    for (Status b : Status.values()) {
      if (String.valueOf(b.value).equals(text)) {
        return b;
      }
    }
    return null;
  }
}

