package org.bel.birthdeath.birth.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.birth.certmodel.BirthCertificate;
import org.bel.birthdeath.birth.certmodel.BirthCertificate.StatusEnum;
import org.bel.birthdeath.common.model.AuditDetails;
import org.egov.tracer.model.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class BirthCertRowMapper implements ResultSetExtractor<List<BirthCertificate>> {

	@Override
	public List<BirthCertificate> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, BirthCertificate> birthDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String id = rs.getString("id");
				BirthCertificate certReq = birthDtlMap.get(id);

				if (certReq == null) {
					certReq = BirthCertificate.builder().id(id).filestoreid(rs.getString("filestoreid")).applicationStatus(StatusEnum.fromValue(rs.getString("applicationStatus")))
							.birthDtlId(rs.getString("birthDtlId")).tenantId(rs.getString("tenantId")).birthCertificateNo(rs.getString("birthCertificateNo"))
							.embeddedUrl(rs.getString("embeddedUrl")).dateofissue(rs.getLong("dateofissue"))
							.auditDetails(AuditDetails.builder().createdBy(rs.getString("createdBy")).createdTime(rs.getLong("createdTime")).build())
							.build();
					birthDtlMap.put(id, certReq);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<BirthCertificate> (birthDtlMap.values());
	}

}
