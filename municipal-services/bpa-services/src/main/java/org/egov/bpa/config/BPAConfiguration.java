package org.egov.bpa.config;

import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.TimeZone;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class BPAConfiguration {

	@Value("${app.timezone}")
	private String timeZone;

	@PostConstruct
	public void initialize() {
		TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
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

	// Idgen Config
	@Value("${egov.idgen.host}")
	private String idGenHost;

	@Value("${egov.idgen.path}")
	private String idGenPath;

	@Value("${egov.idgen.bpa.applicationNum.name}")
	private String applicationNoIdgenName;

	@Value("${egov.idgen.bpa.applicationNum.format}")
	private String applicationNoIdgenFormat;

	@Value("${egov.idgen.bpa.permitNum.name}")
	private String permitNoIdgenName;

	@Value("${egov.idgen.bpa.permitNum.format}")
	private String permitNoIdgenFormat;

	// Persister Config
	@Value("${persister.save.buildingplan.topic}")
	private String saveTopic;

	@Value("${persister.update.buildingplan.topic}")
	private String updateTopic;

	@Value("${persister.update.buildingplan.workflow.topic}")
	private String updateWorkflowTopic;

	@Value("${persister.update.buildingplan.adhoc.topic}")
	private String updateAdhocTopic;

	// Location Config
	@Value("${egov.location.host}")
	private String locationHost;

	@Value("${egov.location.context.path}")
	private String locationContextPath;

	@Value("${egov.location.endpoint}")
	private String locationEndpoint;

	@Value("${egov.location.hierarchyTypeCode}")
	private String hierarchyTypeCode;

	@Value("${egov.bpa.default.limit}")
	private Integer defaultLimit;

	@Value("${egov.bpa.default.offset}")
	private Integer defaultOffset;

	@Value("${egov.bpa.max.limit}")
	private Integer maxSearchLimit;

	// EDCR Service
	@Value("${egov.edcr.host}")
	private String edcrHost;

	@Value("${egov.edcr.authtoken.endpoint}")
	private String edcrAuthEndPoint;

	@Value("${egov.edcr.getPlan.endpoint}")
	private String getPlanEndPoint;

	// Institutional key word
	@Value("${egov.ownershipcategory.institutional}")
	private String institutional;

	@Value("${egov.receipt.businessservice}")
	private String businessService;

	// Property Service
	@Value("${egov.property.service.host}")
	private String propertyHost;

	@Value("${egov.property.service.context.path}")
	private String propertyContextPath;

	@Value("${egov.property.endpoint}")
	private String propertySearchEndpoint;

	// SMS
	@Value("${kafka.topics.notification.sms}")
	private String smsNotifTopic;

	@Value("${notification.sms.enabled}")
	private Boolean isSMSEnabled;

	// Email
	@Value("${kafka.topics.notification.email}")
	private String emailNotifTopic;

	@Value("${notification.email.enabled}")
	private Boolean isEmailNotificationEnabled;

	// Localization
	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.context.path}")
	private String localizationContextPath;

	@Value("${egov.localization.search.endpoint}")
	private String localizationSearchEndpoint;

	@Value("${egov.localization.statelevel}")
	private Boolean isLocalizationStateLevel;

	@Value("${egov.localization.fallback.locale}")
	private String fallBackLocale;

	// Calculator
	@Value("${egov.bpa.calculator.host}")
	private String calculatorHost;

	@Value("${egov.bpa.calculator.calculate.endpoint}")
	private String calulatorEndPoint;

	@Value("${egov.billingservice.host}")
	private String billingHost;

	@Value("${egov.demand.search.endpoint}")
	private String demandSearchEndpoint;

	// MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndPoint;

	// Allowed Search Parameters
	@Value("${citizen.allowed.search.params}")
	private String allowedCitizenSearchParameters;

	@Value("${employee.allowed.search.params}")
	private String allowedEmployeeSearchParameters;

	@Value("${egov.tl.previous.allowed}")
	private Boolean isPreviousTLAllowed;

	@Value("${egov.tl.min.period}")
	private Long minPeriod;

	// Workflow
	@Value("${create.bpa.workflow.name}")
	private String businessServiceValue;

	@Value("${create.bpa.low.workflow.name}")
	private String lowBusinessServiceValue;

	@Value("${workflow.context.path}")
	private String wfHost;

	@Value("${workflow.transition.path}")
	private String wfTransitionPath;

	@Value("${workflow.businessservice.search.path}")
	private String wfBusinessServiceSearchPath;

	@Value("${workflow.process.path}")
	private String wfProcessPath;

	@Value("${is.external.workflow.enabled}")
	private Boolean isExternalWorkFlowEnabled;

	// USER EVENTS
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

	@Value("${egov.collection.service.host}")
	private String collectionServiceHost;

	@Value("${egov.collection.service.search.endpoint}")
	private String collectionServiceSearchEndPoint;

	@Value("${egov.bpa.validity.date.in.months}")
	private Integer validityInMonths;
	
	//landInfo
	
	@Value("${egov.landinfo.host}")
	private String landInfoHost;
	
	@Value("${egov.landinfo.create.endpoint}")
	private String landInfoCreate;
	
	@Value("${egov.landinfo.update.endpoint}")
	private String landInfoUpdate;
	
	@Value("${egov.landinfo.search.endpoint}")
	private String landInfoSearch;
	
	@Value("${persister.save.landinfo.topic}")
	private String saveLandInfoTopic;
	
	@Value("${persister.update.landinfo.topic}")
	private String updateLandInfoTopic;
	
	@Value("#{${appSrvTypeBussSrvCode}}")
	private Map<String,Map<String,String>> appSrvTypeBussSrvCode;
	
	@Value("${egov.bpa.skippayment.status}")
	private String skipPaymentStatuses;
	
	@Value("${egov.noc.service.host}")
	private String nocServiceHost;
	
	@Value("${egov.noc.create.endpoint}")
	private String nocCreateEndpoint;
	
	@Value("${egov.noc.update.endpoint}")
	private String nocUpdateEndpoint;
	
	@Value("${egov.noc.search.endpoint}")
	private String nocSearchEndpoint;
	
	@Value("${validate.required.nocs}")
	private Boolean validateRequiredNoc;
	
	@Value("${validate.required.nocs.statuses}")
	private String nocValidationCheckStatuses;
	
	@Value("${egov.noc.initiate.action}")
	private String nocInitiateAction;
	
	@Value("${egov.noc.void.action}")
	private String nocVoidAction;
	
	@Value("${egov.noc.autoapprove.action}")
	private String nocAutoApproveAction;
	
	@Value("${egov.noc.autoapproved.state}")
	private String nocAutoApprovedState;
	
	@Value("${egov.noc.approved.state}")
	private String nocApprovedState;
  
//	action and status constants
	@Value("${egov.sendtocitizen.action}")
	private String actionsendtocitizen;
	
	@Value("${egov.inprogress.action}")
	private String actioninprogress;
	
	@Value("${egov.approve.action}")
	private String actionapprove;
	
	@Value("${egov.pendingapplfee.stsus}")
	private String statuspendingapplfee;
	
	@Value("${egov.inprogress.stsus}")
	private String statusinprogress;
	

	@Value("#{${nocSourceConfig}}")
	private Map<String,String> nocSourceConfig;

	@Value("#{${workflowStatusFeeBusinessSrvMap}}")
	private Map<String,Map<String,String>> workflowStatusFeeBusinessSrvMap;

	@Value("${egov.collection.host}")
	private String collectionHost;

	@Value("${egov.collection.payment.search}")
	private String paymentSearch;

	@Value("${notification.url}")
	private String notificationUrl;

	@Value("${egov.download.receipt.link}")
	private String receiptDownloadLink;

	@Value("${egov.download.permit.order.link}")
	private String downloadPermitOrderLink;

	@Value("${egov.download.occupancy.certificate.link}")
	private String downloadOccupancyCertificateLink;

	// url shortner
	@Value("${egov.url.shortner.host}")
	private String urlShortnerHost;

	@Value("${egov.shortener.url}")
	private String shortenerURL;

	@Value("${egov.bpa.application.details.link}")
	private String applicationDetailsLink;

}
