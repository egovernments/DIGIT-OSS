package org.egov.wscalculation.web.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Gets or Sets Type
 */
public enum Type {
  
  PERMANENT("PERMANENT"),
  
  CORRESPONDENCE("CORRESPONDENCE");

  private String value;

  Type(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Type fromValue(String text) {
    for (Type b : Type.values()) {
      if (String.valueOf(b.value).equalsIgnoreCase(text)) {
        return b;
      }
    }
    return null;
  }
}

