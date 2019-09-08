package org.egov.pt.calculator.validator;

import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_AREA_NULL;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_AREA_NULL_MSG;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_NON_VACANT_LAND_UNITS;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_NON_VACANT_LAND_UNITS_MSG;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_VACANT_LAND_NULL;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ESTIMATE_VACANT_LAND_NULL_MSG;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TYPE_VACANT_LAND;

import java.util.HashMap;
import java.util.Map;

import org.egov.pt.calculator.web.models.GetBillCriteria;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class CalculationValidator {

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
	 * Validates the GetBillCriteria
	 * @param getBillCriteria The Bill generation criteria
	 */
	public void validateGetBillCriteria(GetBillCriteria getBillCriteria){
		if(CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes())){
			if(getBillCriteria.getPropertyId()==null || getBillCriteria.getAssessmentNumber()==null)
				throw new CustomException("INVALID GETBILLCRITERIA","PropertyId or assessmentNumber cannot be null");
		}

	}
}
