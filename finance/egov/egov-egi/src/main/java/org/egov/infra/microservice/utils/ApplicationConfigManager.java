/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.microservice.utils;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Configuration
@Setter
@Getter
@NoArgsConstructor
public class ApplicationConfigManager {
    @Value("${egov.hrms.service.endpoint:}")
    private String egovHrmsSerHost;
    @Value("${egov.accesscontrol.service.endpoint:}")
    private String egovAccessControllSerHost;
    @Value("${egov.hr.masters.service.endpoint:}")
    private String egovHrMasterSerHost;
    @Value("${egov.user.service.endpoint:}")
    private String egovUserSerHost;
    @Value("${egov.common.masters.endpoint:}")
    private String egovCommonMasterSerHost;
    @Value("${egov.billing.service.endpoint:}")
    private String egovBillingSerHost;
    @Value("${egov.collection.service.endpoint:}")
    private String egovCollSerHost;
    @Value("${egov.egf.master.service.endpoint:}")
    private String egovEgfMasterSerHost;
    @Value("${egov.egf.instrument.service.endpoint:}")
    private String egovEgfInstSerHost;
    @Value("${egov.mdms.service.endpoint:}")
    private String egovMdmsSerHost;
    @Value("${egov.indexer.service.endpoint:}")
    private String egovIndexerSerHost;
    @Value("${egov.default.services.endpoint}")
    private String egovSerHost;
    @Value("${egov.filestore.service.endpoint:}")
    private String egovFileStoreSerHost;
    @Value("${egov.services.filestore.service.upload.file:}")
    private String egovFileStoreUploadFile;
    @Value("${egov.services.filestore.service.download.file:}")
    private String egovFileStoreDownloadFile;
    
    @Value("${egov.services.collection.service.payment.search:}")
    private String collSerPaymentSearch;
    
    @Value("${egov.services.collection.service.payment.create:}")
    private String collSerPaymentCreate;
    
    @Value("${egov.services.collection.service.payment.workflow:}")
    private String collSerPaymentWorkflow;
    
    @Value("${egov.services.collection.service.remittance.search:}")
    private String collSerRemittanceSearch;
    
    @Value("${egov.services.collection.service.payment.modulename.search:}")
    private String collSerPaymentModuleNameSearch;

    @Value("${egov.services.collection.service.payment.modulename.workflow:}")
    private String collSerPaymentModuleNameWorkflow;

    
    public String getEgovHrmsSerHost(){
        return StringUtils.isNotBlank(egovHrmsSerHost) ? egovHrmsSerHost : egovSerHost; 
    }
    
    public String getEgovAccessControllSerHost(){
        return StringUtils.isNotBlank(egovAccessControllSerHost) ? egovAccessControllSerHost : egovSerHost; 
    }
    public String getEgovHrMasterSerHost(){
        return StringUtils.isNotBlank(egovHrMasterSerHost) ? egovHrMasterSerHost : egovSerHost; 
    }
    public String getEgovUserSerHost(){
        return StringUtils.isNotBlank(egovUserSerHost) ? egovUserSerHost : egovSerHost; 
    }
    public String getEgovCommonMasterSerHost(){
        return StringUtils.isNotBlank(egovCommonMasterSerHost) ? egovCommonMasterSerHost : egovSerHost; 
    }
    public String getEegovBillingSerHost(){
        return StringUtils.isNotBlank(egovBillingSerHost) ? egovBillingSerHost : egovSerHost; 
    }
    public String getEgovCollSerHost(){
        return StringUtils.isNotBlank(egovCollSerHost) ? egovCollSerHost : egovSerHost; 
    }
    public String getEgovEgfMasterSerHost(){
        return StringUtils.isNotBlank(egovEgfMasterSerHost) ? egovEgfMasterSerHost : egovSerHost; 
    }
    public String getEgovEgfInstSerHost(){
        return StringUtils.isNotBlank(egovEgfInstSerHost) ? egovEgfInstSerHost : egovSerHost; 
    }
    public String getEgovMdmsSerHost(){
        return StringUtils.isNotBlank(egovMdmsSerHost) ? egovMdmsSerHost : egovSerHost; 
    }
    public String getEgovIndexerSerHost(){
        return StringUtils.isNotBlank(egovIndexerSerHost) ? egovIndexerSerHost : egovSerHost; 
    }
    public String getEgovFileStoreSerHost(){
        return StringUtils.isNotBlank(egovFileStoreSerHost) ? egovFileStoreSerHost : egovSerHost; 
    }
    public String getEgovFileStoreUploadFile(){
        return StringUtils.isNotBlank(egovFileStoreUploadFile) ? egovFileStoreUploadFile : egovSerHost; 
    }
    public String getEgovFileStoreDownloadFile(){
        return StringUtils.isNotBlank(egovFileStoreDownloadFile) ? egovFileStoreDownloadFile : egovSerHost; 
    }
    
    
    
}
