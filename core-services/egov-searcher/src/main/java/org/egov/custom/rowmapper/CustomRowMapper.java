package org.egov.custom.rowmapper;

import org.springframework.jdbc.core.ResultSetExtractor;

public interface CustomRowMapper extends ResultSetExtractor<Object> {
	
	public void getRowMapper();

}
