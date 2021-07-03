package org.egov.swservice.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;

public interface SewerageDao {
	void saveSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest);

	List<SewerageConnection> getSewerageConnectionList(SearchCriteria criteria,
			RequestInfo requestInfo);

	void updateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest, boolean isStateUpdatable);

}
