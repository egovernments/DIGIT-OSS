package digit.models.coremodels.mdms;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MasterMetaData {

    @JsonProperty("tenantId")
    public String tenantId;

    @JsonProperty("moduleName")
    public String moduleName;

    @JsonProperty("masterName")
    public String masterName;

    @JsonProperty("masterData")
    public List<Object> masterData;
}
