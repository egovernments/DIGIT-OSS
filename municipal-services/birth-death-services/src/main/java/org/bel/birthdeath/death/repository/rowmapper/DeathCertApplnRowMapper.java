package org.bel.birthdeath.death.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.death.certmodel.DeathCertAppln;
import org.egov.tracer.model.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class DeathCertApplnRowMapper implements ResultSetExtractor<List<DeathCertAppln>> {

	@Override
	public List<DeathCertAppln> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, DeathCertAppln> deathDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String applNo = rs.getString("deathCertificateNo");
				DeathCertAppln certReq = deathDtlMap.get(applNo);

				if (certReq == null) {
					certReq = DeathCertAppln.builder().applicationNumber(rs.getString("deathCertificateNo")).applicationDate(rs.getString("createdtime"))
							.status(rs.getString("status")).regNo(rs.getString("registrationno")).tenantId(rs.getString("tenantid")).name(rs.getString("name"))
							.applicationCategory("Death").applicationType("CERT_DOWNLOAD").fileStoreId(rs.getString("filestoreid"))
							.build();
					deathDtlMap.put(applNo, certReq);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<> (deathDtlMap.values());
	}

}
