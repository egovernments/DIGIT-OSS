package org.egov.nationaldashboardingest.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@Component
public class ApplicationProperties {

    @Value("${egov.es.host}")
    private String elasticSearchHost;

    @Value("${master.data.index}")
    private String masterDataIndex;

    @Value("#{${module.index.mapping}}")
    private Map<String, String> moduleIndexMapping;

    @Value("#{${module.fields.mapping}}")
    private Map<String, Map<String, String>> moduleFieldsMapping;

    @Value("#{${master.module.fields.mapping}}")
    private Map<String, HashSet<String>> masterModuleFieldsMapping;

}
