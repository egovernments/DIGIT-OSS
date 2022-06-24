package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Plot {

    @Valid
    @JsonProperty("label")
    private String label;

    @Valid
    @JsonProperty("name")
    private String name;

    @Valid
    @JsonProperty("value")
    private Double value;

    @Valid
    @JsonProperty("strValue")
    private String strValue;

    @Valid
    @JsonProperty("symbol")
    private String symbol;

    public Plot(String name, Double value, String symbol) {
        this.name = name;
        this.value = value;
        this.symbol = symbol;
    }

    public Plot(String name, String strValue, String symbol) {
        this.name = name;
        this.strValue = strValue;
        this.symbol = symbol;
        this.value = 0d;
    }

    public Plot(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
        this.value = null;
    }
}
