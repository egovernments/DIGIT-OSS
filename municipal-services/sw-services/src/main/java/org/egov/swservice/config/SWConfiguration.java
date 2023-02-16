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

    @Value("${egov.sewerageservice.pagination.max.limit}")
    private Integer maxLimit;

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

    // Email
    @Value("${kafka.topics.notification.email}")
    private String emailNotifTopic;

    @Value("${notification.email.enabled}")
    private Boolean isEmailNotificationEnabled;

    //User Configuration
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.internal.microservice.user.uuid}")
    private String egovInternalMicroserviceUserUuid;
	
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

    @Value("${sw.mypayments.link}")
    private String myPaymentsLink;

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

    @Value("${egov.shortener.url}")
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

    @Value("${egov.user.create.path}")
    private String userCreateEndPoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndPoint;

    @Value("${modify.sw.workflow.name}")
    private String modifySWBusinessServiceName;

    @Value("${egov.msg.download.receipt.link}")
    private String receiptDownloadLink;

    @Value("${egov.collection.host}")
    private String collectionHost;

    @Value("${egov.collectiom.payment.search}")
    private String paymentSearch;

    @Value("${egov.usr.events.download.receipt.link}")
    private String userEventReceiptDownloadLink;

    @Value("${egov.usr.events.pay.link}")
    private String userEventApplicationPayLink;

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;

    //mdms
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Value("${egov.disconnect.businessservice}")
    private String disconnectBusinessServiceName;

    @Value("${egov.idgen.sdcid.name}")
    private String sewerageDisconnectionIdGenName;

    @Value("${egov.idgen.sdcid.format}")
    private String sewerageDisconnectionIdGenFormat;

    @Value("${egov.receipt.disconnection.businessservice.topic}")
    private String receiptDisconnectionBusinessservice;

    @Value("${egov.sewerage.connection.document.access.audit.kafka.topic}")
    private String documentAuditTopic;

    @Value("${egov.billing.service.host}")
    private String billingServiceHost;

    @Value("${egov.fetch.bill.endpoint}")
    private String fetchBillEndPoint;

}
