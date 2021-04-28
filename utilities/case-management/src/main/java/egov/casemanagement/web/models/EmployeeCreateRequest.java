package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeCreateRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo = null;

    private Employee employee;

}
