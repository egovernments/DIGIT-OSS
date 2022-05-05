package org.bel.birthdeath.death.certmodel;

import java.sql.Timestamp;
import java.util.List;

import org.bel.birthdeath.common.model.Amount;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.death.calculation.Calculation;
import org.egov.common.contract.request.User;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeathCertificate {

  @JsonProperty("citizen")

  private User citizen = null;

  @JsonProperty("id")

  private String id = null;

  @JsonProperty("tenantId")

  private String tenantId = null;

  @JsonProperty("businessService")

  private String businessService = null;

  @JsonProperty("deathCertificateNo")

  private String deathCertificateNo = null;

  @JsonProperty("additionalDetail")

  private Object additionalDetail = null;

  @JsonProperty("source")

  private String source = null;
  
  @JsonProperty("taxPeriodFrom")
  private Long taxPeriodFrom = null;

  @JsonProperty("taxPeriodTo")
  private Long taxPeriodTo = null;

  @JsonProperty("calculation")
  private Calculation calculation;
  
  @JsonProperty("amount")
  private List<Amount> amount;

  @JsonProperty("deathDtlId")

  private String deathDtlId = null;
  
  @JsonProperty("filestoreid")

  private String filestoreid = null;

  @JsonProperty("auditDetails")

  private AuditDetails auditDetails = null;

  @JsonProperty("gender")
  private String gender = null;

  @JsonProperty("age")
  private Long age = null;

  @JsonProperty("state")
  private String state = null;

  @JsonProperty("ward")
  private String ward = null;

  @JsonProperty("district")
  private String district = null;

  public enum StatusEnum {
	  ACTIVE("ACTIVE"),
	  
	  CANCELLED("CANCELLED"),
	  
	  FREE_DOWNLOAD("FREE_DOWNLOAD"),

	  PAID_DOWNLOAD("PAID_DOWNLOAD"),

	  PAID_PDF_GENERATED("PAID_PDF_GENERATED"),
	  
	  PAID("PAID");

      private String value;

      StatusEnum(String value) {
          this.value = value;
      }

      @Override
      @JsonValue
      public String toString() {
          return String.valueOf(value);
      }

      @JsonCreator
      public static StatusEnum fromValue(String text) {
          for (StatusEnum b : StatusEnum.values()) {
              if (String.valueOf(b.value).equals(text)) {
                  return b;
              }
          }
          return null;
      }
  }

  @JsonProperty("applicationStatus")
  private StatusEnum applicationStatus = null;
  
  @JsonProperty("counter")
  private Integer counter ;
  
  private String embeddedUrl;
  
  private Long dateofissue;

  private Timestamp dateofdeath;

  private Timestamp dateofreport;

  private String placeofdeath;

  private String year;
}
