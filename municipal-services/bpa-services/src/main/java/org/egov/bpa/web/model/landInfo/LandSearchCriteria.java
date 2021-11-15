package org.egov.bpa.web.model.landInfo;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
