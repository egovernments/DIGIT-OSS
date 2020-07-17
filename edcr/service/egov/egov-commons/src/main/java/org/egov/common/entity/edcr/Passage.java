package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.List;
public class Passage extends Measurement {

	private List<BigDecimal> passageDimensions;
	
	private List<BigDecimal> passageStairDimensions;

	public List<BigDecimal> getPassageStairDimensions() {
		return passageStairDimensions;
	}

	public void setPassageStairDimensions(List<BigDecimal> passageStairDimensions) {
		this.passageStairDimensions = passageStairDimensions;
	}

	public List<BigDecimal> getPassageDimensions() {
		return passageDimensions;
	}

	public void setPassageDimensions(List<BigDecimal> passageDimensions) {
		this.passageDimensions = passageDimensions;
	}

	 

}
