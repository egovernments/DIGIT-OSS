package org.egov.land.repository.rowmapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.land.web.models.Address;
import org.egov.land.web.models.AuditDetails;
import org.egov.land.web.models.Boundary;
import org.egov.land.web.models.Channel;
import org.egov.land.web.models.Document;
import org.egov.land.web.models.GeoLocation;
import org.egov.land.web.models.Institution;
import org.egov.land.web.models.LandInfo;
import org.egov.land.web.models.OccupancyType;
import org.egov.land.web.models.OwnerInfo;
import org.egov.land.web.models.Relationship;
import org.egov.land.web.models.Source;
import org.egov.land.web.models.Status;
import org.egov.land.web.models.Unit;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

@Component
public class LandRowMapper implements ResultSetExtractor<List<LandInfo>> {

	@Override
	public List<LandInfo> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, LandInfo> buildingMap = new LinkedHashMap<String, LandInfo>();

		while (rs.next()) {
			String id = rs.getString("land_id");
			LandInfo currentLandInfo = buildingMap.get(id);
			String tenantId = rs.getString("landInfo_tenantId");
			if (currentLandInfo == null) {
				Long lastModifiedTime = rs.getLong("landInfo_lastModifiedTime");
				if (rs.wasNull()) {
					lastModifiedTime = null;
				}

				Object additionalDetails = new Gson().fromJson(rs.getString("additionalDetails").equals("{}")
						|| rs.getString("additionalDetails").equals("null") ? null : rs.getString("additionalDetails"),
						Object.class);

				AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("landInfo_createdBy"))
						.createdTime(rs.getLong("landInfo_createdTime"))
						.lastModifiedBy(rs.getString("landInfo_lastModifiedBy")).lastModifiedTime(lastModifiedTime)
						.build();

				Double latitude = (Double) rs.getObject("latitude");
				Double longitude = (Double) rs.getObject("longitude");

				Boundary locality = Boundary.builder().code(rs.getString("locality")).build();

				GeoLocation geoLocation = GeoLocation.builder()
						.id(rs.getString("landInfo_geo_loc"))
						.latitude(latitude)
						.longitude(longitude).build();

				Address address = Address.builder().buildingName(rs.getString("buildingName"))
						.city(rs.getString("city")).plotNo(rs.getString("plotno")).district(rs.getString("district"))
						.region(rs.getString("region")).state(rs.getString("state")).country(rs.getString("country"))
						.id(rs.getString("landInfo_ad_id")).landmark(rs.getString("landmark")).geoLocation(geoLocation)
						.pincode(rs.getString("pincode")).doorNo(rs.getString("doorno")).street(rs.getString("street"))
						.tenantId(tenantId).locality(locality).build();

				currentLandInfo = LandInfo.builder().id(id).landUId(rs.getString("landuid"))
						.landUniqueRegNo(rs.getString("land_regno")).tenantId(tenantId)
						.status(rs.getString("status") != null ? Status.fromValue(rs.getString("status")) : null).address(address)
						.ownershipCategory(rs.getString("ownershipcategory"))
						.source(rs.getString("source") != null ? Source.fromValue(rs.getString("source")) : null)
						.channel(rs.getString("channel") != null ? Channel.fromValue(rs.getString("channel")) : null)
						.auditDetails(auditdetails).additionalDetails(additionalDetails).build();

				buildingMap.put(id, currentLandInfo);
			}
			addChildrenToProperty(rs, currentLandInfo);
		}

		return new ArrayList<>(buildingMap.values());

	}

	private void addChildrenToProperty(ResultSet rs, LandInfo landInfo) throws SQLException {

		String tenantId = landInfo.getTenantId();
		AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("landInfo_createdBy"))
				.createdTime(rs.getLong("landInfo_createdTime")).lastModifiedBy(rs.getString("landInfo_lastModifiedBy"))
				.lastModifiedTime(rs.getLong("landInfo_lastModifiedTime")).build();

		String unitId = rs.getString("landInfo_un_id");
		if (unitId != null) {
			Unit unit = Unit.builder().id(rs.getString("landInfo_un_id")).floorNo(rs.getString("floorno"))
					.unitType(rs.getString("unittype")).usageCategory(rs.getString("usageCategory"))
					.occupancyType(rs.getString("occupancytype") != null
							? rs.getString("occupancytype") : null)
					.occupancyDate(rs.getLong("occupancydate"))
					.auditDetails(auditdetails)
					.tenantId(tenantId).build();
			landInfo.addUnitsItem(unit);
		}
		
		String ownerId = rs.getString("landInfoowner_id");
		if (ownerId != null) {
			Boolean isPrimaryOwner = (Boolean) rs.getObject("isprimaryowner");
			Boolean status = (Boolean) rs.getObject("ownerstatus");
			Double val =  (Double) rs.getObject("ownershippercentage");
			BigDecimal ownerShipPercentage = val != null ? new BigDecimal(val) : null;

			OwnerInfo owner = OwnerInfo.builder().tenantId(tenantId).ownerId(ownerId)
					.uuid(rs.getString("landInfoowner_uuid"))
//					.mobileNumber(rs.getString("mobilenumber"))
					.isPrimaryOwner(isPrimaryOwner)
					.ownerShipPercentage(ownerShipPercentage)
					.institutionId(rs.getString("institutionid"))
					.auditDetails(auditdetails)
					.status(status)
					.relationship(rs.getString("relationship") != null
							? Relationship.fromValue(rs.getString("relationship")) : null)
					.build();
			landInfo.addOwnersItem(owner);
		}

		if(rs.getString("land_inst_id") != null) {
			Institution institution = Institution.builder().id(rs.getString("land_inst_id"))
					.type(rs.getString("land_inst_type")).tenantId(tenantId).designation(rs.getString("designation"))
					.nameOfAuthorizedPerson(rs.getString("nameOfAuthorizedPerson")).build();
			landInfo.setInstitution(institution);
		}

		String documentId = rs.getString("landInfo_doc_id");
		if (documentId != null) {
			Document document = Document.builder().documentType(rs.getString("landInfo_doc_documenttype"))
					.fileStoreId(rs.getString("landInfo_doc_filestore")).id(documentId)
					.documentUid(rs.getString("documentUid"))
					.auditDetails(auditdetails).build();
			landInfo.addDocumentsItem(document);
		}
	}
}
