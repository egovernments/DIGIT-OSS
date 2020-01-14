package org.egov.pt.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.pt.models.Assessment;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.Document;
import org.egov.pt.models.Unit;
import org.egov.pt.models.enums.OccupancyType;
import org.egov.pt.models.enums.Source;
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
						.propertyId(rs.getString("ass_propertyid"))
						.source(Source.valueOf(rs.getString("ass_source")))
						.documents(new ArrayList<>()).build();
				
				try {
					PGobject obj = (PGobject) rs.getObject("ass_additionaldetails");
					if (obj != null) {
						JsonNode propertyAdditionalDetails = mapper.readTree(obj.getValue());
						assessment.setAdditionalDetails(propertyAdditionalDetails);
					}
				} catch (IOException e) {
					throw new CustomException("PARSING ERROR", "The assessment additionaldetails json cannot be parsed");
				}
				assessment.getDocuments().add(getDocument(rs));
				
				AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("ass_createdby"))
						.createdTime(rs.getLong("ass_createdtime")).lastModifiedBy(rs.getString("ass_lastmodifiedby"))
						.lastModifiedTime(rs.getLong("ass_lastmodifiedtime")).build();
				assessment.setAuditDetails(auditDetails);
				
				assessmentMap.put(assessment.getId(), assessment);
			}else {
				assessment.getDocuments().add(getDocument(rs));
			}
		}

		return new ArrayList<>(assessmentMap.values());
	}
	
	
	
	private Unit getUnit(ResultSet rs) throws SQLException {
		if(null == rs.getString("unit_id"))
			return null;
		
		AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("unit_createdby"))
				.createdTime(rs.getLong("unit_createdtime")).lastModifiedBy(rs.getString("unit_lastmodifiedby"))
				.lastModifiedTime(rs.getLong("unit_lastmodifiedtime")).build();
				
		
		return Unit.builder().id(rs.getString("unit_id"))
				.floorNo(rs.getString("unit_floorno"))
				.occupancyDate(rs.getLong("unit_occupancydate"))
				.occupancyType((OccupancyType.valueOf(rs.getString("unit_occupancytype"))))
				.usageCategory(rs.getString("unit_usagecategory"))
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
				.build();
	}
	
	

}
