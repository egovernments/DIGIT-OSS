package org.egov.swcalculation.config;

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
public class SWCalculationConfiguration {

	// billing service
	@Value("${egov.billingservice.host}")
	private String billingServiceHost;

	@Value("${egov.taxhead.search.endpoint}")
	private String taxheadsSearchEndpoint;

	@Value("${egov.taxperiod.search.endpoint}")
	private String taxPeriodSearchEndpoint;

	// MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndPoint;

	// sewerage Registry
	@Value("${egov.sw.host}")
	private String sewerageConnectionHost;

	@Value("${egov.sc.search.endpoint}")
	private String sewerageConnectionSearchEndPoint;

	@Value("${sw.module.minpayable.amount}")
	private BigDecimal swMinAmountPayable;

	@Value("${egov.demand.businessservice}")
	private String businessService;
	
	@Value("${egov.demand.create.endpoint}")
	private String demandCreateEndPoint;
	
	@Value("${egov.demand.update.endpoint}")
	private String demandUpdateEndPoint;
	
	@Value("${egov.demand.search.endpoint}")
	private String demandSearchEndPoint;

	@Value("${egov.sewerageservice.pagination.default.limit}")
	private String limit;
	
	@Value("${egov.sewerageservice.pagination.default.offset}")
	private String offset;
	
	@Value("${egov.bill.gen.endpoint}")
	private String billGenEndPoint;
	
	@Value("${egov.demand.billexpirytime}")
	private Long demandBillExpiry;
	
	
    //SMS
    @Value("${kafka.topics.notification.sms}")
    private String smsNotifTopic;

    @Value("${notification.sms.enabled}")
    private Boolean isSMSEnabled;
    
    @Value("${notification.sms.link}")
    private String smsNotificationLink;

    //Email
    @Value("${notification.mail.enabled}")
    private Boolean isMailEnabled;
    
    @Value("${kafka.topics.notification.mail.name}")
    private String emailNotifTopic;
    
    //User-events
    @Value("${egov.user.event.notification.enabled}")
	private Boolean isUserEventsNotificationEnabled;
	
	@Value("${egov.usr.events.create.topic}")
	private String saveUserEventsTopic;

    //Localization
    @Value("${egov.localization.host}")
    private String localizationHost;

    @Value("${egov.localization.context.path}")
    private String localizationContextPath;

    @Value("${egov.localization.search.endpoint}")
    private String localizationSearchEndpoint;

    @Value("${egov.localization.statelevel}")
    private Boolean isLocalizationStateLevel;
    
    @Value("${sw.calculator.demand.successful.topic}")
    private String onDemandSuccess;
    
    @Value("${sw.calculator.demand.failed.topic}")
    private String onDemandFailed;
    
    @Value("${sw.calculator.bill.successful}")
    private String onBillSuccessful;
    
    @Value("${sw.calculator.bill.failed}")
    private String onBillFailed;
    
    // User Config
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;


    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;
   
	
	@Value("${egov.ui.app.host}")
	private String uiAppHost;
	
	@Value("${egov.usr.events.pay.code}")
	private String payCode;
	
	@Value("${egov.usr.events.pay.link}")
	private String payLink;
	
	@Value("${egov.bill.fetch.endpoint}")
	private String fetchBillEndPoint;
	

	@Value("${kafka.topics.billgen.topic}")
   	private String payTriggers;
	
    @Value("${sw.demand.based.batch.size}")
    private Integer batchSize;

	@Value("${egov.seweragecalculatorservice.createdemand.topic}")
	private String createDemand;
	
    @Value("${persister.demand.based.dead.letter.topic.batch}")
    private String deadLetterTopicBatch;

    @Value("${persister.demand.based.dead.letter.topic.single}")
    private String deadLetterTopicSingle;
    
    @Value("${notification.url}")
    private String notificationUrl;
    
	@Value("${egov.demand.minimum.payable.amount}")
	 private BigDecimal minimumPayableAmount;
    
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

	@Value("${egov.sw.view.history.link}")
	private String viewHistoryLink;

	@Value("${egov.bill.details.sms.link}")
	private String billDetailsLink;

}
