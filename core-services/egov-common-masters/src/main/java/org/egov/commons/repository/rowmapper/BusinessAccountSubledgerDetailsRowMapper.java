package org.egov.commons.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BusinessAccountSubledgerDetailsRowMapper implements RowMapper<BusinessAccountSubLedgerDetails> {

	@Override
	public BusinessAccountSubLedgerDetails mapRow(ResultSet rs, int rowNum) throws SQLException {

		BusinessAccountDetails businessAccountDetail = new BusinessAccountDetails();
		businessAccountDetail.setId(rs.getLong("id"));

		BusinessAccountSubLedgerDetails subledger = new BusinessAccountSubLedgerDetails();
		subledger.setId(rs.getLong("id"));
		subledger.setAccountDetailKey(rs.getLong("accountDetailKey"));
		subledger.setAccountDetailType(rs.getLong("accountDetailType"));
		subledger.setAmount(rs.getDouble("amount"));
		subledger.setTenantId(rs.getString("tenantId"));
		subledger.setBusinessAccountDetail(businessAccountDetail);
		return subledger;
	}

}
