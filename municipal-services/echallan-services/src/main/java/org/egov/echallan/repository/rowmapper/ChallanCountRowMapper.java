package org.egov.echallan.repository.rowmapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class ChallanCountRowMapper implements ResultSetExtractor<Map<String,String>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	/**
	 * Maps ResultSet to Employee POJO.
	 */
	public Map<String,String> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String,String> response = new HashMap<>();
		int totalChallan = 0;
		int activeChallan = 0;
		int paidChallan = 0;
		int cancelledChallan = 0;

		while(rs.next()) {
			if(rs.getString("applicationstatus").equalsIgnoreCase("CANCELLED"))
				cancelledChallan = cancelledChallan + rs.getInt("count");
			else if(rs.getString("applicationstatus").equalsIgnoreCase("ACTIVE"))
				activeChallan = activeChallan + rs.getInt("count");
			else
				paidChallan = paidChallan + rs.getInt("count");

			totalChallan = totalChallan + rs.getInt("count");
		}
		if(totalChallan==0){
			response.put("activeChallan","0");
			response.put("paidChallan", "0");
			response.put("cancelledChallan", "0");
			response.put("totalChallan", "0");
			return response;
		}
		response.put("activeChallan", String.valueOf(activeChallan));
		response.put("paidChallan", String.valueOf(paidChallan));
		response.put("cancelledChallan", String.valueOf(cancelledChallan));
		response.put("totalChallan", String.valueOf(totalChallan));

		return response;
	}


}
