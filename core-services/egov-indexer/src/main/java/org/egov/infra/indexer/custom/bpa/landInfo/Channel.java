package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * constructionDetail details can be created from different channels Eg. System (properties created by ULB officials), CFC Counter (From citizen faciliation counters) etc. Here we are defining some known channels, there can be more client to client.
 */
public enum Channel {
  SYSTEM("SYSTEM"),
    CFC_COUNTER("CFC_COUNTER"),
    CITIZEN("CITIZEN"),
    DATA_ENTRY("DATA_ENTRY"),
    MIGRATION("MIGRATION");

  private String value;

  Channel(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Channel fromValue(String text) {
    for (Channel b : Channel.values()) {
      if (String.valueOf(b.value).equals(text)) {
        return b;
      }
    }
    return null;
  }
}
