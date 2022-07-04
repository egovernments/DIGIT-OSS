package org.egov.wf.validator;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.tracer.model.CustomException;

import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.State;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessServiceValidator.class})
@ExtendWith(SpringExtension.class)
class BusinessServiceValidatorTest {
    @MockBean
    private BusinessServiceRepository businessServiceRepository;

    @Autowired
    private BusinessServiceValidator businessServiceValidator;


    @Test

    void testValidateCreateRequestWithArrayList() {

        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(new ArrayList<>());

    }


    @Test
    void testValidateCreateRequestWithAddBusinessService() {

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);

    }


    @Test
    void testValidateCreateRequestWithAuditDetails() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        this.businessServiceValidator.validateCreateRequest(businessServiceRequest);
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }

    @Test
    void TestValidateCreateRequest() {
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);
        this.businessServiceValidator.validateCreateRequest(businessServiceRequest);
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test
    void testValidateCreateRequestWithAddState() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        BusinessService e = new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, stateList, new AuditDetails());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(e);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        this.businessServiceValidator.validateCreateRequest(businessServiceRequest);
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test

    void testValidateCreateRequestWithNull() {

        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(null);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);

    }


    @Test
    void testValidateCreateRequestWithErrorCode() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class,
                () -> this.businessServiceValidator.validateCreateRequest(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test
    void testValidateCreateRequestBusinessServiceList1() {
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);
        this.businessServiceValidator.validateCreateRequest(businessServiceRequest);
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test
    void testValidateCreateRequestBServiceList() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        stateList.add(new State());
        BusinessService e = new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, stateList, new AuditDetails());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(e);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class,
                () -> this.businessServiceValidator.validateCreateRequest(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test

    void testValidateCreateRequests() {

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(null);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 1L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);

    }



    @Test

    void testValidateUpdate() {
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(new ArrayList<>());

    }


    @Test
    void testValidateUpdateWithAddList() {


        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);

    }


    @Test
    void testValidateUpdateWithState() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class, () -> this.businessServiceValidator.validateUpdate(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test

    void testValidateUpdates() {

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);

    }


    @Test
    void testValidateUpdateWithAdd() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        BusinessService e = new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, stateList, new AuditDetails());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(e);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class, () -> this.businessServiceValidator.validateUpdate(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test

    void testValidateUpdateWithNull() {

        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(null);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);

    }


    @Test
    void testValidateUpdateWithInvalidNull() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenThrow(new CustomException("INVALID UUID", "An error occurred"));

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class, () -> this.businessServiceValidator.validateUpdate(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }

    @Test

    void TestValidateUpdate() {

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(new BusinessService());
        businessServiceList.add(new BusinessService());
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);

    }


    @Test
    void testValidateUpdateWithAddState() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<State> stateList = new ArrayList<>();
        stateList.add(new State());
        stateList.add(new State());
        BusinessService e = new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, stateList, new AuditDetails());

        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        businessServiceList.add(e);
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList);
        assertThrows(CustomException.class, () -> this.businessServiceValidator.validateUpdate(businessServiceRequest));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }


    @Test
    void testValidateUpdateList1Add() {
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        ArrayList<State> states = new ArrayList<>();
        businessServiceList.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states, new AuditDetails()));
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);

        ArrayList<BusinessService> businessServiceList1 = new ArrayList<>();
        ArrayList<State> states1 = new ArrayList<>();
        businessServiceList1.add(new BusinessService("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Business Service",
                "Business", "Get Uri", "Post Uri", 4L, states1, new AuditDetails()));
        BusinessServiceRequest businessServiceRequest = mock(BusinessServiceRequest.class);
        when(businessServiceRequest.getBusinessServices()).thenReturn(businessServiceList1);
        this.businessServiceValidator.validateUpdate(businessServiceRequest);
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
        verify(businessServiceRequest, atLeast(1)).getBusinessServices();
    }
}

