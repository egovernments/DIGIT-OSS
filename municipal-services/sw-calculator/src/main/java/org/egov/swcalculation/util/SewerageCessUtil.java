package org.egov.swcalculation.util;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Component
public class SewerageCessUtil {


	@Autowired
	MasterDataService mDataService;

	public BigDecimal getSewerageCess(BigDecimal sewerageCharge, String assessmentYear, List<Object> masterList) {
		BigDecimal waterCess = BigDecimal.ZERO;
		if (sewerageCharge.doubleValue() == 0.0)
			return waterCess;
		Map<String, Object> CessMap = mDataService.getApplicableMaster(assessmentYear, masterList);
		return calculateSewerageCess(sewerageCharge, CessMap);
	}

	public BigDecimal calculateSewerageCess(BigDecimal sewerageCharge, Object config) {

		BigDecimal currentApplicable = BigDecimal.ZERO;

		if (null == config)
			return currentApplicable;

		@SuppressWarnings("unchecked")
		Map<String, Object> configMap = (Map<String, Object>) config;

		BigDecimal rate = null != configMap.get(SWCalculationConstant.RATE_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(SWCalculationConstant.RATE_FIELD_NAME)).doubleValue())
				: null;
		BigDecimal flatAmt = null != configMap.get(SWCalculationConstant.FLAT_AMOUNT_FIELD_NAME)
				? BigDecimal
						.valueOf(((Number) configMap.get(SWCalculationConstant.FLAT_AMOUNT_FIELD_NAME)).doubleValue())
				: BigDecimal.ZERO;

		if (null == rate)
			currentApplicable = flatAmt.compareTo(sewerageCharge) > 0 ? sewerageCharge : flatAmt;
		else {
			currentApplicable = sewerageCharge.multiply(rate.divide(SWCalculationConstant.HUNDRED));
		}
		return currentApplicable;

	}

}
