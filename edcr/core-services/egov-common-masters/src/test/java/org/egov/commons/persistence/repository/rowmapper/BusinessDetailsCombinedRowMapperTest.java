package org.egov.commons.persistence.repository.rowmapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.repository.rowmapper.BusinessDetailsCombinedRowMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class BusinessDetailsCombinedRowMapperTest {
	@Mock
	private ResultSet rs;

	@InjectMocks
	private BusinessDetailsCombinedRowMapper detailsCombinedRowMapper;

	@Test
    @Ignore
	public void test_should_map_result_set_to_entity() throws Exception {
		Mockito.when(rs.next()).thenReturn(true).thenReturn(false);
		when(rs.getLong("bd_id")).thenReturn(1L);
		when(rs.getString("bd_type")).thenReturn("C");
		when(rs.getString("bd_url")).thenReturn("/receipts/receipt-create.action");
		when(rs.getString("bd_code")).thenReturn("TL");
		when(rs.getString("bd_name")).thenReturn("Trade Licence");
		when(rs.getString("bd_department")).thenReturn("56");
		when(rs.getString("bd_fund")).thenReturn("12");
		when(rs.getString("bd_function")).thenReturn("123");
		when(rs.getString("bd_fundsource")).thenReturn("234");
		when(rs.getString("bd_functionary")).thenReturn("456");
		when((Boolean) rs.getObject("bd_enabled")).thenReturn(true);
		when((Boolean)rs.getObject("bd_callback")).thenReturn(true);
		when((Boolean) rs.getObject("bd_is_Vou_approved")).thenReturn(true);
		when((Integer) rs.getObject("bd_ordernumber")).thenReturn(2);
		when(rs.getString("bd_tenant")).thenReturn("default");
		when((Boolean) rs.getObject("bd_vouc_creation")).thenReturn(true);
		when(rs.getLong("bd_createdby")).thenReturn(1L);
		when(rs.getLong("bd_lastmodifiedby")).thenReturn(1L);
		when(rs.getTimestamp("bd_createddate")).thenReturn(null);
		when(rs.getTimestamp("bd_lastmodifieddate")).thenReturn(null);
		when(rs.getTimestamp("bd_vou_cutoffdate")).thenReturn(null);
		when(rs.getLong("bd_category")).thenReturn(1L);
		when((Long) rs.getObject("bad_id")).thenReturn(1L);
		when((Double) rs.getObject("bad_amount")).thenReturn(1000.0);
		when(rs.getLong("bad_chartofacc")).thenReturn(56L);
		when(rs.getString("bad_tenant")).thenReturn("default");
		when((Long) rs.getObject("basd_id")).thenReturn(1L);
		when(rs.getLong("basd_detailkey")).thenReturn(56L);
		when(rs.getLong("basd_detailtype")).thenReturn(89L);
		when((Double) rs.getObject("basd_amount")).thenReturn(10000.0);
		when(rs.getString("basd_tenant")).thenReturn("default");
		BusinessDetails actualDetails = detailsCombinedRowMapper.mapRow(rs, 1);
		BusinessDetails expectedBusinessDetails = getExpectedBusinessDetails();
		assertThat(expectedBusinessDetails.equals(actualDetails));
	}

	private BusinessDetails getExpectedBusinessDetails() {
		BusinessDetails businessDetails = new BusinessDetails();
		businessDetails.setId(1L);
		businessDetails.setBusinessType("C");
		businessDetails.setBusinessUrl("/receipts/receipt-create.action");
		businessDetails.setCode("TL");
		businessDetails.setName("Trade Licence");
		businessDetails.setDepartment("56");
		businessDetails.setFund("12");
		businessDetails.setCallBackForApportioning(true);
		businessDetails.setFunction("123");
		businessDetails.setFunctionary("456");
		businessDetails.setFundSource("234");
		businessDetails.setIsEnabled(true);
		businessDetails.setIsVoucherApproved(true);
		businessDetails.setOrdernumber(2);
		businessDetails.setTenantId("default");
		businessDetails.setVoucherCreation(true);
		businessDetails.setCreatedBy(1L);
		businessDetails.setCreatedDate(null);
		businessDetails.setLastModifiedBy(1L);
		businessDetails.setLastModifiedDate(null);
		businessDetails.setVoucherCutoffDate(null);

		BusinessAccountDetails accountDetails = new BusinessAccountDetails();
		accountDetails.setId(1L);
		accountDetails.setAmount(1000.0);
		accountDetails.setChartOfAccount(56L);
		accountDetails.setTenantId("default");
		accountDetails.setBusinessDetails(1L);

		BusinessAccountSubLedgerDetails subledger = new BusinessAccountSubLedgerDetails();
		subledger.setId(1L);
		subledger.setAccountDetailKey(56L);
		subledger.setAccountDetailType(89L);
		subledger.setAmount(10000.0);
		subledger.setTenantId("default");
		BusinessAccountDetails accountDetail = new BusinessAccountDetails();
		accountDetail.setId(1L);
		subledger.setBusinessAccountDetail(accountDetail);
		List<BusinessAccountSubLedgerDetails> subledgered = new ArrayList<>();
		subledgered.add(subledger);
		accountDetails.setSubledgerDetails(subledgered);
		List<BusinessAccountDetails> details = new ArrayList<>();
		details.add(accountDetails);
		businessDetails.setBusinessCategory(1L);
		businessDetails.setAccountDetails(details);

		return businessDetails;
	}

}
