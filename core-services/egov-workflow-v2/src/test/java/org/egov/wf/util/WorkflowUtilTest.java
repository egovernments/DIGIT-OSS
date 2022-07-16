package org.egov.wf.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {WorkflowUtil.class})
@ExtendWith(SpringExtension.class)
class WorkflowUtilTest {
    @MockBean
    private BusinessServiceRepository businessServiceRepository;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private WorkflowConfig workflowConfig;

    @Autowired
    private WorkflowUtil workflowUtil;

    @Test

    void testEnrichStatusesInSearchCriteria() {
        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        processInstanceSearchCriteria.setBusinessIds(new ArrayList<>());
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
         }


    @Test

    void TestEnrichStatusesInSearchCriteria() {

        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());

        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        processInstanceSearchCriteria.setBusinessIds(new ArrayList<>());
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
          }


    @Test
    void testEnrichStatusesInSearchCriteriaWithUser() {
        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        User user = new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210");

        requestInfo.setUserInfo(user);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        ArrayList<String> stringList = new ArrayList<>();
        processInstanceSearchCriteria.setBusinessIds(stringList);
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
        this.workflowUtil.enrichStatusesInSearchCriteria(requestInfo, processInstanceSearchCriteria);
        verify(this.businessServiceRepository).getRoleTenantAndStatusMapping();
        User userInfo = requestInfo.getUserInfo();
        assertSame(user, userInfo);
        assertEquals("Assignee", processInstanceSearchCriteria.getAssignee());
        assertEquals(1L, processInstanceSearchCriteria.getToDate().longValue());
        assertEquals(stringList, processInstanceSearchCriteria.getTenantSpecifiStatus());
        assertEquals("42", processInstanceSearchCriteria.getTenantId());
        assertEquals(stringList, processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant());
        assertEquals(stringList, processInstanceSearchCriteria.getStatus());
        assertEquals(stringList, processInstanceSearchCriteria.getStatesToIgnore());
        assertEquals(2, processInstanceSearchCriteria.getOffset().intValue());
        assertEquals(stringList, processInstanceSearchCriteria.getMultipleAssignees());
        assertEquals("Module Name", processInstanceSearchCriteria.getModuleName());
        assertEquals(1, processInstanceSearchCriteria.getLimit().intValue());
        assertTrue(processInstanceSearchCriteria.getIsEscalatedCount());
        assertTrue(processInstanceSearchCriteria.getIsAssignedToMeCount());
        assertEquals(stringList, processInstanceSearchCriteria.getIds());
        assertTrue(processInstanceSearchCriteria.getHistory());
        assertEquals(1L, processInstanceSearchCriteria.getFromDate().longValue());
        assertEquals("Business Service", processInstanceSearchCriteria.getBusinessService());
        List<Role> expectedBusinessIds = userInfo.getRoles();
        assertEquals(expectedBusinessIds, processInstanceSearchCriteria.getBusinessIds());
    }


    @Test
    void testEnrichStatusesInSearchCriteriaWithAddRole() {
        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());

        ArrayList<Role> roleList = new ArrayList<>();
        roleList.add(new Role());
        User userInfo = new User(123L, "janedoe", "Name", "Type", "42", "42", roleList, "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210");

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(userInfo);

        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        processInstanceSearchCriteria.setBusinessIds(new ArrayList<>());
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
        this.workflowUtil.enrichStatusesInSearchCriteria(requestInfo, processInstanceSearchCriteria);
        verify(this.businessServiceRepository).getRoleTenantAndStatusMapping();
    }

    @Test
    void testEnrichStatusesInSearchCriteriaWithRoleList() {
        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());

        ArrayList<Role> roleList = new ArrayList<>();
        roleList.add(new Role());
        roleList.add(new Role());
        User userInfo = new User(123L, "janedoe", "Name", "Type", "42", "42", roleList, "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210");

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(userInfo);

        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        processInstanceSearchCriteria.setBusinessIds(new ArrayList<>());
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
        this.workflowUtil.enrichStatusesInSearchCriteria(requestInfo, processInstanceSearchCriteria);
        verify(this.businessServiceRepository).getRoleTenantAndStatusMapping();
    }

    @Test

    void testEnrichStatusesInSearchCriteriaWithNull() {

        when(this.businessServiceRepository.getRoleTenantAndStatusMapping()).thenReturn(new HashMap<>());

        ArrayList<Role> roleList = new ArrayList<>();
        roleList.add(null);
        User userInfo = new User(123L, "janedoe", "Name", "Type", "42", "42", roleList, "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210");

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(userInfo);

        ProcessInstanceSearchCriteria processInstanceSearchCriteria = new ProcessInstanceSearchCriteria();
        processInstanceSearchCriteria.setAssignee("Assignee");
        processInstanceSearchCriteria.setBusinessIds(new ArrayList<>());
        processInstanceSearchCriteria.setBusinessService("Business Service");
        processInstanceSearchCriteria.setFromDate(1L);
        processInstanceSearchCriteria.setHistory(true);
        processInstanceSearchCriteria.setIds(new ArrayList<>());
        processInstanceSearchCriteria.setIsAssignedToMeCount(true);
        processInstanceSearchCriteria.setIsEscalatedCount(true);
        processInstanceSearchCriteria.setLimit(1);
        processInstanceSearchCriteria.setModuleName("Module Name");
        processInstanceSearchCriteria.setMultipleAssignees(new ArrayList<>());
        processInstanceSearchCriteria.setOffset(2);
        processInstanceSearchCriteria.setStatesToIgnore(new ArrayList<>());
        processInstanceSearchCriteria.setStatus(new ArrayList<>());
        processInstanceSearchCriteria.setStatusesIrrespectiveOfTenant(new ArrayList<>());
        processInstanceSearchCriteria.setTenantId("42");
        processInstanceSearchCriteria.setTenantSpecifiStatus(new ArrayList<>());
        processInstanceSearchCriteria.setToDate(1L);
         }
}

