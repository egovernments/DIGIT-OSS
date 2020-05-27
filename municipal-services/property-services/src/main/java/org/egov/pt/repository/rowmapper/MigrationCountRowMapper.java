package org.egov.pt.repository.rowmapper;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pt.models.Property;
import org.egov.pt.models.oldProperty.MigrationCount;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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
