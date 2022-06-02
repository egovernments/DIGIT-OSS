package org.egov.waterconnection.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.waterconnection.web.models.SearchCriteria;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;

public interface WaterDao {
	void saveWaterConnection(WaterConnectionRequest waterConnectionRequest);

	List<WaterConnection> getWaterConnectionList(SearchCriteria criteria,RequestInfo requestInfo);
	
	void updateWaterConnection(WaterConnectionRequest waterConnectionRequest, boolean isStateUpdatable);
}
