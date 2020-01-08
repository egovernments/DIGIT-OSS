package org.egov.pt.calculator.service;

import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIALYEAR_MASTER_KEY;
import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIAL_YEAR_ENDING_DATE;
import static org.egov.pt.calculator.util.CalculatorConstants.FINANCIAL_YEAR_STARTING_DATE;

@Service
public class EnrichmentService {



    /**
     * Enriches the fromDate and toDate of the calculation criteria based on financial year
     *
     * @param assessmentYear The assessmentYear of the assessment
     * @param masterMap      The map containing the financialYear data from MDMS
     * @return
     */
    public void enrichDemandPeriod(CalculationCriteria calculationCriteria,String assessmentYear, Map<String, Object> masterMap) {

        Map<String, Map<String, Object>> financialYearMaster = (Map<String, Map<String, Object>>) masterMap.get(FINANCIALYEAR_MASTER_KEY);

        Map<String, Object> finYearMap = financialYearMaster.get(assessmentYear);
        Long fromDate = (Long) finYearMap.get(FINANCIAL_YEAR_STARTING_DATE);
        Long toDate = (Long) finYearMap.get(FINANCIAL_YEAR_ENDING_DATE);

        calculationCriteria.setFromDate(fromDate);
        calculationCriteria.setToDate(toDate);
    }

}
