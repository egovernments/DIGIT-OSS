package org.egov.edcr.feature;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.springframework.stereotype.Service;

@Service
public class RoadWidthExtract extends FeatureExtract {
	private static final Logger LOG = Logger.getLogger(RoadWidthExtract.class);

	@Override
	public PlanDetail validate(PlanDetail planDetail) {
		return planDetail;
	}

	@Override
	public PlanDetail extract(PlanDetail planDetail) {
		return planDetail;
	}

}
