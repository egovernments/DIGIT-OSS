package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

/**
 * UpdateCase
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateCase   {
        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("caseId")
        private String caseId = null;

        @JsonProperty("mobileNumber")
        private String mobileNumber = null;

        @JsonProperty("uuid")
        private String uuid = null;

        @JsonProperty("startDate")
        private Long startDate = null;

        @JsonProperty("endDate")
        private Long endDate = null;

        @JsonProperty("reason")
        private String reason = null;

        @JsonProperty("additionalDetails")
        private JsonNode additionalDetails = null;

        @JsonProperty("status")
        private Status status = null;


}

