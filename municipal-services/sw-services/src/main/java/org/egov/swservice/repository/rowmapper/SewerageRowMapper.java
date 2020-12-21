package org.egov.swservice.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.swservice.web.models.AuditDetails;
import org.egov.swservice.web.models.Connection.StatusEnum;
import org.egov.swservice.web.models.Document;
import org.egov.swservice.web.models.PlumberInfo;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.Status;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.util.SWConstants;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class SewerageRowMapper implements ResultSetExtractor<List<SewerageConnection>> {

	@Override
	public List<SewerageConnection> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, SewerageConnection> connectionListMap = new HashMap<>();
		SewerageConnection sewarageConnection = new SewerageConnection();
		while (rs.next()) {
			String Id = rs.getString("connection_Id");
			if (connectionListMap.getOrDefault(Id, null) == null) {
				sewarageConnection = new SewerageConnection();
				sewarageConnection.setTenantId(rs.getString("tenantid"));
				sewarageConnection.setId(rs.getString("connection_Id"));
				sewarageConnection.setApplicationNo(rs.getString("applicationNo"));
				sewarageConnection
						.setApplicationStatus(rs.getString("applicationstatus"));
				sewarageConnection.setStatus(StatusEnum.fromValue(rs.getString("status")));
				sewarageConnection.setConnectionNo(rs.getString("connectionNo"));
				sewarageConnection.setOldConnectionNo(rs.getString("oldConnectionNo"));
				sewarageConnection.setConnectionExecutionDate(rs.getLong("connectionExecutionDate"));
				sewarageConnection.setNoOfToilets(rs.getInt("noOfToilets"));
				sewarageConnection.setNoOfWaterClosets(rs.getInt("noOfWaterClosets"));
				sewarageConnection.setProposedToilets(rs.getInt("proposedToilets"));
				sewarageConnection.setProposedWaterClosets(rs.getInt("proposedWaterClosets"));
				sewarageConnection.setConnectionType(rs.getString("connectionType"));
				sewarageConnection.setRoadCuttingArea(rs.getFloat("roadcuttingarea"));
				sewarageConnection.setRoadType(rs.getString("roadtype"));
				// get property id and get property object
				HashMap<String, Object> addtionalDetails = new HashMap<>();
				addtionalDetails.put(SWConstants.ADHOC_PENALTY, rs.getBigDecimal("adhocpenalty"));
				addtionalDetails.put(SWConstants.ADHOC_REBATE, rs.getBigDecimal("adhocrebate"));
				addtionalDetails.put(SWConstants.ADHOC_PENALTY_REASON, rs.getString("adhocpenaltyreason"));
				addtionalDetails.put(SWConstants.ADHOC_PENALTY_COMMENT, rs.getString("adhocpenaltycomment"));
				addtionalDetails.put(SWConstants.ADHOC_REBATE_REASON, rs.getString("adhocrebatereason"));
				addtionalDetails.put(SWConstants.ADHOC_REBATE_COMMENT, rs.getString("adhocrebatecomment"));
				addtionalDetails.put(SWConstants.APP_CREATED_DATE, rs.getBigDecimal("appCreatedDate"));
				addtionalDetails.put(SWConstants.DETAILS_PROVIDED_BY, rs.getString("detailsprovidedby"));
				addtionalDetails.put(SWConstants.ESTIMATION_FILESTORE_ID, rs.getString("estimationfileStoreId"));
				addtionalDetails.put(SWConstants.SANCTION_LETTER_FILESTORE_ID, rs.getString("sanctionfileStoreId"));
				addtionalDetails.put(SWConstants.ESTIMATION_DATE_CONST, rs.getBigDecimal("estimationLetterDate"));
				sewarageConnection.setAdditionalDetails(addtionalDetails);
				sewarageConnection.processInstance(ProcessInstance.builder().action((rs.getString("action"))).build());
				sewarageConnection.setPropertyId(rs.getString("property_id"));
				
				 AuditDetails auditdetails = AuditDetails.builder()
	                        .createdBy(rs.getString("sw_createdBy"))
	                        .createdTime(rs.getLong("sw_createdTime"))
	                        .lastModifiedBy(rs.getString("sw_lastModifiedBy"))
	                        .lastModifiedTime(rs.getLong("sw_lastModifiedTime"))
	                        .build();
				 sewarageConnection.setAuditDetails(auditdetails);
				 
				// Add documents id's
				connectionListMap.put(Id, sewarageConnection);
			}
			addChildrenToProperty(rs, sewarageConnection);
		}
		return new ArrayList<>(connectionListMap.values());
	}

	private void addChildrenToProperty(ResultSet rs, SewerageConnection sewerageConnection) throws SQLException {
		String document_Id = rs.getString("doc_Id");
		String isActive = rs.getString("doc_active");
		boolean documentActive = false;
		if (isActive != null) {
			documentActive = Status.ACTIVE.name().equalsIgnoreCase(isActive);
		}
		if (document_Id != null && documentActive) {
			Document applicationDocument = new Document();
			applicationDocument.setId(document_Id);
			applicationDocument.setDocumentType(rs.getString("documenttype"));
			applicationDocument.setFileStoreId(rs.getString("filestoreid"));
			applicationDocument.setDocumentUid(rs.getString("doc_Id"));
			applicationDocument.setStatus(Status.fromValue(isActive));
			sewerageConnection.addDocumentsItem(applicationDocument);
		}
		String plumber_id = rs.getString("plumber_id");
		if (plumber_id != null) {
			PlumberInfo plumber = new PlumberInfo();
			plumber.setId(plumber_id);
			plumber.setName(rs.getString("plumber_name"));
			plumber.setGender(rs.getString("plumber_gender"));
			plumber.setLicenseNo(rs.getString("licenseno"));
			plumber.setMobileNumber(rs.getString("plumber_mobileNumber"));
			plumber.setRelationship(rs.getString("relationship"));
			plumber.setCorrespondenceAddress(rs.getString("correspondenceaddress"));
			plumber.setFatherOrHusbandName(rs.getString("fatherorhusbandname"));
			sewerageConnection.addPlumberInfoItem(plumber);
		}
	}

}
