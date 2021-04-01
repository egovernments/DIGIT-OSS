package org.egov.pt.repository.rowmapper;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pt.models.oldProperty.MigrationCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class MigrationCountRowMapper implements ResultSetExtractor<MigrationCount> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	public MigrationCount extractData(ResultSet rs) throws SQLException, DataAccessException {

		MigrationCount migrationCount = new MigrationCount();

		while(rs.next()){
			migrationCount = MigrationCount.builder().id(rs.getString("id")).offset(rs.getLong("batch")).limit(rs.getLong("batchsize"))
					.createdTime(rs.getLong("createdtime")).tenantid(rs.getString("tenantid")).recordCount(rs.getLong("recordCount")).build();
		}
		return migrationCount;
	}

}
