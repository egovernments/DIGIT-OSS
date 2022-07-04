package org.egov.wf.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
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

@ContextConfiguration(classes = {StatusUpdateService.class})
@ExtendWith(SpringExtension.class)
class StatusUpdateServiceTest {
    @MockBean
    private Producer producer;

    @Autowired
    private StatusUpdateService statusUpdateService;

    @MockBean
    private WorkflowConfig workflowConfig;


    @Test
    void testUpdateStatus() {
        when(this.workflowConfig.getSaveTransitionTopic()).thenReturn("Save Transition Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        RequestInfo requestInfo = new RequestInfo();
        this.statusUpdateService.updateStatus(requestInfo, new ArrayList<>());
        verify(this.workflowConfig).getSaveTransitionTopic();
        verify(this.producer).push((String) any(), (Object) any());
    }


    @Test
    void testUpdateStatusWithSaveTransition() {
        when(this.workflowConfig.getSaveTransitionTopic()).thenReturn("Save Transition Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        RequestInfo requestInfo = new RequestInfo();

        ProcessStateAndAction processStateAndAction = new ProcessStateAndAction();
        processStateAndAction.setAction(new Action());
        processStateAndAction.setCurrentState(new State());
        processStateAndAction.setProcessInstanceFromDb(new ProcessInstance());
        processStateAndAction.setProcessInstanceFromRequest(new ProcessInstance());
        processStateAndAction.setResultantState(new State());

        ArrayList<ProcessStateAndAction> processStateAndActionList = new ArrayList<>();
        processStateAndActionList.add(processStateAndAction);
        this.statusUpdateService.updateStatus(requestInfo, processStateAndActionList);
        verify(this.workflowConfig).getSaveTransitionTopic();
        verify(this.producer).push((String) any(), (Object) any());
    }


    @Test
    void TestUpdateStatus() {
        when(this.workflowConfig.getSaveTransitionTopic()).thenReturn("Save Transition Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        RequestInfo requestInfo = new RequestInfo();

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
        this.statusUpdateService.updateStatus(requestInfo, processStateAndActionList);
        verify(this.workflowConfig).getSaveTransitionTopic();
        verify(this.producer).push((String) any(), (Object) any());
    }


    @Test
    void testUpdateStatusWithGetResult() {
        when(this.workflowConfig.getSaveTransitionTopic()).thenReturn("Save Transition Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getResultantState()).thenReturn(new State());
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
        this.statusUpdateService.updateStatus(requestInfo, processStateAndActionList);
        verify(this.workflowConfig).getSaveTransitionTopic();
        verify(this.producer).push((String) any(), (Object) any());
        verify(processStateAndAction, atLeast(1)).getProcessInstanceFromRequest();
        verify(processStateAndAction).getResultantState();
        verify(processStateAndAction).setAction((Action) any());
        verify(processStateAndAction).setCurrentState((State) any());
        verify(processStateAndAction).setProcessInstanceFromDb((ProcessInstance) any());
        verify(processStateAndAction).setProcessInstanceFromRequest((ProcessInstance) any());
        verify(processStateAndAction).setResultantState((State) any());
    }


    @Test

    void testUpdateStatusWithNull() {

        when(this.workflowConfig.getSaveTransitionTopic()).thenReturn("Save Transition Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        RequestInfo requestInfo = new RequestInfo();
        ProcessStateAndAction processStateAndAction = mock(ProcessStateAndAction.class);
        when(processStateAndAction.getResultantState()).thenReturn(new State());
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
}

