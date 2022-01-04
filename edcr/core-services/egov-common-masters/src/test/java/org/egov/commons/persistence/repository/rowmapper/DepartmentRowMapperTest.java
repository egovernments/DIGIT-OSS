package org.egov.commons.persistence.repository.rowmapper;

import org.egov.commons.model.Department;
import org.egov.commons.repository.rowmapper.DepartmentRowMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.ResultSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DepartmentRowMapperTest {

    @Mock
    private ResultSet rs;

    @InjectMocks
    private DepartmentRowMapper categoryRowMapper;

    @Test
    public void test_should_map_result_set_to_entity() throws Exception {
        Mockito.when(rs.next()).thenReturn(true).thenReturn(false);
        when(rs.getLong("id")).thenReturn(1L);
        when(rs.getString("code")).thenReturn("ENG");
        when(rs.getString("name")).thenReturn("Engineering");
        when((Boolean) rs.getObject("active")).thenReturn(true);
        when(rs.getString("tenantId")).thenReturn("default");
        when(rs.getLong("createdBy")).thenReturn(1L);
        when(rs.getTimestamp("createdDate")).thenReturn(null);
        when(rs.getLong("lastModifiedBy")).thenReturn(1L);
        when(rs.getTimestamp("lastModifiedDate")).thenReturn(null);
        Department actualCategory = categoryRowMapper.mapRow(rs, 1);
        Department expectedDepartment = getExpectedDepartment();
        assertThat(expectedDepartment.equals(actualCategory));
    }

    private Department getExpectedDepartment() {
        return Department.builder().id(1L).code("CL").name("Engineering").active(true).tenantId("default")
                .createdBy(1L).lastModifiedBy(1L).build();

    }

}
