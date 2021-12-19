package org.egov.edcr.feature;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.springframework.stereotype.Service;

@Service
public class ConstructedArea extends FeatureProcess {

    @Override
    public Plan validate(Plan pl) {
        return pl;
    }

    @Override
    public Plan process(Plan pl) {
        return pl;
    }

    @Override
    public Map<String, Date> getAmendments() {
    	return Collections.emptyMap();
    }
}
