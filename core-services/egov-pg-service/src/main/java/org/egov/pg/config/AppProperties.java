package org.egov.pg.config;

import lombok.Getter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Getter
@ToString
@Configuration
@PropertySource("classpath:application.properties")
public class AppProperties {

    private final Integer earlyReconcileJobRunInterval;

    private final String saveTxnTopic;

    private final String updateTxnTopic;

    private final String saveTxnDumpTopic;

    private final String updateTxnDumpTopic;
    
    private final String idGenHost;

    private final String idGenPath;

    private final String idGenName;

    private final String idGenFormat;

    private final String collectionServiceHost;

    private final String collectionServiceCreatePath;

    private final String collectionServiceValidatePath;
    
    private final String paymentCreatePath;

    private final String paymentValidatePath;

    private final String bankAccountHost;

    private final String bankAccountPath;

    private final String userServiceHost;

    private final String userServiceCreatePath;

    private final String userServiceSearchPath;

    private final Boolean isUserCreationEnable;

    private final Boolean isSMSEnable;

    private final Boolean isLocalizationStateLevel;

    private final String localizationHost;

    private final String localizationContextPath;

    private final String localizationSearchEndpoint;

    private final String smsNotifTopic;

    private final String applicationPayLink;

    private final String urlShortnerHost;

    private final String urlShortnerEndpoint;

    private final String billingServiceHost;

    private final String billingServiceSearchEndpoint;

    private final String notificationHost;

    private final String stateLevelTenantId;

    private final String egovPgReconciliationSystemUserUuid;

    private final String internalMicroserviceRoleName;

    private final String internalMicroserviceRoleCode;

    private final String internalMicroserviceUserName;

    private final String internalMicroserviceUserUsername;

    private final String internalMicroserviceUserMobilenumber;

    private final String internalMicroserviceUserType;

    @Autowired
    public AppProperties(Environment environment){
        this.earlyReconcileJobRunInterval = Integer.valueOf(environment.getRequiredProperty("pg.earlyReconcileJobRunInterval.mins"));
        this.saveTxnTopic = environment.getRequiredProperty("persister.save.pg.txns");
        this.updateTxnTopic = environment.getRequiredProperty("persister.update.pg.txns");
        this.saveTxnDumpTopic = environment.getRequiredProperty("persister.save.pg.txnsDump");
        this.updateTxnDumpTopic = environment.getRequiredProperty("persister.update.pg.txnsDump");
        this.idGenHost = environment.getRequiredProperty("egov.idgen.host");
        this.idGenPath = environment.getRequiredProperty("egov.idgen.path");
        this.idGenName = environment.getRequiredProperty("egov.idgen.ack.name");
        this.idGenFormat = environment.getRequiredProperty("egov.idgen.ack.format");
        this.collectionServiceHost = environment.getRequiredProperty("egov.collectionservice.host");
        this.collectionServiceCreatePath = environment.getRequiredProperty("egov.collectionservice.create.path");
        this.collectionServiceValidatePath = environment.getRequiredProperty("egov.collectionservice.validate.path");
        this.bankAccountHost = environment.getRequiredProperty("egov.bankaccountservice.host");
        this.bankAccountPath = environment.getRequiredProperty("egov.bankaccountservice.path");
        this.paymentCreatePath = environment.getRequiredProperty("egov.collectionservice.payment.create.path");
        this.paymentValidatePath = environment.getRequiredProperty("egov.collectionservice.payment.validate.path");
        this.userServiceHost = environment.getRequiredProperty("egov.userservice.host");
        this.userServiceCreatePath = environment.getRequiredProperty("egov.userservice.create.path");
        this.userServiceSearchPath = environment.getRequiredProperty("egov.userservice.search.path");
        this.isUserCreationEnable = Boolean.valueOf(environment.getRequiredProperty("pg.is.user.create.enabled"));
        this.isSMSEnable = Boolean.valueOf(environment.getRequiredProperty("notification.sms.enabled"));
        this.isLocalizationStateLevel = Boolean.valueOf(environment.getRequiredProperty("egov.localization.statelevel"));
        this.localizationHost = environment.getRequiredProperty("egov.localization.host");
        this.localizationContextPath = environment.getRequiredProperty("egov.localization.context.path");
        this.localizationSearchEndpoint = environment.getRequiredProperty("egov.localization.search.endpoint");
        this.smsNotifTopic = environment.getRequiredProperty("kafka.topics.notification.sms");
        this.applicationPayLink = environment.getRequiredProperty("egov.application.pay.link");
        this.urlShortnerHost = environment.getRequiredProperty("egov.url.shortner.host");
        this.urlShortnerEndpoint =environment.getRequiredProperty("egov.url.shortner.endpoint");
        this.billingServiceHost = environment.getRequiredProperty("egov.billing.service.host");
        this.billingServiceSearchEndpoint = environment.getRequiredProperty("egov.bill.searchendpoint");
        this.notificationHost = environment.getRequiredProperty("notification.url");
        this.stateLevelTenantId = environment.getRequiredProperty("state.level.tenant.id");
        this.egovPgReconciliationSystemUserUuid = environment.getRequiredProperty("egov.pg.reconciliation.system.user.uuid");
        this.internalMicroserviceRoleName = environment.getRequiredProperty("internal.microservice.role.name");
        this.internalMicroserviceRoleCode = environment.getRequiredProperty("internal.microservice.role.code");
        this.internalMicroserviceUserName = environment.getRequiredProperty("internal.microservice.user.name");
        this.internalMicroserviceUserUsername = environment.getRequiredProperty("internal.microservice.user.username");
        this.internalMicroserviceUserMobilenumber = environment.getRequiredProperty("internal.microservice.user.mobilenumber");
        this.internalMicroserviceUserType = environment.getRequiredProperty("internal.microservice.user.type");
    }

}
