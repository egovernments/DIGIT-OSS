package org.egov.waterconnection.service;

import org.egov.waterconnection.web.models.ValidatorResult;
import org.egov.waterconnection.web.models.WaterConnectionRequest;

public interface WaterActionValidator {

	ValidatorResult validate(WaterConnectionRequest waterConnectionRequest, int reqType);

}
