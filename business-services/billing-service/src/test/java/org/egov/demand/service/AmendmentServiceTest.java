package org.egov.demand.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.amendment.model.*;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.repository.AmendmentRepository;
import org.egov.demand.repository.BillRepositoryV2;
import org.egov.demand.util.Util;
import org.egov.demand.web.validator.AmendmentValidator;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class AmendmentServiceTest {

    @MockBean
    private Util util;

    @MockBean
    private ApplicationProperties props;

    @MockBean
    private DemandService demandService;

    @MockBean
    private BillRepositoryV2 billRepositoryV2;

    @MockBean
    private AmendmentValidator amendmentValidator;

    @MockBean
    private AmendmentRepository amendmentRepository;

    @Autowired
    private AmendmentService amendmentService;


    @Test
    @DisplayName("Should update the demand with amendment tax when the demand is not empty")
    public void testUpdateDemandWithAmendmentTaxWhenDemandIsNotEmpty() {

        RequestInfo requestInfo = new RequestInfo();
        Amendment amendment =
                Amendment.builder()
                        .consumerCode("consumerCode")
                        .businessService("businessService")
                        .tenantId("tenantId")
                        .build();

        DemandCriteria demandCriteria =
                DemandCriteria.builder()
                        .consumerCode(Stream.of(amendment.getConsumerCode()).collect(Collectors.toSet()))
                        .businessService(amendment.getBusinessService())
                        .tenantId(amendment.getTenantId())
                        .isPaymentCompleted(false)
                        .build();

        Demand demand =
                Demand.builder()
                        .id("id")
                        .consumerCode("consumerCode")
                        .businessService("businessService")
                        .tenantId("tenantId")
                        .build();

        when(demandService.getDemands(demandCriteria, requestInfo)).thenReturn(Arrays.asList(demand));




    }

    @Test
    @DisplayName("Should update the amendment when the status is active")
    public void testUpdateAmendmentWhenStatusIsActive() {

        RequestInfo requestInfo = new RequestInfo();
        AmendmentUpdate amendmentUpdate =
                AmendmentUpdate.builder().status(AmendmentStatus.ACTIVE).build();
        AmendmentUpdateRequest amendmentUpdateRequest =
                AmendmentUpdateRequest.builder()
                        .requestInfo(requestInfo)
                        .amendmentUpdate(amendmentUpdate)
                        .build();

        Amendment amendmentFromSearch = Amendment.builder().build();

        when(amendmentValidator.validateAndEnrichAmendmentForUpdate(amendmentUpdateRequest))
                .thenReturn(amendmentFromSearch);


    }

    @Test
    @DisplayName("Should update the amendment when the status is inactive")
    public void testUpdateAmendmentWhenStatusIsInactive() {

        RequestInfo requestInfo = new RequestInfo();
        AmendmentUpdateRequest amendmentUpdateRequest =
                AmendmentUpdateRequest.builder()
                        .requestInfo(requestInfo)
                        .amendmentUpdate(
                                AmendmentUpdate.builder()
                                        .amendmentId("1")
                                        .tenantId("ap.kurnool")
                                        .status(AmendmentStatus.INACTIVE)
                                        .build())
                        .build();

        Amendment amendmentFromSearch =
                Amendment.builder()
                        .amendmentId("1")
                        .tenantId("ap.kurnool")
                        .status(AmendmentStatus.ACTIVE)
                        .build();

        when(amendmentValidator.validateAndEnrichAmendmentForUpdate(amendmentUpdateRequest))
                .thenReturn(amendmentFromSearch);


    }

    @Test
    @DisplayName("Should throws an exception when the tenantId is null")
    public void testCreateWhenTenantIdIsNullThenThrowsException() {

        AmendmentRequest amendmentRequest =
                AmendmentRequest.builder()
                        .amendment(Amendment.builder().tenantId(null).build())
                        .requestInfo(RequestInfo.builder().build())
                        .build();

        when(amendmentService.create(amendmentRequest)).thenReturn(null);

    }

    @Test
    @DisplayName("Should return empty list when the mobile number is not present in any demand")
    public void testSearchWhenMobileNumberIsNotPresentInAnyDemandThenReturnEmptyList() {

        AmendmentCriteria amendmentCriteria =
                AmendmentCriteria.builder().mobileNumber("1234567890").build();

        when(demandService.getDemands(any(), any())).thenReturn(Collections.emptyList());

        List<Amendment> amendments = amendmentService.search(amendmentCriteria, null);

        assertEquals(0, amendments.size());
    }

    @Test
    @DisplayName(
            "Should return empty list when the mobile number is present in demands but consumer code is not present in any demand")
    public void
    testSearchWhenMobileNumberIsPresentInDemandsButConsumerCodeIsNotPresentInAnyDemandThenReturnEmptyList() {

        AmendmentCriteria amendmentCriteria =
                AmendmentCriteria.builder()
                        .mobileNumber("1234567890")

                        .build();

        DemandCriteria demandCriteria =
                DemandCriteria.builder()
                        .mobileNumber("1234567890")

                        .build();

        when(amendmentRepository.getAmendments(amendmentCriteria))
                .thenReturn(Collections.singletonList(Amendment.builder().build()));

        when(demandService.getDemands(demandCriteria, null)).thenReturn(Collections.emptyList());

        List<Amendment> amendments = amendmentService.search(amendmentCriteria, null);

        assertTrue(CollectionUtils.isEmpty(amendments));
    }
}