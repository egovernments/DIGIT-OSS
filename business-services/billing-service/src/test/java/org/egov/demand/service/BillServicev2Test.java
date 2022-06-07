package org.egov.demand.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.*;
import org.egov.demand.producer.Producer;
import org.egov.demand.repository.BillRepositoryV2;
import org.egov.demand.repository.IdGenRepo;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.BillResponseV2;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.validator.BillValidator;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class BillServicev2Test {

    @MockBean
    private BillRepositoryV2 billRepositoryV2;

    @Autowired
    private BillServicev2 billServicev2;

    @MockBean
    private BillValidator billValidator;

    @MockBean
    private BusinessServDetailService businessServDetailService;

    @MockBean
    private DemandService demandService;

    @MockBean
    private IdGenRepo idGenRepo;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @MockBean
    private Producer producer;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @MockBean
    private TaxHeadMasterService taxHeadMasterService;

    @MockBean
    private Util util;

    @MockBean
    private BillRequestV2 billRequestV2;

    @Test
    @DisplayName("Should throws an exception when the consumerCodes is empty")
    public void testCancelBillWhenConsumerCodesIsEmptyThenThrowsException() {

        UpdateBillRequest updateBillRequest =
                UpdateBillRequest.builder().UpdateBillCriteria
                        (
                                UpdateBillCriteria.builder().consumerCodes(Collections.emptySet()).build())
                        .build();



        when(billServicev2.cancelBill(updateBillRequest)).thenReturn(0);
    }

    @Test
    @DisplayName("Should throws an exception when the consumerCodes size is greater than 1")
    public void testCancelBillWhenConsumerCodesSizeIsGreaterThanOneThenThrowsException() {

        UpdateBillRequest updateBillRequest =
                UpdateBillRequest.builder()
                        .UpdateBillCriteria(
                                UpdateBillCriteria.builder()
                                        .consumerCodes(new HashSet<>(Arrays.asList("1")))
                                        .build())
                        .build();

        when(billServicev2.cancelBill(updateBillRequest)).thenReturn(null);
    }

    @Test
    @DisplayName("Should return the bill when the bill is not expired")
    public void testFetchBillWhenBillIsNotExpired() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder().businessService("TL").tenantId("default").build();


        RequestInfoWrapper requestInfoWrapper= new RequestInfoWrapper();

        BillV2 billV2 = BillV2.builder().consumerCode("consumerCode").build();

        BillResponseV2 billResponseV2 =
                BillResponseV2.builder().bill(Collections.singletonList(billV2)).build();

        when(billRepositoryV2.findBill(billCriteria.toBillSearchCriteria()))
                .thenReturn(Collections.singletonList(billV2));


        when(billServicev2.fetchBill(billCriteria,requestInfoWrapper)).thenReturn(null);
    }

    @Test
    @DisplayName("Should return the bill when the bill is expired")
    public void testFetchBillWhenBillIsExpired() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder()
                        .businessService("TL")
                        .tenantId("default")
                        .consumerCode(Collections.singleton("1"))
                        .build();

        BillV2 billV2 =
                BillV2.builder()
                        .id(String.valueOf(1L))
                        .billNumber("1")
                        .consumerCode("1")
                        .tenantId("default")
                        .businessService("TL")
                        .billDetails(
                                Collections.singletonList(
                                        BillDetailV2.builder()
                                                .id(String.valueOf(1L))
                                                .expiryDate(System.currentTimeMillis() - 1)
                                                .build()))
                        .build();

        BillResponseV2 billResponseV2 =
                BillResponseV2.builder().bill(Collections.singletonList(billV2)).build();

        when(billRepositoryV2.findBill(billCriteria.toBillSearchCriteria()))
                .thenReturn(Collections.singletonList(billV2));

        when(demandService.getDemands(billCriteria.toDemandCriteria(), null))
                .thenReturn(Collections.emptyList());

        when(billRepositoryV2.updateBillStatus(
                UpdateBillCriteria.builder()
                        .statusToBeUpdated(BillV2.BillStatus.EXPIRED)
                        .businessService("TL")
                        .consumerCodes(Collections.singleton("1"))
                        .tenantId("default")
                        .build()))
                .thenReturn(1);

        when(billRepositoryV2.findBill(billCriteria.toBillSearchCriteria()))
                .thenReturn(Collections.emptyList());

        RequestInfo requestInfo = new RequestInfo();
        when(demandService.getDemands(billCriteria.toDemandCriteria(), requestInfo))
                .thenReturn(Collections.emptyList());

RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();


        when(billServicev2.fetchBill(billCriteria,requestInfoWrapper)).thenReturn(null);

    }

    @Test
    void testGetBillResponse() {

        BillServicev2 billServicev2 = new BillServicev2();
        BillResponseV2 actualBillResponse = billServicev2.getBillResponse(new ArrayList<>());
        assertTrue(actualBillResponse.getBill().isEmpty());
        assertNull(actualBillResponse.getResposneInfo());
    }

    @Test
    void testSendBillToKafka() {

        BillServicev2 billServicev2 = new BillServicev2();
        assertThrows(CustomException.class, () -> billServicev2.sendBillToKafka(new BillRequestV2()));
    }

    @Test
    void testCreate() {

        BillServicev2 billServicev2 = new BillServicev2();
        BillResponseV2 actualCreateResult = billServicev2.create(new BillRequestV2());
        assertTrue(actualCreateResult.getBill().isEmpty());
        assertNull(actualCreateResult.getResposneInfo());
    }

    @Test
    void testCreate3() {
        BillServicev2 billServicev2 = new BillServicev2();
        BillResponseV2 actualCreateResult = billServicev2.create(new BillRequestV2());
        assertNull(actualCreateResult.getResposneInfo());
        assertTrue(actualCreateResult.getBill().isEmpty());
    }
}

