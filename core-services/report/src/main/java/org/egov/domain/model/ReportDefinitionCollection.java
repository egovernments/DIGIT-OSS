package org.egov.domain.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.swagger.model.ReportDefinition;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReportDefinitionCollection {
    @JsonProperty("moduleName")
    public String moduleName;

    @JsonProperty("ReportDefinitions")
    public List<ReportDefinition> reportDefinitions = new ArrayList<>();

    private HashMap<String, ReportDefinition> definitionMap = new HashMap<>();

    private HashMap<String, ReportDefinition> duplicateReportKeys = new HashMap<>();


    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public ReportDefinition getReportDefinition(String name) {
        return definitionMap.get(name);
    }

    public List<ReportDefinition> getDuplicateReportDefinition() {
        List<ReportDefinition> localreportDefinitions = new ArrayList<>(duplicateReportKeys.values());
        return localreportDefinitions;
    }

    public List<ReportDefinition> getReportDefinitions() {
        return reportDefinitions;
    }

    public void setReportDefinitions(List<ReportDefinition> reportDefinitions) {
        this.reportDefinitions = reportDefinitions;
        for (ReportDefinition rd : reportDefinitions) {
            String reportKey = rd.getReportName();

            if (definitionMap.get(rd.getReportName()) == null) {
                definitionMap.put(reportKey, rd);
            } else {
                duplicateReportKeys.put(reportKey, rd);
            }

        }
    }

    @Override
    public String toString() {
        return "ReportDefinitions [moduleName=" + moduleName + " reportDefinitions=" + reportDefinitions + "]";
    }
}
