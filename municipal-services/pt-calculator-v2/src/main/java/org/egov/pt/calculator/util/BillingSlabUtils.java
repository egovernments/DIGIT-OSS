package org.egov.pt.calculator.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.kafka.common.network.SaslChannelBuilder;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.calculator.web.models.BillingSlab;
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
		String[] mastersForValidation = {BillingSlabConstants.MDMS_PROPERTYSUBTYPE_MASTER_NAME, BillingSlabConstants.MDMS_SUBOWNERSHIP_MASTER_NAME,
				BillingSlabConstants.MDMS_USAGEMINOR_MASTER_NAME, BillingSlabConstants.MDMS_USAGESUBMINOR_MASTER_NAME, BillingSlabConstants.MDMS_PROPERTYTYPE_MASTER_NAME,
				BillingSlabConstants.MDMS_USAGEMAJOR_MASTER_NAME, BillingSlabConstants.MDMS_OWNERSHIP_MASTER_NAME, BillingSlabConstants.MDMS_OCCUPANCYTYPE_MASTER_NAME,
				BillingSlabConstants.MDMS_USAGEDETAIL_MASTER_NAME};
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
	
/*	public Boolean checkIfRangeSatisfies(BillingSlab slabOne, BillingSlab slabTwo) {
		Boolean areBillingSlabsEqual = false;
		log.info("dbSlab: "+slabOne);
		log.info("incomingSlab: "+slabTwo);
		if((slabOne.getFromFloor().equals(slabTwo.getFromFloor())) && (slabOne.getToFloor().equals(slabTwo.getToFloor()))
				&& (slabOne.getFromPlotSize().equals(slabTwo.getFromPlotSize())) && (slabOne.getToPlotSize().equals(slabTwo.getToPlotSize()))) {
			log.info("All propeties are equal");
			return areBillingSlabsEqual;
		}
		
		if((slabTwo.getFromFloor() <= slabOne.getToFloor()) || (slabTwo.getFromPlotSize() <= slabOne.getToPlotSize())) {
			log.info("Range problem");
			return areBillingSlabsEqual;
		}

		areBillingSlabsEqual = true;
		return areBillingSlabsEqual;
		
	}*/
	
/*	public Boolean checkIfBillingSlabsAreEqual(BillingSlab slabOne, BillingSlab slabTwo) {
		Boolean areBillingSlabsEqual = false;
		
		if(!slabOne.getTenantId().equals(slabTwo.getTenantId()))
			return areBillingSlabsEqual;
		if(!slabOne.getAreaType().equalsIgnoreCase("All") && !slabOne.getAreaType().equals(slabTwo.getAreaType()))
			return areBillingSlabsEqual;
		if(slabOne.getArvPercent() != slabTwo.getArvPercent())
			return areBillingSlabsEqual;
		if(!slabOne.getOccupancyType().equalsIgnoreCase("All") && !slabOne.getOccupancyType().equals(slabTwo.getOccupancyType()))
			return areBillingSlabsEqual;
		if(!slabOne.getOwnerShipCategory().equalsIgnoreCase("All") && !slabOne.getOwnerShipCategory().equals(slabTwo.getOwnerShipCategory()))
			return areBillingSlabsEqual;
		if(!slabOne.getPropertySubType().equalsIgnoreCase("All") && !slabOne.getPropertySubType().equals(slabTwo.getPropertySubType()))
			return areBillingSlabsEqual;
		if(!slabOne.getPropertyType().equalsIgnoreCase("All") && !slabOne.getPropertyType().equals(slabTwo.getPropertyType()))
			return areBillingSlabsEqual;
		if(!slabOne.getSubOwnerShipCategory().equalsIgnoreCase("All") && !slabOne.getSubOwnerShipCategory().equals(slabTwo.getSubOwnerShipCategory()))
			return areBillingSlabsEqual;
		if(!slabOne.getUsageCategoryDetail().equalsIgnoreCase("All") && !slabOne.getUsageCategoryDetail().equals(slabTwo.getUsageCategoryDetail()))
			return areBillingSlabsEqual;
		if(!slabOne.getUsageCategoryMajor().equalsIgnoreCase("All") && !slabOne.getUsageCategoryMajor().equals(slabTwo.getUsageCategoryMajor()))
			return areBillingSlabsEqual;
		if(!slabOne.getUsageCategoryMinor().equalsIgnoreCase("All") && !slabOne.getUsageCategoryMinor().equals(slabTwo.getUsageCategoryMinor()))
			return areBillingSlabsEqual;
		if(!slabOne.getUsageCategorySubMinor().equalsIgnoreCase("All") && !slabOne.getUsageCategorySubMinor().equals(slabTwo.getUsageCategorySubMinor()))
			return areBillingSlabsEqual;
		if(slabOne.getUnBuiltUnitRate() != slabTwo.getUnBuiltUnitRate())
			return areBillingSlabsEqual;
		if(slabOne.getUnitRate() != slabTwo.getUnitRate())
			return areBillingSlabsEqual;
		if(slabOne.getIsPropertyMultiFloored() != slabTwo.getIsPropertyMultiFloored())
			return areBillingSlabsEqual;
		
		areBillingSlabsEqual = true;
		return areBillingSlabsEqual;
		
		
	}*/
}
