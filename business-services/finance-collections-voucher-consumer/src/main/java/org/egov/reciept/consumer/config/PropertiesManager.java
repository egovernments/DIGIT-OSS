/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.empernments.org
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
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@empernments.org.
 */

package org.egov.reciept.consumer.config;

import java.util.regex.Pattern;

import org.egov.common.contract.request.User;
import org.egov.receipt.consumer.model.ProcessStatus;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PropertiesManager {

    @Value("${egov.services.egov.user.host}")
    private String userHostUrl;

    @Value("${egov.services.common.masters.businessdetails.url}")
    private String businessDetailsServiceUrl;

    @Value("${egov.services.egf.voucher.create}")
    private String voucherCreateUrl;
    
    @Value("${egov.services.egf.voucher.cancel}")
    private String voucherCancelUrl;

    @Value("${si.microservice.user}")
    private String siUser;

    @Value("${si.microservice.password}")
    private String siPassword;

    @Value("${si.microservice.usertype}")
    private String siUserType;

    @Value("${si.microservice.scope}")
    private String siScope;

    @Value("${si.microservice.granttype}")
    private String siGrantType;

    @Value("${egov.services.user.token.url}")
    private String tokenGenUrl;

    @Value("${egov.services.egf.master.financialstatuses.search}")
    private String financialStatusesSearch;

    @Value("${egov.services.egf.instrument.instruments.create}")
    private String instrumentCreate;

    @Value("${egov.services.collection.services.receipts.update}")
    private String receiptsUpdate;
    
    @Value("${egov.services.instrument.search.accountcodes.uri}")
    private String instrumentAccountCodeUrl;
    
    @Value("${egov.services.egf.voucher.search.by.service.reference}")
    private String voucherSearchByRefUrl;
    
    @Value("${egov.services.egf.voucher.search}")
    private String voucherSearchUrl;
    
    @Value("${egov.services.egf.voucher.manualreceiptdate.config.url}")
    private String manualReceiptDateConfigUrl;
    
    @Value("${egov.services.master.mdms.search.url}")
    private String mdmsSearchUrl;
    
    @Value("${egov.services.egf.instrument.instruments.cancel}")
    private String instrumentCancel;
    
    @Value("${fin.coe.erp.domain.name}")
    private String finCoeErpDomainName;
    
    @Value("${fin.coe.erp.environment.name}")
    private String finCoeErpEnvName;
    
    @Value("${fin.coe.erp.http.protocol}")
    private String httpProtocol;
    
    @Value("${egov.services.egf.voucher.moduleid.search}")
    private String moduleIdSearchUrl;
    
    @Value("${egov.services.collection.receipts.view.source.url}")
    private String receiptViewSourceUrl;
    
    @Value("${egov.services.mdms.hostname}")
    private String mdmsHostUrl;
    
    @Value("${egov.services.egfinstrument.hostname}")
    private String instrumentHostUrl;
    
    @Value("${egov.services.collections.hostname}")
    private String collectionsHostUrl;
    
    @Value("${egov.services.businessservice.hostname}")
    private String businessServiceHostUrl;
    
    @Value("${egov.services.egfmaster.hostname}")
    private String egfMasterHostUrl;
    
    @Value("${token.authorizaton.key}")
    private String tokenAuhorizationtKey;
    
    @Value("${egov.collection.receipt.voucher.save.topic}")
    private String voucherCreateTopic;
    
    @Value("${egov.collection.receipt.voucher.cancel.topic}")
    private String voucherCancelTopic;
    
    @Value("${kafka.topics.payment.create.name}")
    private String createPaymentTopicName;
    
    @Value("${kafka.topics.payment.cancel.name}")
    private String cancelPaymentTopicName;
    
    private String siAuthToken;
    private User siUserInfo;
    
    @Value("${egov.services.egf.instrument.instruments.search}")
    private String instrumentSearch;
    
    public String getErpURLBytenantId(String tenantId) throws VoucherCustomException {
    	try {
    		tenantId = tenantId.split(Pattern.quote("."))[1];
    		if(finCoeErpEnvName != null && finCoeErpEnvName.equalsIgnoreCase("local")){
    			return "http://jalandhar.lgpunjab.com:8080/";
    		}
    		if(finCoeErpEnvName != null && !finCoeErpEnvName.isEmpty()){
    			return httpProtocol+"://"+tenantId+"-"+finCoeErpEnvName+"."+finCoeErpDomainName+"/";
    		}else{
    			//considered as the production url
    			return httpProtocol+"://"+tenantId+"."+finCoeErpDomainName+"/";
    		}
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED,"ERROR occured while generating ERP url to interact with the finance coexistence. Please check the configuration in properties file.");
		}
    }

}