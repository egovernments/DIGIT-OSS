package org.egov.commons.mdms.model;

import java.util.List;

import javax.validation.constraints.NotNull;

public class ModuleDetail {

    @NotNull
    private String moduleName;

    private List<MasterDetail> masterDetails;

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public List<MasterDetail> getMasterDetails() {
        return masterDetails;
    }

    public void setMasterDetails(List<MasterDetail> masterDetails) {
        this.masterDetails = masterDetails;
    }

}
