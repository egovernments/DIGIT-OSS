package org.egov.land.calcutaor;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class FeesTypeCalculationDto {

	private float scrutinyFeeChargesCal;
	private float licenseFeeChargesCal;
	private float conversionChargesCal;
	private float externalDevelopmentChargesCal;
	private float stateInfrastructureDevelopmentChargesCal;
	private List<Float> farValue;

}
