package org.egov.wf.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;

import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;

import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.Document;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.egov.wf.web.models.ProcessStateAndAction;
import org.egov.wf.web.models.State;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {EnrichmentService.class})
@ExtendWith(SpringExtension.class)
class EnrichmentServiceTest {
    @Autowired
    private EnrichmentService enrichmentService;

    @MockBean
    private RestTemplate restTemplate;

    @MockBean
    private TransitionService transitionService;

    @MockBean
    private UserService userService;

    @MockBean
    private WorkflowUtil workflowUtil;


    @Test
    void testEnrichProcessRequest() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        User user = new User();
        requestInfo.setUserInfo(user);
        this.enrichmentService.enrichProcessRequest(requestInfo, new ArrayList<>());
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        assertSame(user, requestInfo.getUserInfo());
    }


    @Test
    void testEnrichProcessRequestWithRequestInfoList() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichProcessRequest(requestInfo, new ArrayList<>()));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }


    @Test

    void EnrichProcessRequest() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());

        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test
    void testEnrichProcessRequestWithError() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getAction()).thenThrow(new CustomException("Code", "An error occurred"));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichProcessRequest(requestInfo, processStateAndActionList));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        verify(processStateAndAction).getAction();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }

    @Test

    void testEnrichProcessRequestWithProcessStateAndActionList() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test
    void testEnrichProcessRequestWithInvalidUuid() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb())
                .thenThrow(new CustomException("INVALID UUID", "An error occurred"));
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichProcessRequest(requestInfo, processStateAndActionList));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        verify(processStateAndAction, atLeast(1)).getAction();
        verify(processStateAndAction).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).getResultantState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }

    @Test

    void testEnrichProcessRequestWithInstance() {

        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setLastModifiedTime(1L);
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(auditDetails);
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test

    void EnrichProcessRequestwithAction() {

        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        doNothing().when(auditDetails).setLastModifiedTime((Long) any());
        auditDetails.setLastModifiedTime(4L);
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(auditDetails);
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());
        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test

    void testEnrichProcessRequestReturnAuditDetails() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        doNothing().when(auditDetails).setLastModifiedTime((Long) any());
        auditDetails.setLastModifiedTime(4L);
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(auditDetails);
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAuditDetails(new AuditDetails());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(processInstance);
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test

    void TestEnrichProcessRequest() {

        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        doNothing().when(auditDetails).setLastModifiedTime((Long) any());
        auditDetails.setLastModifiedTime(4L);
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(auditDetails);
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());

        AuditDetails auditDetails1 = new AuditDetails();
        auditDetails1.setLastModifiedTime(1L);

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAuditDetails(auditDetails1);
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(processInstance);
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }

    @Test
    void testEnrichProcessRequests() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        doNothing().when(auditDetails).setLastModifiedTime((Long) any());
        auditDetails.setLastModifiedTime(4L);
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(auditDetails);
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        AuditDetails auditDetails1 = new AuditDetails();
        auditDetails1.setLastModifiedTime(4L);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();

        ProcessInstance processInstance = new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name",
                state, "Comment", documents, assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity",
                new AuditDetails(), 1, true);
        processInstance.setAuditDetails(auditDetails1);
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(processInstance);
        when(processStateAndAction.getResultantState()).thenReturn(new State());
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42",
                "Current State", "Action", "Next State", roles, new AuditDetails(), true));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichProcessRequest(requestInfo, processStateAndActionList));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).setLastModifiedTime((Long) any());
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        verify(processStateAndAction, atLeast(1)).getAction();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction, atLeast(1)).getResultantState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }

    @Test
    void TestEnrichUsers() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        this.enrichmentService.enrichUsers(requestInfo, new ArrayList<>());
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }


    @Test

    void testEnrichUsers() {

        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }


    @Test
    void testEnrichUsersWithCodeError() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class, () -> this.enrichmentService.enrichUsers(requestInfo, new ArrayList<>()));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }

    void testEnrichUsers4() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(
                new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name", state, "Comment", documents,
                        assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity", new AuditDetails(), 1, true));
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsers(requestInfo, processStateAndActionList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }


    @Test
    void testEnrichUserWIthNull() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(null);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(
                new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name", state, "Comment", documents,
                        assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity", new AuditDetails(), 1, true));
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsers(requestInfo, processStateAndActionList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }

    @Test
    void testEnrichUsersWithProcessInstance() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.addUsersItem(new User());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(processInstance);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(
                new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name", state, "Comment", documents,
                        assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity", new AuditDetails(), 1, true));
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsers(requestInfo, processStateAndActionList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }


    @Test
    void testEnrichUsersTrue() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ArrayList<User> userList = new ArrayList<>();
        userList.add(new User());
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<Action> nextActions = new ArrayList<>();
        ProcessInstance processInstance = new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name",
                state, "Comment", documents, assigner, userList, nextActions, 1L, 1L, "Previous Status", "Entity",
                new AuditDetails(), 1, true);

        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(processInstance);
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsers(requestInfo, processStateAndActionList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromDb();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }


    @Test

    void testEnrichUsersWithNull() {

        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getProcessInstanceFromDb()).thenReturn(new ProcessInstance());
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(null);
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);

    }

    @Test
    void testEnrichUsersFromSearch() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();
        this.enrichmentService.enrichUsersFromSearch(requestInfo, new ArrayList<>());
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }

    @Test

    void testEnrichUsersFromSearchWithNull() {

        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());

    }


    @Test
    void testEnrichUsersFromSearchWithCodeError() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsersFromSearch(requestInfo, new ArrayList<>()));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }


    @Test
    void testEnrichUsersFromSearchWithList() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAssigner(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsersFromSearch(requestInfo, processInstanceList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }

    @Test

    void testEnrichUsersFromSearchAddNull() {


        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(null);

    }


    @Test
    void testEnrichUsersFromSearchMapUser() {


        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.addUsersItem(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);

    }


    @Test
    void testEnrichUsersFromSearchWithUsersItem() {
        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAssigner(new User());
        processInstance.addUsersItem(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUsersFromSearch(requestInfo, processInstanceList));
        verify(this.userService).searchUser((RequestInfo) any(), (java.util.List<String>) any());
    }


    @Test

    void testEnrichUsersFromSearchWithNullItem() {

        when(this.userService.searchUser((RequestInfo) any(), (java.util.List<String>) any())).thenReturn(new HashMap<>());
        RequestInfo requestInfo = new RequestInfo();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.addUsersItem(null);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);

    }


    @Test
    void testEnrichNextActionForSearchWithEmpty() {
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        assertTrue(this.enrichmentService.enrichNextActionForSearch(requestInfo, new ArrayList<>()).isEmpty());
    }



    @Test
    void testEnrichNextActionForSearchWIthUserInfo() {
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        assertTrue(this.enrichmentService.enrichNextActionForSearch(requestInfo, new ArrayList<>()).isEmpty());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchAddProcessInstance() {
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(new ArrayList<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertTrue(this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).isEmpty());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(requestInfo).getUserInfo();
    }
    @Test
    void testEnrichNextActionForSearch() {
        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertEquals(1, this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).size());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchWithUser() {
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(new ArrayList<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        processInstanceList.add(new ProcessInstance());
        assertTrue(this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).isEmpty());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchWithNull() {

        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(new ArrayList<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(null);

    }

    @Test
    void testEnrichNextActionForSearchWithCodeNull() {
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertTrue(this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).isEmpty());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(requestInfo).getUserInfo();
    }
    @Test
    void testEnrichNextActionForSearchWithStateAction() {
        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ProcessStateAndAction processStateAndAction1 = new ProcessStateAndAction();
        processStateAndAction1.setAction(new Action());
        processStateAndAction1.setCurrentState(new State());
        processStateAndAction1.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction1.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction1.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction1);
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertEquals(2, this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).size());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchWithProcessInstance() {
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenThrow(new CustomException("Code", "An error occurred"));
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());
        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList));
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(processStateAndAction).getProcessInstanceFromRequest();
        verify(processStateAndAction).getCurrentState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
        verify(requestInfo).getUserInfo();
    }
    @Test
    void TestEnrichNextActionForSearchWithUser() {
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenReturn(null);
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());

    }

    @Test
    void testEnrichNextActionForSearchWithTrue() {
        when(this.workflowUtil.isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any())).thenReturn(true);
        State state = new State();
        state.addActionsItem(new Action());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenReturn(state);
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());
        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertEquals(1, this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).size());
        verify(this.workflowUtil).isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).getCurrentState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchWithFalse() {
        when(this.workflowUtil.isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any())).thenReturn(false);
        State state = new State();
        state.addActionsItem(new Action());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenReturn(state);
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertEquals(1, this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).size());
        verify(this.workflowUtil).isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).getCurrentState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearch15() {
        when(this.workflowUtil.isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any())).thenReturn(true);

        State state = new State();
        state.addActionsItem(new Action());
        state.addActionsItem(new Action());
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenReturn(state);
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertEquals(1, this.enrichmentService.enrichNextActionForSearch(requestInfo, processInstanceList).size());
        verify(this.workflowUtil, atLeast(1)).isRoleAvailable((String) any(),
                (List<org.egov.common.contract.request.Role>) any(), (List<String>) any());
        verify(this.transitionService).getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).getCurrentState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testEnrichNextActionForSearchWithTrueUser() {
        when(this.workflowUtil.isRoleAvailable((String) any(), (List<org.egov.common.contract.request.Role>) any(),
                (List<String>) any())).thenReturn(true);

        State state = new State();
        state.addActionsItem(null);
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getCurrentState()).thenReturn(state);
        when(processStateAndAction.getProcessInstanceFromRequest()).thenReturn(new ProcessInstance());
        doNothing().when(processStateAndAction).setAction((Action) any());
        doNothing().when(processStateAndAction).setCurrentState((State) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        doNothing().when(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        doNothing().when(processStateAndAction).setResultantState((State) any());
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        when(this.transitionService.getProcessStateAndActions((List<ProcessInstance>) any(), (Boolean) any()))
                .thenReturn(processStateAndActionList);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());

    }



    @Test
    void testEnrichCreateBusinessService() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setRequestInfo(requestInfo);

    }

    @Test
    void testEnrichCreateBusinessServiceWithList() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(new BusinessService());
        businessServiceRequest.setRequestInfo(requestInfo);

    }

    @Test
    void testEnrichCreateBusinessServiceWithSave() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());
        RequestInfo requestInfo = new RequestInfo();
        ArrayList<Role> roleList = new ArrayList<>();
        requestInfo.setUserInfo(
                new User(123L, "janedoe", "Name", "Type", "42", "42", roleList, "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setBusinessServices(new ArrayList<>());
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichCreateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        assertEquals(roleList, businessServiceRequest.getBusinessServices());
        assertSame(requestInfo, businessServiceRequest.getRequestInfo());
    }

    @Test
    void testEnrichCreateBusinessServiceCodeWithError() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setRequestInfo(requestInfo);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichCreateBusinessService(businessServiceRequest));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }

    @Test
    void TestEnrichCreateBusinessService() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));
        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        ArrayList<State> states = new ArrayList<>();
        businessServiceRequest.addBusinessServiceItem(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210",
                "Business Service", "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichCreateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }

    @Test
    void testEnrichCreateBusinessServiceWithNull() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(null);
        businessServiceRequest.setRequestInfo(requestInfo);

    }

    @Test
    void TestEnrichCreateBusinessServiceWithList() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(businessService);
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichCreateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }

    @Test
    void testEnrichCreateBusinessServiceWithAuditList() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());
        businessService.addStatesItem(new State());

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(businessService);
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichCreateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }

    @Test
    void testEnrichUpdateBusinessService3() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setRequestInfo(requestInfo);

    }

    @Test
    void testEnrichUpdateBusinessServiceWithUuid() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(new BusinessService());
        businessServiceRequest.setRequestInfo(requestInfo);

    }
    @Test
    void testEnrichUpdateBusinessServiceWithAuditDetails() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        ArrayList<Role> roleList = new ArrayList<>();
        requestInfo.setUserInfo(
                new User(123L, "janedoe", "Name", "Type", "42", "42", roleList, "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setBusinessServices(new ArrayList<>());
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichUpdateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
        assertEquals(roleList, businessServiceRequest.getBusinessServices());
        assertSame(requestInfo, businessServiceRequest.getRequestInfo());
    }

    @Test
    void testEnrichUpdateBusinessServiceWithCodeError() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.setRequestInfo(requestInfo);
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUpdateBusinessService(businessServiceRequest));
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }
    @Test
    void testEnrichUpdateBusinessServiceGetAuditDetails() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        ArrayList<State> states = new ArrayList<>();
        businessServiceRequest.addBusinessServiceItem(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210",
                "Business Service", "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichUpdateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }

    @Test
    void testEnrichUpdateBusinessServiceWithBusinessServiceItemNull() {

        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(null);
        businessServiceRequest.setRequestInfo(requestInfo);

    }


    @Test
    void testEnrichUpdateBusinessService() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(businessService);
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichUpdateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }


    @Test
    void TestEnrichUpdateBusinessService() {
        when(this.workflowUtil.getAuditDetails((String) any(), (Boolean) any())).thenReturn(new AuditDetails());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "Name", "Type", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());
        businessService.addStatesItem(new State());

        BusinessServiceRequest businessServiceRequest = new BusinessServiceRequest();
        businessServiceRequest.addBusinessServiceItem(businessService);
        businessServiceRequest.setRequestInfo(requestInfo);
        this.enrichmentService.enrichUpdateBusinessService(businessServiceRequest);
        verify(this.workflowUtil).getAuditDetails((String) any(), (Boolean) any());
    }


    @Test
    void testEnrichAndUpdateSlaForSearch() {

        this.enrichmentService.enrichAndUpdateSlaForSearch(new ArrayList<>());
    }


    @Test

    void testEnrichAndUpdateSlaForSearchWithList() {


        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());

    }


    @Test

    void testEnrichAndUpdateSlaForSearchAddProcessInstance() {


        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAuditDetails(new AuditDetails());
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);

    }


    @Test

    void testEnrichAndUpdateSlaForSearchWithTime() {
        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setLastModifiedTime(1L);
        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setAuditDetails(auditDetails);
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);

    }


    @Test
    void testEnrichAndUpdateSlaForSearchWithTrue() {
        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setLastModifiedTime(0L);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();
        ProcessInstance processInstance = new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name",
                state, "Comment", documents, assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity",
                new AuditDetails(), 1, true);
        processInstance.setAuditDetails(auditDetails);
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);
        this.enrichmentService.enrichAndUpdateSlaForSearch(processInstanceList);
    }


    @Test
    void testEnrichAndUpdateSlaForSearchWithInstanceList() {
        AuditDetails auditDetails = new AuditDetails();
        auditDetails.setLastModifiedTime(0L);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();

        ProcessInstance processInstance = new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name",
                state, "Comment", documents, assigner, assignes, nextActions, null, 1L, "Previous Status", "Entity",
                new AuditDetails(), 1, true);
        processInstance.setAuditDetails(auditDetails);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);
        this.enrichmentService.enrichAndUpdateSlaForSearch(processInstanceList);
    }


    @Test
    void TestEnrichAndUpdateSlaForSearch() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        doNothing().when(auditDetails).setLastModifiedTime((Long) any());
        auditDetails.setLastModifiedTime(0L);
        State state = new State();
        ArrayList<Document> documents = new ArrayList<>();
        User assigner = new User();
        ArrayList<User> assignes = new ArrayList<>();
        ArrayList<Action> nextActions = new ArrayList<>();

        ProcessInstance processInstance = new ProcessInstance("42", "42", "Business Service", "42", "Action", "Module Name",
                state, "Comment", documents, assigner, assignes, nextActions, 1L, 1L, "Previous Status", "Entity",
                new AuditDetails(), 1, true);
        processInstance.setAuditDetails(auditDetails);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(processInstance);
        this.enrichmentService.enrichAndUpdateSlaForSearch(processInstanceList);
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).setLastModifiedTime((Long) any());
    }


    @Test
    void testEnrichTenantIdForStateLevel() {

        this.enrichmentService.enrichTenantIdForStateLevel("42", new ArrayList<>());
    }




    @Test
    void testEnrichTenantIdForStateLevelWithBusinessList() {


        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
    }



    @Test
    void testEnrichTenantIdForStateLevelWithTenantId() {
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(new ArrayList<>());
        doNothing().when(businessService).setTenantId((String) any());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
        verify(businessService).getStates();
        verify(businessService).setTenantId((String) any());
    }


    @Test
    void testEnrichTenantIdForStateLevels() {
        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(stateList);
        doNothing().when(businessService).setTenantId((String) any());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
        verify(businessService).getStates();
        verify(businessService).setTenantId((String) any());
    }


    @Test
    void testEnrichTenantIdForStateLevelWithStates() {
        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        stateList.add(new State());
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(stateList);
        doNothing().when(businessService).setTenantId((String) any());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
        verify(businessService).getStates();
        verify(businessService).setTenantId((String) any());
    }


    @Test
    void testEnrichTenantIdForStateLevelWithAddState() {
        State state = new State();
        state.addActionsItem(new Action());
        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(state);
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(stateList);
        doNothing().when(businessService).setTenantId((String) any());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
        verify(businessService).getStates();
        verify(businessService).setTenantId((String) any());
    }


    @Test
    void testEnrichTenantIdForStateLevelWithState() {
        State state = new State();
        state.addActionsItem(new Action());
        state.addActionsItem(new Action());
        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(state);
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(stateList);
        doNothing().when(businessService).setTenantId((String) any());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        this.enrichmentService.enrichTenantIdForStateLevel("42", businessServiceList);
        verify(businessService).getStates();
        verify(businessService).setTenantId((String) any());
    }


    @Test

    void testEnrichTenantIdForStateLevelStateList() {

        State state = new State();
        state.addActionsItem(null);

        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(state);
        BusinessService businessService = mock(BusinessService.class);
        when(businessService.getStates()).thenReturn(stateList);
        doNothing().when(businessService).setTenantId((String) any());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);

    }


    @Test
    void testEnrichUuidsOfAutoEscalationEmployees() {
        when(this.userService.searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any()))
                .thenReturn(new ArrayList<>());
        RequestInfo requestInfo = new RequestInfo();

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
        assertTrue(this.enrichmentService.enrichUuidsOfAutoEscalationEmployees(requestInfo, processInstanceSearchCriteria)
                .isEmpty());
        verify(this.userService).searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any());
        assertEquals(stringList, processInstanceSearchCriteria.getMultipleAssignees());
    }


    @Test
    void testEnrichUuidsOfAutoEscalationEmployeesWithStringList() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("AUTO_ESCALATE");
        when(this.userService.searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any()))
                .thenReturn(stringList);
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
        Set<String> actualEnrichUuidsOfAutoEscalationEmployeesResult = this.enrichmentService
                .enrichUuidsOfAutoEscalationEmployees(requestInfo, processInstanceSearchCriteria);
        assertEquals(1, actualEnrichUuidsOfAutoEscalationEmployeesResult.size());
        assertTrue(actualEnrichUuidsOfAutoEscalationEmployeesResult.contains("AUTO_ESCALATE"));
        verify(this.userService).searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any());
        assertEquals(1, processInstanceSearchCriteria.getMultipleAssignees().size());
    }


    @Test
    void testEnrichUuidsOfAutoEscalationEmployeesWithAutoEscalate() {
        when(this.userService.searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any()))
                .thenThrow(new CustomException("AUTO_ESCALATE", "An error occurred"));
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
        assertThrows(CustomException.class,
                () -> this.enrichmentService.enrichUuidsOfAutoEscalationEmployees(requestInfo, processInstanceSearchCriteria));
        verify(this.userService).searchUserUuidsBasedOnRoleCodes((org.egov.wf.web.models.user.UserSearchRequest) any());
    }


    @Test
    void testFetchStatesToIgnoreFromMdms() {
        assertTrue(this.enrichmentService.fetchStatesToIgnoreFromMdms(new RequestInfo(), "42").isEmpty());
        assertTrue(this.enrichmentService.fetchStatesToIgnoreFromMdms(new RequestInfo(), "").isEmpty());
    }
}

