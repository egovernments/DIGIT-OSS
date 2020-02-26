package org.egov.pt.models.enums;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * New property comes into system either property is newly constructed or existing property got sub divided. Here the reason for creation will be captured.
 */

public enum CreationReason {
	
  CREATE ("CREATE"),
  
  UPDATE ("UPDATE"),
  
  MUTATION ("MUTATION"),
  
  BIFURCATION ("BIFURCATION"),
  
  AMALGAMATION ("AMALGAMATION"),
  
  SUBDIVISION("SUBDIVISION");

  private String value;

  CreationReason(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

	@JsonCreator
	public static CreationReason fromValue(String text) {
		for (CreationReason b : CreationReason.values()) {
			if (String.valueOf(b.value).equalsIgnoreCase(text)) {
				return b;
			}
		}
		return null;
	}
}
