package org.egov.pt.repository.rowmapper;


import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import org.egov.pt.web.models.Address;
import org.egov.pt.web.models.AuditDetails;
import org.egov.pt.web.models.Boundary;
import org.egov.pt.web.models.Document;
import org.egov.pt.web.models.Institution;
import org.egov.pt.web.models.OwnerInfo;
import org.egov.pt.web.models.Property;
import org.egov.pt.web.models.Property.CreationReasonEnum;
import org.egov.pt.web.models.PropertyDetail;
import org.egov.pt.web.models.PropertyDetail.ChannelEnum;
import org.egov.pt.web.models.PropertyDetail.SourceEnum;
import org.egov.pt.web.models.PropertyDetail.StatusEnum;
import org.egov.pt.web.models.PropertyInfo;
import org.egov.pt.web.models.Unit;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Component
public class PropertyRowMapper implements ResultSetExtractor<List<Property>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	public List<Property> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, Property> propertyMap = new HashMap<>();

		while (rs.next()) {

			String currentId = rs.getString("ptid");
			Property currentProperty = propertyMap.get(currentId);
			String tenanId = rs.getString("tenantId");

			if (null == currentProperty) {

				Boundary locality = Boundary.builder().code(rs.getString("locality"))
						            .build();

				/*
				 * id of the address table is being fetched as address key to avoid confusion
				 * with addressId field
				 */
				Double latitude = rs.getDouble("latitude");
				if(rs.wasNull()){latitude = null;}
				Double longitude = rs.getDouble("longitude");
				if(rs.wasNull()){longitude = null;}

				//PGobject addObj = (PGobject) rs.getObject("add_additionalDetails");

				Address address = Address.builder().addressId(rs.getString("addressId"))
						.addressLine1(rs.getString("addressLine1")).addressLine2(rs.getString("addressLine2"))
						.addressNumber(rs.getString("addressNumber")).buildingName(rs.getString("buildingName"))
						.city(rs.getString("city")).detail(rs.getString("detail")).id(rs.getString("addresskeyid"))
						.landmark(rs.getString("landmark")).latitude(latitude).locality(locality)
						.longitude(longitude).pincode(rs.getString("pincode"))
						.doorNo(rs.getString("doorno"))
						.street(rs.getString("street"))
						.tenantId(tenanId)
						.type(rs.getString("type"))
						//.additionalDetails(getJsonValue(addObj))
						.build();

				Long lastModifiedTime = rs.getLong("propertylastModifiedTime");
				if(rs.wasNull()){lastModifiedTime = null;}
				AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("propertyCreatedby"))
						.createdTime(rs.getLong("propertyCreatedTime")).lastModifiedBy(rs.getString("propertyModifiedBy"))
						.lastModifiedTime(lastModifiedTime)
						.build();

				Long occupancyDate = rs.getLong("occupancyDate");
				PGobject obj = (PGobject) rs.getObject("pt_additionalDetails");

				if(rs.wasNull()){occupancyDate = null;}
				currentProperty = Property.builder().address(address)
						.acknowldgementNumber(rs.getString("acknowldgementNumber"))
						.creationReason(CreationReasonEnum.fromValue(rs.getString("creationReason")))
						.occupancyDate(occupancyDate).propertyId(currentId)
						.oldPropertyId(rs.getString("oldPropertyId"))
						.status(PropertyInfo.StatusEnum.fromValue(rs.getString("status")))
						.tenantId(tenanId).auditDetails(auditdetails)
						.additionalDetails(getJsonValue(obj))
						.build();


				propertyMap.put(currentId, currentProperty);

			}

			addChildrenToProperty(rs, currentProperty);
		}
		return new ArrayList<>(propertyMap.values());
	}

	private void addChildrenToProperty(ResultSet rs, Property property) throws SQLException {

		PropertyDetail detail = null;

		//Search if the row contains new PropertyDetail or existing one
		String assessmentNumber = rs.getString("assessmentNumber");
		if(!CollectionUtils.isEmpty(property.getPropertyDetails())) {
			for(PropertyDetail propertyDetail:property.getPropertyDetails()){
				if(propertyDetail.getAssessmentNumber().equals(assessmentNumber)){
					detail = propertyDetail;
					break;
				}
			}
		}

		// If assessmentNumber not found in previous loop new PropertyDetail is created
		if(detail==null) {
			Long assesslastModifiedTime = rs.getLong("assesslastModifiedTime");
			if(rs.wasNull()){assesslastModifiedTime = null;}
			AuditDetails assessAuditdetails = AuditDetails.builder().createdBy(rs.getString("assesscreatedBy"))
					.createdTime(rs.getLong("assesscreatedTime")).lastModifiedBy(rs.getString("assesslastModifiedBy"))
					.lastModifiedTime(assesslastModifiedTime)
					.build();

			Institution institution = null;
			//PGobject insti_additionalDetails = (PGobject) rs.getObject("insti_additionalDetails");
			if(rs.getString("instiid")!=null)
			{ institution = Institution.builder()
					.id(rs.getString("instiid"))
					.tenantId(rs.getString("institenantId"))
					.name(rs.getString("institutionName"))
					.type(rs.getString("institutionType"))
					.designation(rs.getString("designation"))
					//.additionalDetails(getJsonValue(insti_additionalDetails))
					.build();
			}

			OwnerInfo citizenInfo = OwnerInfo.builder().uuid(rs.getString("accountId")).build();

			Float landArea = rs.getFloat("landArea");
			if(rs.wasNull()){landArea = null;}
			Float buildUpArea = rs.getFloat("buildUpArea");
			if(rs.wasNull()){buildUpArea = null;}
			Long noOfFloors = rs.getLong("noOfFloors");
			if(rs.wasNull()){noOfFloors = null;}


			detail = PropertyDetail.builder()
					.buildUpArea(buildUpArea)
					.landArea(landArea)
					.channel(ChannelEnum.fromValue(rs.getString("channel")))
					.noOfFloors(noOfFloors).source(SourceEnum.fromValue(rs.getString("source")))
					.usage(rs.getString("usage")).assessmentDate(rs.getLong("assessmentDate"))
					.assessmentNumber(rs.getString("assessmentNumber")).financialYear(rs.getString("financialYear"))
					.propertyType(rs.getString("propertyType")).propertySubType(rs.getString("propertySubType"))
					.ownershipCategory(rs.getString("ownershipCategory"))
					.subOwnershipCategory(rs.getString("subOwnershipCategory"))
					.usageCategoryMajor(rs.getString("usageCategoryMajor"))
					.usageCategoryMinor(rs.getString("usageCategoryMinor"))
					.adhocExemption(rs.getBigDecimal("adhocExemption"))
					.status(StatusEnum.fromValue(rs.getString("propertydetailstatus")))
					.adhocExemptionReason(rs.getString("adhocExemptionReason"))
					.adhocPenalty(rs.getBigDecimal("adhocPenalty"))
					.adhocPenaltyReason(rs.getString("adhocPenaltyReason"))
					.tenantId(rs.getString("tenantid"))
					.institution(institution)
					.citizenInfo(citizenInfo)
					.auditDetails(assessAuditdetails)
					.build();

			PGobject obj = (PGobject) rs.getObject("ptdl_additionalDetails");
			detail.setAdditionalDetails(getJsonValue(obj));
			property.addpropertyDetailsItem(detail);

		}

		String tenantId = property.getTenantId();


		if(rs.getString("documentid")!=null)
		{Document document = Document.builder().id(rs.getString("documentid"))
				.documentType(rs.getString("documentType"))
				.fileStore(rs.getString("fileStore"))
				.documentUid(rs.getString("documentuid"))
				.build();
			detail.addDocumentsItem(document);
		}


		if(rs.getString("unitid")!=null)
		{   Float unitArea = rs.getFloat("unitArea");
			if(rs.wasNull()){unitArea = null;}
			Long unitoccupancyDate = rs.getLong("unitoccupancyDate");
			if(rs.wasNull()){unitoccupancyDate = null;}

			//PGobject unit_additionalDetails = (PGobject) rs.getObject("unit_additionalDetails");

			Unit unit = Unit.builder().id(rs.getString("unitid"))
				.floorNo(rs.getString("floorNo"))
				.tenantId(tenantId)
				.unitArea(unitArea)
				.unitType(rs.getString("unitType"))
				.usageCategoryMajor(rs.getString("unitusagecategorymajor"))
				.usageCategoryMinor(rs.getString("unitusagecategoryminor"))
				.usageCategorySubMinor(rs.getString("usageCategorySubMinor"))
				.usageCategoryDetail(rs.getString("usageCategoryDetail"))
				.occupancyType(rs.getString("occupancyType"))
				.occupancyDate(unitoccupancyDate)
				.constructionType(rs.getString("constructionType"))
				.constructionSubType(rs.getString("constructionSubType"))
				.arv(rs.getBigDecimal("arv"))
				//.additionalDetails(getJsonValue(unit_additionalDetails))
				.build();
			detail.addUnitsItem(unit);
		}



		Document ownerDocument = Document.builder().id(rs.getString("ownerdocid"))
				.documentType(rs.getString("ownerdocType"))
				.fileStore(rs.getString("ownerfileStore"))
				.documentUid(rs.getString("ownerdocuid"))
				.build();

		Double ownerShipPercentage = rs.getDouble("ownerShipPercentage");
		if(rs.wasNull()){ ownerShipPercentage = null;}
		Boolean isPrimaryOwner = rs.getBoolean("isPrimaryOwner");
		if(rs.wasNull()){ isPrimaryOwner = null;}

		//PGobject ownerInfo_additionalDetails = (PGobject) rs.getObject("ownerInfo_additionalDetails");

		OwnerInfo owner = OwnerInfo.builder().uuid(rs.getString("userid"))
				.isPrimaryOwner(isPrimaryOwner)
				.ownerType(rs.getString("ownerType"))
				.ownerShipPercentage(ownerShipPercentage)
				.institutionId(rs.getString("institutionid"))
				.relationship(OwnerInfo.RelationshipEnum.fromValue(rs.getString("relationship")))
			//	.additionalDetails(getJsonValue(ownerInfo_additionalDetails))
				.build();

		/*
		 * add item methods of models are being used to avoid the null checks
		 */
		detail.addOwnersItem(owner);

		// Add owner document to the specific propertyDetail for which it was used
		String docuserid = rs.getString("docuserid");
		String docAssessmentNumber = rs.getString("docassessmentnumber");
		if(assessmentNumber.equalsIgnoreCase(docAssessmentNumber) && docuserid!=null) {
			detail.getOwners().forEach(ownerInfo -> {
				if (docuserid.equalsIgnoreCase(ownerInfo.getUuid()))
					ownerInfo.addDocumentsItem(ownerDocument);
			});
		}
	}




	private JsonNode getJsonValue(PGobject pGobject){
		try {
			if(Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
				return null;
			else
				return mapper.readTree( pGobject.getValue());
		} catch (IOException e) {
			throw new CustomException("SERVER_ERROR","Exception occurred while parsing the additionalDetail json : "+ e
					.getMessage());
		}
	}



}
