package org.egov.hrms.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.hrms.model.*;
import org.egov.hrms.model.enums.EmployeeDocumentReferenceType;
import org.egov.hrms.web.contract.User;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class EmployeeCountRowMapper implements ResultSetExtractor<Map<String,String>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	/**
	 * Maps ResultSet to Employee POJO.
	 */
	public Map<String,String> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String,String> response = new HashMap<>();
		int totalEmployee = 0;
		int activeEmployee = 0;
		int inactiveEmployee = 0;
		while(rs.next()) {
			if(rs.getBoolean("active"))
				activeEmployee = activeEmployee + rs.getInt("count");
			else
				inactiveEmployee = inactiveEmployee + rs.getInt("count");
			totalEmployee = totalEmployee + rs.getInt("count");
		}
		if(totalEmployee==0){
			response.put("activeEmployee","0");
			response.put("inactiveEmployee", "0");
		}
		response.put("activeEmployee", String.valueOf(activeEmployee));
		response.put("inactiveEmployee", String.valueOf(inactiveEmployee));
		response.put("totalEmployee", String.valueOf(totalEmployee));
		return response;
	}


}
