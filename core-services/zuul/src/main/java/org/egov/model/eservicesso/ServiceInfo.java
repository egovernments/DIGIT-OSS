package org.egov.model.eservicesso;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceInfo {

    @JsonProperty("_id")
    private String appId;

    @JsonProperty("slug")
    private String slug;

    @JsonProperty("id")
    private String id;

    @JsonProperty("nameHindi")
    private String nameHindi;

    @JsonProperty("nameEnglish")
    private String nameEnglish;

    @JsonProperty("department")
    private DepartmentInfo department;


}
