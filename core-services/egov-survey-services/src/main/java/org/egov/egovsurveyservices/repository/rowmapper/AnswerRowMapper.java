package org.egov.egovsurveyservices.repository.rowmapper;

import org.egov.egovsurveyservices.web.models.Answer;
import org.egov.egovsurveyservices.web.models.AuditDetails;
import org.egov.egovsurveyservices.web.models.Question;
import org.egov.egovsurveyservices.web.models.SurveyEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Component
public class AnswerRowMapper implements ResultSetExtractor<List<Answer>> {
    public List<Answer> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String,Answer> answerMap = new LinkedHashMap<>();

        while (rs.next()){
            String uuid = rs.getString("uuid");
            Answer answer = answerMap.get(uuid);

            if(answer == null) {

                Long lastModifiedTime = rs.getLong("lastmodifiedtime");
                if (rs.wasNull()) {
                    lastModifiedTime = null;
                }

                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("createdby"))
                        .createdTime(rs.getLong("createdtime"))
                        .lastModifiedBy(rs.getString("lastmodifiedby"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();

                answer = Answer.builder()
                        .uuid(rs.getString("uuid"))
                        .questionId(rs.getString("questionid"))
                        .answer(Arrays.asList(rs.getString("answer").split(",")))
                        .citizenId(rs.getString("citizenid"))
                        .auditDetails(auditdetails)
                        .build();
            }

            answerMap.put(uuid, answer);
        }
        return new ArrayList<>(answerMap.values());
    }

}
