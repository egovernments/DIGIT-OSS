package org.egov.egovsurveyservices.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class SurveySearchCriteria {

    @JsonProperty("tenantIds")
    private List<String> tenantIds;

    @JsonProperty("title")
    private String title;

    @JsonProperty("postedBy")
    private String postedBy;

    @JsonProperty("status")
    private String status;

    @JsonIgnore
    private String uuid;

}
