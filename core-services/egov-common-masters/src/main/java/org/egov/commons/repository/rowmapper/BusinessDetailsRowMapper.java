package org.egov.commons.repository.rowmapper;

import org.egov.commons.model.BusinessDetails;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.springframework.util.ObjectUtils.isEmpty;

@Component
public class BusinessDetailsRowMapper implements RowMapper<BusinessDetails> {
	final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

	@Override
	public BusinessDetails mapRow(ResultSet rs, int rowNum) throws SQLException {

		BusinessDetails businessDetails = new BusinessDetails();
		businessDetails.setId(rs.getLong("id"));
		businessDetails.setBusinessType(rs.getString("businessType"));
		businessDetails.setBusinessUrl(rs.getString("businessUrl"));
		businessDetails.setCode(rs.getString("code"));
		businessDetails.setName(rs.getString("name"));
		businessDetails.setDepartment(rs.getString("department"));
		businessDetails.setFund(rs.getString("fund"));
		businessDetails.setFunction(rs.getString("function"));
		businessDetails.setFunctionary(rs.getString("functionary"));
		businessDetails.setFundSource(rs.getString("fundsource"));
		businessDetails.setIsEnabled((Boolean) rs.getObject("isEnabled"));
		businessDetails.setCallBackForApportioning((Boolean) rs.getObject("callBackForApportioning"));
		businessDetails.setIsVoucherApproved((Boolean) rs.getObject("isVoucherApproved"));
		businessDetails.setOrdernumber((Integer) rs.getObject("ordernumber"));
		businessDetails.setTenantId(rs.getString("tenantId"));
		businessDetails.setVoucherCreation((Boolean) rs.getObject("voucherCreation"));
		try {
			Date date = isEmpty(rs.getDate("voucherCutOffDate")) ? null
					: sdf.parse(sdf.format(rs.getDate("voucherCutOffDate")));
			businessDetails.setVoucherCutoffDate(date != null ? date.getTime() : null);
		} catch (ParseException e) {
			e.printStackTrace();
			throw new SQLException("Parse exception while parsing date");
		}

		businessDetails.setCreatedBy(rs.getLong("createdBy"));
		businessDetails.setLastModifiedBy(rs.getLong("lastModifiedBy"));

		businessDetails.setBusinessCategory(rs.getLong("id"));
		return businessDetails;
	}
}
