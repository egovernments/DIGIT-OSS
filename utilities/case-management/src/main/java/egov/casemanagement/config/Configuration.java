package egov.casemanagement.config;

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
public class Configuration {


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

    // User Config
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;

    @Value("${egov.user.create.path}")
    private String userCreateEndpoint;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndpoint;

    @Value("${egov.user.username.prefix}")
    private String usernamePrefix;


    //Idgen Config
    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;

    @Value("${egov.idgen.case.applicationNum.name}")
    private String applicationNumberIdgenName;

    @Value("${egov.idgen.case.applicationNum.format}")
    private String applicationNumberIdgenFormat;



    //Persister Config
    @Value("${persister.save.case.topic}")
    private String saveTopic;

    @Value("${persister.update.case.topic}")
    private String updateTopic;

    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndPoint;

    @Value("${egov.enc.service.host}")
    private String encServiceHost;

    @Value("${egov.enc.service.path}")
    private String encServicePath;

    @Value("${es.case.topic}")
    private String esCaseTopic;

    @Value("${es.index.name}")
    private String esIndexName;

    @Value("${egov.root.tenant.id}")
    private String rootTenantId;

    @Value("${send.email.topic}")
    private String sendEmailTopic;

    @Value("${send.sms.topic}")
    private String sendSmsTopic;

    @Value("${cova.health.record.topic}")
    private String covaHealthRecordTopic;

    @Value("${cova.fetch.url}")
    private String covaFetchUrl;

    @Value("${cova.create.health.record.url}")
    private String covaCreateHealthRecordUrl;

    @Value("${cova.auth.token}")
    private String covaAuthToken;

}
