package org.egov.boundary.domain.model;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "app.module.propertytax",
        "app.module.vacantlandtax",
        "app.module.watertax",
        "app.module.buildingplanapproval",
        "app.module.buildingpenalization"
})
public class NonActiveModules {

    @JsonProperty("app.module.propertytax")
    private Boolean appModulePropertytax;
    @JsonProperty("app.module.vacantlandtax")
    private Boolean appModuleVacantlandtax;
    @JsonProperty("app.module.watertax")
    private Boolean appModuleWatertax;
    @JsonProperty("app.module.buildingplanapproval")
    private Boolean appModuleBuildingplanapproval;
    @JsonProperty("app.module.buildingpenalization")
    private Boolean appModuleBuildingpenalization;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("app.module.propertytax")
    public Boolean getAppModulePropertytax() {
        return appModulePropertytax;
    }

    @JsonProperty("app.module.propertytax")
    public void setAppModulePropertytax(Boolean appModulePropertytax) {
        this.appModulePropertytax = appModulePropertytax;
    }

    @JsonProperty("app.module.vacantlandtax")
    public Boolean getAppModuleVacantlandtax() {
        return appModuleVacantlandtax;
    }

    @JsonProperty("app.module.vacantlandtax")
    public void setAppModuleVacantlandtax(Boolean appModuleVacantlandtax) {
        this.appModuleVacantlandtax = appModuleVacantlandtax;
    }

    @JsonProperty("app.module.watertax")
    public Boolean getAppModuleWatertax() {
        return appModuleWatertax;
    }

    @JsonProperty("app.module.watertax")
    public void setAppModuleWatertax(Boolean appModuleWatertax) {
        this.appModuleWatertax = appModuleWatertax;
    }

    @JsonProperty("app.module.buildingplanapproval")
    public Boolean getAppModuleBuildingplanapproval() {
        return appModuleBuildingplanapproval;
    }

    @JsonProperty("app.module.buildingplanapproval")
    public void setAppModuleBuildingplanapproval(Boolean appModuleBuildingplanapproval) {
        this.appModuleBuildingplanapproval = appModuleBuildingplanapproval;
    }

    @JsonProperty("app.module.buildingpenalization")
    public Boolean getAppModuleBuildingpenalization() {
        return appModuleBuildingpenalization;
    }

    @JsonProperty("app.module.buildingpenalization")
    public void setAppModuleBuildingpenalization(Boolean appModuleBuildingpenalization) {
        this.appModuleBuildingpenalization = appModuleBuildingpenalization;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}