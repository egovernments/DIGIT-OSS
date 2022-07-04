package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResponseData {

        @Valid
        @JsonProperty("chartType")
        private String chartType;

        @Valid
        @JsonProperty("visualizationCode")
        private String visualizationCode;

        @Valid
        @JsonProperty("chartFormat")
        private String chartFormat;

        @Valid
        @JsonProperty("drillDownChartId")
        private String drillDownChartId;

        @Valid
        @JsonProperty("customData")
        private Map<String, Object> customData;

        @Valid
        @JsonProperty("dates")
        private RequestDate dates;

        @Valid
        @JsonProperty("filter")
        private Object filter;

        @Valid
        @JsonProperty("data")
        private List<Data> data = new ArrayList<>();

}
