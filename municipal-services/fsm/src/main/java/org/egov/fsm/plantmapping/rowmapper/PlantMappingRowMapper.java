package org.egov.fsm.plantmapping.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;


@Component
public class PlantMappingRowMapper implements ResultSetExtractor<List<PlantMapping>>{

	@Autowired
	private ObjectMapper mapper;
	
	private int full_count=0;

	public int getFull_count() {
		return full_count;
	}

	public void setFull_count(int full_count) {
		this.full_count = full_count;
	}

	@Override
	public List<PlantMapping> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, PlantMapping> plant = new LinkedHashMap<String, PlantMapping>();
		this.setFull_count(0);
		while (rs.next()) {
			PlantMapping plantMap = new PlantMapping();
			// TODO fill the FSM object with data in the result set record
			String id = rs.getString("id");
			plantMap = plant.get(id);
			String tenantId = rs.getString("tenantid");
			String plantCode = rs.getString("plantcode");
			
			AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("createdBy"))
					.createdTime(rs.getLong("createdTime")).lastModifiedBy(rs.getString("lastModifiedBy"))
					.lastModifiedTime(rs.getLong("lastModifiedTime")).build();
			
			
			if (plantMap == null) {
				Long lastModifiedTime = rs.getLong("lastmodifiedtime");

				if (rs.wasNull()) {
					lastModifiedTime = null;
				}
				plantMap = PlantMapping.builder().id(id).tenantId(tenantId).plantCode(plantCode).auditDetails(auditdetails).build();

				plant.put(id, plantMap);
			}
			
			
		}
		return new ArrayList<>(plant.values());
	}
}
