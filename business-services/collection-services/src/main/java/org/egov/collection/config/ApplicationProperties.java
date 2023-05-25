/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any  of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.collection.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@PropertySource(value = { "classpath:config/application-config.properties" }, ignoreResourceNotFound = true)
@Order(0)
public class ApplicationProperties {

    @Value("${kafka.topics.receipt.create.name}")
    private String createReceiptTopicName;

    @Value("${kafka.topics.receipt.create.key}")
    private String createReceiptTopicKey;

    @Value("${kafka.topics.receipt.cancel.name}")
    private String cancelReceiptTopicName;

    @Value("${kafka.topics.receipt.cancel.key}")
    private String cancelReceiptTopicKey;

    @Value("${kafka.topics.receipt.update.name}")
    private String updateReceiptTopicName;

    @Value("${kafka.topics.receipt.update.key}")
    private String updateReceiptTopicKey;

    @Value("${egov.services.hostname}")
    private String egovServiceHost;

    @Value("${egov.pdf.service.create}")
    private String egovPdfCreate;

    @Value("${egov.egfcommonmasters.hostname}")
    private String egfcommonmastersHost;

    @Value("${buisnessdetails.search.uri}")
    private String businessDetailsSearch;

    @Value("${egov.egfmasters.hostname}")
    private String egfmastersHost;

    @Value("${coa.search.uri}")
    private String chartOfAccountsSearch;

    @Value("${egov.idgen.hostname}")
    private String idGenServiceHost;

    @Value("${rcptno.gen.uri}")
    private String idGeneration;

    @Value("${egov.instrument.hostname}")
    private String instrumentServiceHost;

    @Value("${create.instrument.uri}")
    private String createInstrument;

    @Value("${search.instrument.uri}")
    private String searchInstrument;

    @Value("${search.instrumentbypaymentmode.uri}")
    private String searchInstrumentByPaymentMode;

    @Value("${egov.services.billing_service.hostname}")
    private String billingServiceHostName;

    @Value("${egov.services.billing_service.apportion}")
    private String billingServiceApportion;

    @Value("${search.accountcodes.uri}")
    private String searchAccountCodes;

    @Value("${egov.services.billing_service.search}")
    private String searchBill;

    @Value("${kafka.topics.update.receipt.workflowdetails}")
    private String kafkaUpdateWorkFlowDetailsTopic;

    @Value("${kafka.topics.bankaccountservicemapping.create.name}")
    private String createBankAccountServiceMappingTopicName;

    @Value("${kafka.topics.filestore}")
    private String fileStore;
    
    @Value("${receiptnumber.idname}")
    private String receiptNumberIdName;

    @Value("${receiptnumber.servicebased}")
    private boolean receiptNumberByService;

    @Value("${receiptnumber.state.level.format}")
    private String receiptNumberStateLevelFormat;

    @Value("${collection.receipts.search.paginate}")
    private boolean receiptsSearchPaginationEnabled;

    @Value("${collection.receipts.search.default.size}")
    private Integer receiptsSearchDefaultLimit;

    @Value("${collection.receipts.search.max.size}")
    private Integer receiptsSearchMaxLimit;
    
    @Value("${egov.apportion.service.host}")
    private String apportionHost;
    
    @Value("${egov.apportion.apportion.endpoint}")
    private String apportionURI;
    
    @Value("${collection.is.user.create.enabled}")
    private Boolean isUserCreateEnabled;
    
    @Value("${user.service.host}")
    private String userHost;
    
    @Value("${egov.services.user_by_id}")
    private String userSearchEnpoint;
    
    @Value("${egov.user.create.user}")
    private String userCreateEnpoint;
    
    @Value("${kafka.topics.payment.receiptlink.name}")
    private String paymentReceiptLinkTopic;
    
    @Value("${kafka.topics.payment.receiptlink.key}")
    private String paymentReceiptLinkTopicKey;

    @Value("${coll.notification.ui.host}")
    private String uiHost;

    @Value("${coll.notification.ui.redirect.url}")
    private String uiRedirectUrl;

    @Value("${coll.notification.fallback.locale}")
    private String fallBackLocale;


    // Payment properties

    @Value("${kafka.topics.payment.create.name}")
    private String createPaymentTopicName;
    
    @Value("${kafka.topics.payment.create.key}")
    private String createPaymentTopicKey;
    
    @Value("${collection.payments.search.paginate}")
    private boolean paymentsSearchPaginationEnabled;

    @Value("${kafka.topics.payment.cancel.name}")
    private String cancelPaymentTopicName;
    
    @Value("#{'${search.ignore.status}'.split(',')}")
    private List<String> searchIgnoreStatus;
    
    @Value("${is.payment.search.uri.modulename.mandatory}")
    private Boolean isModuleNameMandatoryInSearchUriForEmployee;
    

    @Value("${kafka.topics.payment.cancel.key}")
    private String cancelPaymentTopicKey;

    @Value("${kafka.topics.payment.update.name}")
    private String updatePaymentTopicName;

    @Value("${kafka.topics.payment.update.key}")
    private String updatePaymentTopicKey;

    @Value("${kafka.topics.notification.sms}")
    private String smsTopic;

    @Value("${kafka.topics.notification.sms.key}")
    private String smsTopickey;



    //MDMS

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsSearchEndpoint;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Value("${kafka.topics.collection.migrate.name}")
    private String collectionMigrationTopicName;

    @Value("${kafka.topics.collection.migrate.key}")
    private String collectionMigrationTopicKey;

    //Localization

    @Value("${egov.localization.host}")
    private String localizationHost;

    @Value("${egov.localization.search.endpoint}")
    private String localizationEndpoint;

    @Value("${collection.search.max.limit}")
    private Integer defaultLimit;

    @Value("${collection.search.default.limit}")
    private Integer maxSearchLimit;

    @Value("${egov.url.shortner.host}")
    private String urlShortnerHost;

    @Value("${egov.url.shortner.endpoint}")
    private String urlShortnerEndpoint;
    
    @Value("${egov.razorpay.url}")
    private String razorPayUrl;


}
