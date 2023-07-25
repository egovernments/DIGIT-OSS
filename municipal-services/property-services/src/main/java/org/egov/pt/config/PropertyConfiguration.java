package org.egov.pt.config;

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

import java.math.BigDecimal;
import java.util.List;
import java.util.TimeZone;


@Import({TracerConfiguration.class})
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class PropertyConfiguration {

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


    //PERSISTER
    @Value("${persister.save.property.topic}")
    private String savePropertyTopic;

    @Value("${persister.save.property.fuzzy.topic}")
    private String savePropertyFuzzyTopic;
    
    @Value("${persister.update.property.topic}")
    private String updatePropertyTopic;

    @Value("${persister.cancel.property.topic}")
    private String cancelPropertyTopic;

    @Value("${persister.cancel.property.assessment.topic}")
    private String cancelPropertyAssessmentTopic;

    @Value("${persister.update.document.topic}")
    private String updateDocumentTopic;

    @Value("${persister.migration.batch.count.topic}")
    private String migartionBatchCountTopic;

    //USER
    @Value("${egov.user.host}")
    private String userHost;
    
    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.internal.microservice.user.uuid}")
    private String egovInternalMicroserviceUserUuid;


    //IDGEN config
    
    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;
    
    @Value("${egov.idgen.ack.name}")
    private String ackIdGenName;

    @Value("${egov.idgen.ack.format}")
    private String ackIdGenFormat;
    
    @Value("${egov.idgen.mutation.name}")
    private String mutationIdGenName;

    @Value("${egov.idgen.mutation.format}")
    private String mutationIdGenFormat;

    @Value("${egov.idgen.assm.name}")
    private String assessmentIdGenName;

    @Value("${egov.idgen.assm.format}")
    private String assessmentIdGenFormat;

    @Value("${egov.idgen.ptid.name}")
    private String propertyIdGenName;

    @Value("${egov.idgen.ptid.format}")
    private String propertyIdGenFormat;


    //NOTIFICATION TOPICS
    @Value("${kafka.topics.notification.sms}")
    private String smsNotifTopic;

    @Value("${kafka.topics.notification.email}")
    private String emailNotifTopic;

    @Value("${kafka.topics.receipt.create}")
    private String receiptTopic;

    @Value("${kafka.topics.notification.pg.save.txns}")
    private String pgTopic;

    @Value("${egov.localization.statelevel}")
    private Boolean isStateLevel;

    @Value("${notif.sms.enabled}")
    private Boolean isSMSNotificationEnabled;

    @Value("${notif.email.enabled}")
    private Boolean isEmailNotificationEnabled;
    
    // Notif variables 
    
    @Value("${egov.notif.commonpay}")
    private String commonPayLink;
    
    @Value("${egov.notif.view.property}")
    private String viewPropertyLink;
    
    @Value("${egov.notif.view.mutation}")
    private String viewMutationLink;
    

    @Value("${egov.usr.events.view.history.link}")
    private String userEventViewPropertyLink;
    
    @Value("${egov.usr.events.view.mutation.history.link}")
    private String userEventViewMutationLink;

    @Value("${egov.usr.events.download.receipt.link}")
    private String userEventReceiptDownloadLink;
    
    //Property Search Params
    @Value("${citizen.allowed.search.params}")
    private String citizenSearchParams;

    @Value("${employee.allowed.search.params}")
    private String employeeSearchParams;

    @Value("${notification.url}")
    private String notificationURL;
    
    @Value("${pt.search.pagination.default.limit}")
    private Long defaultLimit;

    @Value("${pt.search.pagination.default.offset}")
    private Long defaultOffset;
    
    @Value("${pt.search.pagination.max.search.limit}")
    private Long maxSearchLimit;

    //Localization
    @Value("${egov.localization.host}")
    private String localizationHost;

    @Value("${egov.localization.context.path}")
    private String localizationContextPath;

    @Value("${egov.localization.search.endpoint}")
    private String localizationSearchEndpoint;

    @Value("${egov.localization.fallback.locale}")
    private String fallBackLocale;
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

    @Value("${egov.msg.download.receipt.link}")
    private String receiptDownloadLink;
	
	//Assessments V2
	@Value("${egov.pt.assessment.create.topic}")
	private String createAssessmentTopic;
	
	@Value("${egov.pt.assessment.update.topic}")
	private String updateAssessmentTopic;

    @Value("${egov.msg.pay.link}")
    private String payLinkSMS;
	

    // Workflow
	
    @Value("${pt.business.codes}")
    private List<String> businessServiceList;

    @Value("${workflow.host}")
    private String wfHost;

    @Value("${workflow.transition.path}")
    private String wfTransitionPath;

    @Value("${workflow.businessservice.search.path}")
    private String wfBusinessServiceSearchPath;

    @Value("${workflow.processinstance.search.path}")
    private String wfProcessInstanceSearchPath;

    @Value("${is.workflow.enabled}")
    private Boolean isWorkflowEnabled;
    
    @Value("${property.create.workflow.name}")
    private String createPTWfName;
    
    @Value("${property.legacy.entry.workflow.name}")
    private String LegacyPTWfName;
    
    @Value("${property.update.workflow.name}")
    private String updatePTWfName;
    
    @Value("${is.mutation.workflow.enabled}")
    private Boolean isMutationWorkflowEnabled;
    
    @Value("${mutation.workflow.name}")
    private String mutationWfName;
    
    @Value("${mutation.workflow.open.state}")
    private String mutationOpenState;
    
    @Value("${workflow.status.active}")
    private String wfStatusActive;
    
    // ##### mdms 
    
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndpoint;
    
    // Billing-Service
    
    
    @Value("${egbs.host}")
    private String egbsHost;

    @Value("${egbs.fetchbill.endpoint}")
    private String egbsFetchBill;
    	
    // Registry 
    
    @Value("${property.min.landarea}")
	private Double minumumLandArea;
    
    @Value("${property.unit.landarea}")
	private String landAreaUnit;
    
    @Value("${property.min.unit.builtuparea}")
	private BigDecimal minUnitArea;
    
    @Value("${property.module.name}")
	private String propertyModuleName;    



    // Assessment Workflow

    @Value("${assessment.workflow.enabled}")
    private Boolean isAssessmentWorkflowEnabled;


    @Value("${assessment.workflow.trigger.param}")
    private String assessmentWorkflowTriggerParams;

    @Value("${assessment.workflow.trigger.object}")
    private String assessmentWorkflowObjectTriggers;

    @Value("${assessment.workflow.demand.trigger}")
    private String demandTriggerState;



    // Calculation

    @Value("${egov.calculation.host}")
    private String calculationHost;

    @Value("${egov.calculation.context.path}")
    private String calculationContextPath;


    @Value("${egov.calculation.endpoint}")
    private String calculationEndpoint;

    @Value("${egov.calculation.mutation.endpoint}")
    private String mutationCalculationEndpoint;


    @Value("${egov.localization.statelevel}")
    private Boolean isLocalizationStateLevel;


    // url shortner

    @Value("${egov.url.shortner.host}")
    private String urlShortnerHost;

    @Value("${egov.url.shortner.endpoint}")
    private String urlShortnerEndpoint;

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;


    // ES Config

    @Value("${elasticsearch.host}")
    private String esHost;

    @Value("${property.es.index}")
    private String esPTIndex;

    @Value("${elasticsearch.search.endpoint}")
    private String esSearchEndpoint;

    @Value("${pt.search.name.fuziness}")
    private String nameFuziness;

    @Value("${pt.search.doorno.fuziness}")
    private String doorNoFuziness;

    @Value("${pt.search.oldpropertyid.fuziness}")
    private String oldPropertyIdFuziness;

    @Value("${pt.fuzzy.searh.is.wildcard}")
    private Boolean isSearchWildcardBased;

    // Inbox service Config

    @Value("${inbox.property.search.allowed}")
    private Boolean isInboxSearchAllowed;

    //encryptOldDataStatus topic
    @Value("${property.oldDataEncryptionStatus.topic}")
    private String encryptionStatusTopic;

}