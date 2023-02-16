package digit.models.coremodels.mdms;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MdmsCreateResponse {

    @JsonProperty("ResponseInfo")
    public ResponseInfo responseInfo;

    @JsonProperty("Data")
    public Object data;

}
