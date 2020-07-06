package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * CaseUpdateRequest
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseUpdateRequest   {
        @JsonProperty("RequestInfo")
        private org.egov.common.contract.request.RequestInfo requestInfo = null;

        @JsonProperty("case")
        private UpdateCase _case = null;
}

