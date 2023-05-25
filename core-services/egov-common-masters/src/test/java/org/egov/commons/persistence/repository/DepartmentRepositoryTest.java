package org.egov.commons.persistence.repository;

import org.egov.commons.model.Department;
import org.egov.commons.repository.DepartmentRepository;
import org.egov.commons.repository.builder.DepartmentQueryBuilder;
import org.egov.commons.repository.rowmapper.DepartmentRowMapper;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DepartmentRepositoryTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private DepartmentRowMapper departmentRowMapper;

    @Mock
    private DepartmentQueryBuilder departmentQueryBuilder;

    @InjectMocks
    private DepartmentRepository departmentRepository;

    @Test
    public void test_should_save_serviceCategory_inDB() {

        when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);

    }

    @Test
    public void test_should_update_serviceCategory_inDB() {

        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelServiceCategories());
        when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);

    }

    private Department getDepartmentModelForUpdate() {
        Department category = Department.builder().id(1L).code("CLS").name("Collections").active(true)
                .tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
        return category;
    }

    @Test
    public void test_should_get_All_ServiceCategories_As_per_Criteria() {
        when(departmentQueryBuilder.getQuery(any(DepartmentGetRequest.class), any(List.class)))
                .thenReturn("");
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelDepartments());
        List<Department> listOfCategories = departmentRepository
                .findForCriteria(new DepartmentGetRequest());
        assertTrue(listOfCategories.equals(getListOfModelDepartments()));
    }

    @Test
    public void test_should_return_false_if_category_exists_with_name_and_tenantid_for_create() {
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelServiceCategories());
        Boolean value = departmentRepository.checkDepartmentByNameAndTenantIdExists("Collection", "default", 1L,
                false);
        assertTrue(value.equals(false));
    }

    @Test
    public void test_should_return_true_if_category_doesnot_exists_with_name_and_tenantid_for_Create() {
        List<Department> categories = new ArrayList<>();
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(categories);
        Boolean value = departmentRepository.checkDepartmentByNameAndTenantIdExists("Collection", "default", 1L,
                false);
        assertTrue(value.equals(true));
    }

    @Test
    public void test_should_return_false_if_category_exists_with_name_and_tenantid_for_update() {
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelServiceCategories());
        Boolean value = departmentRepository.checkDepartmentByNameAndTenantIdExists("Collection", "default", 1L,
                true);
        assertTrue(value.equals(false));
    }

    @Test
    public void test_should_return_true_if_category_doesnot_exists_with_name_and_tenantid_for_update() {
        List<Department> categories = new ArrayList<>();
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(categories);
        Boolean value = departmentRepository.checkDepartmentByNameAndTenantIdExists("Collection", "default", 1L,
                true);
        assertTrue(value.equals(true));
    }

    @Test
    public void test_should_return_false_if_category_exists_with_code_and_tenantid_for_create() {
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelServiceCategories());
        Boolean value = departmentRepository.checkDepartmentByCodeAndTenantIdExists("CL", "default", 1L, false);
        assertTrue(value.equals(false));
    }

    @Test
    public void test_should_return_true_if_category_exists_with_code_and_tenantid_for_create() {
        List<Department> categories = new ArrayList<>();
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(categories);
        Boolean value = departmentRepository.checkDepartmentByCodeAndTenantIdExists("CL", "default", 1L, false);
        assertTrue(value.equals(true));
    }

    @Test
    public void test_should_return_false_if_category_exists_with_code_and_tenantid_for_update() {
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(getListOfModelServiceCategories());
        Boolean value = departmentRepository.checkDepartmentByCodeAndTenantIdExists("CL", "default", 1L, true);
        assertTrue(value.equals(false));
    }

    @Test
    public void test_should_return_true_if_category_exists_with_code_and_tenantid_for_update() {
        List<Department> categories = new ArrayList<>();
        when(jdbcTemplate.query(any(String.class), any(Object[].class), any(DepartmentRowMapper.class)))
                .thenReturn(categories);
        Boolean value = departmentRepository.checkDepartmentByCodeAndTenantIdExists("CL", "default", 1L, true);
        assertTrue(value.equals(true));
    }

    private List<Department> getListOfModelDepartments() {
        Department category1 = Department.builder().id(3L).code("TL").name("Trade Licence").active(true)
                .tenantId("default").build();
        Department category2 = Department.builder().id(2L).code("MR").name("Marriage Registration")
                .active(true).tenantId("default").build();
        Department category3 = Department.builder().id(1L).code("CL").name("Collection").active(true)
                .tenantId("default").build();
        return Arrays.asList(category1, category2, category3);
    }

    private List<Department> getListOfModelServiceCategories() {
        return Arrays.asList(
                Department.builder().id(5L).code("CLL").name("Collection Label").tenantId("default").build());
    }

    private Department getDepartmentModel() {
        Department category = Department.builder().id(1L).code("CL").name("Collection").active(true)
                .tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
        return category;
    }

}
