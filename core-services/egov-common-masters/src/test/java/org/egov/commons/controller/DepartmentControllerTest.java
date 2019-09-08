package org.egov.commons.controller;

import org.apache.commons.io.IOUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.TestConfiguration;
import org.egov.commons.model.Department;
import org.egov.commons.service.DepartmentService;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.egov.commons.web.contract.DepartmentRequest;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.controller.DepartmentController;
import org.egov.commons.web.errorhandlers.RequestErrorHandler;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(DepartmentController.class)
@Import(TestConfiguration.class)
public class DepartmentControllerTest {

    @MockBean
    private DepartmentService departmentService;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RequestErrorHandler errHandler;

    @MockBean
    private ResponseInfoFact responseInfoFactory;

    @Test
    public void test_should_create_department() throws Exception {
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
                .thenReturn(getResponseInfo());
        when(departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L, false))
                .thenReturn(true);
        when(departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, false)).thenReturn(true);

        when(departmentService.createDepartmentAsync(any(DepartmentRequest.class))).thenReturn(getDepartmentRequest());


        mockMvc.perform(post("/departments/v1/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(getFileContents("departmentRequestCreate.json"))).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("departmentResponseCreate.json")));
    }


    @Test
    public void test_should_update_department() throws Exception {
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(false)))
                .thenReturn(getResponseInfoInCaseOfFailure());
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
                .thenReturn(getResponseInfo());
        when(departmentService.getDepartmentByNameAndTenantId("Health", "default", 1L, true))
                .thenReturn(true);
        when(departmentService.getDepartmentByCodeAndTenantId("HLT", "default", 1L, true)).thenReturn(true);
        when(departmentService.updateDepartmentAsync(any(DepartmentRequest.class)))
                .thenReturn(getDepartmentRequestForUpdate());
        mockMvc.perform(post("/departments/v1/_update")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(getFileContents("departmentRequestUpdate.json"))).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("departmentResponseUpdate.json")));
    }


    @Test
    public void test_should_get_all_departments_with_the_params_criteria() throws Exception {
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
                .thenReturn(getResponseInfo());
        when(departmentService.getDepartments(getDepartmentGetRequest()))
                .thenReturn(getListOfModelDepartments());

        mockMvc.perform(
                post("/departments/v1/_search?active=true&tenantId=default&id=1,2&sortBy=code&sortOrder=desc")
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(getFileContents("departmentRequest.json")))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("departmentResponse.json")));
    }


    private DepartmentGetRequest getDepartmentGetRequest() {
        return DepartmentGetRequest.builder().active(true).tenantId("default").sortBy("code").sortOrder("desc")
                .id(Arrays.asList(1L, 2L)).build();
    }


    private DepartmentRequest getDepartmentRequest() {
        User userInfo = User.builder().id(1L).build();
        RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.commons").ver("1.0").action("POST")
                .did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        Department department = Department.builder().id(1L).code("HLT").name("Health").active(true).tenantId("default").build();
        return DepartmentRequest.builder().requestInfo(requestInfo).department(department).build();
    }

    private ResponseInfo getResponseInfo() {
        return ResponseInfo.builder().apiId("org.egov.commons").ver("1.0").resMsgId("uief87324").msgId("654654")
                .status("successful").build();
    }

    private String getFileContents(String fileName) {
        try {
            return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private DepartmentRequest getDepartmentRequestForUpdate() {
        User userInfo = User.builder().id(1L).build();
        RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.commons").ver("1.0").action("POST")
                .did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        Department department = Department.builder().id(1L).code("HLT").name("Health").active(true).tenantId("default").build();
        return DepartmentRequest.builder().requestInfo(requestInfo).department(department).build();

    }

    private ResponseInfo getResponseInfoInCaseOfFailure() {
        return ResponseInfo.builder().apiId("org.egov.commons").ver("1.0").resMsgId("uief87324").msgId("654654")
                .status("failed").build();
    }

    private List<Department> getListOfModelDepartments() {

        Department category2 = Department.builder().id(2L).code("COL").name("COLLECTION")
                .active(true).tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
        Department category1 = Department.builder().id(1L).code("HLT").name("HEALTH").active(true)
                .tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
        return Arrays.asList(category1, category2);
    }


}
