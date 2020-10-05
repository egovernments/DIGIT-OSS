package org.egov.swservice.service;

import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.ValidatorResult;

public interface SewerageActionValidator {

	ValidatorResult validate(SewerageConnectionRequest sewerageConnectionRequest, int reqType);
}
