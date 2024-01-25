package org.egov.fsm.repository.rowmapper;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.web.model.AuditDetails;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.PitDetail;
import org.egov.fsm.web.model.location.Address;
import org.egov.fsm.web.model.location.Boundary;
import org.egov.fsm.web.model.location.GeoLocation;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class FSMRowMapper implements ResultSetExtractor<List<FSM>> {

	@Autowired
	private ObjectMapper mapper;

	private int fullCount = 0;

	

	public int getFullCount() {
		return fullCount;
	}

	public void setFullCount(int fullCount) {
		this.fullCount = fullCount;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List<FSM> extractData(ResultSet rs) throws SQLException {

		Map<String, FSM> fmsMap = new LinkedHashMap<>();
		this.setFullCount(0);
		while (rs.next()) {
			String id = rs.getString("fsm_id");
			String applicationNo = rs.getString("applicationno");
			FSM currentfsm = fmsMap.get(id);
			String tenantId = rs.getString(FSMConstants.TENANT_ID);
			String accountId = rs.getString("accountId");
			String description = rs.getString("description");
			String source = rs.getString("source");
			String sanitationtype = rs.getString("sanitationtype");
			String propertyUsage = rs.getString("propertyUsage");
			int noOfTrips = rs.getInt("noOfTrips");
			String applicationStatus = rs.getString("applicationStatus");
			String vehicleId = rs.getString("vehicle_id");
			String vehicleType = rs.getString("vehicletype");
			String vehicleCapacity = rs.getString("vehiclecapacity");
			String dsoid = rs.getString("dso_id");
			Long possiblesrvdate = rs.getLong("possible_srv_date");
			this.setFullCount(rs.getInt("full_count"));
			Long compeletedOn = rs.getLong("completed_on");
			String applicationType = rs.getString("applicationType");
			String oldApplicationNo = rs.getString("oldApplicationNo");
			String paymentPreference = rs.getString("paymentPreference");
			BigDecimal advanceAmount = rs.getBigDecimal("advanceamount");
			if (fmsMap.get(id) == null) {
				currentfsm = FSM.builder().id(id).applicationNo(applicationNo).tenantId(tenantId)
						.description(description).accountId(accountId)
						.additionalDetails(getAdditionalDetail("additionalDetails", rs)).source(source)
						.sanitationtype(sanitationtype).propertyUsage(propertyUsage).noOfTrips(noOfTrips)
						.vehicleId(vehicleId).applicationStatus(applicationStatus).dsoId(dsoid)
						.possibleServiceDate(possiblesrvdate).vehicleType(vehicleType).vehicleCapacity(vehicleCapacity)
						.completedOn(compeletedOn).applicationType(applicationType).oldApplicationNo(oldApplicationNo)
						.paymentPreference(paymentPreference).advanceAmount(advanceAmount).build();

				fmsMap.put(id, currentfsm);
			}
			addChildrenToProperty(rs, currentfsm);
		}

		return new ArrayList<>(fmsMap.values());

	}

	@SuppressWarnings("unused")
	private void addChildrenToProperty(ResultSet rs, FSM fsm) throws SQLException {

		AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("createdBy"))
				.createdTime(rs.getLong("createdTime")).lastModifiedBy(rs.getString("lastModifiedBy"))
				.lastModifiedTime(rs.getLong("lastModifiedTime")).build();

		Double latitude = rs.getDouble("latitude");
		Double longitude = rs.getDouble("longitude");

		Boundary locality = Boundary.builder().code(rs.getString("locality")).build();

		GeoLocation geoLocation = GeoLocation.builder().id(rs.getString("fsm_geo_id")).latitude(latitude)
				.longitude(longitude).build();

		Address address = Address.builder().buildingName(rs.getString("buildingName")).city(rs.getString("city"))
				.plotNo(rs.getString("plotno")).district(rs.getString("district")).region(rs.getString("region"))
				.state(rs.getString("state")).country(rs.getString("country")).landmark(rs.getString("landmark"))
				.geoLocation(geoLocation).pincode(rs.getString("pincode")).doorNo(rs.getString("doorno"))
				.id(rs.getString("fsm_address_id")).additionalDetails(getAdditionalDetail("addressAdditionalDetails", rs))
				.street(rs.getString("street")).slumName(rs.getString("slumname"))
				.tenantId(rs.getString(FSMConstants.TENANT_ID)).locality(locality).auditDetails(auditdetails).build();
		PitDetail pitDetail = PitDetail.builder().height(rs.getDouble("height")).width(rs.getDouble("width"))
				.diameter(rs.getDouble("diameter")).length(rs.getDouble("length"))
				.distanceFromRoad(rs.getDouble("distanceFromRoad")).id(rs.getString("fsm_pit_id"))
				.additionalDetails(getAdditionalDetail("fsm_pit_additionalDetails", rs))
				.tenantId(rs.getString(FSMConstants.TENANT_ID)).auditDetails(auditdetails).build();

		fsm.setAddress(address);
		fsm.setPitDetail(pitDetail);
		fsm.setAuditDetails(auditdetails);

	}

	private JsonNode getAdditionalDetail(String columnName, ResultSet rs) {

		JsonNode additionalDetail = null;
		try {
			PGobject pgObj = (PGobject) rs.getObject(columnName);
			if (pgObj != null) {
				additionalDetail = mapper.readTree(pgObj.getValue());
			}
		} catch (IOException | SQLException e) {
			throw new CustomException("PARSING_ERROR", "Failed to parse additionalDetail object");
		}
		return additionalDetail;
	}
}