package org.egov.swservice.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Value denoting if the unit is rented or occupied by owner
 */
public enum OccupancyType {
  
  OWNER("OWNER"),
  
  TENANT("TENANT");

  private String value;

  OccupancyType(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static OccupancyType fromValue(String text) {
    for (OccupancyType b : OccupancyType.values()) {
      if (String.valueOf(b.value).equals(text)) {
        return b;
      }
    }
    return null;
  }
}

