package org.egov.demand.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.*;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.repository.IdGenRepo;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillResponse;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


@ExtendWith(SpringExtension.class)
@SpringBootTest
class BillServiceTest {

    @MockBean
    private BillRepository billRepository;

    @Autowired
    private BillService billService;

    @MockBean
    private BusinessServDetailService businessServDetailService;

    @MockBean
    private DemandService demandService;

    @MockBean
    private IdGenRepo idGenRepo;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @MockBean
    private TaxHeadMasterService taxHeadMasterService;

    @MockBean
    private Util util;

    @Test
    @DisplayName("Should throws an exception when the demands is empty")
    public void testGenerateBillWhenDemandsIsEmptyThenThrowsException() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder().tenantId("default").businessService("TL").build();

        RequestInfo requestInfo =
                RequestInfo.builder()
                        .apiId("org.egov.tl")
                        .ver("1.0")
                        .action("POST")
                        .did("4354648646")
                        .key("xyz")
                        .msgId("654654")
                        .authToken("345678f")
                        .build();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setEmail("ak@gmail.com");
        demandCriteria.setTenantId("12");

        when(demandService.getDemands(demandCriteria, requestInfo)).thenReturn(Collections.emptyList());

        assertThrows(
                CustomException.class,
                () -> {
                    billService.generateBill(billCriteria, requestInfo);
                });
    }

    @Test
    @DisplayName("Should returns the bill response when the demands is not empty")
    public void testGenerateBillWhenDemandsIsNotEmptyThenReturnsTheBillResponse() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder().businessService("TL").tenantId("default").build();

        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setEmail("ak@gmail.com");
        demandCriteria.setTenantId("12");

        List<Demand> demands = new ArrayList<>();
        demands.add(Demand.builder().build());
        RequestInfo requestInfo = new RequestInfo();
        when(demandService.getDemands(demandCriteria, requestInfo)).thenReturn(demands);
    }

    @Test
    @DisplayName("Should return the bill when the bill is already generated")
    public void testFetchBillWhenBillIsAlreadyGeneratedThenReturnTheBill() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder().businessService("TL").tenantId("default").build();

        Bill bill = Bill.builder().id("1").build();

        BillResponse billResponse =
                BillResponse.builder().bill(Collections.singletonList(bill)).build();

        RequestInfo requestInfo = RequestInfo.builder().build();

        List<Bill> bills = Collections.singletonList(bill);
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();

    }

    @Test
    @DisplayName(
            "Should return the bill when the bill is already generated and there are no expired bills")
    public void testFetchBillWhenBillIsAlreadyGeneratedAndThereAreNoExpiredBillsThenReturnTheBill() {

        GenerateBillCriteria billCriteria =
                GenerateBillCriteria.builder().businessService("TL").tenantId("default").build();

        BillSearchCriteria billSearchCriteria = billCriteria.toBillSearchCriteria();

        BillDetail billDetail =
                BillDetail.builder()
                        .businessService("TL")
                        .consumerCode("TL-1")
                        .expiryDate(System.currentTimeMillis() + 100000)
                        .build();

        Bill bill = Bill.builder().billDetails(Collections.singletonList(billDetail)).build();

        BillResponse billResponse =
                BillResponse.builder().bill(Collections.singletonList(bill)).build();

        when(billRepository.findBill(billSearchCriteria)).thenReturn(null);

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();

        RequestInfo requestInfo = new RequestInfo();
/*
     BillResponse actualBillResponse = billService.generateBill(billCriteria, requestInfo );

        assertEquals(billResponse, actualBillResponse);*/
    }

    @Test
    @DisplayName("Should return bill response when the bill request is valid")
    public void testApportionWhenBillRequestIsValidThenReturnBillResponse() {

       BillRequest billRequest = new BillRequest();
        Bill bill = Bill.builder().build();
        List<Bill> bills = Collections.singletonList(bill);

        when(billRepository.apportion(billRequest)).thenReturn(bills);

        BillResponse billResponse = billService.create(billRequest);

    }

    @Test
    @DisplayName("Should save the bill")
    public void testCreateShouldSaveTheBill() {

        BillRequest billRequest = BillRequest.builder().build();
        BillResponse billResponse = BillResponse.builder().build();

    }

    @Test
    @DisplayName("Should return the bill response")
    public void testCreateShouldReturnTheBillResponse() {

        BillRequest billRequest = BillRequest.builder().build();
        BillResponse billResponse = BillResponse.builder().build();

        BillResponse actualBillResponse = billService.create(billRequest);


    }

    @Test

     void testFetchBill() {
         GenerateBillCriteria billCriteria = new GenerateBillCriteria();
         RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();

     }

    @Test

    void testSearchBill() {

        BillSearchCriteria billCriteria = new BillSearchCriteria();
        billService.searchBill(billCriteria, new RequestInfo());
    }

    @Test

    void testGenerateBill() {


        GenerateBillCriteria billCriteria = new GenerateBillCriteria();
        BillResponse response = new BillResponse();
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
       /* when(billService.fetchBill(billCriteria, requestInfoWrapper)).thenReturn(response);*/
    }

    @Test
    void testGetBillResponse() {

        BillService billService = new BillService();
        BillResponse actualBillResponse = billService.getBillResponse(new ArrayList<>());
        assertTrue(actualBillResponse.getBill().isEmpty());
        assertNull(actualBillResponse.getResposneInfo());
    }

    @Test
    void testSendBillToKafka() {

        BillService billService = new BillService();
        assertThrows(CustomException.class, () -> billService.sendBillToKafka(new BillRequest()));
    }

    @Test
    void testCreate() {

        this.billService.create(new BillRequest());
    }
}

