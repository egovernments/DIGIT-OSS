package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SepticTank extends Measurement {

	private List<BigDecimal> distanceFromWaterSource = new ArrayList<>();

	private List<BigDecimal> distanceFromBuilding = new ArrayList<>();

	public List<BigDecimal> getDistanceFromWaterSource() {
		return distanceFromWaterSource;
	}

	public void setDistanceFromWaterSource(List<BigDecimal> distanceFromWaterSource) {
		this.distanceFromWaterSource = distanceFromWaterSource;
	}

	public List<BigDecimal> getDistanceFromBuilding() {
		return distanceFromBuilding;
	}

	public void setDistanceFromBuilding(List<BigDecimal> distanceFromBuilding) {
		this.distanceFromBuilding = distanceFromBuilding;
	}

}
