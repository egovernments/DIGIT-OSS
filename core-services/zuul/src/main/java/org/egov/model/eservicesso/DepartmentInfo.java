package org.egov.model.eservicesso;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DepartmentInfo {

    @JsonProperty("_id")
    private String id;

    @JsonProperty("slug")
    private String slug;

    @JsonProperty("nameEnglish")
    private String nameEnglish;

    @JsonProperty("nameHindi")
    private String nameHindi;

}
