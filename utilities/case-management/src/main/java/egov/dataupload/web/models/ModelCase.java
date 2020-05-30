package egov.dataupload.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import egov.dataupload.models.AuditDetails;
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
        @NotNull
        @Size(max=64)
        private String tenantId = null;

        @JsonProperty("name")
        @NotNull
        @Size(max=256)
        private String name = null;

        @JsonProperty("mobileNumber")
        @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
        @NotNull
        private String mobileNumber = null;

        @JsonProperty("age")
        @Min(0)
        @Max(99)
        @NotNull
        private Integer age = null;

        @JsonProperty("startDate")
        private Long startDate = null;

        @JsonProperty("endDate")
        private Long endDate = null;

        @JsonProperty("reason")
        @NotNull
        @Size(max=1000)
        private String reason = null;

        @JsonProperty("medicalHistory")
        @NotNull
        @Size(max=256)
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

