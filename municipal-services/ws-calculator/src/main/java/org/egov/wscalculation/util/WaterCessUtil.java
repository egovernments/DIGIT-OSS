package org.egov.wscalculation.util;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WaterCessUtil {

	@Autowired
	private MasterDataService mDataService;

	public BigDecimal getWaterCess(BigDecimal waterCharge, String assessmentYear, List<Object> masterList) {
		BigDecimal waterCess = BigDecimal.ZERO;
		if (waterCharge.doubleValue() == 0.0)
			return waterCess;
		Map<String, Object> CessMap = mDataService.getApplicableMaster(assessmentYear, masterList);
		return calculateWaterCess(waterCharge, CessMap);
	}

	public BigDecimal calculateWaterCess(BigDecimal waterCharge, Object config) {

		BigDecimal currentApplicable = BigDecimal.ZERO;

		if (null == config)
			return currentApplicable;

		@SuppressWarnings("unchecked")
		Map<String, Object> configMap = (Map<String, Object>) config;

		BigDecimal rate = null != configMap.get(WSCalculationConstant.RATE_FIELD_NAME)
				? BigDecimal.valueOf(((Number) configMap.get(WSCalculationConstant.RATE_FIELD_NAME)).doubleValue())
				: null;
		BigDecimal flatAmt = null != configMap.get(WSCalculationConstant.FLAT_AMOUNT_FIELD_NAME)
				? BigDecimal
						.valueOf(((Number) configMap.get(WSCalculationConstant.FLAT_AMOUNT_FIELD_NAME)).doubleValue())
				: BigDecimal.ZERO;

		if (null == rate)
			currentApplicable = flatAmt.compareTo(waterCharge) > 0 ? waterCharge : flatAmt;
		else {
			currentApplicable = waterCharge.multiply(rate.divide(WSCalculationConstant.HUNDRED));
		}
		return currentApplicable;

	}
}
