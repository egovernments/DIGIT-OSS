package org.egov.commons.persistence.repository.rowmapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;

import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.repository.rowmapper.BusinessAccountDetailsRowMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class BusinessAccountDetailsRowMapperTest {

	@Mock
	private ResultSet rs;

	@InjectMocks
	private BusinessAccountDetailsRowMapper accountDetailsRowMapper;

	@Test
    @Ignore
	public void test_should_map_result_set_to_entity() throws Exception {
		Mockito.when(rs.next()).thenReturn(true).thenReturn(false);
		when(rs.getLong("id")).thenReturn(1L);
		when(rs.getDouble("amount")).thenReturn(1000.0);
		when(rs.getLong("chartOfAccount")).thenReturn(56L);
		when(rs.getString("tenantId")).thenReturn("default");
		when((Long) rs.getObject("businessDetails")).thenReturn(1L);

		BusinessAccountDetails actualAccountDetails = accountDetailsRowMapper.mapRow(rs, 1);
		BusinessAccountDetails expectedBusinessAccountDetails = getExpectedBusinessAccountDetails();
		assertThat(expectedBusinessAccountDetails.equals(actualAccountDetails));
	}

	private BusinessAccountDetails getExpectedBusinessAccountDetails() {
		return BusinessAccountDetails.builder().id(1L).amount(1000.0).chartOfAccount(56L).tenantId("default")
				.businessDetails(1L).build();
	}

}
