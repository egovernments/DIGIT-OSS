package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandSearchCriteria {

    @JsonProperty("tenantId")
    @NotNull
    private String tenantId;

    @JsonProperty("ids")
    private List<String> ids;

    @JsonProperty("landUId")
    private String landUId;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @JsonProperty("locality")
    private String locality;

    public boolean isEmpty() {
        return (this.tenantId == null && this.ids == null && this.landUId == null && this.mobileNumber == null && this.locality == null);
    }

    public boolean tenantIdOnly() {
        return (this.tenantId != null && this.ids == null && this.landUId == null && this.mobileNumber == null && this.locality == null);
    }
}
