package org.egov.common.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValueContract {

    @JsonProperty("key")
    private String key = null;

    @JsonProperty("name")
    private String name = null;

}