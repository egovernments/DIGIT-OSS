package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class GuardRoom {

	private List<Measurement> guardRooms = new ArrayList<>();

	protected List<BigDecimal> cabinHeights = new ArrayList<>();

	public List<Measurement> getGuardRooms() {
		return guardRooms;
	}

	public void setGuardRooms(List<Measurement> guardRooms) {
		this.guardRooms = guardRooms;
	}

	public List<BigDecimal> getCabinHeights() {
		return cabinHeights;
	}

	public void setCabinHeights(List<BigDecimal> cabinHeights) {
		this.cabinHeights = cabinHeights;
	}

}
