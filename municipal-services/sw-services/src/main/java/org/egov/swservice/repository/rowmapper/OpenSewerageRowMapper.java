package org.egov.swservice.repository.rowmapper;

import org.egov.swservice.util.SWConstants;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.Connection.StatusEnum;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Component
public class OpenSewerageRowMapper implements ResultSetExtractor<List<SewerageConnection>> {
	
	@Override
    public List<SewerageConnection> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String, SewerageConnection> connectionListMap = new LinkedHashMap<>();
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
                sewarageConnection.setOldApplication(rs.getBoolean("isoldapplication"));
                // get property id and get property object
                HashMap<String, Object> addtionalDetails = new HashMap<>();
                addtionalDetails.put(SWConstants.APP_CREATED_DATE, rs.getBigDecimal("appCreatedDate"));
                addtionalDetails.put(SWConstants.LOCALITY, rs.getString("locality"));
                sewarageConnection.setAdditionalDetails(addtionalDetails);
                sewarageConnection.processInstance(ProcessInstance.builder().action((rs.getString("action"))).build());
                sewarageConnection.setApplicationType(rs.getString("applicationType"));
                sewarageConnection.setChannel(rs.getString("channel"));
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

			addHoldersDeatilsToSewerageConnection(rs, sewarageConnection);
        }
        return new ArrayList<>(connectionListMap.values());
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
                    .relationship(rs.getString("holderrelationship"))
                    .status(Status.fromValue(rs.getString("holderstatus")))
                    .tenantId(rs.getString("holdertenantid")).ownerType(rs.getString("connectionholdertype"))
                    .isPrimaryOwner(isPrimaryOwner).uuid(uuid).build();
            sewerageConnection.addConnectionHolderInfo(connectionHolderInfo);
        }
    }
}
