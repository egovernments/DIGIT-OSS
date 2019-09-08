package org.egov.commons.persistence.repository.rowmapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.repository.rowmapper.BusinessAccountSubledgerDetailsRowMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class BusinessAccountSubledgerDetailsTest {
	@Mock
	private ResultSet rs;

	@InjectMocks
	private BusinessAccountSubledgerDetailsRowMapper subledgerDetailsRowMapper;

	@Test
    @Ignore
	public void test_should_map_result_set_to_entity() throws Exception {
		Mockito.when(rs.next()).thenReturn(true).thenReturn(false);

		when(rs.getLong("id")).thenReturn(1L);
		when(rs.getLong("accountDetailKey")).thenReturn(57L);
		when(rs.getLong("accountDetailType")).thenReturn(89L);
		when(rs.getDouble("amount")).thenReturn(1000.0);
		when(rs.getString("tenantId")).thenReturn("default");
		when(rs.getLong("businessAccountDetail")).thenReturn(1L);

		BusinessAccountSubLedgerDetails actualAccountSubledgerDetails = subledgerDetailsRowMapper.mapRow(rs, 1);
		BusinessAccountSubLedgerDetails expectedBusinessAccountSubledgerDetails = getExpectedBusinessAccountSubledgerDetails();
		assertThat(expectedBusinessAccountSubledgerDetails.equals(actualAccountSubledgerDetails));
	}

	private BusinessAccountSubLedgerDetails getExpectedBusinessAccountSubledgerDetails() {
		BusinessAccountDetails businessAccountDetails = BusinessAccountDetails.builder().id(1L).build();
		return BusinessAccountSubLedgerDetails.builder().id(1L).amount(1000.0).accountDetailKey(57L)
				.accountDetailType(89L).tenantId("default").businessAccountDetail(businessAccountDetails).build();
	}
}
