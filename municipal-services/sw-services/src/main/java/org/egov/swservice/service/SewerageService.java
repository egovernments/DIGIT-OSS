package org.egov.swservice.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;

public interface SewerageService {

	List<SewerageConnection> createSewerageConnection(SewerageConnectionRequest sewarageConnectionRequest);

	List<SewerageConnection> search(SearchCriteria criteria, RequestInfo requestInfo);

	Integer countAllSewerageApplications(SearchCriteria criteria, RequestInfo requestInfo);
	
	List<SewerageConnection> updateSewerageConnection(SewerageConnectionRequest sewarageConnectionRequest);
	
	List<SewerageConnection> plainSearch(SearchCriteria criteria, RequestInfo requestInfo);

}
