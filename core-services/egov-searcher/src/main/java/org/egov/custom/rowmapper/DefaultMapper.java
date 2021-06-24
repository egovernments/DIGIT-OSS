package org.egov.custom.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@ConditionalOnProperty(value = "egov.searcher.rowmapper", havingValue = "default")
public class DefaultMapper implements CustomRowMapper {
	
	@Override
	public void getRowMapper() {
		log.info("Picking default row mapper");
	}

	@Override
	public Object extractData(ResultSet arg0) throws SQLException, DataAccessException {
		getRowMapper();
		return null;
	}

}
