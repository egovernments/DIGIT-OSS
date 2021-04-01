package org.egov.commons.domain.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.commons.model.Department;
import org.egov.commons.repository.DepartmentRepository;
import org.egov.commons.service.DepartmentService;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.egov.commons.web.contract.DepartmentRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(DepartmentService.class)
@WebAppConfiguration
public class DepartmentServiceTest {
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

    private DepartmentService departmentService;

    @Before
    public void before() {
        departmentService = new DepartmentService(departmentRepository, kafkaTemplate);
    }

    @Test
    public void test_should_create_department() {
        departmentService.createDepartment(getDepartmentModel(), getDepartmentRequest().getRequestInfo().getUserInfo().getId());
        verify(departmentRepository).create(getDepartmentModel(), getDepartmentRequest().getRequestInfo().getUserInfo().getId());
    }

    @Test
    public void test_should_create_businessCategory_Asynchronously() {
        departmentService.createDepartmentAsync(getDepartmentRequest());
        verify(kafkaTemplate).send("egov-common-department-create", getDepartmentRequest());

    }

    @Test
    public void test_should_update_department() {
        departmentService.updateDepartment(getDepartmentModelForUpdate(), getDepartmentRequestForUpdate().getRequestInfo().getUserInfo().getId());
        verify(departmentRepository).update(getDepartmentModelForUpdate(), getDepartmentRequestForUpdate().getRequestInfo().getUserInfo().getId());
    }

    @Test
    public void test_should_update_department_Asynchronously() {
        departmentService.updateDepartmentAsync(getDepartmentRequestForUpdate());
        verify(kafkaTemplate).send("egov-common-department-update", getDepartmentRequestForUpdate());

    }

    @Test
    public void test_should_return_all_department_As_per_criteria() {
        when(departmentRepository.findForCriteria(getDepartmentGetRequest()))
                .thenReturn(getListOfModelDepartments());
        List<Department> modelDepartments = departmentService.getDepartments(getDepartmentGetRequest());
        assertThat(modelDepartments.get(0).getCode()).isEqualTo(getListOfModelDepartments().get(0).getCode());
        assertThat(modelDepartments.get(1).getCode()).isEqualTo(getListOfModelDepartments().get(1).getCode());
        assertThat(modelDepartments.get(2).getCode()).isEqualTo(getListOfModelDepartments().get(2).getCode());

    }

    @Test
    public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
        when(departmentRepository.checkDepartmentByNameAndTenantIdExists("Health", "default", 1L, false))
                .thenReturn(true);
        Boolean value = departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L, false);
        assertEquals(true, value.booleanValue());

    }

    @Test
    public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
        when(departmentRepository.checkDepartmentByNameAndTenantIdExists("Health", "default", 1L, false))
                .thenReturn(false);
        Boolean value = departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L,
                false);
        assertEquals(false, value);
    }

    @Test
    public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
        when(departmentRepository.checkDepartmentByNameAndTenantIdExists("Health", "default", 1L, true))
                .thenReturn(true);
        Boolean value = departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L,
                true);
        assertEquals(true, value);
    }

    @Test
    public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
        when(departmentRepository.checkDepartmentByNameAndTenantIdExists("Health", "default", 1L, true))
                .thenReturn(false);
        Boolean value = departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L,
                true);
        assertEquals(false, value);
    }

    @Test
    public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_create() {
        when(departmentRepository.checkDepartmentByCodeAndTenantIdExists("HLT", "default", 1L, false))
                .thenReturn(true);
        Boolean value = departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, false);
        assertEquals(true, value);
    }


    @Test
    public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_create() {
        when(departmentRepository.checkDepartmentByCodeAndTenantIdExists("HLT", "default", 1L, false))
                .thenReturn(false);
        Boolean value = departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, false);
        assertEquals(false, value);
    }

    @Test
    public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_update() {
        when(departmentRepository.checkDepartmentByCodeAndTenantIdExists("HLT", "default", 1L, true))
                .thenReturn(true);
        Boolean value = departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, true);
        assertEquals(true, value);
    }


    @Test
    public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_update() {
        when(departmentRepository.checkDepartmentByCodeAndTenantIdExists("HLT", "default", 1L, true))
                .thenReturn(false);
        Boolean value = departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, true);
        assertEquals(false, value);
    }

    private DepartmentRequest getDepartmentRequest() {
        User userInfo = User.builder().id(1L).build();
        RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
                .did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        Department department = Department
                .builder().id(1L).code("HLT").name("Health").active(true).tenantId("default").build();
        return DepartmentRequest.builder().requestInfo(requestInfo).department(department).build();
    }

    private Department getDepartmentModel() {
        Department category = Department.builder().id(1L).code("HLT").name("Health").active(true)
                .tenantId("default").build();
        return category;
    }

    private Department getDepartmentModelForUpdate() {
        Department department = Department.builder().id(1L).code("HLT").name("Health").active(true)
                .tenantId("default").build();
        return department;
    }

    private DepartmentRequest getDepartmentRequestForUpdate() {
        User userInfo = User.builder().id(1L).build();
        RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
                .did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        Department department = Department
                .builder().id(1L).code("HLT").name("Health").active(true).tenantId("default").build();
        return DepartmentRequest.builder().requestInfo(requestInfo).department(department).build();
    }

    private List<Department> getListOfModelDepartments() {
        Department department1 = Department.builder().id(3L).code("HLT").name("Health").active(true)
                .tenantId("default").build();
        Department department2 = Department.builder().id(2L).code("ENG").name("Engineering").active(true)
                .tenantId("default").build();
        Department department3 = Department.builder().id(1L).code("ADM").name("Admin").active(true)
                .tenantId("default").build();
        return Arrays.asList(department1, department2, department3);
    }

    private DepartmentGetRequest getDepartmentGetRequest() {
        return DepartmentGetRequest.builder().id(Arrays.asList(1L, 2L, 3L)).active(true).sortBy("code")
                .sortOrder("desc").tenantId("default").build();
    }

}
