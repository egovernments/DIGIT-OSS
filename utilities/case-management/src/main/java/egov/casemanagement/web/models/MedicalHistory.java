package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Existing medical histories of the person. TODO - thsi will need to be multiselect
 */
public enum MedicalHistory {
  
  DIABETES("Diabetes"),
  
  HYPERTENSION("Hypertension"),
  
  LUNG_DISEASE("Lung_Disease"),
  
  HEART_DISEASE("Heart_Disease"),

  NONE("NONE");

  private String value;

  MedicalHistory(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static MedicalHistory fromValue(String text) {
    for (MedicalHistory b : MedicalHistory.values()) {
      if (String.valueOf(b.value).equals(text)) {
        return b;
      }
    }
    return null;
  }
}

