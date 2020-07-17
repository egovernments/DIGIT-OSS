package org.egov.edcr.feature;

import java.util.Date;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.springframework.stereotype.Service;

@Service
public class CompoundWallService extends FeatureProcess {

    @Override
    public Map<String, Date> getAmendments() {
        return null;
    }

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        return pl;
    }

}
