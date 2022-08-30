package org.egov.collection.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;
import java.util.ArrayList;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.service.MigrationService;
import org.egov.collection.service.PaymentService;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.collection.web.contract.PaymentWorkflowRequest;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {PaymentController.class})
@ExtendWith(SpringExtension.class)
class PaymentControllerTest {
    @MockBean
    private MigrationService migrationService;

    @Autowired
    private PaymentController paymentController;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private PaymentWorkflowService paymentWorkflowService;

    @Test
    void testCreate() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(new Payment());
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testPlainSearch() throws Exception {
        when(this.paymentService.plainSearch((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_plainsearch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testPlainSearch2() throws Exception {
        when(this.paymentService.plainSearch((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_plainsearch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":\"\",\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testCreate2() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(new Payment());
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create", "Uri Vars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate3() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate4() throws Exception {
        Payment payment = new Payment();
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate5() throws Exception {
        Payment payment = new Payment();
        payment.setAuditDetails(new AuditDetails());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate6() throws Exception {
        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatusEnum.NEW);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate7() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CHEQUE, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate8() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVAL_PENDING, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42",
                "?", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCreate9() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.DEPOSITED, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testSearch() throws Exception {
        when(this.paymentService.getPayments((RequestInfo) any(), (org.egov.collection.model.PaymentSearchCriteria) any(),
                (String) any())).thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testSearch2() throws Exception {
        when(this.paymentService.getPayments((RequestInfo) any(), (org.egov.collection.model.PaymentSearchCriteria) any(),
                (String) any())).thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":\"\",\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testValidate() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(new Payment());
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate2() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate3() throws Exception {
        Payment payment = new Payment();
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate4() throws Exception {
        Payment payment = new Payment();
        payment.setAuditDetails(new AuditDetails());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate5() throws Exception {
        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatusEnum.NEW);

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(payment);
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate6() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CHEQUE, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate7() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVAL_PENDING, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42",
                "?", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testValidate8() throws Exception {
        PaymentRequest paymentRequest = new PaymentRequest();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentRequest.setPayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L,
                "42", InstrumentStatusEnum.APPROVED, "?", auditDetails, additionalDetails, new ArrayList<>(), "?", "42", "?",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.DEPOSITED, "42"));
        paymentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/payments/_validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testWorkflow() throws Exception {
        PaymentWorkflowRequest paymentWorkflowRequest = new PaymentWorkflowRequest();
        paymentWorkflowRequest.setPaymentWorkflows(new ArrayList<>());
        paymentWorkflowRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentWorkflowRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/payments/{moduleName}/_workflow", "Module Name")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testWorkflow2() throws Exception {
        when(this.paymentWorkflowService.performWorkflow((PaymentWorkflowRequest) any())).thenReturn(new ArrayList<>());

        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);

        PaymentWorkflowRequest paymentWorkflowRequest = new PaymentWorkflowRequest();
        paymentWorkflowRequest.setPaymentWorkflows(paymentWorkflowList);
        paymentWorkflowRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(paymentWorkflowRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/payments/{moduleName}/_workflow", "Module Name")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testWorkflow3() throws Exception {
        when(this.paymentWorkflowService.performWorkflow((PaymentWorkflowRequest) any())).thenReturn(new ArrayList<>());

        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);

        PaymentWorkflowRequest paymentWorkflowRequest = new PaymentWorkflowRequest();
        paymentWorkflowRequest.setPaymentWorkflows(paymentWorkflowList);
        paymentWorkflowRequest.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(paymentWorkflowRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/payments/{moduleName}/_workflow", "Module Name")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":\"\",\"status\":\"200"
                                        + " OK\"},\"Payments\":[]}"));
    }

    @Test
    void testWorkflow4() throws Exception {
        doNothing().when(this.migrationService)
                .migrate((RequestInfo) any(), (Integer) any(), (Integer) any(), (String) any());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder postResult = MockMvcRequestBuilders.post("/payments/_migrate");
        MockHttpServletRequestBuilder requestBuilder = postResult.param("batchSize", String.valueOf(1))
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.paymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}

