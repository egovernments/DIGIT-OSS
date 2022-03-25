package org.egov.egovdocumentuploader.web.models;

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
public class DocumentSearchCriteria {

    @JsonProperty("tenantIds")
    private List<String> tenantIds;

    @JsonProperty("name")
    private String name;

    @JsonProperty("postedBy")
    private String postedBy;

    @JsonProperty("category")
    private String category;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @JsonIgnore
    private String uuid;

    @JsonIgnore
    private Boolean isCountCall = false;

}
