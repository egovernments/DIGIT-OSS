package org.egov.swservice.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.web.models.EncryptionCount;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;

public interface SewerageDao {
	void saveSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest);

	List<SewerageConnection> getSewerageConnectionList(SearchCriteria criteria, RequestInfo requestInfo);
	
	Integer getSewerageConnectionsCount(SearchCriteria criteria, RequestInfo requestInfo);
	
	void updateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest, boolean isStateUpdatable);

	List<SewerageConnection> getSewerageConnectionPlainSearchList(SearchCriteria criteria,
			RequestInfo requestInfo);

	void updateOldSewerageConnections(SewerageConnectionRequest sewerageConnectionRequest);

	Integer getTotalApplications(SearchCriteria criteria);

	void updateEncryptionStatus(EncryptionCount encryptionCount);

	EncryptionCount getLastExecutionDetail(SearchCriteria criteria);
}
