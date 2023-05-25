package egov.casemanagement.models.cova;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CovaSearchResponse {
    @JsonProperty("response")
    private int response = 0;

    @JsonProperty("sys_message")
    private String sys_message = null;

    @JsonProperty("data")
    private List<CovaData> data = null;
}
