package org.egov.wf.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.TimeZone;



@Import({TracerConfiguration.class})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class WorkflowConfig {



    @Value("${app.timezone}")
    private String timeZone;

    @PostConstruct
    public void initialize() {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
    }

    @Bean
    @Autowired
    public MappingJackson2HttpMessageConverter jacksonConverter(ObjectMapper objectMapper) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        return converter;
    }


    @Value("${egov.wf.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.wf.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.wf.max.limit}")
    private Integer maxSearchLimit;

    @Value("${persister.save.transition.wf.topic}")
    private String saveTransitionTopic;

    @Value("${persister.save.businessservice.wf.topic}")
    private String saveBusinessServiceTopic;

    @Value("${persister.update.businessservice.wf.topic}")
    private String updateBusinessServiceTopic;



    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndPoint;


    //User
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.search.endpoint}")
    private String userSearchEndpoint;

    @Value("${egov.wf.inbox.assignedonly}")
    private Boolean assignedOnly;


    // Statelevel tenantId required for escalation
    @Value("${egov.statelevel.tenantid}")
    private String stateLevelTenantId;

    @Value("${egov.wf.escalation.batch.size}")
    private Integer escalationBatchSize;





}
