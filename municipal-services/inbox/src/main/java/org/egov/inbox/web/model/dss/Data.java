package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Data {

    @Valid
    @JsonProperty("headerName")
    private String headerName;

    @Valid
    @JsonProperty("headerValue")
    private BigDecimal headerValue;

    @Valid
    @JsonProperty("headerSymbol")
    private String headerSymbol;

    @Valid
    @JsonProperty("insight")
    private InsightsWidget insight;

    private List<Plot> plots = new ArrayList<>();

    public Data(String name, BigDecimal value, String symbol) {
        this.headerName = name;
        this.headerValue = value;
        this.headerSymbol = symbol;
    }

    public Data(String name, BigDecimal value, String symbol, List<Plot> plots) {
        this.headerName = name;
        this.headerValue = value;
        this.headerSymbol = symbol;
        this.plots = plots;
    }
}
