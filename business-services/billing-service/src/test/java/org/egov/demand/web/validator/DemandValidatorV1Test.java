package org.egov.demand.web.validator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.service.UserService;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.User;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class DemandValidatorV1Test {
    @MockBean
    private Boolean aBoolean;

    @MockBean
    private DemandRepository demandRepository;

    @Autowired
    private DemandValidatorV1 demandValidatorV1;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private Util util;


    @Test
    void testValidateDemandDetailsForAmount() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        demandValidatorV1.validateDemandDetailsForAmount(demandDetails, new HashMap<>());
        assertNull(demandValidatorV1.userService);
    }


    @Test
    void testValidateDemandDetailsForAmount3() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        BigDecimal taxAmount = BigDecimal.valueOf(42L);
        BigDecimal collectionAmount = BigDecimal.valueOf(42L);
        demandDetailList.add(new DemandDetail("42", "42", "Tax Head Master Code", taxAmount, collectionAmount,
                "Additional Details", new AuditDetails(), "42"));
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, new HashMap<>());
        assertNull(demandValidatorV1.userService);
    }


    @Test
    void testValidateDemandDetailsForAmount5() {


        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(42L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, new HashMap<>());
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
    }


    @Test
    void testValidateDemandDetailsForAmount6() {


        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(-1L));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(42L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        HashMap<String, String> stringStringMap = new HashMap<>();
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, stringStringMap);
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
        assertEquals(1, stringStringMap.size());
    }


    @Test
    void testValidateDemandDetailsForAmount7() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(Long.MAX_VALUE));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(42L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        HashMap<String, String> stringStringMap = new HashMap<>();
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, stringStringMap);
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
        assertEquals(1, stringStringMap.size());
    }


    @Test
    void testValidateDemandDetailsForAmount9() {


        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(-1L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        HashMap<String, String> stringStringMap = new HashMap<>();
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, stringStringMap);
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
        assertEquals(1, stringStringMap.size());
    }


    @Test
    void testValidateDemandDetailsForAmount10() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(-1L));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(-1L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, new HashMap<>());
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
    }


    @Test
    void testValidateDemandDetailsForAmount11() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();
        DemandDetail demandDetail = mock(DemandDetail.class);
        when(demandDetail.getCollectionAmount()).thenReturn(BigDecimal.valueOf(0L));
        when(demandDetail.getTaxAmount()).thenReturn(BigDecimal.valueOf(-1L));

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        demandValidatorV1.validateDemandDetailsForAmount(demandDetailList, new HashMap<>());
        verify(demandDetail).getCollectionAmount();
        verify(demandDetail).getTaxAmount();
    }



    @Test
    void testValidateForUpdate4() {

        DemandValidatorV1 demandValidatorV1 = new DemandValidatorV1();

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        DemandRequest demandRequest = mock(DemandRequest.class);
        when(demandRequest.getDemands()).thenReturn(demandList);
        assertThrows(CustomException.class, () -> demandValidatorV1.validateForUpdate(demandRequest, null));
        verify(demandRequest, atLeast(1)).getDemands();
    }


}

