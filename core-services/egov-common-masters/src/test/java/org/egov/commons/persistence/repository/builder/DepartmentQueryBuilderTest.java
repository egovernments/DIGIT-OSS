package org.egov.commons.persistence.repository.builder;

import org.egov.commons.repository.builder.DepartmentQueryBuilder;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;


public class DepartmentQueryBuilderTest {

    @Test
    public void no_input_test() {
        String searchPageSize = "500";
        DepartmentGetRequest departmentGetRequest = new DepartmentGetRequest();

        DepartmentQueryBuilder builder = new DepartmentQueryBuilder(searchPageSize);
        assertEquals(
                "SELECT id, name, code, active, tenantId, createdBy, createdDate, lastModifiedBy,"
                        + " lastModifiedDate FROM eg_department ORDER BY name ASC LIMIT ? OFFSET ?",

                builder.getQuery(departmentGetRequest, new ArrayList<>()));
    }

    @Test
    public void all_input_test() {
        String searchPageSize = "500";
        DepartmentGetRequest departmentGetRequest = new DepartmentGetRequest();
        DepartmentQueryBuilder builder = new DepartmentQueryBuilder(searchPageSize);
        List<String> names = new ArrayList<>(); names.add("Health");
        departmentGetRequest.setNames(names);
        departmentGetRequest.setActive(true);
        departmentGetRequest.setId(Arrays.asList(1L));
        departmentGetRequest.setTenantId("default");
        departmentGetRequest.setSortBy("code");
        departmentGetRequest.setSortOrder("DESC");
        departmentGetRequest.setPageSize((short) 700);
        departmentGetRequest.setPageNumber((short) 300);

        assertEquals(
                "SELECT id, name, code, active, tenantId, createdBy, createdDate, lastModifiedBy,"
                        + " lastModifiedDate FROM eg_department"
                        + " WHERE tenantId = ? AND id IN (1) AND name = ? AND active = ? ORDER BY code DESC LIMIT ? OFFSET ?",
                builder.getQuery(departmentGetRequest, new ArrayList<>()));
    }
}
