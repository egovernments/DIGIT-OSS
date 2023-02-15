package org.egov.pt.repository.rowmapper;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyAudit;
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
public class PropertyAuditEncRowMapper implements ResultSetExtractor<List<PropertyAudit>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	public List<PropertyAudit> extractData(ResultSet rs) throws SQLException, DataAccessException {

		List<PropertyAudit> propertyAuditList = new ArrayList<>();
		PropertyAudit propertyAudit = new PropertyAudit();
		while (rs.next()) {
			propertyAudit = PropertyAudit.builder().audituuid(rs.getString("audituuid"))
					.propertyId(rs.getString("propertyId"))
					.property(getProperty(rs, "property"))
					.auditcreatedTime(rs.getLong("auditcreatedTime"))
					.build();
			propertyAuditList.add(propertyAudit);
		}
		return propertyAuditList;
	}
	
	/**
	 * method parses the PGobject and returns the JSON node
	 * 
	 * @param rs
	 * @param key
	 * @return
	 * @throws SQLException
	 */
	private Property getProperty(ResultSet rs, String key) throws SQLException {

		JsonNode node = null;

		try {

			PGobject obj = (PGobject) rs.getObject(key);
			if (obj != null) {
				node = mapper.readTree(obj.getValue());
			}
			return mapper.convertValue(node, Property.class);

		} catch (IOException e) {
			throw new CustomException("PARSING ERROR", "The propertyAdditionalDetail json cannot be parsed");
		}
	}
}
