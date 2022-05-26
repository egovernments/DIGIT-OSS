package org.bel.birthdeath.common.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.common.model.EgHospitalDtl;
import org.egov.tracer.model.CustomException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class CommonRowMapper implements ResultSetExtractor<List<EgHospitalDtl>> {

	@Override
	public List<EgHospitalDtl> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, EgHospitalDtl> hospitalDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String hospitalId = rs.getString("id");
				EgHospitalDtl hospitalDtl = hospitalDtlMap.get(hospitalId);

				if (hospitalDtl == null) {
					hospitalDtl = EgHospitalDtl.builder().id(hospitalId).name(rs.getString("hospitalname"))
							.tenantid(rs.getString("tenantid"))
							.build();
					hospitalDtlMap.put(hospitalId, hospitalDtl);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<>(hospitalDtlMap.values());
	}

}
