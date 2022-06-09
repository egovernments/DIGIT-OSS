package org.egov.collection.service;

import com.fasterxml.jackson.databind.node.MissingNode;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.*;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.util.PaymentEnricher;
import org.egov.collection.util.PaymentValidator;
import org.egov.collection.util.PaymentWorkflowValidator;
import org.egov.collection.web.contract.Bill;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentServiceTest {

    @Test
    void testGetPayments2() {

        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        doNothing().when(paymentValidator)
                .validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(), (RequestInfo) any(), (String) any());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPayments((PaymentSearchCriteria) any())).thenReturn(paymentList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        RequestInfo requestInfo = new RequestInfo();
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria();
        List<Payment> actualPayments = paymentService.getPayments(requestInfo, paymentSearchCriteria, "Module Name");
        assertSame(paymentList, actualPayments);
        assertTrue(actualPayments.isEmpty());
        verify(paymentValidator).validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(),
                (RequestInfo) any(), (String) any());
        verify(paymentRepository).fetchPayments((PaymentSearchCriteria) any());
        assertEquals(0, paymentSearchCriteria.getOffset().intValue());
        assertNull(paymentSearchCriteria.getLimit());
    }

    @Test
    void testGetPayments3() {

        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        doNothing().when(paymentValidator)
                .validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(), (RequestInfo) any(), (String) any());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((PaymentSearchCriteria) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class,
                () -> paymentService.getPayments(requestInfo, new PaymentSearchCriteria(), "Module Name"));
        verify(paymentValidator).validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(),
                (RequestInfo) any(), (String) any());
        verify(paymentRepository).fetchPayments((PaymentSearchCriteria) any());
    }

    @Test
    void testGetPayments6() {

        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        doNothing().when(paymentValidator)
                .validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(), (RequestInfo) any(), (String) any());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPayments((PaymentSearchCriteria) any())).thenReturn(paymentList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        RequestInfo requestInfo = new RequestInfo();
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        doNothing().when(paymentSearchCriteria).setLimit((Integer) any());
        doNothing().when(paymentSearchCriteria).setOffset((Integer) any());
        List<Payment> actualPayments = paymentService.getPayments(requestInfo, paymentSearchCriteria, "Module Name");
        assertSame(paymentList, actualPayments);
        assertTrue(actualPayments.isEmpty());
        verify(paymentValidator).validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(),
                (RequestInfo) any(), (String) any());
        verify(paymentRepository).fetchPayments((PaymentSearchCriteria) any());
        verify(paymentSearchCriteria).setLimit((Integer) any());
        verify(paymentSearchCriteria).setOffset((Integer) any());
    }

    @Test
    void testGetPayments7() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setPaymentsSearchPaginationEnabled(true);
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        doNothing().when(paymentValidator)
                .validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(), (RequestInfo) any(), (String) any());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPayments((PaymentSearchCriteria) any())).thenReturn(paymentList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        RequestInfo requestInfo = new RequestInfo();
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getLimit()).thenReturn(1);
        when(paymentSearchCriteria.getOffset()).thenReturn(2);
        doNothing().when(paymentSearchCriteria).setLimit((Integer) any());
        doNothing().when(paymentSearchCriteria).setOffset((Integer) any());
        List<Payment> actualPayments = paymentService.getPayments(requestInfo, paymentSearchCriteria, "Module Name");
        assertSame(paymentList, actualPayments);
        assertTrue(actualPayments.isEmpty());
        verify(paymentValidator).validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(),
                (RequestInfo) any(), (String) any());
        verify(paymentRepository).fetchPayments((PaymentSearchCriteria) any());
        verify(paymentSearchCriteria, atLeast(1)).getLimit();
        verify(paymentSearchCriteria, atLeast(1)).getOffset();
        verify(paymentSearchCriteria).setLimit((Integer) any());
        verify(paymentSearchCriteria).setOffset((Integer) any());
    }

    @Test
    void testGetPayments8() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setPaymentsSearchPaginationEnabled(true);
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        doNothing().when(paymentValidator)
                .validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(), (RequestInfo) any(), (String) any());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((PaymentSearchCriteria) any())).thenReturn(new ArrayList<>());
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        RequestInfo requestInfo = new RequestInfo();
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getLimit()).thenThrow(new CustomException("Code", "An error occurred"));
        when(paymentSearchCriteria.getOffset()).thenThrow(new CustomException("Code", "An error occurred"));
        doNothing().when(paymentSearchCriteria).setLimit((Integer) any());
        doNothing().when(paymentSearchCriteria).setOffset((Integer) any());
        assertThrows(CustomException.class,
                () -> paymentService.getPayments(requestInfo, paymentSearchCriteria, "Module Name"));
        verify(paymentValidator).validateAndUpdateSearchRequestFromConfig((PaymentSearchCriteria) any(),
                (RequestInfo) any(), (String) any());
        verify(paymentSearchCriteria).getOffset();
    }

    @Test
    void testGetpaymentcountForBusiness() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.getPaymentsCount((String) any(), (String) any())).thenReturn(3L);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        assertEquals(3L,
                (new PaymentService(apportionerService, paymentEnricher, applicationProperties, userService, paymentValidator,
                        paymentRepository, new CollectionProducer())).getpaymentcountForBusiness("foo", "foo").longValue());
        verify(paymentRepository).getPaymentsCount((String) any(), (String) any());
    }

    @Test
    void testGetpaymentcountForBusiness2() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.getPaymentsCount((String) any(), (String) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        assertThrows(CustomException.class,
                () -> (new PaymentService(apportionerService, paymentEnricher, applicationProperties, userService,
                        paymentValidator, paymentRepository, new CollectionProducer())).getpaymentcountForBusiness("foo", "foo"));
        verify(paymentRepository).getPaymentsCount((String) any(), (String) any());
    }

    @Test
    void testCreatePayment5() {

        ApportionerService apportionerService = mock(ApportionerService.class);
        when(apportionerService.apportionBill((PaymentRequest) any())).thenReturn(new HashMap<>());
        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doThrow(new CustomException("Code", "An error occurred")).when(paymentEnricher)
                .enrichAdvanceTaxHead((List<Bill>) any());
        doNothing().when(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        assertThrows(CustomException.class, () -> paymentService.createPayment(new PaymentRequest()));
        verify(apportionerService).apportionBill((PaymentRequest) any());
        verify(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        verify(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
    }

    @Test
    void testCreatePayment8() {

        ApportionerService apportionerService = mock(ApportionerService.class);
        when(apportionerService.apportionBill((PaymentRequest) any())).thenReturn(new HashMap<>());
        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doNothing().when(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        doNothing().when(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());

        Payment payment = new Payment();
        payment.addpaymentDetailsItem(new PaymentDetail());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> paymentService.createPayment(paymentRequest));
        verify(apportionerService).apportionBill((PaymentRequest) any());
        verify(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        verify(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
    }

    @Test
    void testCreatePayment9() {

        ApportionerService apportionerService = mock(ApportionerService.class);
        when(apportionerService.apportionBill((PaymentRequest) any())).thenReturn(new HashMap<>());
        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doNothing().when(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        doNothing().when(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());

        Payment payment = new Payment();
        payment.addpaymentDetailsItem(new PaymentDetail());
        payment.addpaymentDetailsItem(new PaymentDetail());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> paymentService.createPayment(paymentRequest));
        verify(apportionerService).apportionBill((PaymentRequest) any());
        verify(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        verify(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
    }

    @Test
    void testCreatePayment14() {

        ApportionerService apportionerService = mock(ApportionerService.class);
        when(apportionerService.apportionBill((PaymentRequest) any())).thenReturn(new HashMap<>());
        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doNothing().when(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        doNothing().when(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        doNothing().when(paymentRepository).savePayment((Payment) any());
        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        ApplicationProperties applicationProperties = new ApplicationProperties();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                new UserService(), paymentValidator, paymentRepository, collectionProducer);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "CITIZEN", "CITIZEN", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(requestInfo);
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        paymentRequest.setPayment(payment);
        Payment actualCreatePaymentResult = paymentService.createPayment(paymentRequest);
        assertSame(payment, actualCreatePaymentResult);
        assertEquals("01234567-89AB-CDEF-FEDC-BA9876543210", actualCreatePaymentResult.getPayerId());
        verify(apportionerService).apportionBill((PaymentRequest) any());
        verify(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        verify(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
        verify(paymentRepository).savePayment((Payment) any());
        verify(collectionProducer).producer((String) any(), (Object) any());
    }

    @Test
    void testCreatePayment16() {

        ApportionerService apportionerService = mock(ApportionerService.class);
        when(apportionerService.apportionBill((PaymentRequest) any())).thenReturn(new HashMap<>());
        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doNothing().when(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        doNothing().when(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        doNothing().when(paymentRepository).savePayment((Payment) any());
        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        ApplicationProperties applicationProperties = new ApplicationProperties();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                new UserService(), paymentValidator, paymentRepository, collectionProducer);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "CITIZEN", "CITIZEN", "42", "42", new ArrayList<>(), "42", ""));

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(requestInfo);
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        paymentRequest.setPayment(payment);
        assertSame(payment, paymentService.createPayment(paymentRequest));
        verify(apportionerService).apportionBill((PaymentRequest) any());
        verify(paymentEnricher).enrichAdvanceTaxHead((List<Bill>) any());
        verify(paymentEnricher).enrichPaymentPostValidate((PaymentRequest) any());
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
        verify(paymentRepository).savePayment((Payment) any());
        verify(collectionProducer).producer((String) any(), (Object) any());
    }

    @Test
    void testCreateUser4() {

        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository2, new CollectionProducer());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User(123L, "janedoe", "CITIZEN", "CITIZEN", "42", "42", new ArrayList<>(), "42",
                "01234567-89AB-CDEF-FEDC-BA9876543210"));

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(requestInfo);
        assertEquals("01234567-89AB-CDEF-FEDC-BA9876543210", paymentService.createUser(paymentRequest));
    }

    @Test
    void testCreateUser7() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setIsUserCreateEnabled(false);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository2, new CollectionProducer());
        User user = mock(User.class);
        when(user.getType()).thenReturn("Type");

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(requestInfo);
        assertNull(paymentService.createUser(paymentRequest));
        verify(user).getType();
    }

    @Test
    void testCreateUser8() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setIsUserCreateEnabled(false);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository1,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository2, new CollectionProducer());
        User user = mock(User.class);
        when(user.getUuid()).thenThrow(new CustomException("Code", "An error occurred"));
        when(user.getType()).thenReturn("CITIZEN");

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(requestInfo);
        assertThrows(CustomException.class, () -> paymentService.createUser(paymentRequest));
        verify(user).getType();
        verify(user).getUuid();
    }

    @Test
    void testUpdatePayment3() {

        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validateAndEnrichPaymentsForUpdate((List<Payment>) any(),
                (RequestInfo) any())).thenReturn(new ArrayList<>());
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        doThrow(new CustomException("Pushing to Queue FAILED! ", "An error occurred")).when(paymentRepository)
                .updatePayment((List<Payment>) any());
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        assertThrows(CustomException.class, () -> paymentService.updatePayment(new PaymentRequest()));
        verify(paymentValidator).validateAndEnrichPaymentsForUpdate((List<Payment>) any(),
                (RequestInfo) any());
        verify(paymentRepository).updatePayment((List<Payment>) any());
    }

    @Test
    void testUpdatePayment5() {

        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentValidator.validateAndEnrichPaymentsForUpdate((List<Payment>) any(),
                (RequestInfo) any())).thenReturn(paymentList);
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        doNothing().when(paymentRepository).updatePayment((List<Payment>) any());
        CollectionProducer collectionProducer = mock(CollectionProducer.class);
        doNothing().when(collectionProducer).producer((String) any(), (Object) any());
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                new UserService(), paymentValidator, paymentRepository, collectionProducer);
        List<Payment> actualUpdatePaymentResult = paymentService.updatePayment(new PaymentRequest());
        assertSame(paymentList, actualUpdatePaymentResult);
        assertTrue(actualUpdatePaymentResult.isEmpty());
        verify(paymentValidator).validateAndEnrichPaymentsForUpdate((List<Payment>) any(),
                (RequestInfo) any());
        verify(paymentRepository).updatePayment((List<Payment>) any());
        verify(collectionProducer).producer((String) any(), (Object) any());
    }

    @Test
    void testVaidateProvisonalPayment3() {

        PaymentEnricher paymentEnricher = mock(PaymentEnricher.class);
        doNothing().when(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        PaymentValidator paymentValidator = mock(PaymentValidator.class);
        when(paymentValidator.validatePaymentForCreate((PaymentRequest) any())).thenReturn(new Payment());
        ApportionerService apportionerService = new ApportionerService();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        assertNull(paymentService.vaidateProvisonalPayment(new PaymentRequest()));
        verify(paymentEnricher).enrichPaymentPreValidate((PaymentRequest) any());
        verify(paymentValidator).validatePaymentForCreate((PaymentRequest) any());
    }

    @Test
    void testPlainSearch() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(new ArrayList<>());
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        assertTrue(paymentService.plainSearch(new PaymentSearchCriteria()).isEmpty());
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
    }

    @Test
    void testPlainSearch3() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPaymentsForPlainSearch((PaymentSearchCriteria) any())).thenReturn(paymentList);
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(stringList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        List<Payment> actualPlainSearchResult = paymentService.plainSearch(new PaymentSearchCriteria());
        assertSame(paymentList, actualPlainSearchResult);
        assertTrue(actualPlainSearchResult.isEmpty());
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
        verify(paymentRepository).fetchPaymentsForPlainSearch((PaymentSearchCriteria) any());
    }

    @Test
    void testPlainSearch4() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setPaymentsSearchPaginationEnabled(true);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPaymentsForPlainSearch((PaymentSearchCriteria) any())).thenReturn(paymentList);
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(stringList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        List<Payment> actualPlainSearchResult = paymentService.plainSearch(new PaymentSearchCriteria());
        assertSame(paymentList, actualPlainSearchResult);
        assertTrue(actualPlainSearchResult.isEmpty());
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
        verify(paymentRepository).fetchPaymentsForPlainSearch((PaymentSearchCriteria) any());
    }

    @Test
    void testPlainSearch5() {

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPaymentsForPlainSearch((PaymentSearchCriteria) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(stringList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        ApplicationProperties applicationProperties = new ApplicationProperties();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        assertThrows(CustomException.class, () -> paymentService.plainSearch(new PaymentSearchCriteria()));
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
        verify(paymentRepository).fetchPaymentsForPlainSearch((PaymentSearchCriteria) any());
    }

    @Test
    void testPlainSearch6() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setPaymentsSearchPaginationEnabled(true);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPaymentsForPlainSearch((PaymentSearchCriteria) any())).thenReturn(paymentList);
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(stringList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        HashSet<String> ids = new HashSet<>();
        HashSet<String> billIds = new HashSet<>();
        HashSet<String> tenantIds = new HashSet<>();
        HashSet<String> receiptNumbers = new HashSet<>();
        HashSet<String> status = new HashSet<>();
        HashSet<String> instrumentStatus = new HashSet<>();
        HashSet<String> paymentModes = new HashSet<>();
        ArrayList<String> payerIds = new ArrayList<>();
        HashSet<String> consumerCodes = new HashSet<>();
        List<Payment> actualPlainSearchResult = paymentService
                .plainSearch(new PaymentSearchCriteria(ids, billIds, "42", tenantIds, receiptNumbers, status, instrumentStatus,
                        paymentModes, payerIds, consumerCodes, new HashSet<>(), "42", "42", 3L, 3L, 2, 3, true));
        assertSame(paymentList, actualPlainSearchResult);
        assertTrue(actualPlainSearchResult.isEmpty());
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
        verify(paymentRepository).fetchPaymentsForPlainSearch((PaymentSearchCriteria) any());
    }

    @Test
    void testPlainSearch8() {

        ApplicationProperties applicationProperties = new ApplicationProperties();
        applicationProperties.setPaymentsSearchPaginationEnabled(true);

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        ArrayList<Payment> paymentList = new ArrayList<>();
        when(paymentRepository.fetchPaymentsForPlainSearch((PaymentSearchCriteria) any())).thenReturn(paymentList);
        when(paymentRepository.fetchPaymentIds((PaymentSearchCriteria) any())).thenReturn(stringList);
        ApportionerService apportionerService = new ApportionerService();
        PaymentEnricher paymentEnricher = new PaymentEnricher();
        UserService userService = new UserService();
        PaymentRepository paymentRepository1 = mock(PaymentRepository.class);
        PaymentRepository paymentRepository2 = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository2,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentValidator paymentValidator = new PaymentValidator(paymentRepository1, paymentWorkflowService,
                new ApplicationProperties(), mock(ServiceRequestRepository.class));

        PaymentService paymentService = new PaymentService(apportionerService, paymentEnricher, applicationProperties,
                userService, paymentValidator, paymentRepository, new CollectionProducer());
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getLimit()).thenReturn(1);
        when(paymentSearchCriteria.getOffset()).thenReturn(2);
        List<Payment> actualPlainSearchResult = paymentService.plainSearch(paymentSearchCriteria);
        assertSame(paymentList, actualPlainSearchResult);
        assertTrue(actualPlainSearchResult.isEmpty());
        verify(paymentRepository).fetchPaymentIds((PaymentSearchCriteria) any());
        verify(paymentRepository).fetchPaymentsForPlainSearch((PaymentSearchCriteria) any());
        verify(paymentSearchCriteria, atLeast(1)).getLimit();
        verify(paymentSearchCriteria, atLeast(1)).getOffset();
    }
}

