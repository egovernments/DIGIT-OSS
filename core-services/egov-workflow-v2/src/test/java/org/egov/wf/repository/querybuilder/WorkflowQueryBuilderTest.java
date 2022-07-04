package org.egov.wf.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;

import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class WorkflowQueryBuilderTest {

    @Test

    void testGetProcessInstanceIds() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, new ArrayList<>());
    }


    @Test

    void testGetProcessInstanceIds2() {
        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, new ArrayList<>()));

    }


    @Test
    void testGetProcessInstanceIds3() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testGetProcessInstanceIds4() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        assertEquals(7, objectList.size());
    }

    @Test

    void testGetProcessInstanceIds5() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, null, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
    void testGetProcessInstanceIds6() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(7, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds7() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(false);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND pi_outer.tenantid=?  and id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND"
                        + " pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime DESC "
                        + " OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(8, objectList.size());
    }


    @Test

    void testGetProcessInstanceIds8() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(null);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
         }


    @Test
    void testGetProcessInstanceIds9() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(null);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(7, objectList.size());
    }


    @Test
    void testGetProcessInstanceIds10() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(null);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(7, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds11() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn(null);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  AND pi_outer.businessservice"
                        + " =?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(5, objectList.size());
    }


    @Test
    void testGetProcessInstanceIds12() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds13() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.modulename =?  ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(6, objectList.size());
    }


    @Test
    void testGetProcessInstanceIds14() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn(null);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and id in (select"
                        + " processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid"
                        + " = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(6, objectList.size());
    }


    @Test
    void testGetProcessInstanceIds15() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and pi_outer.businessId"
                        + " IN (  ?) and id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER"
                        + " BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(8, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds16() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=? and pi_outer.id IN ( ?)"
                        + " and id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?)"
                        + " AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY"
                        + " pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(8, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds17() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and pi_outer.status IN"
                        + " ( ?) and id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee ="
                        + " ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER BY"
                        + " pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(8, objectList.size());
    }

    @Test
    void testGetProcessInstanceIds18() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE ");
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(" select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.tenantid=?  and pi_outer.businessId"
                        + " IN (  ?, ?) and id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  AND pi_outer.modulename =?  ORDER"
                        + " BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getProcessInstanceIds(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
        verify(processInstanceSearchCriteria).getStatus();
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
        assertEquals(9, objectList.size());
    }


    @Test
    void testGetProcessInstanceSearchQueryById() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ArrayList<String> ids = new ArrayList<>();
        assertEquals(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.id IN () ORDER BY wf_lastModifiedTime"
                + " DESC ", workflowQueryBuilder.getProcessInstanceSearchQueryById(ids, new ArrayList<>()));
    }

    @Test
    void testGetProcessInstanceSearchQueryById2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.id IN ( ?) ORDER BY wf_lastModifiedTime"
                + " DESC ", workflowQueryBuilder.getProcessInstanceSearchQueryById(stringList, objectList));
        assertEquals(1, objectList.size());
    }

    @Test
    void testGetProcessInstanceSearchQueryById3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.id IN ( ?, ?) ORDER BY"
                + " wf_lastModifiedTime DESC ", workflowQueryBuilder.getProcessInstanceSearchQueryById(stringList, objectList));
        assertEquals(2, objectList.size());
    }

    @Test
    void testGetInboxIdCount() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select count(DISTINCT id) from ( select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer"
                        + ".lastmodifiedTime = (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where"
                        + " pi_inner.businessid = pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND"
                        + " pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC ) as count",
                workflowQueryBuilder.getInboxIdCount(processInstanceSearchCriteria, objectList));
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetInboxIdCount2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select count(DISTINCT id) from ( select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer"
                        + ".lastmodifiedTime = (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where"
                        + " pi_inner.businessid = pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND"
                        + " pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC ) as count",
                workflowQueryBuilder.getInboxIdCount(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetInboxIdCount3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select count(DISTINCT id) from ( select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer"
                        + ".lastmodifiedTime = (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where"
                        + " pi_inner.businessid = pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  ORDER BY"
                        + " pi_outer.lastModifiedTime DESC ) as count",
                workflowQueryBuilder.getInboxIdCount(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(3, objectList.size());
    }

    @Test
    void testGetInboxIdCount4() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select count(DISTINCT id) from ( select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer"
                        + ".lastmodifiedTime = (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where"
                        + " pi_inner.businessid = pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  ORDER BY"
                        + " pi_outer.lastModifiedTime DESC ) as count",
                workflowQueryBuilder.getInboxIdCount(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(3, objectList.size());
    }

    @Test
    void testGetInboxIdCount5() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
    }

    @Test
    void testGetInboxIdCount6() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(null);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
          }

    @Test
    void testGetInboxIdQuery() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
    void testGetInboxIdQuery2() {

        WorkflowConfig workflowConfig = new WorkflowConfig();
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
    void testGetInboxIdQuery3() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery4() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery5() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, null, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

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
    void testGetInboxIdQuery6() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery7() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    /**
     * Method under test: {@link WorkflowQueryBuilder#getInboxIdQuery(ProcessInstanceSearchCriteria, List, Boolean)}
     */
    @Test
    void testGetInboxIdQuery8() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(null);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery9() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(null);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery10() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(null);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery11() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetInboxIdQuery12() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetInboxIdQuery13() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, false));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetInboxIdQuery14() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
       }

    @Test
    void testGetInboxIdQuery15() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", false, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                " select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2"
                        + " asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =? "
                        + " ORDER BY pi_outer.lastModifiedTime DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetInboxIdQuery16() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", null, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
      }

    @Test
    void testGetInboxIdQuery17() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(0);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("BPAREG");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(" select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                        + " pi_outer.businessid and tenantid = ? )  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getInboxIdQuery(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).getStatusesIrrespectiveOfTenant();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetInboxCount() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetInboxCount2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetInboxCount3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  ORDER BY pi_outer.lastModifiedTime DESC ) ) cq GROUP BY cq.applicationStatus"
                        + ",cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(3, objectList.size());
    }

    @Test
    void testGetInboxCount4() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  ORDER BY pi_outer.lastModifiedTime DESC ) ) cq GROUP BY cq.applicationStatus"
                        + ",cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(3, objectList.size());
    }

    @Test
    void testGetInboxCount5() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
    }

    @Test
    void testGetInboxCount6() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(null);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
    }

    @Test
    void testGetInboxCount7() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT id) from ( select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer"
                        + ".lastmodifiedTime = (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where"
                        + " pi_inner.businessid = pi_outer.businessid and tenantid = ? )  AND id in (select processinstanceid"
                        + " from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ?  AND"
                        + " pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC ) as count",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, false));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }

    @Test

    void testGetInboxCount8() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
          }


    @Test
    void testGetInboxCount9() {

        WorkflowConfig workflowConfig = new WorkflowConfig();
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetInboxCount10() {


        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getAssignedOnly()).thenReturn(false);
        doNothing().when(workflowConfig).setAssignedOnly((Boolean) any());
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("Module Name");
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(workflowConfig).getAssignedOnly();
        verify(workflowConfig).setAssignedOnly((Boolean) any());
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetInboxCount11() {


        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getAssignedOnly()).thenReturn(false);
        doNothing().when(workflowConfig).setAssignedOnly((Boolean) any());
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("BPAREG");
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC ) ) cq GROUP BY"
                        + " cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(workflowConfig).getAssignedOnly();
        verify(workflowConfig).setAssignedOnly((Boolean) any());
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).getStatusesIrrespectiveOfTenant();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetInboxCount12() {

        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getAssignedOnly()).thenReturn(false);
        doNothing().when(workflowConfig).setAssignedOnly((Boolean) any());
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                + " pi_outer.businessid and tenantid = ? ) ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("BPAREG");
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                + " = ? )  AND ((id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                + " = ?) AND pi_outer.tenantid = ? )  OR pi_outer.status IN ( ?) ) AND pi_outer.businessservice =?  ORDER"
                + " BY pi_outer.lastModifiedTime DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI"
                + "_STATUS", workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(workflowConfig).getAssignedOnly();
        verify(workflowConfig).setAssignedOnly((Boolean) any());
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getStatus();
        verify(processInstanceSearchCriteria).getStatusesIrrespectiveOfTenant();
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
        assertEquals(5, objectList.size());
    }


    @Test
    void testGetInboxCount13() {


        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getAssignedOnly()).thenReturn(false);
        doNothing().when(workflowConfig).setAssignedOnly((Boolean) any());
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getModuleName()).thenReturn(null);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ?  AND pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime"
                        + " DESC ) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(workflowConfig).getAssignedOnly();
        verify(workflowConfig).setAssignedOnly((Boolean) any());
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getModuleName();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetInboxCount14() {


        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getAssignedOnly()).thenReturn(false);
        doNothing().when(workflowConfig).setAssignedOnly((Boolean) any());
        workflowConfig.setAssignedOnly(true);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(" select id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT"
                + " max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid ="
                + " pi_outer.businessid and tenantid = ? ) ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getStatusesIrrespectiveOfTenant()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getModuleName()).thenReturn("BPAREG");
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getIsAssignedToMeCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from "
                        + " ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf"
                        + "_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ( select"
                        + " id from eg_wf_processinstance_v2 pi_outer WHERE  pi_outer.lastmodifiedTime = (SELECT max(lastmodifiedTime)"
                        + " from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid"
                        + " = ? )  AND ((id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee"
                        + " = ?) AND pi_outer.tenantid = ? )  OR (pi_outer.tenantid || ':' || pi_outer.status) IN ( ?) ) AND"
                        + " pi_outer.businessservice =?  ORDER BY pi_outer.lastModifiedTime DESC ) ) cq GROUP BY cq.applicationStatus"
                        + ",cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getInboxCount(processInstanceSearchCriteria, objectList, true));
        verify(workflowConfig).getAssignedOnly();
        verify(workflowConfig).setAssignedOnly((Boolean) any());
        verify(processInstanceSearchCriteria, atLeast(1)).getIsAssignedToMeCount();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
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
        assertEquals(5, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from"
                        + " ( SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,    "
                        + "   st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND pi.businessservice"
                        + " =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount2() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from"
                        + " ( SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,    "
                        + "   st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND pi.businessservice"
                        + " =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(false);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.lastmodifiedTime  IN  (SELECT"
                        + " max(lastmodifiedTime) from eg_wf_processinstance_v2 GROUP BY businessid)  AND pi.tenantid=?  AND"
                        + " pi.businessservice =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice"
                        + ",cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount4() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND pi.businessservice"
                        + " =? ) as cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount5() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND asg.assignee=? )"
                        + " as cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount6() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  and pi.businessId IN"
                        + " ( ?) AND pi.businessservice =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice"
                        + ",cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount7() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=? and pi.id IN ( ?) AND"
                        + " pi.businessservice =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice"
                        + ",cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount8() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND pi.businessservice"
                        + " =?  and pi.status  IN ( ?) AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq.businessservice"
                        + ",cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetProcessInstanceCount9() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getStatus()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getTenantSpecifiStatus()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  AND pi.businessservice"
                        + " =?  and CONCAT (pi.tenantid,':',pi.status)  IN ( ?) AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus"
                        + ",cq.businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount10() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT wf_id) from ( SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as"
                        + " wf_lastModifiedTime,pi.createdTime as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy"
                        + " as wf_lastModifiedBy,pi.status as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime"
                        + " as doc_lastModifiedTime,doc.createdTime as doc_createdTime,doc.createdBy as doc_createdBy,      "
                        + " doc.lastModifiedBy as doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee"
                        + " as assigneeuuid,       st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId"
                        + " as ac_tenantId,ac.action as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN     "
                        + "   eg_wf_assignee_v2 asg ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc"
                        + "  ON doc.processinstanceid = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT"
                        + " OUTER JOIN        eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE "
                        + " pi.tenantid=?  AND pi.businessservice =?  AND asg.assignee=? ) as count",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, false));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetProcessInstanceCount11() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        stringList
                .add(" SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getHistory()).thenReturn(true);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
        when(processInstanceSearchCriteria.getIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ("
                        + " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime"
                        + " as wf_createdTime,       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status"
                        + " as pi_status, pi.tenantid as pi_tenantid,        doc.lastModifiedTime as doc_lastModifiedTime,doc"
                        + ".createdTime as doc_createdTime,doc.createdBy as doc_createdBy,       doc.lastModifiedBy as"
                        + " doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,     "
                        + "  st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action"
                        + " as ac_action       FROM eg_wf_processinstance_v2 pi   LEFT OUTER JOIN        eg_wf_assignee_v2 asg"
                        + " ON asg.processinstanceid = pi.id  LEFT OUTER JOIN       eg_wf_document_v2 doc  ON doc.processinstanceid"
                        + " = pi.id  INNER JOIN        eg_wf_state_v2 st ON st.uuid = pi.status LEFT OUTER JOIN        eg_wf_action_v2"
                        + " ac ON ac.currentState = st.uuid AND ac.active=TRUE        WHERE  pi.tenantid=?  and pi.businessId IN"
                        + " ( ?, ?) AND pi.businessservice =?  AND asg.assignee=? ) as cq GROUP BY cq.applicationStatus,cq"
                        + ".businessservice,cq.PI_STATUS",
                workflowQueryBuilder.getProcessInstanceCount(processInstanceSearchCriteria, objectList, true));
        verify(processInstanceSearchCriteria, atLeast(1)).getHistory();
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
        verify(processInstanceSearchCriteria).getIds();
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
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetInboxApplicationsBusinessIdsQuery() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT DISTINCT businessid FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  createdby = ?  AND"
                        + "  businessservice = ? ",
                workflowQueryBuilder.getInboxApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetInboxApplicationsBusinessIdsQuery2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getAssignee()).thenReturn("Assignee");
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT DISTINCT businessid FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  createdby = ?  AND"
                        + "  businessservice = ? ",
                workflowQueryBuilder.getInboxApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getAssignee();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).setAssignee((String) any());
        verify(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setBusinessService((String) any());
        verify(processInstanceSearchCriteria).setFromDate((Long) any());
        verify(processInstanceSearchCriteria).setHistory((Boolean) any());
        verify(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        verify(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        verify(processInstanceSearchCriteria).setLimit((Integer) any());
        verify(processInstanceSearchCriteria).setModuleName((String) any());
        verify(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setOffset((Integer) any());
        verify(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setTenantId((String) any());
        verify(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
        verify(processInstanceSearchCriteria).setToDate((Long) any());
        assertEquals(3, objectList.size());
    }

    @Test

    void testGetEscalatedApplicationsCount() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
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
    void testGetEscalatedApplicationsCount2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId"
                        + " ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND "
                        + " businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank"
                        + " = 2 ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        assertEquals(2, objectList.size());
    }


    @Test

    void testGetEscalatedApplicationsCount3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
    void testGetEscalatedApplicationsCount4() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId"
                        + " ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND "
                        + " businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank"
                        + " = 2 ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount5() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe",
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ",
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ",
                "42", "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice"
                        + " = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  AND asg = ?"
                        + " ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo, atLeast(1)).getUserInfo();
        assertEquals(3, objectList.size());
    }


    @Test

    void testGetEscalatedApplicationsCount6() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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

    }


    @Test
    void testGetEscalatedApplicationsCount7() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  and businessId"
                        + " IN (  ?) AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE"
                        + " outer_rank = 2 ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount8() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  and businessId"
                        + " IN (  ?, ?) AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final"
                        + " WHERE outer_rank = 2 ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test

    void testGetEscalatedApplicationsCount9() {

        WorkflowConfig workflowConfig = new WorkflowConfig();
        workflowConfig.setDefaultLimit(4);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
    }


    @Test
    void testGetEscalatedApplicationsCount10() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice"
                        + " = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ? "
                        + " LIMIT ? ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount11() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice"
                        + " = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ? "
                        + " LIMIT ? ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test

    void testGetEscalatedApplicationsCount12() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, null, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
         }


    @Test
    void testGetEscalatedApplicationsCount13() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(null);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice"
                        + " = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ? "
                        + " LIMIT ? ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount14() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(null);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice"
                        + " = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ? "
                        + " LIMIT ? ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetEscalatedApplicationsCount15() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(null);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId"
                        + " ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND "
                        + " businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank"
                        + " = 2 ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount16() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER"
                        + " BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ? ) wf  WHERE"
                        + " rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ?  LIMIT ? ) as" + " count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetEscalatedApplicationsCount17() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn(null);
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select count(DISTINCT businessid) from (SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,"
                        + "  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank  FROM"
                        + " eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid"
                        + " WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId"
                        + " ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE  businessservice = ?"
                        + " ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2  OFFSET ?  LIMIT"
                        + " ? ) as count",
                workflowQueryBuilder.getEscalatedApplicationsCount(requestInfo, processInstanceSearchCriteria, objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test

    void testGetAutoEscalatedApplicationsFinalQuery() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
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
    void testGetAutoEscalatedApplicationsFinalQuery2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2 ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        assertEquals(2, objectList.size());
    }


    @Test

    void testGetAutoEscalatedApplicationsFinalQuery3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
    void testGetAutoEscalatedApplicationsFinalQuery4() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2 ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery5() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe",
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ",
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ",
                "42", "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2  AND asg = ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo, atLeast(1)).getUserInfo();
        assertEquals(3, objectList.size());
    }


    @Test

    void testGetAutoEscalatedApplicationsFinalQuery6() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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

    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery7() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  and businessId IN (  ?) AND  businessservice = ? ) wf  WHERE rank_number = 1"
                        + " AND wf.escalated = true ) ) final WHERE outer_rank = 2 ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery8() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        stringList.add("foo");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(true);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  and businessId IN (  ?, ?) AND  businessservice = ? ) wf  WHERE rank_number ="
                        + " 1 AND wf.escalated = true ) ) final WHERE outer_rank = 2 ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test

    void testGetAutoEscalatedApplicationsFinalQuery9() {

        WorkflowConfig workflowConfig = new WorkflowConfig();
        workflowConfig.setDefaultLimit(4);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
          }

    @Test
    void testGetAutoEscalatedApplicationsFinalQuery10() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery11() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 0, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }

    @Test

    void testGetAutoEscalatedApplicationsFinalQuery12() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, null, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
        doNothing().when(processInstanceSearchCriteria).setAssignee((String) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setBusinessService((String) any());
        doNothing().when(processInstanceSearchCriteria).setFromDate((Long) any());
        doNothing().when(processInstanceSearchCriteria).setHistory((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIds((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setIsAssignedToMeCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setIsEscalatedCount((Boolean) any());
        doNothing().when(processInstanceSearchCriteria).setLimit((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setModuleName((String) any());
        doNothing().when(processInstanceSearchCriteria).setMultipleAssignees((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setOffset((Integer) any());
        doNothing().when(processInstanceSearchCriteria).setStatesToIgnore((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatus((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setStatusesIrrespectiveOfTenant((java.util.List<String>) any());
        doNothing().when(processInstanceSearchCriteria).setTenantId((String) any());
        doNothing().when(processInstanceSearchCriteria).setTenantSpecifiStatus((java.util.List<String>) any());
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
      }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery13() {


        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(null);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery14() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(null);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetAutoEscalatedApplicationsFinalQuery15() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(null);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )"
                        + " ) final WHERE outer_rank = 2 ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery16() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn(null);
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  tenantid = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE outer_rank"
                        + " = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsFinalQuery17() {

        WorkflowConfig workflowConfig = new WorkflowConfig("UTC", 1, 1, 3, "Save Transition Topic",
                "Save Business Service Topic", "2020-03-01", "localhost", "https://config.us-east-2.amazonaws.com", "localhost",
                "https://config.us-east-2.amazonaws.com", true, "MD", 3);
        workflowConfig.setDefaultLimit(1);
        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(workflowConfig);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getLimit()).thenReturn(1);
        when(processInstanceSearchCriteria.getOffset()).thenReturn(2);
        when(processInstanceSearchCriteria.getIsEscalatedCount()).thenReturn(false);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn(null);
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT businessid from ( SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid"
                        + " ORDER BY wf.createdtime DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2"
                        + " assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK"
                        + " () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2"
                        + "  WHERE  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ) ) final WHERE"
                        + " outer_rank = 2  OFFSET ?  LIMIT ? ",
                workflowQueryBuilder.getAutoEscalatedApplicationsFinalQuery(requestInfo, processInstanceSearchCriteria,
                        objectList));
        verify(requestInfo).getUserInfo();
        verify(processInstanceSearchCriteria, atLeast(1)).getIsEscalatedCount();
        verify(processInstanceSearchCriteria, atLeast(1)).getLimit();
        verify(processInstanceSearchCriteria, atLeast(1)).getOffset();
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsRankedQuery() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime"
                        + " DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id ="
                        + " assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER"
                        + " (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE"
                        + "  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )",
                workflowQueryBuilder.getAutoEscalatedApplicationsRankedQuery(processInstanceSearchCriteria, objectList));
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsRankedQuery2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime"
                        + " DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id ="
                        + " assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER"
                        + " (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE"
                        + "  tenantid = ?  AND  businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true )",
                workflowQueryBuilder.getAutoEscalatedApplicationsRankedQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsRankedQuery3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime"
                        + " DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id ="
                        + " assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER"
                        + " (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE"
                        + "  tenantid = ?  and businessId IN (  ?) AND  businessservice = ? ) wf  WHERE rank_number = 1 AND"
                        + " wf.escalated = true )",
                workflowQueryBuilder.getAutoEscalatedApplicationsRankedQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }

    @Test
    void testGetAutoEscalatedApplicationsRankedQuery4() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT wf.* , assg.assignee AS asg,  DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime"
                        + " DESC) outer_rank  FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id ="
                        + " assg.processinstanceid WHERE wf.businessid IN (select businessId from (  SELECT *,RANK () OVER"
                        + " (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number  FROM eg_wf_processinstance_v2  WHERE"
                        + "  tenantid = ?  and businessId IN (  ?, ?) AND  businessservice = ? ) wf  WHERE rank_number = 1 AND"
                        + " wf.escalated = true )",
                workflowQueryBuilder.getAutoEscalatedApplicationsRankedQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsBusinessIdsQuery() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE"
                        + " rank_number = 1 AND wf.escalated = true ",
                workflowQueryBuilder.getAutoEscalatedApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsBusinessIdsQuery2() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(new ArrayList<>());
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  AND  businessservice = ? ) wf  WHERE"
                        + " rank_number = 1 AND wf.escalated = true ",
                workflowQueryBuilder.getAutoEscalatedApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(2, objectList.size());
    }

    @Test
    void testGetAutoEscalatedApplicationsBusinessIdsQuery3() {

        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  and businessId IN (  ?) AND "
                        + " businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ",
                workflowQueryBuilder.getAutoEscalatedApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(3, objectList.size());
    }


    @Test
    void testGetAutoEscalatedApplicationsBusinessIdsQuery4() {


        WorkflowQueryBuilder workflowQueryBuilder = new WorkflowQueryBuilder(new WorkflowConfig());

        ArrayList<String> stringList = new ArrayList<>();
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        stringList
                .add("select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 ");
        ProcessInstanceSearchCriteria processInstanceSearchCriteria = mock(ProcessInstanceSearchCriteria.class);
        when(processInstanceSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(processInstanceSearchCriteria.getTenantId()).thenReturn("42");
        when(processInstanceSearchCriteria.getBusinessIds()).thenReturn(stringList);
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
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2  WHERE  tenantid = ?  and businessId IN (  ?, ?) AND "
                        + " businessservice = ? ) wf  WHERE rank_number = 1 AND wf.escalated = true ",
                workflowQueryBuilder.getAutoEscalatedApplicationsBusinessIdsQuery(processInstanceSearchCriteria, objectList));
        verify(processInstanceSearchCriteria, atLeast(1)).getBusinessService();
        verify(processInstanceSearchCriteria, atLeast(1)).getTenantId();
        verify(processInstanceSearchCriteria).getBusinessIds();
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
        assertEquals(4, objectList.size());
    }
}

