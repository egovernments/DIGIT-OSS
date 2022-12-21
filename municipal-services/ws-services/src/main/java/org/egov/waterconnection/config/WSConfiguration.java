package org.egov.waterconnection.config;

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
public class WSConfiguration {

    @Value("${egov.waterservice.pagination.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.waterservice.pagination.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.waterservice.pagination.max.limit}")
    private Integer maxLimit;

    // IDGEN
    @Value("${egov.idgen.wcid.name}")
    private String waterConnectionIdGenName;

    @Value("${egov.idgen.wcid.format}")
    private String waterConnectionIdGenFormat;

    @Value("${egov.idgen.wcapid.name}")
    private String waterApplicationIdGenName;

    @Value("${egov.idgen.wcapid.format}")
    private String waterApplicationIdGenFormat;

    // Idgen Config
    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;

    // Workflow
    @Value("${create.ws.workflow.name}")
    private String businessServiceValue;

    @Value("${workflow.context.path}")
    private String wfHost;

    @Value("${workflow.transition.path}")
    private String wfTransitionPath;

    @Value("${workflow.businessservice.search.path}")
    private String wfBusinessServiceSearchPath;

    @Value("${workflow.process.search.path}")
    private String wfProcessSearchPath;

    @Value("${is.external.workflow.enabled}")
    private Boolean isExternalWorkFlowEnabled;

    @Value("${egov.waterservice.updatewaterconnection.workflow.topic}")
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

    // Email
    @Value("${kafka.topics.notification.email}")
    private String emailNotifTopic;

    @Value("${notification.email.enabled}")
    private Boolean isEmailNotificationEnabled;

    // Water Topic
    @Value("${egov.waterservice.createwaterconnection.topic}")
    private String onWaterSaved;

    @Value("${egov.waterservice.updatewaterconnection.topic}")
    private String onWaterUpdated;

    @Value("${egov.user.event.notification.enabled}")
    private Boolean isUserEventsNotificationEnabled;

    //User Configuration
    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.internal.microservice.user.uuid}")
    private String egovInternalMicroserviceUserUuid;

    // water connection Calculator
    @Value("${egov.ws.calculation.host}")
    private String calculatorHost;

    @Value("${egov.ws.calculation.endpoint}")
    private String calculateEndpoint;

    @Value("${egov.receipt.businessservice.topic}")
    private String receiptBusinessservice;

    @Value("${ws.meterreading.create.topic}")
    private String createMeterReading;

    @Value("${ws.meterreading.create.endpoint}")
    private String createMeterReadingEndpoint;

    @Value("${ws.mseva.app.link}")
    private String mSevaAppLink;

    @Value("${ws.view.history.link}")
    private String viewHistoryLink;

    @Value("${ws.mypayments.link}")
    private String myPaymentsLink;

    @Value("${ws.connectiondetails.link}")
    private String connectionDetailsLink;

    @Value("${ws.application.pay.link}")
    private String applicationPayLink;

    @Value("${egov.msg.download.receipt.link}")
    private String receiptDownloadLink;

    @Value("${egov.usr.events.download.receipt.link}")
    private String userEventReceiptDownloadLink;

    @Value("${egov.usr.events.pay.link}")
    private String userEventApplicationPayLink;

    @Value("${egov.ws.estimate.endpoint}")
    private String estimationEndpoint;

    @Value("${egov.collectiom.payment.search}")
    private String paymentSearch;

    @Value("${ws.pdfservice.link}")
    private String pdfServiceLink;

    @Value("${ws.fileStore.link}")
    private String fileStoreLink;

    @Value("${egov.shortener.url}")
    private String shortenerURL;

    @Value("${egov.pdfservice.host}")
    private String pdfServiceHost;

    @Value("${egov.filestore.host}")
    private String fileStoreHost;

    @Value("${ws.editnotification.topic}")
    private String editNotificationTopic;

    @Value("${ws.consume.filestoreids.topic}")
    private String fileStoreIdsTopic;

    @Value("${egov.waterservice.savefilestoreIds.topic}")
    private String saveFileStoreIdsTopic;

    @Value("${egov.user.create.path}")
    private String userCreateEndPoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndPoint;

    @Value("${modify.ws.workflow.name}")
    private String modifyWSBusinessServiceName;

    @Value("${egov.collection.host}")
    private String collectionHost;

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;

    //mdms
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Value("${egov.disconnect.businessservice}")
    private String disconnectBusinessServiceName;

    @Value("${egov.idgen.wdcid.name}")
    private String waterDisconnectionIdGenName;

    @Value("${egov.idgen.wdcid.format}")
    private String waterDisconnectionIdGenFormat;

    @Value("${egov.receipt.disconnection.businessservice.topic}")
    private String receiptDisconnectionBusinessservice;

    @Value("${egov.water.connection.document.access.audit.kafka.topic}")
    private String documentAuditTopic;

    @Value("${egov.billing.service.host}")
    private String billingServiceHost;

    @Value("${egov.fetch.bill.endpoint}")
    private String fetchBillEndPoint;

}
