package org.egov.common.entity.edcr;

import java.util.ArrayList;
import java.util.List;

public class Plantation {

	private List<Measurement> plantations = new ArrayList<>();

	public List<Measurement> getPlantations() {
		return plantations;
	}

	public void setPlantations(List<Measurement> plantations) {
		this.plantations = plantations;
	}

}
