package org.egov.vendor.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vendor.web.model.AuditDetails;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.location.Address;
import org.egov.vendor.web.model.location.Boundary;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class VendorRowMapper implements ResultSetExtractor<List<Vendor>> {

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
	public List<Vendor> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, Vendor> vendorMap = new LinkedHashMap<String, Vendor>();

		this.setFullCount(0);

		while (rs.next()) {
			Vendor currentvendor = new Vendor();
			String id = rs.getString("vendor_id");
			String name = rs.getString("name");
			currentvendor = vendorMap.get(id);
			String tenantId = rs.getString("tenantid");
			Object additionalDetail = getAdditionalDetail("additionaldetails", rs);
			String owner_id = rs.getString("owner_id");
			String description = rs.getString("description");
			String source = rs.getString("source");
			String status = rs.getString("status");
			String agencytype = rs.getString("agencytype");
			String paymentpreference = rs.getString("paymentpreference");
			this.setFullCount(rs.getInt("full_count"));
			if (currentvendor == null) {
				Long lastModifiedTime = rs.getLong("lastmodifiedtime");

				if (rs.wasNull()) {
					lastModifiedTime = null;
				}

				currentvendor = Vendor.builder().id(id).name(name).tenantId(tenantId).agencyType(agencytype)
						.paymentPreference(paymentpreference).additionalDetails(additionalDetail)
						.description(description).source(source).ownerId(owner_id).build();

				vendorMap.put(id, currentvendor);
			}
			addChildrenToProperty(rs, currentvendor);
		}

		return new ArrayList<>(vendorMap.values());
	}

	@SuppressWarnings("unused")
	private void addChildrenToProperty(ResultSet rs, Vendor vendor) throws SQLException {
		String tenantId = vendor.getTenantId();

		AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("createdBy"))
				.createdTime(rs.getLong("createdTime")).lastModifiedBy(rs.getString("lastModifiedBy"))
				.lastModifiedTime(rs.getLong("lastModifiedTime")).build();

		Boundary locality = Boundary.builder().code(rs.getString("locality")).build();

		Address address = Address.builder().id(rs.getString("id")).tenantId(rs.getString("tenantid"))
				.doorNo(rs.getString("doorno")).plotNo(rs.getString("plotno")).landmark(rs.getString("landmark"))
				.city(rs.getString("city")).district(rs.getString("district")).region(rs.getString("region"))
				.state(rs.getString("state")).country(rs.getString("country")).pincode(rs.getString("pincode"))
				.additionalDetails(rs.getString("additionaldetails")).buildingName(rs.getString("buildingname"))
				.street(rs.getString("street")).locality(locality).build();

		// Vehicle vehicle =
		// Vehicle.builder().registrationNumber(rs.getString("vechile_id")).build();

		vendor.setAddress(address);
		vendor.setAuditDetails(auditdetails);

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