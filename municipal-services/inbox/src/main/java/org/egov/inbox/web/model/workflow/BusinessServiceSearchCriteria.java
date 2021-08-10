package org.egov.inbox.web.model.workflow;


import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessServiceSearchCriteria {


    @NotNull
    @JsonProperty("tenantId")
    private List<String> tenantIds;

    @JsonProperty("businessServices")
    private List<String> businessServices;

    @JsonIgnore
    private List<String> stateUuids;

    @JsonIgnore
    private List<String> actionUuids;


    public BusinessServiceSearchCriteria(BusinessServiceSearchCriteria criteria) {
        this.tenantIds = criteria.getTenantIds();
        this.businessServices = criteria.getBusinessServices();
        this.stateUuids = criteria.getStateUuids();
        this.actionUuids = criteria.getActionUuids();
    }
}
