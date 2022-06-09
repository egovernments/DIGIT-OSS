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
					certReq = BirthCertificate.builder().id(id).source(rs.getString("source")).filestoreid(rs.getString("filestoreid")).applicationStatus(StatusEnum.fromValue(rs.getString("status")))
							.birthDtlId(rs.getString("birthdtlid")).tenantId(rs.getString("tenantid")).birthCertificateNo(rs.getString("birthcertificateno"))
							.embeddedUrl(rs.getString("embeddedurl")).dateofissue(rs.getLong("dateofissue"))
							.auditDetails(AuditDetails.builder().createdBy(rs.getString("createdBy")).createdTime(rs.getLong("createdtime")).build())
							.build();
					birthDtlMap.put(id, certReq);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<> (birthDtlMap.values());
	}

}
