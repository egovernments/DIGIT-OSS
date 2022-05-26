package org.egov.swcalculation.service;

import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.swcalculation.web.models.SewerageConnection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import static org.egov.swcalculation.constants.SWCalculationConstant.*;

@Service
public class EnrichmentService {

	@Autowired
	private ObjectMapper mapper;
	
	public List<SewerageConnection> filterConnections(List<SewerageConnection> connectionList) {
		HashMap<String, SewerageConnection> connectionHashMap = new HashMap<>();
		connectionList.forEach(connection -> {
			if (!StringUtils.isEmpty(connection.getConnectionNo())) {
				if (connectionHashMap.get(connection.getConnectionNo()) == null
						&& FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					connectionHashMap.put(connection.getConnectionNo(), connection);
				} else if (connectionHashMap.get(connection.getConnectionNo()) != null
						&& FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					if (connectionHashMap.get(connection.getConnectionNo()).getApplicationStatus()
							.equals(connection.getApplicationStatus())) {
						HashMap additionalDetail1 = new HashMap<>();
						HashMap additionalDetail2 = new HashMap<>();
						additionalDetail1 = mapper.convertValue(
								connectionHashMap.get(connection.getConnectionNo()).getAdditionalDetails(),
								HashMap.class);
						additionalDetail2 = mapper.convertValue(connection.getAdditionalDetails(), HashMap.class);
						BigDecimal creationDate1 = (BigDecimal) additionalDetail1.get(APP_CREATED_DATE);
						BigDecimal creationDate2 = (BigDecimal) additionalDetail2.get(APP_CREATED_DATE);
						if (creationDate1.compareTo(creationDate2) == -1) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					} else {
						if (connection.getApplicationStatus().equals(MODIFIED_FINAL_STATE)) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					}
				}
			}
		});
		
		return new ArrayList(connectionHashMap.values());
	}


}
