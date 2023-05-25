package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Passage extends Measurement {

	private List<BigDecimal> passageDimensions;

	private List<BigDecimal> passageStairDimensions;

	private List<BigDecimal> passageHeight = new ArrayList<>();

	private List<BigDecimal> passageStairHeight = new ArrayList<>();

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

	/**
	 * @return the passageHeight
	 */
	public List<BigDecimal> getPassageHeight() {
		return passageHeight;
	}

	/**
	 * @param passageHeight
	 *            the passageHeight to set
	 */
	public void setPassageHeight(List<BigDecimal> passageHeight) {
		this.passageHeight = passageHeight;
	}

	/**
	 * @return the passageStairHeight
	 */
	public List<BigDecimal> getPassageStairHeight() {
		return passageStairHeight;
	}

	/**
	 * @param passageStairHeight
	 *            the passageStairHeight to set
	 */
	public void setPassageStairHeight(List<BigDecimal> passageStairHeight) {
		this.passageStairHeight = passageStairHeight;
	}

}
