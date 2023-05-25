package org.egov.commons.persistence.repository.rowmapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;

import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.repository.rowmapper.BusinessDetailsRowMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class BusinessDetailsRowMapperTest {

	@Mock
	private ResultSet rs;

	@InjectMocks
	private BusinessDetailsRowMapper detailsRowMapper;

	@Test
    @Ignore
	public void test_should_map_result_set_to_entity() throws Exception {
		Mockito.when(rs.next()).thenReturn(true).thenReturn(false);
		when(rs.getLong("id")).thenReturn(1L);
		when(rs.getString("businessType")).thenReturn("C");
		when(rs.getString("businessUrl")).thenReturn("/receipts/receipt-create.action");
		when(rs.getString("code")).thenReturn("TL");
		when(rs.getString("name")).thenReturn("Trade Licence");
		when(rs.getString("department")).thenReturn("56");
		when(rs.getString("fund")).thenReturn("12");
		when(rs.getString("function")).thenReturn("123");
		when(rs.getString("fundSource")).thenReturn("234");
		when(rs.getString("functionary")).thenReturn("456");
		when((Boolean)rs.getObject("callBackForApportioning")).thenReturn(true);
		when((Boolean) rs.getObject("isEnabled")).thenReturn(true);
		when((Boolean) rs.getObject("isVoucherApproved")).thenReturn(true);
		when((Integer) rs.getObject("ordernumber")).thenReturn(2);
		when(rs.getString("tenantId")).thenReturn("default");
		when((Boolean) rs.getObject("voucherCreation")).thenReturn(true);
		when(rs.getLong("createdBy")).thenReturn(1L);
		when(rs.getLong("lastModifiedBy")).thenReturn(1L);
		when(rs.getTimestamp("createdDate")).thenReturn(null);
		when(rs.getTimestamp("lastModifiedDate")).thenReturn(null);
		when(rs.getTimestamp("voucherCutOffDate")).thenReturn(null);
		when(rs.getLong("category")).thenReturn(1L);
		BusinessDetails actualDetails = detailsRowMapper.mapRow(rs, 1);
		BusinessDetails expectedBusinessDetails = getExpectedBusinessDetails();
		assertThat(expectedBusinessDetails.equals(actualDetails));
	}

	private BusinessDetails getExpectedBusinessDetails() {
		return BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").callBackForApportioning(true).businessCategory(1L).createdBy(1L).lastModifiedBy(1L).build();
	}

}
