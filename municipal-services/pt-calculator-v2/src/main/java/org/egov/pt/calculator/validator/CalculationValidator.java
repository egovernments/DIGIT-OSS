package org.egov.pt.calculator.validator;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.GetBillCriteria;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.demand.DemandDetail;
import org.egov.pt.calculator.web.models.demand.DemandRequest;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.pt.calculator.web.models.propertyV2.PropertyV2;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import static org.egov.pt.calculator.util.CalculatorConstants.*;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_DOCDATE_NULL_MSG;

@Service
public class CalculationValidator {


	@Autowired
	private CalculatorUtils utils;

	@Autowired
	private Repository repository;


	/**
	 * validates for the required information needed to do the calculation/estimation
	 * 
	 * @param detail property detail
	 */
	public void validatePropertyForCalculation (PropertyDetail detail) {
		
		Map<String, String> error = new HashMap<>();

        boolean isVacantLand = PT_TYPE_VACANT_LAND.equalsIgnoreCase(detail.getPropertyType());

        if(null == detail.getLandArea() && null == detail.getBuildUpArea())
        	error.put(PT_ESTIMATE_AREA_NULL, PT_ESTIMATE_AREA_NULL_MSG);
        
        if (isVacantLand && null == detail.getLandArea())
            error.put(PT_ESTIMATE_VACANT_LAND_NULL, PT_ESTIMATE_VACANT_LAND_NULL_MSG);

        if (!isVacantLand && CollectionUtils.isEmpty(detail.getUnits()))
            error.put(PT_ESTIMATE_NON_VACANT_LAND_UNITS, PT_ESTIMATE_NON_VACANT_LAND_UNITS_MSG);

        if (!CollectionUtils.isEmpty(error))
            throw new CustomException(error);
	}

	/**
	 * validates for the required information needed to do for mutation calculation
	 *
	 * @param additionalDetails property additionalDetails
	 */
	public void validatePropertyForMutationCalculation (Map<String,Object> additionalDetails) {

		Map<String, String> error = new HashMap<>();
		if(additionalDetails == null){
			error.put(PT_ADDITIONALNDETAILS_NULL,PT_ADDITIONALNDETAILS_NULL_MSG);
			throw new CustomException(error);
		}
		if(!additionalDetails.containsKey(MARKET_VALUE) || additionalDetails.get(MARKET_VALUE)== null){
			error.put(PT_MARKETVALUE_NULL,PT_MARKETVALUE_NULL_MSG);
		}
		else{
			boolean numeric = true;
			String marketValue = additionalDetails.get(MARKET_VALUE).toString();
			numeric = marketValue.matches(NUMERIC_REGEX);
			if(!numeric)
				error.put(PT_MARKETVALUE_NULL,PT_MARKETVALUE_NULL_MSG);
		}
		if(!additionalDetails.containsKey(DOCUMENT_DATE) || additionalDetails.get(DOCUMENT_DATE) == null)
			error.put(PT_DOCDATE_NULL,PT_DOCDATE_NULL_MSG);
		if (!CollectionUtils.isEmpty(error))
			throw new CustomException(error);
	}




	/**
	 * Validates the GetBillCriteria
	 * @param getBillCriteria The Bill generation criteria
	 */
	public void validateGetBillCriteria(GetBillCriteria getBillCriteria){
		if(CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes())){
			if(getBillCriteria.getPropertyId()==null || getBillCriteria.getAssessmentNumber()==null)
				throw new CustomException("INVALID GETBILLCRITERIA","PropertyId or assessmentNumber cannot be null");
		}

	}


	/**
	 * if any previous assessments and demands associated with it exists for the
	 * same financial year
	 *
	 * Then Returns the collected amount of previous demand if the current
	 * assessment is for the current year
	 *
	 * and cancels the previous demand by updating it's status to inactive
	 *
	 * @param criteria
	 * @return
	 */
	public void getCarryForwardAndCancelOldDemand(BigDecimal newTax, CalculationCriteria criteria, RequestInfo requestInfo
			, Demand demand) {

		Property property = criteria.getProperty();

		BigDecimal oldTaxAmt = BigDecimal.ZERO;

		Boolean isPTDepriciated = false;

		if(null == property.getPropertyId()) return ;

		//	Demand demand = getLatestDemandForCurrentFinancialYear(requestInfo, property);

		if(null == demand) return ;

		for (DemandDetail detail : demand.getDemandDetails()) {
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(CalculatorConstants.PT_TAX))
				oldTaxAmt = oldTaxAmt.add(detail.getTaxAmount());
		}

		if (oldTaxAmt.compareTo(newTax) > 0) {
			boolean isDepreciationAllowed = utils.isAssessmentDepreciationAllowed(demand,new RequestInfoWrapper(requestInfo));
			if (!isDepreciationAllowed)
				isPTDepriciated = true;
		}

		if(isPTDepriciated)
			throw new CustomException(CalculatorConstants.EG_PT_DEPRECIATING_ASSESSMENT_ERROR,
					CalculatorConstants.EG_PT_DEPRECIATING_ASSESSMENT_ERROR_MSG );

	}


    /**
     * Validates demand before update or create
     * @param demand Demand to be validated
     */
	public void validationsBeforeDemandUpdate(Demand demand){

		BigDecimal totalTaxAmount = demand.getDemandDetails().stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO,BigDecimal::add);
        BigDecimal totalCollectionAmount = demand.getDemandDetails().stream().map(DemandDetail::getCollectionAmount).reduce(BigDecimal.ZERO,BigDecimal::add);

		Map<String,String> errorMap = new HashMap<>();

		if(totalTaxAmount.remainder(BigDecimal.ONE).doubleValue()!=0)
			errorMap.put("INVALID_TAXAMOUNT","Failed to roundOff the tax amount");

        if(totalCollectionAmount.remainder(BigDecimal.ONE).doubleValue()!=0)
            errorMap.put("INVALID_COLLECTIONAMOUNT","The collection amount is not properly apportioned");

        if(totalCollectionAmount.doubleValue()<0)
            errorMap.put("INVALID_COLLECTIONAMOUNT","The collection amount cannot be negative");



	}


}
