package org.egov.bpa.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.egov.bpa.web.model.AuditDetails;
import org.egov.bpa.web.model.BPA;
import org.egov.bpa.web.model.Document;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

@Component
@Slf4j
public class BPARowMapper implements ResultSetExtractor<List<BPA>> {

	@Autowired
	private ObjectMapper mapper;

	/**
	 * extract the data from the resultset and prepare the BPA Object
	 * @see org.springframework.jdbc.core.ResultSetExtractor#extractData(java.sql.ResultSet)
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public List<BPA> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, BPA> buildingMap = new LinkedHashMap<String, BPA>();

		while (rs.next()) {
			String id = rs.getString("bpa_id");
			String applicationNo = rs.getString("applicationno");
			String approvalNo = rs.getString("approvalNo");
			BPA currentbpa = buildingMap.get(id);
			String tenantId = rs.getString("bpa_tenantId");
			if (currentbpa == null) {
				Long lastModifiedTime = rs.getLong("bpa_lastModifiedTime");
				if (rs.wasNull()) {
					lastModifiedTime = null;
				}

				Object additionalDetails = new Gson().fromJson(rs.getString("additionalDetails").equals("{}")
						|| rs.getString("additionalDetails").equals("null") ? null : rs.getString("additionalDetails"),
						Object.class);
				
				AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("bpa_createdBy"))
						.createdTime(rs.getLong("bpa_createdTime")).lastModifiedBy(rs.getString("bpa_lastModifiedBy"))
						.lastModifiedTime(lastModifiedTime).build();


				currentbpa = BPA.builder()
						.auditDetails(auditdetails)
						.applicationNo(applicationNo)
						.status(rs.getString("status"))
						.tenantId(tenantId)
						.approvalNo(approvalNo)
						.edcrNumber(rs.getString("edcrnumber"))
						.approvalDate(rs.getLong("approvalDate"))
						.accountId(rs.getString("accountId"))
						.landId(rs.getString("landId"))
						.applicationDate(rs.getLong("applicationDate"))
						.id(id)
						.additionalDetails(additionalDetails)
						.businessService(rs.getString("businessService"))
						.build();

				buildingMap.put(id, currentbpa);
			}
			addChildrenToProperty(rs, currentbpa);

		}

		return new ArrayList<>(buildingMap.values());

	}

	/**
	 * add child objects to the BPA fro the results set
	 * @param rs
	 * @param bpa
	 * @throws SQLException
	 */
	@SuppressWarnings("unused")
	private void addChildrenToProperty(ResultSet rs, BPA bpa) throws SQLException {

		String tenantId = bpa.getTenantId();
		AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("bpa_createdBy"))
				.createdTime(rs.getLong("bpa_createdTime")).lastModifiedBy(rs.getString("bpa_lastModifiedBy"))
				.lastModifiedTime(rs.getLong("bpa_lastModifiedTime")).build();

		if (bpa == null) {
			PGobject pgObj = (PGobject) rs.getObject("additionaldetail");
			JsonNode additionalDetail = null;
			try {
				additionalDetail = mapper.readTree(pgObj.getValue());
			} catch (IOException e) {
				log.error("Failed to parse additionalDetails",e);
			}
			bpa.setAdditionalDetails(additionalDetail);
		}


		String documentId = rs.getString("bpa_doc_id");
		Object docDetails = null;
		if(rs.getString("doc_details") != null) {
			docDetails = new Gson().fromJson(rs.getString("doc_details").equals("{}")
					|| rs.getString("doc_details").equals("null") ? null : rs.getString("doc_details"),
					Object.class);
		}
		
		if (documentId != null) {
			Document document = Document.builder().documentType(rs.getString("bpa_doc_documenttype"))
					.fileStoreId(rs.getString("bpa_doc_filestore"))
					.id(documentId)
					.additionalDetails(docDetails)
					.documentUid(rs.getString("documentUid")).build();
			bpa.addDocumentsItem(document);
		}
	}
}
