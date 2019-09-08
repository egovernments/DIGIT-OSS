package org.egov.tl.config;

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
public class TLConfiguration {


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

    @Value("${egov.idgen.tl.applicationNum.name}")
    private String applicationNumberIdgenName;

    @Value("${egov.idgen.tl.applicationNum.format}")
    private String applicationNumberIdgenFormat;

    @Value("${egov.idgen.tl.licensenumber.name}")
    private String licenseNumberIdgenName;

    @Value("${egov.idgen.tl.licensenumber.format}")
    private String licenseNumberIdgenFormat;




    //Persister Config
    @Value("${persister.save.tradelicense.topic}")
    private String saveTopic;

    @Value("${persister.update.tradelicense.topic}")
    private String updateTopic;

    @Value("${persister.update.tradelicense.workflow.topic}")
    private String updateWorkflowTopic;

    @Value("${persister.update.tradelicense.adhoc.topic}")
    private String updateAdhocTopic;


    //Location Config
    @Value("${egov.location.host}")
    private String locationHost;

    @Value("${egov.location.context.path}")
    private String locationContextPath;

    @Value("${egov.location.endpoint}")
    private String locationEndpoint;

    @Value("${egov.location.hierarchyTypeCode}")
    private String hierarchyTypeCode;

    @Value("${egov.tl.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.tl.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.tl.max.limit}")
    private Integer maxSearchLimit;



    // tradelicense Calculator
    @Value("${egov.tl.calculator.host}")
    private String calculatorHost;

    @Value("${egov.tl.calculator.calculate.endpoint}")
    private String calculateEndpoint;

    @Value("${egov.tl.calculator.getBill.endpoint}")
    private String getBillEndpoint;



    //Institutional key word
    @Value("${egov.ownershipcategory.institutional}")
    private String institutional;


    @Value("${egov.receipt.businessservice}")
    private String businessService;


    //Property Service
    @Value("${egov.property.service.host}")
    private String propertyHost;

    @Value("${egov.property.service.context.path}")
    private String propertyContextPath;

    @Value("${egov.property.endpoint}")
    private String propertySearchEndpoint;


    //SMS
    @Value("${kafka.topics.notification.sms}")
    private String smsNotifTopic;

    @Value("${notification.sms.enabled}")
    private Boolean isSMSEnabled;



    //Localization
    @Value("${egov.localization.host}")
    private String localizationHost;

    @Value("${egov.localization.context.path}")
    private String localizationContextPath;

    @Value("${egov.localization.search.endpoint}")
    private String localizationSearchEndpoint;

    @Value("${egov.localization.statelevel}")
    private Boolean isLocalizationStateLevel;



    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndPoint;


    //Allowed Search Parameters
    @Value("${citizen.allowed.search.params}")
    private String allowedCitizenSearchParameters;

    @Value("${employee.allowed.search.params}")
    private String allowedEmployeeSearchParameters;



    @Value("${egov.tl.previous.allowed}")
    private Boolean isPreviousTLAllowed;

    @Value("${egov.tl.min.period}")
    private Long minPeriod;


    // Workflow
    @Value("${create.tl.workflow.name}")
    private String businessServiceValue;

    @Value("${workflow.context.path}")
    private String wfHost;

    @Value("${workflow.transition.path}")
    private String wfTransitionPath;

    @Value("${workflow.businessservice.search.path}")
    private String wfBusinessServiceSearchPath;


    @Value("${is.external.workflow.enabled}")
    private Boolean isExternalWorkFlowEnabled;

    //USER EVENTS
	@Value("${egov.ui.app.host}")
	private String uiAppHost;
    
	@Value("${egov.usr.events.create.topic}")
	private String saveUserEventsTopic;
		
	@Value("${egov.usr.events.pay.link}")
	private String payLink;
	
	@Value("${egov.usr.events.pay.code}")
	private String payCode;
	
	@Value("${egov.user.event.notification.enabled}")
	private Boolean isUserEventsNotificationEnabled;

	@Value("${egov.usr.events.pay.triggers}")
	private String payTriggers;


}
