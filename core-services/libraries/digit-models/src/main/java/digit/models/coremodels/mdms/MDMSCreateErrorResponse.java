package digit.models.coremodels.mdms;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MDMSCreateErrorResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("Message")
    private String message;

    @JsonProperty("Data")
    private Object data;

}
