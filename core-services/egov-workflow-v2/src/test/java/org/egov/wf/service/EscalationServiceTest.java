package org.egov.wf.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.repository.EscalationRepository;
import org.egov.wf.util.EscalationUtil;
import org.egov.wf.web.models.Escalation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {EscalationService.class})
@ExtendWith(SpringExtension.class)
class EscalationServiceTest {
    @MockBean
    private EscalationRepository escalationRepository;

    @Autowired
    private EscalationService escalationService;

    @MockBean
    private EscalationUtil escalationUtil;

    @MockBean
    private MDMSService mDMSService;

    @MockBean
    private Producer producer;

    @MockBean
    private WorkflowConfig workflowConfig;

    @MockBean
    private WorkflowService workflowService;


    @Test
    void testEscalateApplications() {
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(new ArrayList<>());
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(new ArrayList<>());
        this.escalationService.escalateApplications(new RequestInfo(), "Business Service");
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
    }


    @Test
    void testEscalateApplicationsWithString() {
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(mock(Escalation.class));
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(new ArrayList<>());
        this.escalationService.escalateApplications(new RequestInfo(), "Business Service");
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
    }


    @Test
    void testEscalateApplicationsWithStatus() {
        when(this.workflowConfig.getEscalationBatchSize()).thenReturn(3);
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalation.getStateSlaExceededBy()).thenReturn(1L);
        when(escalation.getBusinessService()).thenReturn("Business Service");
        when(escalation.getStatus()).thenReturn("Status");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(escalation);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        when(this.escalationUtil.getStatusUUID((String) any(), (String) any(), (String) any()))
                .thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(stringList);
        when(this.escalationRepository.getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        this.escalationService.escalateApplications(new RequestInfo(), "Business Service");
        verify(this.workflowConfig).getEscalationBatchSize();
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getStatusUUID((String) any(), (String) any(), (String) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
        verify(escalation).getBusinessSlaExceededBy();
        verify(escalation).getStateSlaExceededBy();
        verify(escalation, atLeast(1)).getBusinessService();
        verify(escalation).getStatus();
        verify(this.escalationRepository).getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any());
    }


    @Test
    void TestEscalateApplications() {
        when(this.workflowService.transition((org.egov.wf.web.models.ProcessInstanceRequest) any()))
                .thenReturn(new ArrayList<>());
        when(this.workflowConfig.getEscalationBatchSize()).thenReturn(3);
        doNothing().when(this.producer).push((String) any(), (Object) any());
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getTopic()).thenReturn("Topic");
        when(escalation.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalation.getStateSlaExceededBy()).thenReturn(1L);
        when(escalation.getBusinessService()).thenReturn("Business Service");
        when(escalation.getStatus()).thenReturn("Status");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(escalation);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        when(this.escalationUtil.getProcessInstances((String) any(), (List<String>) any(), (Escalation) any()))
                .thenReturn(new ArrayList<>());
        when(this.escalationUtil.getStatusUUID((String) any(), (String) any(), (String) any()))
                .thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(stringList);

        ArrayList<String> stringList1 = new ArrayList<>();
        stringList1.add("foo");
        when(this.escalationRepository.getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any()))
                .thenReturn(stringList1);
        this.escalationService.escalateApplications(new RequestInfo(), "Business Service");
        verify(this.workflowService).transition((org.egov.wf.web.models.ProcessInstanceRequest) any());
        verify(this.workflowConfig).getEscalationBatchSize();
        verify(this.producer).push((String) any(), (Object) any());
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getStatusUUID((String) any(), (String) any(), (String) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getProcessInstances((String) any(), (List<String>) any(), (Escalation) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
        verify(escalation).getBusinessSlaExceededBy();
        verify(escalation).getStateSlaExceededBy();
        verify(escalation, atLeast(1)).getBusinessService();
        verify(escalation).getStatus();
        verify(escalation).getTopic();
        verify(this.escalationRepository).getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any());
    }


    @Test
    void testEscalateApplicationsTest() {
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(new ArrayList<>());
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(new ArrayList<>());
        assertTrue(this.escalationService.escalateApplicationsTest(new RequestInfo(), "Business Service").isEmpty());
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
    }


    @Test
    void testEscalateApplicationsTestWithEmpty() {
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(mock(Escalation.class));
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(new ArrayList<>());
        assertTrue(this.escalationService.escalateApplicationsTest(new RequestInfo(), "Business Service").isEmpty());
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
    }


    @Test
    void testEscalateApplicationsTestWithEmptyBusinessService() {
        when(this.workflowConfig.getEscalationBatchSize()).thenReturn(3);
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalation.getStateSlaExceededBy()).thenReturn(1L);
        when(escalation.getBusinessService()).thenReturn("Business Service");
        when(escalation.getStatus()).thenReturn("Status");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(escalation);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        when(this.escalationUtil.getStatusUUID((String) any(), (String) any(), (String) any()))
                .thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(stringList);
        when(this.escalationRepository.getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        assertTrue(this.escalationService.escalateApplicationsTest(new RequestInfo(), "Business Service").isEmpty());
        verify(this.workflowConfig).getEscalationBatchSize();
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getStatusUUID((String) any(), (String) any(), (String) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
        verify(escalation).getBusinessSlaExceededBy();
        verify(escalation).getStateSlaExceededBy();
        verify(escalation, atLeast(1)).getBusinessService();
        verify(escalation).getStatus();
        verify(this.escalationRepository).getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any());
    }


    @Test
    void testEscalateApplicationsTestWithStringListAdd() {
        when(this.workflowConfig.getEscalationBatchSize()).thenReturn(3);
        when(this.mDMSService.mDMSCall((RequestInfo) any())).thenReturn("M DMSCall");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalation.getStateSlaExceededBy()).thenReturn(1L);
        when(escalation.getBusinessService()).thenReturn("Business Service");
        when(escalation.getStatus()).thenReturn("Status");

        ArrayList<Escalation> escalationList = new ArrayList<>();
        escalationList.add(escalation);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        when(this.escalationUtil.getProcessInstances((String) any(), (List<String>) any(), (Escalation) any()))
                .thenReturn(new ArrayList<>());
        when(this.escalationUtil.getStatusUUID((String) any(), (String) any(), (String) any()))
                .thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        when(this.escalationUtil.getEscalationsFromConfig((String) any(), (Object) any())).thenReturn(escalationList);
        when(this.escalationUtil.getTenantIds((Object) any())).thenReturn(stringList);

        ArrayList<String> stringList1 = new ArrayList<>();
        stringList1.add("foo");
        when(this.escalationRepository.getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any()))
                .thenReturn(stringList1);
        assertTrue(this.escalationService.escalateApplicationsTest(new RequestInfo(), "Business Service").isEmpty());
        verify(this.workflowConfig).getEscalationBatchSize();
        verify(this.mDMSService).mDMSCall((RequestInfo) any());
        verify(this.escalationUtil).getStatusUUID((String) any(), (String) any(), (String) any());
        verify(this.escalationUtil).getEscalationsFromConfig((String) any(), (Object) any());
        verify(this.escalationUtil).getProcessInstances((String) any(), (List<String>) any(), (Escalation) any());
        verify(this.escalationUtil).getTenantIds((Object) any());
        verify(escalation).getBusinessSlaExceededBy();
        verify(escalation).getStateSlaExceededBy();
        verify(escalation, atLeast(1)).getBusinessService();
        verify(escalation).getStatus();
        verify(this.escalationRepository).getBusinessIds((org.egov.wf.web.models.EscalationSearchCriteria) any());
    }
}

