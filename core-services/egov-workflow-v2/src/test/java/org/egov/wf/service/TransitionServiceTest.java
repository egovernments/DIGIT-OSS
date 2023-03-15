package org.egov.wf.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.tracer.model.CustomException;

import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.repository.WorKflowRepository;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.State;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {TransitionService.class})
@ExtendWith(SpringExtension.class)
class TransitionServiceTest {
    @MockBean
    private BusinessServiceRepository businessServiceRepository;

    @Autowired
    private TransitionService transitionService;

    @MockBean
    private WorKflowRepository worKflowRepository;

    @MockBean
    private WorkflowUtil workflowUtil;





    @Test
    void testGetProcessStateAndActionsWithTrue() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertThrows(CustomException.class,
                () -> this.transitionService.getProcessStateAndActions(processInstanceList, true));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }

    @Test

    void testGetProcessStateAndActionsWithBusinessServiceList() {


        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());

    }


    @Test
    void testGetProcessStateAndActionsWithCodeError() {
        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertThrows(CustomException.class,
                () -> this.transitionService.getProcessStateAndActions(processInstanceList, true));
        verify(this.worKflowRepository).getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any());
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test

    void testGetProcessStateAndActions() {


        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(processInstanceList);

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList1 = new ArrayList<>();
        processInstanceList1.add(new ProcessInstance());
          }


    @Test
    void testGetProcessStateAndAction() {
        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertThrows(CustomException.class,
                () -> this.transitionService.getProcessStateAndActions(processInstanceList, true));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test
    void TestGetProcessStateAndActions() {
        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        assertThrows(CustomException.class,
                () -> this.transitionService.getProcessStateAndActions(processInstanceList, true));
        verify(this.workflowUtil).rolesAllowedInService((BusinessService) any());
        verify(this.worKflowRepository).getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any());
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test

    void testGetProcessStateAndActionsWithList() {


        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        BusinessService businessService = new BusinessService();
        businessService.setStates(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
           }


    @Test

    void testGetProcessStateAndActionsWithDoc() {

        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        ArrayList<Action> actions = new ArrayList<>();
        stateList.add(new State("01234567-89AB-CDEF-FEDC-BA9876543210", "42", "42", 1L, "MD", "Application Status", true,
                true, true, true, actions, new AuditDetails()));

        BusinessService businessService = new BusinessService();
        businessService.setStates(stateList);

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
          }


    @Test

    void testGetProcessStateAndActionsWithBusinessListTrue() {

        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        ArrayList<Action> actions = new ArrayList<>();
        stateList.add(new State("01234567-89AB-CDEF-FEDC-BA9876543210", "42", "42", 1L, "MD", "Application Status", true,
                true, true, true, actions, new AuditDetails()));
        BusinessService businessService = new BusinessService();
        businessService.setStates(stateList);
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(null);
          }


    @Test

    void testGetProcessStateAndActionsStateList() {

        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        ArrayList<Action> actions = new ArrayList<>();
        stateList.add(new State("01234567-89AB-CDEF-FEDC-BA9876543210", "42", "42", 1L, "MD", "Application Status", true,
                true, true, true, actions, new AuditDetails()));

        BusinessService businessService = new BusinessService();
        businessService.setStates(stateList);

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        processInstanceList.add(null);
           }


    @Test

    void testGetProcessStateAndActionsAddState() {

        when(this.workflowUtil.rolesAllowedInService((BusinessService) any())).thenReturn(new ArrayList<>());
        when(this.worKflowRepository.getProcessInstances((org.egov.wf.web.models.ProcessInstanceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        State state = new State();
        state.addActionsItem(new Action());

        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(state);

        BusinessService businessService = new BusinessService();
        businessService.setStates(stateList);

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<ProcessInstance> processInstanceList = new ArrayList<>();
        processInstanceList.add(new ProcessInstance());
        }
}

