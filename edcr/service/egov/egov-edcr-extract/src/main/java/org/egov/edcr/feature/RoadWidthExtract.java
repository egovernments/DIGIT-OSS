package org.egov.edcr.feature;

import org.egov.edcr.entity.blackbox.PlanDetail;
import org.springframework.stereotype.Service;

@Service
public class RoadWidthExtract extends FeatureExtract {

	@Override
	public PlanDetail validate(PlanDetail planDetail) {
		return planDetail;
	}

	@Override
	public PlanDetail extract(PlanDetail planDetail) {
		return planDetail;
	}

}
