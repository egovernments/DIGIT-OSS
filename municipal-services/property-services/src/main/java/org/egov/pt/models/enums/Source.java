package org.egov.pt.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Source of a constructionDetail data. The constructionDetail will be created in a system based on the data avaialble in their manual records or during field survey. There can be more from client to client.
 */
public enum Source {
	
  MUNICIPAL_RECORDS("MUNICIPAL_RECORDS"),
    
  FIELD_SURVEY("FIELD_SURVEY"),
    
  WS("WS"),
	
  WATER_CHARGES("WATER_CHARGES"),

  TL("TL");

  private String value;

  Source(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Source fromValue(String text) {
    for (Source b : Source.values()) {
      if (String.valueOf(b.value).equalsIgnoreCase(text)) {
        return b;
      }
    }
    return null;
  }
}
