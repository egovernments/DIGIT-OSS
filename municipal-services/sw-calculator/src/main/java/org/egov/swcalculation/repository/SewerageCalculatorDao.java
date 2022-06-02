package org.egov.swcalculation.repository;

import org.egov.common.contract.request.RequestInfo;

import java.util.List;

public interface SewerageCalculatorDao {

	List<String> getTenantId(RequestInfo requestInfo);
	
	List<String> getConnectionsNoList(String tenantId, String connectionType);
	
}
