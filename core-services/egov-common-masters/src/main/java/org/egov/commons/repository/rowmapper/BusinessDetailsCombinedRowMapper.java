
package org.egov.commons.repository.rowmapper;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessDetails;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.springframework.util.ObjectUtils.isEmpty;

@Component
public class BusinessDetailsCombinedRowMapper implements RowMapper<BusinessDetails>{

	@Override
	public BusinessDetails mapRow(ResultSet rs, int rowNum) throws SQLException {
		final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

	
		BusinessDetails businessDetails=new BusinessDetails();
		businessDetails.setId(rs.getLong("bd_id"));
		businessDetails.setBusinessType(rs.getString("bd_type"));
		businessDetails.setBusinessUrl(rs.getString("bd_url"));
		businessDetails.setCode(rs.getString("bd_code"));
		businessDetails.setName(rs.getString("bd_name"));
		businessDetails.setDepartment(rs.getString("bd_department"));
		businessDetails.setFund(rs.getString("bd_fund"));
		businessDetails.setFunction(rs.getString("bd_function"));
		businessDetails.setFunctionary(rs.getString("bd_functionary"));
		businessDetails.setFundSource(rs.getString("bd_fundsource"));
		businessDetails.setCallBackForApportioning((Boolean)rs.getObject("bd_callback"));
		businessDetails.setIsEnabled((Boolean)rs.getObject("bd_enabled"));
		businessDetails.setIsVoucherApproved((Boolean)rs.getObject("bd_is_Vou_approved"));
		businessDetails.setOrdernumber((Integer)rs.getObject("bd_ordernumber"));
		businessDetails.setTenantId(rs.getString("bd_tenant"));
		businessDetails.setVoucherCreation((Boolean)rs.getObject("bd_vouc_creation"));
        businessDetails.setVoucherCutoffDate(rs.getLong("bd_vou_cutoffdate"));
		BusinessAccountDetails accountDetails=new BusinessAccountDetails();
		accountDetails.setId((Long)rs.getObject("bad_id"));
		accountDetails.setAmount((Double)rs.getObject("bad_amount"));
		accountDetails.setChartOfAccount(rs.getLong("bad_chartofacc"));
		accountDetails.setTenantId(rs.getString("bad_tenant"));
		accountDetails.setBusinessDetails(rs.getLong("bd_id"));
		
		
		BusinessAccountSubLedgerDetails subledger=new BusinessAccountSubLedgerDetails();
		subledger.setId((Long)rs.getObject("basd_id"));
		subledger.setAccountDetailKey(rs.getLong("basd_detailkey"));
		subledger.setAccountDetailType(rs.getLong("basd_detailtype"));
		subledger.setAmount((Double)rs.getObject("basd_amount"));
		subledger.setTenantId(rs.getString("basd_tenant"));
		BusinessAccountDetails accountDetail=new BusinessAccountDetails();
		accountDetail.setId((Long)rs.getObject("bad_id"));
		subledger.setBusinessAccountDetail(accountDetail);
        List<BusinessAccountSubLedgerDetails>subledgered=new ArrayList<>();
        subledgered.add(subledger);
		accountDetails.setSubledgerDetails(subledgered);
		List<BusinessAccountDetails> details=new ArrayList<>();
		details.add(accountDetails);
	    businessDetails.setBusinessCategory(rs.getLong("bd_category"));
	    businessDetails.setAccountDetails(details);
		
        return businessDetails;
	}

}

