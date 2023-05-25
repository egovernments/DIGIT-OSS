package org.egov.pt.web.contracts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuzzySearchCriteria {

    @JsonProperty("name")
    private String name;

    @JsonProperty("doorNo")
    private String doorNo;

    @JsonProperty("oldPropertyId")
    private String oldPropertyId;

}
