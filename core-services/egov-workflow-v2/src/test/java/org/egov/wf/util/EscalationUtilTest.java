package org.egov.wf.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.tracer.model.CustomException;

import org.egov.wf.service.BusinessMasterService;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.Escalation;
import org.egov.wf.web.models.State;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {EscalationUtil.class})
@ExtendWith(SpringExtension.class)
class EscalationUtilTest {
    @MockBean
    private BusinessMasterService businessMasterService;

    @Autowired
    private EscalationUtil escalationUtil;


    @Test
    void testGetProcessInstances() {
        assertTrue(this.escalationUtil.getProcessInstances("42", new ArrayList<>(), mock(Escalation.class)).isEmpty());
    }


    @Test
    void testGetProcessInstancesWithAction() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getAction()).thenReturn("Action");
        when(escalation.getBusinessService()).thenReturn("Business Service");
        when(escalation.getModuleName()).thenReturn("Module Name");
        assertEquals(1, this.escalationUtil.getProcessInstances("42", stringList, escalation).size());
        verify(escalation).getAction();
        verify(escalation).getBusinessService();
        verify(escalation).getModuleName();
    }

    @Test
    void testGetProcessInstancesWithErrorCode() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        Escalation escalation = mock(Escalation.class);
        when(escalation.getAction()).thenThrow(new CustomException("Code", "An error occurred"));
        when(escalation.getBusinessService()).thenThrow(new CustomException("Code", "An error occurred"));
        when(escalation.getModuleName()).thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class, () -> this.escalationUtil.getProcessInstances("42", stringList, escalation));
        verify(escalation).getAction();
    }

    @Test
    void testGetStatusUUID() {
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        assertThrows(CustomException.class,
                () -> this.escalationUtil.getStatusUUID("Status Code", "42", "Business Service"));
        verify(this.businessMasterService).search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test

    void TestGetStatusUUID() {
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
          }


    @Test
    void testGetStatusUUIDWithBusinessNotFound() {
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenThrow(new CustomException("BUSINESSSERVICE_NOT_FOUND", "An error occurred"));
        assertThrows(CustomException.class,
                () -> this.escalationUtil.getStatusUUID("Status Code", "42", "Business Service"));
        verify(this.businessMasterService).search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test
    void testGetStatusUUIDWithStatusCode() {
        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(new State());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        assertThrows(CustomException.class,
                () -> this.escalationUtil.getStatusUUID("Status Code", "42", "Business Service"));
        verify(this.businessMasterService).search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }

    @Test

    void testGetStatusUUIDWithNull() {


        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(null);
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
          }

    @Test

    void testGetStatusUUIDWithNullStateItem() {


        BusinessService businessService = new BusinessService();
        businessService.addStatesItem(null);

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
           }


    @Test
    void testGetStatusUUIDStatusNotFound() {
        BusinessService businessService = new BusinessService();
        ArrayList<Action> actions = new ArrayList<>();
        businessService.addStatesItem(new State("01234567-89AB-CDEF-FEDC-BA9876543210", "42", "42", 1L, "MD",
                "STATUS_NOT_FOUND", true, true, true, true, actions, new AuditDetails()));

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(businessService);
        when(this.businessMasterService.search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        assertThrows(CustomException.class,
                () -> this.escalationUtil.getStatusUUID("Status Code", "42", "Business Service"));
        verify(this.businessMasterService).search((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test
    void testDaysToMillisecond() {
        assertEquals(864000000L, this.escalationUtil.daysToMillisecond(10.0d).longValue());
        assertNull(this.escalationUtil.daysToMillisecond(null));
    }
}

