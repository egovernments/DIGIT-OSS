package digit.models.coremodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class VoterApplicationSearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("status")
    private String status;

    @JsonProperty("ids")
    private List<String> ids;

    @JsonProperty("applicationNumber")
    private String applicationNumber;

}
