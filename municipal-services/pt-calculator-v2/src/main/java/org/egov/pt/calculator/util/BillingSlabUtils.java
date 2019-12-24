package org.egov.pt.calculator.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.calculator.web.models.BillingSlabReq;
import org.egov.pt.calculator.web.models.BillingSlabRes;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class BillingSlabUtils {
	
	@Autowired
	private ResponseInfoFactory factory;
	
	@Autowired
	private Configurations configurations;

	/**
	 * Returns BillingSlabRes fetched based on the given BillingSlabReq
	 * 
	 * @param billingSlabReq
	 * @return BillingSlabRes
	 */
	public BillingSlabRes getBillingSlabResponse(BillingSlabReq billingSlabReq) {

			return BillingSlabRes.builder()
					.responseInfo(factory.createResponseInfoFromRequestInfo(billingSlabReq.getRequestInfo(), true))
					.billingSlab(billingSlabReq.getBillingSlab())
					.build();
	}
	
	/**
	 * Common method to return the auditDetails for a given transaction
	 * 
	 * @param requestInfo
	 * @return
	 */
	public AuditDetails getAuditDetails(RequestInfo requestInfo) {
		
		return AuditDetails.builder().createdBy(requestInfo.getUserInfo().getId().toString()).createdTime(new Date().getTime())
				.lastModifiedBy(requestInfo.getUserInfo().getId().toString()).lastModifiedTime(new Date().getTime()).build();
		
	}
	
	/**
	 * 
	 * @param uri
	 * @param tenantId
	 * @param requestInfo
	 * @return
	 */
	
	public MdmsCriteriaReq prepareRequest(StringBuilder uri, String tenantId, RequestInfo requestInfo){
		uri.append(configurations.getMdmsHost()).append(configurations.getMdmsEndpoint());
		String[] mastersForValidation = {BillingSlabConstants.MDMS_CONSTRUCTIONTYPE_MASTER_NAME, 
										 BillingSlabConstants.MDMS_ROADTYPE_MASTER_NAME, 
										 BillingSlabConstants.MDMS_PROPERTYTYPE_MASTER_NAME};
		List<MasterDetail> masterDetails = new ArrayList<>();
		for(String master: Arrays.asList(mastersForValidation)) {
			MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder().name(master).build();
			masterDetails.add(masterDetail);
		}
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(BillingSlabConstants.MDMS_PT_MOD_NAME).masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return  MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}
	
}
