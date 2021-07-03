package org.egov.edcr.feature;

import org.egov.edcr.entity.blackbox.PlanDetail;
import org.springframework.stereotype.Service;

@Service
public class CommonFeatureExtract extends FeatureExtract {

    @Override
    public PlanDetail extract(PlanDetail pl) {
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
