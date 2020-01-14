package org.egov.pt.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.egov.pt.models.*;
import org.egov.pt.models.Assessment.Source;
import org.egov.pt.models.enums.OccupancyType;
import org.egov.pt.models.enums.Status;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AssessmentRowMapper implements ResultSetExtractor<List<Assessment>> {


	@Autowired
	private ObjectMapper mapper;

	@Override
	public List<Assessment> extractData(ResultSet rs) throws SQLException, DataAccessException {


		Map<String, Assessment> assessmentMap = new HashMap<>();
		while(rs.next()) {
			String currentAssessmentId = rs.getString("ass_assessmentid");
			Assessment assessment = assessmentMap.get(currentAssessmentId);
			if(null == assessment) {
				assessment = Assessment.builder()
						.id(rs.getString("ass_assessmentid"))
						.assessmentNumber(rs.getString("ass_assessmentnumber"))
						.status(Status.valueOf(rs.getString("ass_status")))
						.tenantId(rs.getString("ass_tenantid"))
						.assessmentDate(rs.getLong("ass_assessmentdate"))
						.financialYear(rs.getString("ass_financialyear"))
						.propertyID(rs.getString("ass_propertyid"))
						.source(Source.valueOf(rs.getString("ass_source")))
						.unitUsageList(new ArrayList<>())
						.documents(new HashSet<>()).build();

				try {
					PGobject obj = (PGobject) rs.getObject("ass_additionaldetails");
					if (obj != null) {
						JsonNode propertyAdditionalDetails = mapper.readTree(obj.getValue());
						assessment.setAdditionalDetails(propertyAdditionalDetails);
					}
				} catch (IOException e) {
					throw new CustomException("PARSING ERROR", "The assessment additionaldetails json cannot be parsed");
				}
				assessment.getUnitUsageList().add(getUnitUsage(rs));
				assessment.getDocuments().add(getDocument(rs));

				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("ass_createdby"))
						.createdTime(rs.getLong("ass_createdtime")).lastModifiedBy(rs.getString("ass_lastmodifiedby"))
						.lastModifiedTime(rs.getLong("ass_lastmodifiedtime")).build();
				assessment.setAuditDetails(auditDetails);

				assessmentMap.put(assessment.getId(), assessment);
			}else {
				assessment.getUnitUsageList().add(getUnitUsage(rs));
				assessment.getDocuments().add(getDocument(rs));
			}
		}

		return new ArrayList<>(assessmentMap.values());
	}



	private UnitUsage getUnitUsage(ResultSet rs) throws SQLException {
		if(null == rs.getString("uus_id"))
			return null;

		AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("uus_createdby"))
				.createdTime(rs.getLong("uus_createdtime")).lastModifiedBy(rs.getString("uus_lastmodifiedby"))
				.lastModifiedTime(rs.getLong("uus_lastmodifiedtime")).build();


		return UnitUsage.builder().id(rs.getString("uus_id"))
				.occupancyDate(rs.getLong("uus_occupancydate"))
				.occupancyType((OccupancyType.valueOf(rs.getString("uus_occupancytype"))))
				.usageCategory(rs.getString("uus_usagecategory"))
				.active(rs.getBoolean("uus_active"))
				.auditDetails(auditDetails)
				.build();
	}



	private Document getDocument(ResultSet rs) throws SQLException {
		if(null == rs.getString("doc_id"))
			return null;

		AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("doc_createdby"))
				.createdTime(rs.getLong("doc_createdtime")).lastModifiedBy(rs.getString("doc_lastmodifiedby"))
				.lastModifiedTime(rs.getLong("doc_lastmodifiedtime")).build();

		return Document.builder().id(rs.getString("doc_id"))
				.status(Status.valueOf(rs.getString("doc_status")))
				.documentType(rs.getString("doc_documenttype"))
				.documentUid(rs.getString("doc_documentuid"))
				.fileStore(rs.getString("doc_filestore"))
				.auditDetails(auditDetails)
				.build();
	}



}
