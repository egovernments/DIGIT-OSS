package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import egov.casemanagement.models.AuditDetails;
import lombok.*;

import javax.validation.constraints.*;

/**
 * Isolation case deatils - User and Daily Health Paramerter Deetails.
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ModelCase   {

        @JsonProperty("tenantId")
        @NotNull(message = "Tenant Id is mandatory")
        @Size(message = "Max allowed characters for Tenant ID 64 is 1000 characters", max=64)
        private String tenantId = null;

        @JsonProperty("name")
        @NotNull
        @Size(message = "Max allowed characters for Name is 256 characters", max=256)
        private String name = null;

        @JsonProperty("mobileNumber")
        @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
        @NotNull(message = "Mobile number is mandatory")
        private String mobileNumber = null;

        @JsonProperty("age")
        @Min(message = "Min allowed age is 0 year", value = 0)
        @Max(message = "Max allowed age is 99 years", value = 99)
        @NotNull(message = "Age is mandatory")
        private Integer age = null;

        @JsonProperty("startDate")
        private Long startDate = null;

        @JsonProperty("endDate")
        private Long endDate = null;

        @JsonProperty("reason")
        @NotNull(message = "Reason is mandatory")
        @Size(message = "Max allowed characters for Reason field is 1000 characters", max=1000)
        private String reason = null;

        @JsonProperty("medicalHistory")
        @NotNull(message = "Medical History is mandatory")
        @Size(message = "Max allowed characters for Medical History is 256 characters", max=256)
        private String medicalHistory = null;

        @JsonProperty("additionalDetails")
        private JsonNode additionalDetails = null;

        @JsonProperty("status")
        private Status status = null;

        @JsonProperty("healthDetails")
        private JsonNode healthDetails = null;

        @JsonProperty("caseId")
        private String caseId = null;

        @JsonProperty("uuid")
        private String uuid = null;

        @JsonProperty("signature")
        private String signature = null;

        @JsonProperty("userUuid")
        private String userUuid = null;

//        @JsonProperty("signature")
//        private Signature signature = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;



}

