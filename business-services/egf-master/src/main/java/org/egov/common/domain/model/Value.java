package org.egov.common.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Value {

    @JsonProperty("key")
    private String key = null;

    @JsonProperty("name")
    private String name = null;

}