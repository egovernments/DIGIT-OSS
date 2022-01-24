package org.egov.swcalculation.repository;

import org.egov.swcalculation.web.models.SewerageConnection;

import java.util.List;

public interface SewerageCalculatorDao {

	List<String> getTenantId();
	
	List<SewerageConnection> getConnectionsNoList(String tenantId, String connectionType, Integer batchOffset, Integer batchsize, Long fromDate, Long toDate);

	long getConnectionCount(String tenantid, Long fromDate, Long toDate);
	
}
