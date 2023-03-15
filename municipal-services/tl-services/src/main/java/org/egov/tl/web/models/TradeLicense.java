package org.egov.tl.web.models;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.*;
import org.egov.tl.util.TLConstants;
import org.egov.tl.web.models.calculation.Calculation;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.annotations.ApiModel;

/**
 * A Object holds the basic data for a Trade License
 */
@ApiModel(description = "A Object holds the basic data for a Trade License")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class  TradeLicense   {
        @Size(max=64)
        @SafeHtml
        @JsonProperty("id")
        private String id = null;

        @NotNull
        @SafeHtml
        @Size(max=64)
        @JsonProperty("tenantId")
        private String tenantId = null;

              /**
   * Unique Identifier of the Trade License (UUID)
   */
  public enum LicenseTypeEnum {
    TEMPORARY("TEMPORARY"),
    
    PERMANENT("PERMANENT");

    private String value;

    LicenseTypeEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static LicenseTypeEnum fromValue(String text) {
      for (LicenseTypeEnum b : LicenseTypeEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }


    public enum ApplicationTypeEnum {
        NEW(TLConstants.APPLICATION_TYPE_NEW),

        RENEWAL(TLConstants.APPLICATION_TYPE_RENEWAL);

        private String value;

        ApplicationTypeEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static ApplicationTypeEnum fromValue(String text) {
            for (ApplicationTypeEnum b : ApplicationTypeEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

        @SafeHtml
        @JsonProperty("businessService")
        private String businessService = "TL";

        @JsonProperty("licenseType")
        private LicenseTypeEnum licenseType = null;

        @JsonProperty("applicationType")
        private ApplicationTypeEnum applicationType = null;

        @SafeHtml
        @JsonProperty("workflowCode")
        private String workflowCode = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("licenseNumber")
        private String licenseNumber = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("applicationNumber")
        private String applicationNumber;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("oldLicenseNumber")
        private String oldLicenseNumber = null;


        @Size(max=256)
        @SafeHtml
        @JsonProperty("propertyId")
        private String propertyId = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("oldPropertyId")
        private String oldPropertyId = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("accountId")
        private String accountId = null;

        @Size(max=256)
        @SafeHtml
        @JsonProperty("tradeName")
        private String tradeName = null;

        @JsonProperty("applicationDate")
        private Long applicationDate = null;

        @JsonProperty("commencementDate")
        private Long commencementDate = null;

        @JsonProperty("issuedDate")
        private Long issuedDate = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("financialYear")
        private String financialYear = null;

        @JsonProperty("validFrom")
        private Long validFrom = null;

        @JsonProperty("validTo")
        private Long validTo = null;

              /**
   * 1. Perform action to change the state of the trade license. 2. INITIATE, if application is getting submitted without required document. 3. APPLY, if application is getting submitted with application documents, in that case api will validate all the required application document. 4. APPROVE action is only applicable for specific role, that role has to be configurable at service level. Employee can approve a application only if application is in APPLIED state and Licesance fees is paid.
   */

        @NotNull
        @Size(max=64)
        @SafeHtml
        @JsonProperty("action")
        private String action = null;

        @JsonProperty("assignee")
        private List<String> assignee = null;

        @Valid
        @JsonProperty("wfDocuments")
        private List<Document> wfDocuments;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("status")
        private String status = null;

        @Valid
        @NotNull
        @JsonProperty("tradeLicenseDetail")
        private TradeLicenseDetail tradeLicenseDetail = null;

        @JsonProperty("calculation")
        private Calculation calculation;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;

        @Size(max=128)
        @SafeHtml
        private String comment;

        @SafeHtml
        @JsonProperty("fileStoreId")
        private String fileStoreId = null;

}

