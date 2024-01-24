package org.egov.pt.repository.rowmapper;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.pt.models.Address;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.GeoLocation;
import org.egov.pt.models.Locality;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.enums.Status;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
@Component
public class OpenPropertyRowMapper implements ResultSetExtractor<List<Property>> {

	@Override
	public List<Property> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, Property> propertyMap = new LinkedHashMap<>();

		while (rs.next()) {

			String propertyUuId = rs.getString("pid");
			Property currentProperty = propertyMap.get(propertyUuId);
			String tenanId = rs.getString("ptenantid");

			if (null == currentProperty) {

				Address address = getAddress(rs, tenanId);

				AuditDetails auditdetails = getAuditDetail(rs, "property");

				currentProperty = Property.builder()
						.creationReason(CreationReason.fromValue(rs.getString("creationReason")))
						.status(Status.fromValue(rs.getString("propertystatus")))
						.oldPropertyId(rs.getString("oldPropertyId"))
						.propertyId(rs.getString("propertyid"))
						.auditDetails(auditdetails)
						.tenantId(tenanId)
						.id(propertyUuId)
						.address(address)
						.build();


				addChildrenToProperty(rs, currentProperty);
				propertyMap.put(propertyUuId, currentProperty);
			}

			addChildrenToProperty(rs, currentProperty);
		}

		return new ArrayList<>(propertyMap.values());

	}

	/**
	 * Adding children elements to Property
	 * 
	 * @param rs
	 * @param currentProperty
	 * @throws SQLException
	 */
	private void addChildrenToProperty(ResultSet rs, Property currentProperty)
			throws SQLException {

		addOwnerToProperty(rs, currentProperty);
	}




	/**
	 * Adds Owner Object to Property
	 * 
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	private void addOwnerToProperty(ResultSet rs, Property property) throws SQLException {
		
		String uuid = rs.getString("userid");
		List<OwnerInfo> owners = property.getOwners();

		if (!CollectionUtils.isEmpty(owners))
			for (OwnerInfo owner : owners) {
				if (owner.getUuid().equals(uuid))
					return;
			}

		OwnerInfo owner = OwnerInfo.builder()
				.status(Status.fromValue(rs.getString("ownstatus")))
				.institutionId(rs.getString("owninstitutionid"))
				.ownerInfoUuid(rs.getString("ownerInfoUuid"))
				.tenantId(rs.getString("owntenantid"))
				.ownerType(rs.getString("ownerType"))
				.uuid(uuid)
				.build();
		
		property.addOwnersItem(owner);
	}
	

	
	/**
	 * creates and adds the address object to property 
	 * 
	 * @param rs
	 * @param tenanId
	 * @return
	 * @throws SQLException
	 */
	private Address getAddress(ResultSet rs, String tenanId) throws SQLException {
		
		Locality locality = Locality.builder().code(rs.getString("locality")).build();

		GeoLocation geoLocation = GeoLocation.builder()
				.longitude(rs.getDouble("longitude"))
				.latitude(rs.getDouble("latitude"))
				.build();

		return Address.builder()
		.buildingName(rs.getString("buildingname"))
		.landmark(rs.getString("landmark"))
		.district(rs.getString("district"))
		.country(rs.getString("country"))
		.pincode(rs.getString("pincode"))
		.doorNo(rs.getString("doorNo"))
		.plotNo(rs.getString("plotNo"))
		.region(rs.getString("region"))
		.street(rs.getString("street"))
		.id(rs.getString("addressid"))
		.state(rs.getString("state"))
		.city(rs.getString("city"))
		.geoLocation(geoLocation)
		.locality(locality)
		.tenantId(tenanId)
		.build();
	}
	
	/**
	 * prepares and returns an audit detail object
	 * 
	 * depending on the source the column names of result set will vary
	 * 
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	private AuditDetails getAuditDetail(ResultSet rs, String source) throws SQLException {
		
		switch (source) {
		
		case "property":
			
			Long lastModifiedTime = rs.getLong("plastModifiedTime");
			if (rs.wasNull()) {
				lastModifiedTime = null;
			}
			
			return AuditDetails.builder().createdBy(rs.getString("pcreatedBy"))
					.createdTime(rs.getLong("pcreatedTime")).lastModifiedBy(rs.getString("plastModifiedBy"))
					.lastModifiedTime(lastModifiedTime).build();
			
		default: 
			return null;
			
		}

	}

	/*
	 *  method sets all the data for PropertyInfo
	 *
	 * @param currentProperty
	 * @param rs
	 * @param tenantId
	 * @param propertyUuId
	 *
	 * @throws SQLException
	 * */
	private void setPropertyInfo(Property currentProperty, ResultSet rs, String tenantId, String propertyUuId, Address address)
			throws SQLException {
		currentProperty.setPropertyId(rs.getString("propertyid"));
		currentProperty.setAddress(address);
		currentProperty.setStatus(Status.fromValue(rs.getString("propertystatus")));
		currentProperty.setOldPropertyId(rs.getString("oldPropertyId"));
		currentProperty.setTenantId(tenantId);
		currentProperty.setId(propertyUuId);
	}

}