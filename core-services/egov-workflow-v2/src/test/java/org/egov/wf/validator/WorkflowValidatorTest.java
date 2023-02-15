package org.egov.wf.validator;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.BusinessUtil;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.Document;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.ProcessStateAndAction;
import org.egov.wf.web.models.State;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {WorkflowValidator.class})
@ExtendWith(SpringExtension.class)
class WorkflowValidatorTest {
    @MockBean
    private BusinessUtil businessUtil;

    @MockBean
    private WorkflowUtil workflowUtil;

    @Autowired
    private WorkflowValidator workflowValidator;





    @Test

    void testValidateRequestWithProcessInstance() {


        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
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
    void testValidateRequestWithErrorCode() {
        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any()))
                .thenThrow(new CustomException("\\.", "An error occurred"));
        RequestInfo requestInfo = new RequestInfo();

        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        assertThrows(CustomException.class,
                () -> this.workflowValidator.validateRequest(requestInfo, processStateAndActionList));
        verify(this.businessUtil).getBusinessService((String) any(), (String) any());
    }

    @Test

    void testValidateRequest() {

        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getAction()).thenReturn(new Action());
        when(processStateAndAction.getCurrentState()).thenReturn(new State());
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

    }


    @Test

    void testValidateRequestWithNull() {


        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getAction()).thenReturn(null);
        when(processStateAndAction.getCurrentState()).thenReturn(new State());
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

    }


    @Test
    void TestValidateRequest() {
        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        ArrayList<String> roles = new ArrayList<>();
        when(processStateAndAction.getAction()).thenReturn(
                new Action("01234567-89AB-CDEF-FEDC-BA9876543210", "42", "\\.", "\\.", "\\.", roles, new AuditDetails(), true));
        when(processStateAndAction.getCurrentState()).thenReturn(new State());
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
                () -> this.workflowValidator.validateRequest(requestInfo, processStateAndActionList));
        verify(this.workflowUtil).getTenantIdToUserRolesMap((RequestInfo) any());
        verify(this.businessUtil).getBusinessService((String) any(), (String) any());
        verify(processStateAndAction).getAction();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }


    @Test

    void testValidateRequestState() {

        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getAction()).thenReturn(new Action());
        when(processStateAndAction.getCurrentState()).thenReturn(new State());
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
    void testValidateRequests() {
        when(this.workflowUtil.getTenantIdToUserRolesMap((RequestInfo) any())).thenReturn(new HashMap<>());
        when(this.businessUtil.getBusinessService((String) any(), (String) any())).thenReturn(new BusinessService());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getAction()).thenThrow(new CustomException("\\.", "An error occurred"));
        when(processStateAndAction.getCurrentState()).thenThrow(new CustomException("\\.", "An error occurred"));
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
                () -> this.workflowValidator.validateRequest(requestInfo, processStateAndActionList));
        verify(this.workflowUtil).getTenantIdToUserRolesMap((RequestInfo) any());
        verify(this.businessUtil).getBusinessService((String) any(), (String) any());
        verify(processStateAndAction).getAction();
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }
}

