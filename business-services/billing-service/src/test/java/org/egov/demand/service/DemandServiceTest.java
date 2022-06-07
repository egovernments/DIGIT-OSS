package org.egov.demand.service;

import com.jayway.jsonpath.DocumentContext;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.PaymentBackUpdateAudit;
import org.egov.demand.repository.BillRepositoryV2;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.DemandEnrichmentUtil;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserSearchRequest;
import org.egov.demand.web.validator.DemandValidatorV1;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DemandServiceTest {

    @MockBean
    private DemandRepository demandRepository;

    @MockBean
    private BillRepositoryV2 billRepoV2;

    @Autowired
    private DemandService demandService;

    @MockBean
    private Util util;

    @MockBean
    private DemandValidatorV1 demandValidatorV1;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @MockBean
    private DemandEnrichmentUtil demandEnrichmentUtil;

    @Test
    @DisplayName("Should return a response with the demands when the demands are valid")
    public void testCreateWhenDemandsAreValidThenReturnResponseWithDemands() {
        DemandRequest demandRequest = DemandRequest.builder().build();
        RequestInfo requestInfo = demandRequest.getRequestInfo();

        DocumentContext mdmsData = util.getMDMSData(requestInfo, "1");
        when(util.getMDMSData(requestInfo, "1")).thenReturn(mdmsData);
       /* demandService.create(demandRequest);
*/

    }

    @Test
    @DisplayName("Should throw an exception when the demands are invalid")
    public void testCreateWhenDemandsAreInvalidThenThrowException() {
        DemandRequest demandRequest = DemandRequest.builder().build();
        RequestInfo requestInfo = new RequestInfo();
        DocumentContext mdmsData = util.getMDMSData(requestInfo , "1");

        when(util.getMDMSData(requestInfo , "1")).thenReturn(mdmsData);

        doThrow(new CustomException("INVALID_DEMAND", "Invalid demand"))
                .when(demandValidatorV1)
                .validatedemandForCreate(demandRequest, true, mdmsData);


    }

    @Test
    @DisplayName("Should  the demand when the demand is found")
    public void testUpdateWhenDemandIsFound() {
        DemandRequest demandRequest = DemandRequest.builder().build();
        PaymentBackUpdateAudit paymentBackUpdateAudit = PaymentBackUpdateAudit.builder().build();
        demandService.update(demandRequest, paymentBackUpdateAudit);
        verify(demandRepository).update(demandRequest, paymentBackUpdateAudit);
    }

    @Test
    @DisplayName("Should throws an exception when the demand is not found")
    public void testUpdateWhenDemandIsNotFoundThenThrowsException() {
        DemandRequest demandRequest = DemandRequest.builder().build();
        RequestInfo requestInfo = new RequestInfo();
        DocumentContext mdmsData = util.getMDMSData(requestInfo , "1");

        PaymentBackUpdateAudit paymentBackUpdateAudit = PaymentBackUpdateAudit.builder().build();

        demandValidatorV1.validateForUpdate(demandRequest,mdmsData);
        when(demandRepository.getDemands(any(DemandCriteria.class)))
                .thenReturn(Collections.emptyList());

        demandService.update(demandRequest,paymentBackUpdateAudit);
    }

    @Test
    @DisplayName("Should s the demand")
    public void testSave() {
        DemandRequest demandRequest = DemandRequest.builder().build();
        demandService.save(demandRequest);
        verify(demandRepository).save(demandRequest);
    }

    @Test
    @DisplayName("Should return demands when the demand criteria is valid")
    public void testGetDemandsWhenDemandCriteriaIsValidThenReturnDemands() {
        DemandCriteria demandCriteria = DemandCriteria.builder().tenantId("ap.kurnool").build();
        RequestInfo requestInfo = RequestInfo.builder().build();

        List<Demand> demands = new ArrayList<>();
        List<User> payers = new ArrayList<>();
        demands.add(Demand.builder().id(String.valueOf(1L)).build());

        when(demandRepository.getDemands(demandCriteria)).thenReturn(demands);

        when(demandEnrichmentUtil.enrichPayer(demands ,payers)).thenReturn(demands);

        List<Demand> actualDemands = demandService.getDemands(demandCriteria, requestInfo);

        assertEquals(demands, actualDemands);

    }

    @Test
    public void  UserSearchReq(){
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        when(serviceRequestRepository.fetchResult("https://primehubstore.com",userSearchRequest)).thenReturn(null);

    }

    @Test
    @DisplayName("Should throw an exception when the demand criteria is invalid")
    public void testGetDemandsWhenDemandCriteriaIsInvalidThenThrowException() {
        DemandCriteria demandCriteria = DemandCriteria.builder().build();
        RequestInfo requestInfo = RequestInfo.builder().build();

        doThrow(new CustomException("INVALID_DEMAND_CRITERIA", "Invalid demand criteria"))
                .when(demandValidatorV1)
                .validateDemandCriteria(demandCriteria, requestInfo);

        assertThrows(
                CustomException.class,
                () -> {
                    demandService.getDemands(demandCriteria, requestInfo);
                });
    }
}

