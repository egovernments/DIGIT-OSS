package org.egov.vehicle.trip.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTrip.StatusEnum;
import org.egov.vehicle.web.model.AuditDetails;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class VehicleTripRowMapper implements ResultSetExtractor<List<VehicleTrip>> {

	@Autowired
	private ObjectMapper mapper;
	
	public int fullCount=0;

	public int getFullCount() {
		return fullCount;
	}

	public void setFullCount(int fullCount) {
		this.fullCount = fullCount;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List<VehicleTrip> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, VehicleTrip> vehicleLogMap = new LinkedHashMap<String, VehicleTrip>();
		this.setFullCount(0);

		while (rs.next()) {
			VehicleTrip vehicleLog = new VehicleTrip();
			String id = rs.getString("id");
			String applicationNo = rs.getString("applicationno");
			vehicleLog = vehicleLogMap.get(id);
			String tenantId = rs.getString("tenantid");
			String status = rs.getString("status");
			String applicationStatus = rs.getString("applicationstatus");
			String driverId = rs.getString("driver_id");
			String dsoId = rs.getString("owner_id");
			String vehicleId = rs.getString("vehicle_id");
			Object additionalDetails = getAdditionalDetail("additionalDetails", rs);

			Long tripstarttime = rs.getLong("tripstarttime");
			Long tripendtime = rs.getLong("tripendtime");
			Double volumeCarried = rs.getDouble("volumecarried");
			String businesSservice = rs.getString("businessservice");
			this.setFullCount(rs.getInt("full_count"));
			if (vehicleLog == null) {
				Long lastModifiedTime = rs.getLong("lastmodifiedtime");

				if (rs.wasNull()) {
					lastModifiedTime = null;
				}

				String createdBy = rs.getString("createdby");
				String lastModifiedBy = rs.getString("lastmodifiedby");
				Long createdTime = rs.getLong("createdtime");
				lastModifiedTime = rs.getLong("lastmodifiedtime");

				AuditDetails audit = new AuditDetails();
				audit = audit.builder().createdBy(createdBy).lastModifiedBy(lastModifiedBy).createdTime(createdTime)
						.lastModifiedTime(lastModifiedTime).build();

				vehicleLog = VehicleTrip.builder().id(id).applicationNo(applicationNo).tenantId(tenantId)
						.applicationStatus(applicationStatus).tripOwnerId(dsoId).vehicleId(vehicleId)
						.volumeCarried(volumeCarried).additionalDetails(additionalDetails).driverId(driverId)
						.tripStartTime(tripstarttime).tripEndTime(tripendtime).businessService(businesSservice)
						.volumeCarried(volumeCarried).status(StatusEnum.valueOf(status)).auditDetails(audit).build();
			}
//			addChildrenToProperty(rs, vehicleLog);
			vehicleLogMap.put(id, vehicleLog);
		}

		return new ArrayList<>(vehicleLogMap.values());
	}

	private JsonNode getAdditionalDetail(String columnName, ResultSet rs) {

		JsonNode additionalDetail = null;
		try {
			PGobject pgObj = (PGobject) rs.getObject(columnName);
			if (pgObj != null) {
				additionalDetail = mapper.readTree(pgObj.getValue());
			}
		} catch (IOException | SQLException e) {
			e.printStackTrace();
			throw new CustomException("PARSING_ERROR", "Failed to parse additionalDetail object");
		}
		return additionalDetail;
	}

}