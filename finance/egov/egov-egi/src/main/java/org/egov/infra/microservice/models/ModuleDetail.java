package org.egov.infra.microservice.models;

import java.util.List;

public class ModuleDetail {

    private String moduleName;
    
    private List<MasterDetail> masterDetails;

    public ModuleDetail(String moduleName, List<MasterDetail> masterDetails) {
        this.moduleName = moduleName;
        this.masterDetails = masterDetails;
    }
    
    public ModuleDetail(){}

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
