package org.egov.collection.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class PaymentValidatorTest {

    @Test
    void testValidatePaymentForCreate7() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.CHEQUE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenThrow(new CustomException("INVALID_REQUEST_INFO", "An error occurred"));
        when(paymentRequest.getPayment()).thenReturn(new Payment());
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> paymentValidator.validatePaymentForCreate(paymentRequest));
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testValidatePaymentForCreate9() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchGetResult((String) any()))
                .thenThrow(new CustomException("INVALID_USER_INFO", "An error occurred"));
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), serviceRequestRepository);

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.CHEQUE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        when(paymentRequest.getPayment()).thenReturn(new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L,
                PaymentModeEnum.CASH, 4L, "42", InstrumentStatusEnum.APPROVED, "INVALID_USER_INFO", auditDetails,
                additionalDetails, new ArrayList<>(), "INVALID_USER_INFO", "42", "INVALID_USER_INFO", "42 Main St",
                "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> paymentValidator.validatePaymentForCreate(paymentRequest));
        verify(paymentRepository).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
        verify(serviceRequestRepository).fetchGetResult((String) any());
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testValidateUserInfo() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = new RequestInfo();
        HashMap<String, String> stringStringMap = new HashMap<>();
        paymentValidator.validateUserInfo(requestInfo, stringStringMap);
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo2() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        HashMap<String, String> stringStringMap = new HashMap<>();
        paymentValidator.validateUserInfo(null, stringStringMap);
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo3() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = new RequestInfo("42", "INVALID_USER_INFO", 1L, "INVALID_USER_INFO", "INVALID_USER_INFO",
                "INVALID_USER_INFO", "42", "ABC123", "42", new User());

        HashMap<String, String> stringStringMap = new HashMap<>();
        paymentValidator.validateUserInfo(requestInfo, stringStringMap);
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo4() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        HashMap<String, String> stringStringMap = new HashMap<>();
        paymentValidator.validateUserInfo(requestInfo, stringStringMap);
        verify(requestInfo, atLeast(1)).getUserInfo();
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateUserInfo5() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateUserInfo(requestInfo, new HashMap<>());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateUserInfo6() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenThrow(new CustomException("INVALID_USER_INFO", "An error occurred"));
        assertThrows(CustomException.class, () -> paymentValidator.validateUserInfo(requestInfo, new HashMap<>()));
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testValidateUserInfo7() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(
                new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42", "42", new ArrayList<>(), "42", ""));
        HashMap<String, String> stringStringMap = new HashMap<>();
        paymentValidator.validateUserInfo(requestInfo, stringStringMap);
        verify(requestInfo, atLeast(1)).getUserInfo();
        assertEquals(1, stringStringMap.size());
    }

    @Test
    void testValidateAndEnrichPaymentsForUpdate() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(paymentList);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        ArrayList<Payment> payments = new ArrayList<>();
        List<Payment> actualValidateAndEnrichPaymentsForUpdateResult = paymentValidator
                .validateAndEnrichPaymentsForUpdate(payments, new RequestInfo());
        assertSame(paymentList, actualValidateAndEnrichPaymentsForUpdateResult);
        assertTrue(actualValidateAndEnrichPaymentsForUpdateResult.isEmpty());
        verify(paymentRepository).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
    }

    @Test
    void testValidateAndEnrichPaymentsForUpdate3() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(new Payment());
        assertThrows(CustomException.class,
                () -> paymentValidator.validateAndEnrichPaymentsForUpdate(paymentList, new RequestInfo()));
        verify(paymentRepository).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
    }

    @Test
    void testValidateAndEnrichPaymentsForUpdate4() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        ArrayList<Payment> payments = new ArrayList<>();
        assertThrows(CustomException.class,
                () -> paymentValidator.validateAndEnrichPaymentsForUpdate(payments, new RequestInfo()));
        verify(paymentRepository).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
    }


    @Test
    void testValidateAndUpdateSearchRequestFromConfig() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        assertThrows(CustomException.class, () -> paymentValidator
                .validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, new RequestInfo(), "Module Name"));
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig2() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        assertThrows(CustomException.class,
                () -> paymentValidator.validateAndUpdateSearchRequestFromConfig(new PaymentSearchCriteria(), null, null));
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig3() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        assertThrows(CustomException.class,
                () -> paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria,
                        new RequestInfo("42", "INVALID_USER_INFO", 1L, "INVALID_USER_INFO", "INVALID_USER_INFO",
                                "INVALID_USER_INFO", "42", "ABC123", "42", new User()),
                        "Module Name"));
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig4() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        assertThrows(CustomException.class, () -> paymentValidator
                .validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name"));
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig7() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenThrow(new CustomException("INVALID_USER_INFO", "An error occurred"));
        assertThrows(CustomException.class, () -> paymentValidator
                .validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name"));
        verify(requestInfo).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig8() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(new ArrayList<>());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(requestInfo, atLeast(1)).getUserInfo();
        assertEquals(1, paymentSearchCriteria.getBusinessServices().size());
    }


    @Test
    void testValidateAndUpdateSearchRequestFromConfig12() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(new ArrayList<>());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig13() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setStatus((Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        verify(paymentSearchCriteria).setStatus((Set<String>) any());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig14() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("EMPLOYEE");
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenReturn(stringSet);
        doNothing().when(paymentSearchCriteria).setStatus((Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig15() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("EMPLOYEE");
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setStatus((Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(stringSet);
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(paymentSearchCriteria, atLeast(1)).getBusinessServices();
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setStatus((Set<String>) any());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig16() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("EMPLOYEE");
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setStatus((Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(stringSet);
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        paymentValidator.validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name");
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig18() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setStatus((java.util.Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((java.util.Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(
                new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42", "42", new ArrayList<>(), "42", ""));
        assertThrows(CustomException.class, () -> paymentValidator
                .validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name"));
        verify(requestInfo, atLeast(1)).getUserInfo();
    }

    @Test
    void testValidateAndUpdateSearchRequestFromConfig19() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("EMPLOYEE");

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setSearchIgnoreStatus(stringList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository,
                new PaymentWorkflowService(paymentRepository1, paymentWorkflowValidator, collectionProducer,
                        new ApplicationProperties()),
                applicationProperties, mock(ServiceRequestRepository.class));
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getStatus()).thenThrow(new CustomException("EMPLOYEE", "An error occurred"));
        doThrow(new CustomException("EMPLOYEE", "An error occurred")).when(paymentSearchCriteria)
                .setStatus((Set<String>) any());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setBusinessServices((Set<String>) any());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User(123L, "janedoe", "INVALID_USER_ID", "INVALID_USER_ID", "42",
                "42", new ArrayList<>(), "42", "01234567-89AB-CDEF-FEDC-BA9876543210"));
        assertThrows(CustomException.class, () -> paymentValidator
                .validateAndUpdateSearchRequestFromConfig(paymentSearchCriteria, requestInfo, "Module Name"));
        verify(paymentSearchCriteria).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(requestInfo, atLeast(1)).getUserInfo();
    }
}

