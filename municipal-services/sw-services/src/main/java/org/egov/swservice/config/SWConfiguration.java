package org.egov.swservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Component
public class SWConfiguration {
	
	@Value("${egov.sewerageservice.pagination.default.limit}")
	private Integer defaultLimit;

	@Value("${egov.sewerageservice.pagination.default.offset}")
	private Integer defaultOffset;
	

    @Value("${egov.idgen.scid.name}")
    private String sewerageIdGenName;

    @Value("${egov.idgen.scid.format}")
    private String sewerageIdGenFormat;
    
    @Value("${egov.idgen.scapid.name}")
    private String sewerageApplicationIdGenName;

    @Value("${egov.idgen.scapid.format}")
    private String sewerageApplicationIdGenFormat;
    
    //Idgen Config
    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;
    
    // Workflow
    @Value("${create.sw.workflow.name}")
    private String businessServiceValue;

    @Value("${workflow.context.path}")
    private String wfHost;

    @Value("${workflow.transition.path}")
    private String wfTransitionPath;

    @Value("${workflow.businessservice.search.path}")
    private String wfBusinessServiceSearchPath;

    @Value("${is.external.workflow.enabled}")
    private Boolean isExternalWorkFlowEnabled;
    
    @Value("${egov.sewerageservice.updatesewerageconnection.workflow.topic}")
    private String workFlowUpdateTopic;
    

	// Localization
	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.context.path}")
	private String localizationContextPath;

	@Value("${egov.localization.search.endpoint}")
	private String localizationSearchEndpoint;

	@Value("${egov.localization.statelevel}")
	private Boolean isLocalizationStateLevel;

	// SMS
	@Value("${kafka.topics.notification.sms}")
	private String smsNotifTopic;

	@Value("${notification.sms.enabled}")
	private Boolean isSMSEnabled;

	@Value("${notification.sms.link}")
	private String smsNotificationLink;

	@Value("${notification.url}")
	private String notificationUrl;

	@Value("${egov.usr.events.create.topic}")
	private String saveUserEventsTopic;
	
	@Value("${egov.user.event.notification.enabled}")
	private Boolean isUserEventsNotificationEnabled;
	
    //User Configuration
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;
    
    // sewerage connection Calculator
    @Value("${egov.sw.calculation.host}")
    private String calculatorHost;

    @Value("${egov.sw.calculation.endpoint}")
    private String calculateEndpoint;
    
    @Value("${egov.receipt.businessservice}")
    private String receiptBusinessservice;
    
	// sewerage notification links configuration

	@Value("${sw.mseva.app.link}")
	private String mSevaAppLink;

	@Value("${sw.view.history.link}")
	private String viewHistoryLink;

	@Value("${sw.connectiondetails.link}")
	private String connectionDetailsLink;

	@Value("${sw.application.pay.link}")
	private String applicationPayLink;

	@Value("${egov.sw.estimate.endpoint}")
	private String estimationEndpoint;

	@Value("${sw.pdfservice.link}")
	private String pdfServiceLink;

	@Value("${sw.fileStore.link}")
	private String fileStoreLink;

	@Value("${sw.shortener.url}")
	private String shortenerURL;
	
	@Value("${egov.pdfservice.host}")
    private String pdfServiceHost;
    
    @Value("${egov.filestore.host}")
    private String fileStoreHost;
    
    @Value("${sw.editnotification.topic}")
    private String editNotificationTopic;
    
    @Value("${sw.consume.filestoreids.topic}")
	private String fileStoreIdsTopic;

	@Value("${egov.sewerageservice.savefilestoreIds}")
	private String saveFileStoreIdsTopic;
	
	@Value("${workflow.process.search.path}")
	private String wfProcessSearchPath;

}
