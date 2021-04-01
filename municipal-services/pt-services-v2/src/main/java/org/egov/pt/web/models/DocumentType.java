package org.egov.pt.web.models;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This object holds type of documents to be uploaded during the transaction for each application type.
 */
@ApiModel(description = "This object holds type of documents to be uploaded during the transaction for each application type.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentType   {
        @JsonProperty("id")
        private Long id;

        @JsonProperty("tenantId")
        private String tenantId;

        @JsonProperty("name")
        private String name;

        @JsonProperty("code")
        private String code;

              /**
   * Application type.
   */
  public enum ApplicationEnum {
    CREATE("CREATE"),
    
    TITLE_TRANSFER("TITLE_TRANSFER"),
    
    BIFURCATION("BIFURCATION"),
    
    ALTER("ALTER"),
    
    EDIT("EDIT"),
    
    AMALGAMATION("AMALGAMATION");

    private String value;

    ApplicationEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static ApplicationEnum fromValue(String text) {
      for (ApplicationEnum b : ApplicationEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("application")
        private ApplicationEnum application;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails;


}

