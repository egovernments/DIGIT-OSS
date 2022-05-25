package org.egov.swcalculation.repository.rowMapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.web.models.workflow.ProcessInstance;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.swcalculation.constants.SWCalculationConstant.*;

@Component
public class SewerageRowMapper implements ResultSetExtractor<List<SewerageConnection>> {


	@Autowired
	private ObjectMapper mapper;

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
                sewarageConnection.setStatus(Connection.StatusEnum.fromValue(rs.getString("status")));
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
                sewarageConnection.setOldApplication(rs.getBoolean("isoldapplication"));
                // get property id and get property object
                PGobject pgObj = (PGobject) rs.getObject("additionaldetails");
				ObjectNode addtionalDetails = null;
				if (pgObj != null) {

					try {
						addtionalDetails = mapper.readValue(pgObj.getValue(), ObjectNode.class);
					} catch (IOException ex) {
						// TODO Auto-generated catch block
						throw new CustomException("PARSING ERROR", "The additionalDetail json cannot be parsed");
					}
				} else {
					addtionalDetails = mapper.createObjectNode();
				}
               // HashMap<String, Object> addtionalDetails = new HashMap<>();
                addtionalDetails.put(ADHOC_PENALTY, rs.getBigDecimal("adhocpenalty"));
                addtionalDetails.put(ADHOC_REBATE, rs.getBigDecimal("adhocrebate"));
                addtionalDetails.put(ADHOC_PENALTY_REASON, rs.getString("adhocpenaltyreason"));
                addtionalDetails.put(ADHOC_PENALTY_COMMENT, rs.getString("adhocpenaltycomment"));
                addtionalDetails.put(ADHOC_REBATE_REASON, rs.getString("adhocrebatereason"));
                addtionalDetails.put(ADHOC_REBATE_COMMENT, rs.getString("adhocrebatecomment"));
                addtionalDetails.put(APP_CREATED_DATE, rs.getBigDecimal("appCreatedDate"));
                addtionalDetails.put(DETAILS_PROVIDED_BY, rs.getString("detailsprovidedby"));
                addtionalDetails.put(ESTIMATION_FILESTORE_ID, rs.getString("estimationfileStoreId"));
                addtionalDetails.put(SANCTION_LETTER_FILESTORE_ID, rs.getString("sanctionfileStoreId"));
                addtionalDetails.put(ESTIMATION_DATE_CONST, rs.getBigDecimal("estimationLetterDate"));
                addtionalDetails.put(LOCALITY, rs.getString("locality"));
                sewarageConnection.setAdditionalDetails(addtionalDetails);
                sewarageConnection.processInstance(ProcessInstance.builder().action((rs.getString("action"))).build());
                sewarageConnection.setApplicationType(rs.getString("applicationType"));
                sewarageConnection.setDateEffectiveFrom(rs.getLong("dateEffectiveFrom"));
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
			addDocumentToSewerageConnection(rs, sewarageConnection);
			addPlumberInfoToSewerageConnection(rs, sewarageConnection);
			addHoldersDeatilsToSewerageConnection(rs, sewarageConnection);
            addRoadCuttingInfotToSewerageConnection(rs, sewarageConnection);
        }
        return new ArrayList<>(connectionListMap.values());
    }

    private void addDocumentToSewerageConnection(ResultSet rs, SewerageConnection sewerageConnection) throws SQLException {
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
    }

    private void addRoadCuttingInfotToSewerageConnection(ResultSet rs, SewerageConnection sewerageConnection) throws SQLException {
        String roadcutting_id = rs.getString("roadcutting_id");
        String isActive = rs.getString("roadcutting_active");
        boolean roadCuttingInfoActive = false;
        if (!org.apache.commons.lang3.StringUtils.isEmpty(isActive)) {
            roadCuttingInfoActive = Status.ACTIVE.name().equalsIgnoreCase(isActive);
        }
        if (!org.apache.commons.lang3.StringUtils.isEmpty(roadcutting_id) && roadCuttingInfoActive) {
            RoadCuttingInfo roadCuttingInfo = new RoadCuttingInfo();
            roadCuttingInfo.setId(roadcutting_id);
            roadCuttingInfo.setRoadType(rs.getString("roadcutting_roadtype"));
            roadCuttingInfo.setRoadCuttingArea(rs.getFloat("roadcutting_roadcuttingarea"));
            roadCuttingInfo.setStatus(Status.fromValue(isActive));
            sewerageConnection.addRoadCuttingInfoList(roadCuttingInfo);
        }
    }

    private void addPlumberInfoToSewerageConnection(ResultSet rs, SewerageConnection sewerageConnection) throws SQLException {
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

    private void addHoldersDeatilsToSewerageConnection(ResultSet rs, SewerageConnection sewerageConnection) throws SQLException {
        String uuid = rs.getString("userid");
        List<OwnerInfo> connectionHolders = sewerageConnection.getConnectionHolders();
        if (!CollectionUtils.isEmpty(connectionHolders)) {
            for (OwnerInfo connectionHolderInfo : connectionHolders) {
                if (!StringUtils.isEmpty(connectionHolderInfo.getUuid()) && !StringUtils.isEmpty(uuid) && connectionHolderInfo.getUuid().equals(uuid))
                    return;
            }
        }
        if (!StringUtils.isEmpty(uuid)) {
            Double holderShipPercentage = rs.getDouble("holdershippercentage");
            if (rs.wasNull()) {
                holderShipPercentage = null;
            }
            Boolean isPrimaryOwner = rs.getBoolean("isprimaryholder");
            if (rs.wasNull()) {
                isPrimaryOwner = null;
            }
            OwnerInfo connectionHolderInfo = OwnerInfo.builder()
                    .relationship(Relationship.fromValue(rs.getString("holderrelationship")))
                    .status(Status.fromValue(rs.getString("holderstatus")))
                    .tenantId(rs.getString("holdertenantid")).ownerType(rs.getString("connectionholdertype"))
                    .isPrimaryOwner(isPrimaryOwner).uuid(uuid).build();
            sewerageConnection.addConnectionHolderInfo(connectionHolderInfo);
        }
    }
}