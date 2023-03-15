package org.egov.wscalculation.config;

import java.math.BigDecimal;

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
public class WSCalculationConfiguration {

	@Value("${egov.ws.search.meterReading.pagination.default.limit}")
	private Integer meterReadingDefaultLimit;

	@Value("${egov.ws_calculation.meterReading.default.offset}")
	private Integer meterReadingDefaultOffset;


	/*
	 * Calculator Configs
	 */

	// billing service
	@Value("${egov.billingservice.host}")
	private String billingServiceHost;

	@Value("${egov.taxhead.search.endpoint}")
	private String taxheadsSearchEndpoint;

	@Value("${egov.taxperiod.search.endpoint}")
	private String taxPeriodSearchEndpoint;

	@Value("${egov.demand.create.endpoint}")
	private String demandCreateEndPoint;

	@Value("${egov.demand.update.endpoint}")
	private String demandUpdateEndPoint;

	@Value("${egov.demand.search.endpoint}")
	private String demandSearchEndPoint;
	
	@Value("${egov.bill.fetch.endpoint}")
	private String fetchBillEndPoint;
	
	@Value("${egov.demand.billexpirytime}")
	private Long demandBillExpiryTime;

	@Value("${egov.bill.gen.endpoint}")
	private String billGenEndPoint;

	// MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndPoint;
	
    	@Value("${egov.bill.gen.endpoint}")
    	private String billGenerateEndpoint;

	// water demand configs

	@Value("${ws.module.code}")
	private String wsModuleCode;

	@Value("${ws.module.minpayable.amount}")
	private Integer ptMinAmountPayable;

	@Value("${ws.financialyear.start.month}")
	private String financialYearStartMonth;
	
	
	@Value("${egov.demand.businessservice}")
	private String businessService;
	  
	@Value("${egov.demand.minimum.payable.amount}")
	 private BigDecimal minimumPayableAmount;
	  
	 //water Registry
	 @Value("${egov.ws.host}")
	 private String waterConnectionHost;

	 @Value("${egov.wc.search.endpoint}")
	 private String waterConnectionSearchEndPoint;
	 
	 //Demand Topic
	 @Value("${ws.calculator.demand.successful.topic}")
	 private String onDemandsSaved;

	 @Value("${ws.calculator.demand.failed}")
	 private String onDemandsFailure;

	 
	//Localization
	@Value("${egov.localization.host}")
	private String localizationHost;
	
	@Value("${egov.localization.context.path}")
	private String localizationContextPath;
	
	@Value("${egov.localization.search.endpoint}")
	private String localizationSearchEndpoint;
	
	@Value("${egov.localization.statelevel}")
	private Boolean isLocalizationStateLevel;
	
	 //SMS
    	@Value("${kafka.topics.notification.sms}")
    	private String smsNotifTopic;

    	@Value("${notification.sms.enabled}")
    	private Boolean isSMSEnabled;
    
    	@Value("${notification.sms.link}")
    	private String smsNotificationLink;
    
    	@Value("${notification.email.enabled}")
    	private Boolean isEmailEnabled;
    
  	//Email
    	@Value("${kafka.topics.notification.mail.name}")
    	private String emailNotifyTopic;
    
    	//User Configuration
    	@Value("${egov.user.host}")
    	private String userHost;

    	@Value("${egov.user.context.path}")
    	private String userContextPath;


    	@Value("${egov.user.search.path}")
    	private String userSearchEndpoint;
    
    	//payment 
    	@Value("${egov.usr.events.pay.triggers}")
   	private String billgenTopic;
    
    
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

	@Value("${kafka.topics.billgen.topic}")
   	private String payTriggers;
	
	@Value("${egov.watercalculatorservice.createdemand.topic}")
	private String createDemand;
	
    	@Value("${ws.demand.based.batch.size}")
    	private Integer batchSize;
    
    	@Value("${persister.demand.based.dead.letter.topic.batch}")
    	private String deadLetterTopicBatch;

    	@Value("${persister.demand.based.dead.letter.topic.single}")
    	private String deadLetterTopicSingle;
    
    
    	@Value("${notification.url}")
    	private String notificationUrl;

    	@Value("${egov.shortener.url}")
	private String shortenerURL;
    
    	@Value("${egov.property.service.host}")
	private String propertyHost;

	@Value("${egov.property.searchendpoint}")
	private String searchPropertyEndPoint;

	@Value("${workflow.workDir.path}")
	private String workflowHost;

	@Value("${workflow.process.search.path}")
	private String searchWorkflowProcessEndPoint;

	@Value("${bulk.demand.batch.value}")
	private Integer bulkbatchSize;

	@Value("${bulk.demand.offset.value}")
	private Integer batchOffset;

	@Value("${egov.internal.microservice.user.uuid}")
	private String egovInternalMicroserviceUserUuid;

	@Value("${egov.bill.search.endpoint}")
	private String searchBillEndPoint;

	@Value("${egov.ws.view.history.link}")
	private String viewHistoryLink;

	@Value("${egov.bill.details.sms.link}")
	private String billDetailsLink;

}
