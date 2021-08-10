package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SegregatedToilet {

	private List<Measurement> segregatedToilets = new ArrayList<>();

	protected List<BigDecimal> distancesToMainEntrance = new ArrayList<>();

	public List<Measurement> getSegregatedToilets() {
		return segregatedToilets;
	}

	public void setSegregatedToilets(List<Measurement> segregatedToilets) {
		this.segregatedToilets = segregatedToilets;
	}

	public List<BigDecimal> getDistancesToMainEntrance() {
		return distancesToMainEntrance;
	}

	public void setDistancesToMainEntrance(List<BigDecimal> distancesToMainEntrance) {
		this.distancesToMainEntrance = distancesToMainEntrance;
	}

}
