package org.egov.pt.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pt.web.models.AuditDetails;
import org.egov.pt.web.models.Draft;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
@Slf4j
public class DraftsRowMapper implements RowMapper<Draft> {

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public Draft mapRow(ResultSet resultSet, int i) throws SQLException {
		AuditDetails auditDetails = AuditDetails.builder().createdBy(resultSet.getString("createdby")).createdTime(resultSet.getLong("createdTime"))
				.lastModifiedBy(resultSet.getString("lastmodifiedby")).lastModifiedTime(resultSet.getLong("lastmodifiedtime"))
				.build();

		PGobject obj = (PGobject) resultSet.getObject("draft");
		try {
			JsonNode pGDraft = objectMapper.readTree( obj.getValue());
			return Draft.builder()
					.id(resultSet.getString("id"))
					.isActive(resultSet.getBoolean("isActive"))
					.userId(resultSet.getString("userId"))
					.tenantId(resultSet.getString("tenantId"))
					.assessmentNumber(resultSet.getString("assessmentNumber"))
					.draftRecord(pGDraft)
					.auditDetails(auditDetails).build();
		} catch (Exception e) {
			throw new CustomException("SERVER_ERROR","Exception occured while parsing the draft json : "+ e.getMessage());
		}
	}

//	public List<Draft> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
//		Map<String, Draft> draftsMap = new HashMap<>();
//		ObjectMapper mapper = new ObjectMapper();
//		while(resultSet.next()) {
//			String currentId = resultSet.getString("id");
//			Draft currentDraft = draftsMap.get(currentId);
//			if(null == currentDraft) {
//				AuditDetails auditDetails = AuditDetails.builder().createdBy(resultSet.getString("createdby")).createdTime(resultSet.getLong("createdTime"))
//						.lastModifiedBy(resultSet.getString("lastmodifiedby")).lastModifiedTime(resultSet.getLong("lastmodifiedtime")).build();
//
//				PGobject obj = (PGobject) resultSet.getObject("draft");
//                try {
//                    JsonNode pGDraft = mapper.readTree( obj.getValue());
//                    currentDraft = Draft.builder().id(resultSet.getString("id")).userId(resultSet.getString("userId")).tenantId(resultSet.getString("tenantId"))
//                            .draftRecord(pGDraft)
//                            .auditDetails(auditDetails).build();
//                } catch (Exception e) {
//                    throw new CustomException("SERVER_ERROR","Exception occured while parsing the draft json : "+ e.getMessage());
//                }
//
//				draftsMap.put(currentId, currentDraft);
//			}
//		}
//		return new ArrayList<>(draftsMap.values());
//
//	}

}
