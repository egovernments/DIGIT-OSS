package org.egov.wf.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.repository.querybuilder.WorkflowQueryBuilder;
import org.egov.wf.repository.rowmapper.WorkflowRowMapper;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {WorKflowRepository.class})
@ExtendWith(SpringExtension.class)
class WorKflowRepositoryTest {
    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private WorKflowRepository worKflowRepository;

    @MockBean
    private WorkflowQueryBuilder workflowQueryBuilder;

    @MockBean
    private WorkflowRowMapper workflowRowMapper;

    @Test
    void testGetProcessInstances() throws DataAccessException {
        when(this.workflowQueryBuilder.getProcessInstanceIds((ProcessInstanceSearchCriteria) any(), (List<Object>) any()))
                .thenReturn("Process Instance Ids");
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(new ArrayList<>());

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
        assertTrue(this.worKflowRepository.getProcessInstances(processInstanceSearchCriteria).isEmpty());
        verify(this.workflowQueryBuilder).getProcessInstanceIds((ProcessInstanceSearchCriteria) any(),
                (List<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }


    @Test
    void testGetProcessInstancespostvalue() throws DataAccessException {
        when(this.workflowQueryBuilder.getProcessInstanceSearchQueryById((List<String>) any(), (List<Object>) any()))
                .thenReturn("42");
        when(this.workflowQueryBuilder.getProcessInstanceIds((ProcessInstanceSearchCriteria) any(), (List<Object>) any()))
                .thenReturn("Process Instance Ids");

        ArrayList<Object> objectList = new ArrayList<>();
        objectList.add("42");
        ArrayList<Object> objectList1 = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList1);
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);

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
        List<ProcessInstance> actualProcessInstances = this.worKflowRepository
                .getProcessInstances(processInstanceSearchCriteria);
        assertSame(objectList1, actualProcessInstances);
        assertTrue(actualProcessInstances.isEmpty());
        verify(this.workflowQueryBuilder).getProcessInstanceIds((ProcessInstanceSearchCriteria) any(),
                (List<Object>) any());
        verify(this.workflowQueryBuilder).getProcessInstanceSearchQueryById((List<String>) any(), (List<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }


    @Test
    void testGetProcessInstancesForUserInbox() {
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
        assertTrue(this.worKflowRepository.getProcessInstancesForUserInbox(processInstanceSearchCriteria).isEmpty());
    }


    @Test
    void testGetProcessInstancesForUserInboxWithEmpty() {
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setToDate((Long) any());
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
        assertTrue(this.worKflowRepository.getProcessInstancesForUserInbox(processInstanceSearchCriteria).isEmpty());
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).getTenantSpecifiStatus();
        verify(processInstanceSearchCriteria).setAssignee((String) any());
        verify(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        verify(processInstanceSearchCriteria).setBusinessService((String) any());
        verify(processInstanceSearchCriteria).setFromDate((Long) any());
        verify(processInstanceSearchCriteria).setHistory((Boolean) any());
        verify(processInstanceSearchCriteria).setIds((List<String>) any());
        verify(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        verify(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        verify(processInstanceSearchCriteria).setLimit((Integer) any());
        verify(processInstanceSearchCriteria).setModuleName((String) any());
        verify(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        verify(processInstanceSearchCriteria).setOffset((Integer) any());
        verify(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        verify(processInstanceSearchCriteria).setStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        verify(processInstanceSearchCriteria).setTenantId((String) any());
        verify(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setToDate((Long) any());
    }


    @Test
    void testGetProcessInstancesForUserInboxWithIdQuery() throws DataAccessException {
        when(this.workflowQueryBuilder.getInboxIdQuery((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any())).thenReturn("Inbox Id Query");
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(new ArrayList<>());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatus()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setToDate((Long) any());
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
        assertTrue(this.worKflowRepository.getProcessInstancesForUserInbox(processInstanceSearchCriteria).isEmpty());
        verify(this.workflowQueryBuilder).getInboxIdQuery((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).setAssignee((String) any());
        verify(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        verify(processInstanceSearchCriteria).setBusinessService((String) any());
        verify(processInstanceSearchCriteria).setFromDate((Long) any());
        verify(processInstanceSearchCriteria).setHistory((Boolean) any());
        verify(processInstanceSearchCriteria).setIds((List<String>) any());
        verify(processInstanceSearchCriteria, atLeast(1)).setIsAssignedToMeCount((Boolean) any());
        verify(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        verify(processInstanceSearchCriteria).setLimit((Integer) any());
        verify(processInstanceSearchCriteria).setModuleName((String) any());
        verify(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        verify(processInstanceSearchCriteria).setOffset((Integer) any());
        verify(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        verify(processInstanceSearchCriteria).setStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        verify(processInstanceSearchCriteria).setTenantId((String) any());
        verify(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setToDate((Long) any());
    }


    @Test
    void GetProcessInstancesForUserInbox() throws DataAccessException {
        when(this.workflowQueryBuilder.getProcessInstanceSearchQueryById((List<String>) any(), (List<Object>) any()))
                .thenReturn("42");
        when(this.workflowQueryBuilder.getInboxIdQuery((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any())).thenReturn("Inbox Id Query");

        ArrayList<Object> objectList = new ArrayList<>();
        objectList.add("42");
        ArrayList<Object> objectList1 = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList1);
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatus()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setToDate((Long) any());
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
        List<ProcessInstance> actualProcessInstancesForUserInbox = this.worKflowRepository
                .getProcessInstancesForUserInbox(processInstanceSearchCriteria);
        assertSame(objectList1, actualProcessInstancesForUserInbox);
        assertTrue(actualProcessInstancesForUserInbox.isEmpty());
        verify(this.workflowQueryBuilder).getInboxIdQuery((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any());
        verify(this.workflowQueryBuilder).getProcessInstanceSearchQueryById((List<String>) any(), (List<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).setAssignee((String) any());
        verify(processInstanceSearchCriteria).setBusinessIds((List<String>) any());
        verify(processInstanceSearchCriteria).setBusinessService((String) any());
        verify(processInstanceSearchCriteria).setFromDate((Long) any());
        verify(processInstanceSearchCriteria).setHistory((Boolean) any());
        verify(processInstanceSearchCriteria).setIds((List<String>) any());
        verify(processInstanceSearchCriteria, atLeast(1)).setIsAssignedToMeCount((Boolean) any());
        verify(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        verify(processInstanceSearchCriteria).setLimit((Integer) any());
        verify(processInstanceSearchCriteria).setModuleName((String) any());
        verify(processInstanceSearchCriteria).setMultipleAssignees((List<String>) any());
        verify(processInstanceSearchCriteria).setOffset((Integer) any());
        verify(processInstanceSearchCriteria).setStatesToIgnore((List<String>) any());
        verify(processInstanceSearchCriteria).setStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((List<String>) any());
        verify(processInstanceSearchCriteria).setTenantId((String) any());
        verify(processInstanceSearchCriteria).setTenantSpecifiStatus((List<String>) any());
        verify(processInstanceSearchCriteria).setToDate((Long) any());
    }


    @Test
    void testGetProcessInstancesForUserInboxCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getInboxIdCount((ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any()))
                .thenReturn("3");
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any())).thenReturn(1);

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
        assertEquals(1,
                this.worKflowRepository.getProcessInstancesForUserInboxCount(processInstanceSearchCriteria).intValue());
        verify(this.workflowQueryBuilder).getInboxIdCount((ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any());
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any());
        assertTrue(processInstanceSearchCriteria.getIsAssignedToMeCount());
    }


    @Test
    void testGetInboxCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getInboxCount((ProcessInstanceSearchCriteria) any(), (java.util.List<Object>) any(),
                (Boolean) any())).thenReturn("3");
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any())).thenReturn(1);

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
        assertEquals(1, this.worKflowRepository.getInboxCount(processInstanceSearchCriteria).intValue());
        verify(this.workflowQueryBuilder).getInboxCount((ProcessInstanceSearchCriteria) any(),
                (java.util.List<Object>) any(), (Boolean) any());
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any());
    }


    @Test
    void testGetProcessInstancesCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getProcessInstanceCount((ProcessInstanceSearchCriteria) any(),
                (java.util.List<Object>) any(), anyBoolean())).thenReturn("3");
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any())).thenReturn(1);

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
        assertEquals(1, this.worKflowRepository.getProcessInstancesCount(processInstanceSearchCriteria).intValue());
        verify(this.workflowQueryBuilder).getProcessInstanceCount((ProcessInstanceSearchCriteria) any(),
                (java.util.List<Object>) any(), anyBoolean());
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any());
    }


    @Test
    void testGetInboxStatusCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getInboxCount((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any())).thenReturn("3");
        ArrayList<Map<String, Object>> mapList = new ArrayList<>();
        when(this.jdbcTemplate.queryForList((String) any(), (Object[]) any())).thenReturn(mapList);

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
        List actualInboxStatusCount = this.worKflowRepository.getInboxStatusCount(processInstanceSearchCriteria);
        assertSame(mapList, actualInboxStatusCount);
        assertTrue(actualInboxStatusCount.isEmpty());
        verify(this.workflowQueryBuilder).getInboxCount((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                (Boolean) any());
        verify(this.jdbcTemplate).queryForList((String) any(), (Object[]) any());
    }


    @Test
    void testGetProcessInstancesStatusCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getProcessInstanceCount((ProcessInstanceSearchCriteria) any(), (List<Object>) any(),
                anyBoolean())).thenReturn("3");
        ArrayList<Map<String, Object>> mapList = new ArrayList<>();
        when(this.jdbcTemplate.queryForList((String) any(), (Object[]) any())).thenReturn(mapList);

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
        List actualProcessInstancesStatusCount = this.worKflowRepository
                .getProcessInstancesStatusCount(processInstanceSearchCriteria);
        assertSame(mapList, actualProcessInstancesStatusCount);
        assertTrue(actualProcessInstancesStatusCount.isEmpty());
        verify(this.workflowQueryBuilder).getProcessInstanceCount((ProcessInstanceSearchCriteria) any(),
                (List<Object>) any(), anyBoolean());
        verify(this.jdbcTemplate).queryForList((String) any(), (Object[]) any());
    }

    @Test
    void testFetchEscalatedApplicationsBusinessIdsFromDb() throws DataAccessException {
        when(this.workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery((RequestInfo) any(),
                (ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any()))
                .thenReturn("Auto Escalated Applications Final Query");
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
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
        List<String> actualFetchEscalatedApplicationsBusinessIdsFromDbResult = this.worKflowRepository
                .fetchEscalatedApplicationsBusinessIdsFromDb(requestInfo, processInstanceSearchCriteria);
        assertSame(objectList, actualFetchEscalatedApplicationsBusinessIdsFromDbResult);
        assertTrue(actualFetchEscalatedApplicationsBusinessIdsFromDbResult.isEmpty());
        verify(this.workflowQueryBuilder).getAutoEscalatedApplicationsFinalQuery((RequestInfo) any(),
                (ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }


    @Test
    void testGetEscalatedApplicationsCount() throws DataAccessException {
        when(this.workflowQueryBuilder.getEscalatedApplicationsCount((RequestInfo) any(),
                (ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any())).thenReturn("3");
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any())).thenReturn(1);
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
        assertEquals(1,
                this.worKflowRepository.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria).intValue());
        verify(this.workflowQueryBuilder).getEscalatedApplicationsCount((RequestInfo) any(),
                (ProcessInstanceSearchCriteria) any(), (ArrayList<Object>) any());
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<Integer>) any());
    }
}

