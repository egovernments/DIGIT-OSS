package org.egov.bpa.calculator.utils;

import org.egov.bpa.calculator.config.BPACalculatorConfig;
import org.egov.bpa.calculator.repository.ServiceRequestRepository;
import org.egov.bpa.calculator.web.models.AuditDetails;
import org.egov.bpa.calculator.web.models.RequestInfoWrapper;
import org.egov.bpa.calculator.web.models.bpa.BPA;
import org.egov.bpa.calculator.web.models.bpa.BPAResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CalculationUtils {

	


    @Autowired
    private BPACalculatorConfig config;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ObjectMapper mapper;


    /**
     * Creates demand Search url based on tenanatId,businessService and ConsumerCode
     * @return demand search url
     */
    public String getDemandSearchURL(){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getDemandSearchEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("businessService=");
        url.append("{2}");
        url.append("&");
        url.append("consumerCode=");
        url.append("{3}");
        return url.toString();
    }


    /**
     * Creates generate bill url using tenantId,consumerCode and businessService
     * @return Bill Generate url
     */
    public String getBillGenerateURI(){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getBillGenerateEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("consumerCode=");
        url.append("{2}");
        url.append("&");
        url.append("businessService=");
        url.append("{3}");

        return url.toString();
    }

    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }

    
    /**
     * identify the billingBusinessService matching to the calculation FeeType
     */
	public String getBillingBusinessService(String businessService, String feeType) {

		String billingBusinessService;
		switch (feeType) {
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_APL_FEETYPE:
			if (businessService.equalsIgnoreCase(BPACalculatorConstants.MDMS_BPA)) {
				billingBusinessService = config.getApplFeeBusinessService();
			} else {
				billingBusinessService = config.getOCApplBusinessservice();
			}
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_SANC_FEETYPE:
			if (businessService.equalsIgnoreCase(BPACalculatorConstants.MDMS_BPA)) {
				billingBusinessService = config.getSanclFeeBusinessService();
			} else {
				billingBusinessService = config.getOCSancBusinessservice();
			}
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_LOW_APL_FEETYPE:
			billingBusinessService = config.getLowRiskPermitFeeBusinessService();
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_LOW_SANC_FEETYPE:
			billingBusinessService = config.getLowRiskPermitFeeBusinessService();
			break;
		case BPACalculatorConstants.LOW_RISK_PERMIT_FEE_TYPE:
			billingBusinessService = config.getLowRiskPermitFeeBusinessService();
			break;
		default:
			billingBusinessService = feeType;
			break;
		}
		return billingBusinessService;
	}
	
	/**
	* identify the billingBusinessService matching to the calculation FeeType
	*/
	public String getTaxHeadCode(String businessService, String feeType) {

		String billingTaxHead;
		switch (feeType) {
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_APL_FEETYPE:
			if(businessService.equalsIgnoreCase(BPACalculatorConstants.MDMS_BPA)){
			billingTaxHead = config.getBaseApplFeeHead();
			}else{
				billingTaxHead = config.getOCApplFee();
			}
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_SANC_FEETYPE:
			if(businessService.equalsIgnoreCase(BPACalculatorConstants.MDMS_BPA)){
			billingTaxHead = config.getBaseSancFeeHead();
			}else{
			billingTaxHead = config.getOCSancFee();
			}
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_LOW_APL_FEETYPE:
			billingTaxHead = config.getBaseLowApplFeeHead();
			break;
		case BPACalculatorConstants.MDMS_CALCULATIONTYPE_LOW_SANC_FEETYPE:
			billingTaxHead = config.getBaseLowSancFeeHead();
			break;
		default:
			billingTaxHead = feeType;
			break;
		}
		return billingTaxHead;
	}
}
