package org.egov.waterconnection.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.waterconnection.web.models.*;

public interface WaterDao {
	void saveWaterConnection(WaterConnectionRequest waterConnectionRequest);

	List<WaterConnection> getWaterConnectionList(SearchCriteria criteria,RequestInfo requestInfo);
	
	Integer getWaterConnectionsCount(SearchCriteria criteria, RequestInfo requestInfo);
	
	void updateWaterConnection(WaterConnectionRequest waterConnectionRequest, boolean isStateUpdatable);
	
	WaterConnectionResponse getWaterConnectionListForPlainSearch(SearchCriteria criteria,RequestInfo requestInfo);

	void updateOldWaterConnections(WaterConnectionRequest waterConnectionRequest);

	Integer getTotalApplications(SearchCriteria criteria);

	void updateEncryptionStatus(EncryptionCount encryptionCount);

	EncryptionCount getLastExecutionDetail(SearchCriteria criteria);
}
