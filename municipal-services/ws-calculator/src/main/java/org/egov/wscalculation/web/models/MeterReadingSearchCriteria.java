package org.egov.wscalculation.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Set;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MeterReadingSearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("connectionNos")
    private Set<String> connectionNos;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    public boolean isEmpty() {
        return (StringUtils.isEmpty(this.tenantId) && CollectionUtils.isEmpty(this.connectionNos));
    }
}
