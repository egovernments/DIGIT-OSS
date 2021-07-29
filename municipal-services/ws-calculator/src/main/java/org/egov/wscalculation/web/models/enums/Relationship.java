package org.egov.wscalculation.web.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * The relationship of guardian.
 */

public enum Relationship {
	
	FATHER("FATHER"),
    HUSBAND("HUSBAND");

  private String value;

  Relationship(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Relationship fromValue(String text) {
    for (Relationship b : Relationship.values()) {
      if (String.valueOf(b.value).equalsIgnoreCase(text)) {
        return b;
      }
    }
    return null;
  }
}
