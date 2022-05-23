package org.egov.demand.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentRequest;
import org.egov.demand.amendment.model.AmendmentUpdate;
import org.egov.demand.amendment.model.AmendmentUpdateRequest;
import org.egov.demand.amendment.model.Document;
import org.egov.demand.amendment.model.ProcessInstance;
import org.egov.demand.amendment.model.enums.AmendmentReason;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.service.AmendmentService;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.factory.ResponseFactory;
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

@ContextConfiguration(classes = {AmendmentController.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class AmendmentControllerTest {
    @Autowired
    private AmendmentController amendmentController;

    @MockBean
    private AmendmentService amendmentService;

    /**
     * Method under test: {@link AmendmentController#create(AmendmentRequest)}
     */
    @Test
    void testCreate() throws Exception {
        AmendmentRequest amendmentRequest = new AmendmentRequest();
        amendmentRequest.setAmendment(new Amendment());
        amendmentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    /**
     * Method under test: {@link AmendmentController#create(AmendmentRequest)}
     */
    @Test
    void testCreate2() throws Exception {
        when(this.amendmentService.create((AmendmentRequest) any())).thenReturn(new Amendment());

        AmendmentRequest amendmentRequest = new AmendmentRequest();
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        amendmentRequest.setAmendment(new Amendment("42", "42", "42", "?", "42", "?", AmendmentReason.COURT_CASE_SETTLEMENT,
                "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails, documents, 1L, 1L, auditDetails,
                MissingNode.getInstance()));
        amendmentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"201"
                                        + " CREATED\"},\"Amendments\":[{\"id\":null,\"amendedDemandId\":null,\"tenantId\":null,\"consumerCode\":null,"
                                        + "\"amendmentId\":null,\"businessService\":null,\"amendmentReason\":null,\"reasonDocumentNumber\":null,\"status"
                                        + "\":null,\"workflow\":null,\"demandDetails\":null,\"documents\":null,\"effectiveFrom\":null,\"effectiveTill\":null"
                                        + ",\"auditDetails\":null,\"additionalDetails\":null}]}"));
    }

    /**
     * Method under test: {@link AmendmentController#create(AmendmentRequest)}
     */
    @Test
    void testCreate3() throws Exception {
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        when(this.amendmentService.create((AmendmentRequest) any())).thenReturn(new Amendment("42", "42", "42", "?", "42",
                "?", AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails,
                documents, 6L, 6L, auditDetails, MissingNode.getInstance()));

        AmendmentRequest amendmentRequest = new AmendmentRequest();
        ProcessInstance workflow1 = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails1 = new ArrayList<>();
        ArrayList<Document> documents1 = new ArrayList<>();
        AuditDetails auditDetails1 = new AuditDetails();
        amendmentRequest.setAmendment(new Amendment("42", "42", "42", "?", "42", "?", AmendmentReason.COURT_CASE_SETTLEMENT,
                "Just cause", AmendmentStatus.ACTIVE, workflow1, demandDetails1, documents1, 1L, 1L, auditDetails1,
                MissingNode.getInstance()));
        amendmentRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"201"
                                        + " CREATED\"},\"Amendments\":[{\"id\":\"42\",\"amendedDemandId\":\"42\",\"tenantId\":\"42\",\"consumerCode\":\"?\",\"amendmentId"
                                        + "\":\"42\",\"businessService\":\"?\",\"amendmentReason\":\"COURT_CASE_SETTLEMENT\",\"reasonDocumentNumber\":\"Just"
                                        + " cause\",\"status\":\"ACTIVE\",\"workflow\":{\"id\":null,\"tenantId\":null,\"businessService\":null,\"businessId\""
                                        + ":null,\"action\":null,\"moduleName\":null,\"state\":null,\"comment\":null,\"documents\":null,\"assigner\":null,"
                                        + "\"assignes\":null,\"nextActions\":null,\"stateSla\":null,\"businesssServiceSla\":null,\"previousStatus\":null,"
                                        + "\"entity\":null,\"auditDetails\":null},\"demandDetails\":[],\"documents\":[],\"effectiveFrom\":6,\"effectiveTill"
                                        + "\":6,\"auditDetails\":{\"createdBy\":null,\"lastModifiedBy\":null,\"createdTime\":null,\"lastModifiedTime\":null"
                                        + "},\"additionalDetails\":null}]}"));
    }

    /**
     * Method under test: {@link AmendmentController#search(RequestInfoWrapper, org.egov.demand.amendment.model.AmendmentCriteria)}
     */
    @Test
    void testSearch() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    /**
     * Method under test: {@link AmendmentController#update(AmendmentUpdateRequest)}
     */
    @Test
    void testUpdate() throws Exception {
        AmendmentUpdateRequest amendmentUpdateRequest = new AmendmentUpdateRequest();
        amendmentUpdateRequest.setAmendmentUpdate(new AmendmentUpdate());
        amendmentUpdateRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentUpdateRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    /**
     * Method under test: {@link AmendmentController#update(AmendmentUpdateRequest)}
     */
    @Test
    void testUpdate2() throws Exception {
        when(this.amendmentService.updateAmendment((AmendmentUpdateRequest) any())).thenReturn(new Amendment());

        AmendmentUpdateRequest amendmentUpdateRequest = new AmendmentUpdateRequest();
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        ProcessInstance workflow = new ProcessInstance();
        amendmentUpdateRequest.setAmendmentUpdate(new AmendmentUpdate("42", "42", "42", auditDetails, additionalDetails,
                workflow, AmendmentStatus.ACTIVE, new ArrayList<>()));
        amendmentUpdateRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentUpdateRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Amendments\":[{\"id\":null,\"amendedDemandId\":null,\"tenantId\":null,\"consumerCode\":null,\"amendmentId"
                                        + "\":null,\"businessService\":null,\"amendmentReason\":null,\"reasonDocumentNumber\":null,\"status\":null,\"workflow"
                                        + "\":null,\"demandDetails\":null,\"documents\":null,\"effectiveFrom\":null,\"effectiveTill\":null,\"auditDetails"
                                        + "\":null,\"additionalDetails\":null}]}"));
    }

    /**
     * Method under test: {@link AmendmentController#update(AmendmentUpdateRequest)}
     */
    @Test
    void testUpdate3() throws Exception {
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        when(this.amendmentService.updateAmendment((AmendmentUpdateRequest) any())).thenReturn(new Amendment("42", "42",
                "42", "?", "42", "?", AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow,
                demandDetails, documents, 4L, 4L, auditDetails, MissingNode.getInstance()));

        AmendmentUpdateRequest amendmentUpdateRequest = new AmendmentUpdateRequest();
        AuditDetails auditDetails1 = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        ProcessInstance workflow1 = new ProcessInstance();
        amendmentUpdateRequest.setAmendmentUpdate(new AmendmentUpdate("42", "42", "42", auditDetails1, additionalDetails,
                workflow1, AmendmentStatus.ACTIVE, new ArrayList<>()));
        amendmentUpdateRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentUpdateRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Amendments\":[{\"id\":\"42\",\"amendedDemandId\":\"42\",\"tenantId\":\"42\",\"consumerCode\":\"?\",\"amendmentId"
                                        + "\":\"42\",\"businessService\":\"?\",\"amendmentReason\":\"COURT_CASE_SETTLEMENT\",\"reasonDocumentNumber\":\"Just"
                                        + " cause\",\"status\":\"ACTIVE\",\"workflow\":{\"id\":null,\"tenantId\":null,\"businessService\":null,\"businessId\""
                                        + ":null,\"action\":null,\"moduleName\":null,\"state\":null,\"comment\":null,\"documents\":null,\"assigner\":null,"
                                        + "\"assignes\":null,\"nextActions\":null,\"stateSla\":null,\"businesssServiceSla\":null,\"previousStatus\":null,"
                                        + "\"entity\":null,\"auditDetails\":null},\"demandDetails\":[],\"documents\":[],\"effectiveFrom\":4,\"effectiveTill"
                                        + "\":4,\"auditDetails\":{\"createdBy\":null,\"lastModifiedBy\":null,\"createdTime\":null,\"lastModifiedTime\":null"
                                        + "},\"additionalDetails\":null}]}"));
    }

    /**
     * Method under test: {@link AmendmentController#update(AmendmentUpdateRequest)}
     */
    @Test
    void testUpdate4() throws Exception {
        when(this.amendmentService.updateAmendment((AmendmentUpdateRequest) any())).thenReturn(new Amendment());

        AmendmentUpdateRequest amendmentUpdateRequest = new AmendmentUpdateRequest();
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        ProcessInstance workflow = new ProcessInstance();
        amendmentUpdateRequest.setAmendmentUpdate(new AmendmentUpdate("42", "42", "42", auditDetails, additionalDetails,
                workflow, AmendmentStatus.INACTIVE, new ArrayList<>()));
        amendmentUpdateRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentUpdateRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Amendments\":[{\"id\":null,\"amendedDemandId\":null,\"tenantId\":null,\"consumerCode\":null,\"amendmentId"
                                        + "\":null,\"businessService\":null,\"amendmentReason\":null,\"reasonDocumentNumber\":null,\"status\":null,\"workflow"
                                        + "\":null,\"demandDetails\":null,\"documents\":null,\"effectiveFrom\":null,\"effectiveTill\":null,\"auditDetails"
                                        + "\":null,\"additionalDetails\":null}]}"));
    }

    /**
     * Method under test: {@link AmendmentController#update(AmendmentUpdateRequest)}
     */
    @Test
    void testUpdate5() throws Exception {
        when(this.amendmentService.updateAmendment((AmendmentUpdateRequest) any())).thenReturn(new Amendment());

        ArrayList<Document> documentList = new ArrayList<>();
        documentList.add(new Document());
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        AmendmentUpdate amendmentUpdate = new AmendmentUpdate("42", "42", "42", auditDetails, additionalDetails,
                new ProcessInstance(), AmendmentStatus.ACTIVE, documentList);

        AmendmentUpdateRequest amendmentUpdateRequest = new AmendmentUpdateRequest();
        amendmentUpdateRequest.setAmendmentUpdate(amendmentUpdate);
        amendmentUpdateRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(amendmentUpdateRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/amendment/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.amendmentController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }
}

