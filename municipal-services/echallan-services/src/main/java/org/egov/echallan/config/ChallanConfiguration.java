package org.egov.echallan.config;

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
public class ChallanConfiguration {


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

    @Value("${egov.idgen.challanNum.name}")
    private String challannNumberIdgenName;

    @Value("${egov.idgen.challanNum.format}")
    private String challanNumberIdgenFormat;


    //Persister Config
    @Value("${persister.save.challan.topic}")
    private String saveChallanTopic;

    @Value("${persister.update.challan.topic}")
    private String updateChallanTopic;

    //Location Config
    @Value("${egov.location.host}")
    private String locationHost;

    @Value("${egov.location.context.path}")
    private String locationContextPath;

    @Value("${egov.location.endpoint}")
    private String locationEndpoint;

    @Value("${egov.location.hierarchyTypeCode}")
    private String hierarchyTypeCode;




    // echallan Calculator
    @Value("${egov.echallan.calculator.host}")
    private String calculatorHost;

    @Value("${egov.echallan.calculator.calculate.endpoint}")
    private String calculateEndpoint;

    @Value("${egov.billingservice.host}")
    private String billingHost;

    @Value("${egov.bill.gen.endpoint}")
    private String fetchBillEndpoint;


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

	@Value("${egov.usr.events.pay.triggers}")
	private String payTriggers;

    @Value("${egov.msg.pay.link}")
    private String payLinkSMS;

    @Value("${egov.url.shortner.host}")
    private String urlShortnerHost;
    @Value("${egov.url.shortner.endpoint}")
    private String urlShortnerEndpoint;

    @Value("${egov.challan.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.challan.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.challan.max.limit}")
    private Integer maxSearchLimit;
    
    @Value("${kafka.topics.notification.sms}")
    private String smsNotifTopic;

    @Value("${notification.sms.enabled}")
    private Boolean isSMSEnabled;
    
    @Value("${egov.user.event.notification.enabled}")
    private Boolean isUserEventEnabled;

    // Email
    @Value("${kafka.topics.notification.email}")
    private String emailNotifTopic;

    @Value("${notification.email.enabled}")
    private Boolean isEmailNotificationEnabled;
    
    @Value("${kafka.topics.receipt.cancel.name}")
    private String receiptCancelTopic;

    @Value("${egov.localityservice.host}")
    private String boundaryHost;

    @Value("${egov.locality.search.endpoint}")
    private String fetchBoundaryEndpoint;

    @Value("${state.level.tenant.id}")
    public String stateLevelTenantId;

    //collection
    @Value("${egov.collection.service.host}")
    private String collectionServiceHost;

    @Value("${egov.collection.service.search.endpoint}")
    private String collectionServiceSearchEndPoint;

    @Value("${egov.download.receipt.link}")
    private String receiptDownloadLink;
    
    @Value("${egov.dynamicdata.period}")
    private String numberOfMonths;
    
    @Value("${egov.challan.validity}")
    private String challanValidity;

}
