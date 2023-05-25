package egov.dataupload.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DataUploadConfig {


    @JsonProperty("service")
    private String service = null;


    @JsonProperty("mappings")
    private List<Mapping> mappings = null;
}
