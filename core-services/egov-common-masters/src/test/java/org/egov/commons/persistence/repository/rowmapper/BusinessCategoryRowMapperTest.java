package org.egov.commons.persistence.repository.rowmapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;

import org.egov.commons.model.BusinessCategory;
import org.egov.commons.repository.rowmapper.BusinessCategoryRowMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class BusinessCategoryRowMapperTest {

	@Mock
	private ResultSet rs;

	@InjectMocks
	private BusinessCategoryRowMapper categoryRowMapper;

	@Test
    @Ignore
	public void test_should_map_result_set_to_entity() throws Exception {
		Mockito.when(rs.next()).thenReturn(true).thenReturn(false);
		when(rs.getLong("id")).thenReturn(1L);
		when(rs.getString("code")).thenReturn("CL");
		when(rs.getString("name")).thenReturn("Collection");
		when((Boolean) rs.getObject("active")).thenReturn(true);
		when(rs.getString("tenantId")).thenReturn("default");
		when(rs.getLong("createdBy")).thenReturn(1L);
		when(rs.getTimestamp("createdDate")).thenReturn(null);
		when(rs.getLong("lastModifiedBy")).thenReturn(1L);
		when(rs.getTimestamp("lastModifiedDate")).thenReturn(null);
		BusinessCategory actualCategory = categoryRowMapper.mapRow(rs, 1);
		BusinessCategory expectedBusinessCategory = getExpectedBusinessCategory();
		assertThat(expectedBusinessCategory.equals(actualCategory));
	}

	private BusinessCategory getExpectedBusinessCategory() {
		return BusinessCategory.builder().id(1L).code("CL").name("Collection").isactive(true).tenantId("default")
				.createdBy(1L).lastModifiedBy(1L).build();

	}

}
