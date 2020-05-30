package egov.dataupload.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * CaseSearchRequest
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseSearchRequest   {
        @JsonProperty("RequestInfo")
        @NotNull
        private org.egov.common.contract.request.RequestInfo requestInfo = null;

        @JsonProperty("tenantId")
        @Size(max=64)
        private String tenantId = null;

        @JsonProperty("mobileNumber")
        @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
        @NotNull
        private String mobileNumber = null;

        @JsonProperty("name")
        private String name = null;

        @JsonProperty("caseId")
        private String caseId = null;

        @JsonProperty("uuid")
        private String uuid = null;

        @JsonProperty("status")
        private Status status = null;

        @JsonProperty("userUuids")
        private Set<String> userUuids = null;


}

