package org.egov.bpa.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class BPAPermitCountSearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("fromDate")
    private Long fromDate;

    @JsonProperty("toDate")
    private Long toDate;

    @JsonProperty("status")
    private String status = null;

    public boolean isEmpty() {
        return (this.tenantId == null && this.fromDate == null && this.fromDate == null);
    }

    public boolean tenantIdOnly() {
        return (this.tenantId != null && this.fromDate == null && this.fromDate == null);
    }

}
