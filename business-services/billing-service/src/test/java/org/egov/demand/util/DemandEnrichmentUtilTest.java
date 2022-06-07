package org.egov.demand.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.demand.model.AuditDetails;

import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.web.contract.User;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {DemandEnrichmentUtil.class})
@ExtendWith(SpringExtension.class)
class DemandEnrichmentUtilTest {
    @Autowired
    private DemandEnrichmentUtil demandEnrichmentUtil;


    @Test
    void testEnrichPayer() {
        ArrayList<Demand> demands = new ArrayList<>();
        assertTrue(this.demandEnrichmentUtil.enrichPayer(demands, new ArrayList<>()).isEmpty());
    }


    @Test
    void testEnrichPayer2() {
        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        assertTrue(this.demandEnrichmentUtil.enrichPayer(demandList, new ArrayList<>()).isEmpty());
    }


    @Test
    void testEnrichPayer3() {
        ArrayList<Demand> demandList = new ArrayList<>();
        User payer = new User();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        demandList
                .add(new Demand("42", "42", "Consumer Code", "Consumer Type", "Business Service", payer, 1L, 1L, demandDetails,
                        auditDetails, 1L, 1L, "Additional Details", BigDecimal.valueOf(42L), true, Demand.StatusEnum.ACTIVE));
        assertEquals(1, this.demandEnrichmentUtil.enrichPayer(demandList, new ArrayList<>()).size());
    }





    @Test
    void testEnrichPayer5() {
        Demand demand = mock(Demand.class);
        when(demand.getPayer()).thenReturn(new User());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        assertEquals(1, this.demandEnrichmentUtil.enrichPayer(demandList, new ArrayList<>()).size());
        verify(demand, atLeast(1)).getPayer();
    }


    @Test
    void testEnrichPayer6() {
        Demand demand = mock(Demand.class);
        doNothing().when(demand).setPayer((User) any());
        when(demand.getPayer()).thenReturn(new User());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);

        ArrayList<User> userList = new ArrayList<>();
        userList.add(new User());
        assertEquals(1, this.demandEnrichmentUtil.enrichPayer(demandList, userList).size());
        verify(demand, atLeast(1)).getPayer();
        verify(demand).setPayer((User) any());
    }



}

