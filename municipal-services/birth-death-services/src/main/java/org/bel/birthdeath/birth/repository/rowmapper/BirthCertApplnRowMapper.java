package org.bel.birthdeath.birth.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.birth.certmodel.BirthCertAppln;
import org.egov.tracer.model.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class BirthCertApplnRowMapper implements ResultSetExtractor<List<BirthCertAppln>> {

	@Override
	public List<BirthCertAppln> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, BirthCertAppln> birthDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String applNo = rs.getString("birthCertificateNo");
				BirthCertAppln certReq = birthDtlMap.get(applNo);

				if (certReq == null) {
					certReq = BirthCertAppln.builder().applicationNumber(rs.getString("birthCertificateNo")).applicationDate(rs.getString("createdtime"))
							.status(rs.getString("status")).regNo(rs.getString("registrationno")).tenantId(rs.getString("tenantid")).name(rs.getString("name"))
							.applicationCategory("Birth").applicationType("CERT_DOWNLOAD").fileStoreId(rs.getString("filestoreid"))
							.build();
					birthDtlMap.put(applNo, certReq);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<> (birthDtlMap.values());
	}

}
