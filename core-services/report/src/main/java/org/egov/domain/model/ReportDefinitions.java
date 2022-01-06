package org.egov.domain.model;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.swagger.model.ReportDefinition;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

@ConfigurationProperties
@EnableConfigurationProperties(ReportDefinitions.class)
public class ReportDefinitions {


    @JsonProperty("ReportDefinitions")
    public List<ReportDefinition> reportDefinitions = new ArrayList<>();

    @JsonProperty("moduleKey")
    private String moduleKey;

    private HashMap<String, ReportDefinition> definitionMap = new HashMap<>();


    public String getModuleKey() {
        return moduleKey;
    }

    public void setModuleKey(String moduleKey) {
        this.moduleKey = moduleKey;
    }


    private HashMap<String, ReportDefinition> duplicateReportKeys = new HashMap<>();


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
        System.out.println("Coming in to the set report definition method");
        for (ReportDefinition rd : reportDefinitions) {
            String reportKey = "";
            if (rd.getModuleName() != null) {
                reportKey = rd.getModuleName() + " " + rd.getReportName();
            } else {
                reportKey = rd.getReportName();
            }
            if (definitionMap.get(rd.getReportName()) == null) {
                definitionMap.put(reportKey, rd);


            } else {
                definitionMap.put(reportKey, rd);

            }


        }
        System.out.println("Hash Map Keys are :" + definitionMap.keySet());

    }

    @Override
    public String toString() {
        return "ReportDefinitions [moduleKey=" + moduleKey + " reportDefinitions=" + reportDefinitions + "]";
    }

}


