package org.egov.noc.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.noc.web.model.AuditDetails;
import org.egov.noc.web.model.Document;
import org.egov.noc.web.model.Noc;
import org.egov.noc.web.model.enums.ApplicationType;
import org.egov.noc.web.model.enums.Status;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

@Component
public class NocRowMapper implements ResultSetExtractor<List<Noc>> {
	/**
	 * extracts the data from the resultSet and populate the NOC Objects
	 * @see org.springframework.jdbc.core.ResultSetExtractor#extractData(java.sql.ResultSet)
	 */
	@Override
	public List<Noc> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, Noc> nocListMap = new HashMap<>();
		Noc noc = new Noc();
		while (rs.next()) {
			String Id = rs.getString("noc_Id");
			if (nocListMap.getOrDefault(Id, null) == null) {
				noc = new Noc();
				noc.setTenantId(rs.getString("tenantid"));
				noc.setId(rs.getString("noc_Id"));
				noc.setApplicationNo(rs.getString("applicationNo"));
                noc.setNocNo(rs.getString("nocNo"));
                noc.setNocType(rs.getString("nocType"));
                noc.setApplicationStatus(rs.getString("applicationStatus"));
                noc.setApplicationType(ApplicationType.fromValue(rs.getString("applicationType")));
                noc.setStatus(Status.fromValue(rs.getString("status")));
                noc.setLandId(rs.getString("landId"));
                noc.setSource(rs.getString("source"));
                noc.setSourceRefId(rs.getString("sourceRefId"));
                noc.setAccountId(rs.getString("AccountId"));

                Object additionalDetails = new Gson().fromJson(rs.getString("additionalDetails").equals("{}")
						|| rs.getString("additionalDetails").equals("null") ? null : rs.getString("additionalDetails"),
						Object.class);
                noc.setAdditionalDetails(additionalDetails);
                
                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("noc_createdBy"))
                        .createdTime(rs.getLong("noc_createdTime"))
                        .lastModifiedBy(rs.getString("noc_lastModifiedBy"))
                        .lastModifiedTime(rs.getLong("noc_lastModifiedTime"))
                        .build();
			    noc.setAuditDetails(auditdetails);
				 
			    nocListMap.put(Id, noc);
			}
			addChildrenToProperty(rs, noc);
		}
		return new ArrayList<>(nocListMap.values());
	}
	/**
	 * add the child objects like document to the NOC object from the result set.
	 * @param rs
	 * @param noc
	 * @throws SQLException
	 */
	@SuppressWarnings("unused")
	private void addChildrenToProperty(ResultSet rs, Noc noc) throws SQLException {
		String documentId = rs.getString("noc_doc_id");
		String tenantId = noc.getTenantId();
		if (!StringUtils.isEmpty(documentId)) {
			Document applicationDocument = new Document();
		     Object additionalDetails = new Gson().fromJson(rs.getString("doc_details").equals("{}")
						|| rs.getString("doc_details").equals("null") ? null : rs.getString("doc_details"),
						Object.class);
			applicationDocument.setId(documentId);
			applicationDocument.setDocumentType(rs.getString("documenttype"));
			applicationDocument.setFileStoreId(rs.getString("noc_doc_filestore"));
			applicationDocument.setDocumentUid(rs.getString("documentUid"));
			applicationDocument.setAdditionalDetails(additionalDetails);
			noc.addDocumentsItem(applicationDocument);
		}
	}

}
