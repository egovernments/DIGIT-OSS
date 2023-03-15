package org.egov.edcr.feature;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.springframework.stereotype.Service;
@Service
public class GateService  extends FeatureProcess {
	@Override
	    public Plan validate(Plan plan) {
	        return plan;
	    }

	    @Override
	    public Plan process(Plan plan) {
	    	
	    	return plan;
	    }
	    
	    @Override
	    public Map<String, Date> getAmendments() {
	        return new LinkedHashMap<>();
	    }
}
