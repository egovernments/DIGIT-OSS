package org.egov.commons.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessDetails;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BusinessAccountDetailsRowMapper implements RowMapper<BusinessAccountDetails> {
	@Override
	public BusinessAccountDetails mapRow(ResultSet rs, int rowNum) throws SQLException {

		BusinessAccountDetails accountDetails = new BusinessAccountDetails();
		accountDetails.setId(rs.getLong("id"));
		accountDetails.setAmount(rs.getDouble("amount"));
		accountDetails.setChartOfAccount(rs.getLong("chartOfAccount"));
		accountDetails.setTenantId(rs.getString("tenantId"));
		accountDetails.setBusinessDetails((Long) rs.getObject("businessDetails"));
		return accountDetails;
	}

}
