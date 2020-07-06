package egov.dataupload.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mapping {

    @JsonProperty("id")
    private String id = null;

    @JsonProperty("version")
    private String version = null;
    
    @JsonProperty("description")
    private String description = null;

    @JsonProperty("headers")
    private List<String> headers = null;

    @JsonProperty("steps")
    private List<Step> steps = null;

}
