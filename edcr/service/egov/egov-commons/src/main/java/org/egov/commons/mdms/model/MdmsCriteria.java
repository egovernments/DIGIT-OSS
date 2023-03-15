package org.egov.commons.mdms.model;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class MdmsCriteria {

    @NotNull
    private String tenantId;

    @NotNull
    @Valid
    private List<ModuleDetail> moduleDetails;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<ModuleDetail> getModuleDetails() {
        return moduleDetails;
    }

    public void setModuleDetails(List<ModuleDetail> moduleDetails) {
        this.moduleDetails = moduleDetails;
    }

}
