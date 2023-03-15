package digit.models.coremodels.mdms;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MDMSCreateRequest {

    @JsonProperty("RequestInfo")
    public RequestInfo requestInfo;

    @JsonProperty("MasterMetaData")
    public MasterMetaData masterMetaData;

}
