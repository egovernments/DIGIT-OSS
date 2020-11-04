package org.egov.collection.model;


import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MigrationCountRowMapper implements ResultSetExtractor<MigrationCount> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	public MigrationCount extractData(ResultSet rs) throws SQLException, DataAccessException {

		MigrationCount migrationCount = new MigrationCount();

		while(rs.next()){
			migrationCount = MigrationCount.builder()
					.id(rs.getString("id"))
					.offset(rs.getInt("batch"))
					.limit(rs.getInt("batchsize"))
					.tenantid(rs.getString("tenantid"))
					.recordCount(rs.getInt("recordCount"))
					.createdTime(rs.getLong("createdtime"))
					.build();
		}
		return migrationCount;
	}

}
