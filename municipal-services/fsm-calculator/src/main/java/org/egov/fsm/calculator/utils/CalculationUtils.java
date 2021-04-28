package org.egov.fsm.calculator.utils;

import org.egov.fsm.calculator.config.CalculatorConfig;
import org.egov.fsm.calculator.repository.ServiceRequestRepository;
import org.egov.fsm.calculator.web.models.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CalculationUtils {

	


    @Autowired
    private CalculatorConfig config;

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
	public String getBillingBusinessService( String feeType) {

		String billingBusinessService;
		switch (feeType) {
		case CalculatorConstants.APPLICATION_FEE:
			
				billingBusinessService = config.getApplicationFeeBusinessService();
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
	public String getTaxHeadCode(String feeType) {

		String billingTaxHead;
		switch (feeType) {
		case CalculatorConstants.APPLICATION_FEE:
		
				billingTaxHead = config.getApplicationFeeTaxHead();
			break;
		
		default:
			billingTaxHead = feeType;
			break;
		}
		return billingTaxHead;
	}
}
