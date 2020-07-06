package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestInfoWrapper {

    @JsonProperty("RequestInfo")
    private org.egov.common.contract.request.RequestInfo requestInfo = null;
}
