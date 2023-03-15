package org.egov.fsm.plantmapping.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.web.model.AuditDetails;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class PlantMappingRowMapper implements ResultSetExtractor<List<PlantMapping>> {

	private int fullCount = 0;

	public int getFullCount() {
		return fullCount;
	}

	public void setFullCount(int fullCount) {
		this.fullCount = fullCount;
	}

	@Override
	public List<PlantMapping> extractData(ResultSet rs) throws SQLException {

		Map<String, PlantMapping> plant = new LinkedHashMap<>();
		this.setFullCount(0);
		while (rs.next()) {
			String id = rs.getString("id");
			PlantMapping plantMappingId = plant.get(id);
			String tenantId = rs.getString("tenantid");
			String plantCode = rs.getString("plantcode");

			AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("createdBy"))
					.createdTime(rs.getLong("createdTime")).lastModifiedBy(rs.getString("lastModifiedBy"))
					.lastModifiedTime(rs.getLong("lastModifiedTime")).build();
			if (plantMappingId == null) {
				PlantMapping plantMap = PlantMapping.builder().id(id).tenantId(tenantId).plantCode(plantCode)
						.auditDetails(auditdetails).build();
				plant.put(id, plantMap);
			}
		}
		return new ArrayList<>(plant.values());
	}
}
