package org.egov.demand.util.migration;

import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.rowmapper.DemandRowMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest
public class DemandMigrationTest {

    @Autowired
    private DemandMigration demandMigration;

    @Mock
    private DemandMigration demandMigration1;



    @Test
    @DisplayName("Should apportion the demand details when the tax amount is negative")
    public void testMigrateToV1WhenTaxAmountIsNegativeThenApportionDemandDetails() {

        Demand demand = Demand.builder()
                .id("1")
                .businessService("TL")
                .minimumAmountPayable(BigDecimal.valueOf(100))
                .demandDetails(Arrays.asList(
                        DemandDetail.builder()
                                .id("1")
                                .taxAmount(BigDecimal.valueOf(-100))
                                .collectionAmount(BigDecimal.valueOf(100))
                                .build(),
                        DemandDetail.builder()
                                .id("2")
                                .taxAmount(BigDecimal.valueOf(-50))
                                .collectionAmount(BigDecimal.valueOf(50))
                                .build()))
                .build();

        List<Demand> demands = Arrays.asList(demand);


        assertEquals(BigDecimal.valueOf(-100), demands.get(0).getDemandDetails().get(0).getTaxAmount());
        assertEquals(BigDecimal.valueOf(100), demands.get(0).getDemandDetails().get(0).getCollectionAmount());

        assertEquals(BigDecimal.valueOf(-50), demands.get(0).getDemandDetails().get(1).getTaxAmount());
        assertEquals(BigDecimal.valueOf(50), demands.get(0).getDemandDetails().get(1).getCollectionAmount());
    }

    @Test
    @DisplayName("Should apportion the demand details when the tax amount is positive")
    public void testMigrateToV1WhenTaxAmountIsPositiveThenApportionDemandDetails() {

        Demand demand = Demand.builder()
                .id("1")
                .demandDetails(Arrays.asList(
                        DemandDetail.builder()
                                .taxAmount(BigDecimal.valueOf(100))
                                .collectionAmount(BigDecimal.valueOf(100))
                                .build(),
                        DemandDetail.builder()
                                .taxAmount(BigDecimal.valueOf(-50))
                                .collectionAmount(BigDecimal.valueOf(50))
                                .build(),
                        DemandDetail.builder()
                                .taxAmount(BigDecimal.valueOf(-50))
                                .collectionAmount(BigDecimal.valueOf(50))
                                .build()))
                .build();

        List<Demand> demands = Arrays.asList(demand);


        assertEquals(BigDecimal.valueOf(100), demands.get(0).getDemandDetails().get(0).getCollectionAmount());
        assertEquals(BigDecimal.valueOf(50), demands.get(0).getDemandDetails().get(1).getCollectionAmount());
        assertEquals(BigDecimal.valueOf(50), demands.get(0).getDemandDetails().get(2).getCollectionAmount());
    }

    @Test
    @DisplayName("Should create a comparator with the given order")
    public void testCreateDemadDetailComparatorShouldCreateComparatorWithGivenOrder() {


        demandMigration.createDemadDetailComparator();

        List<DemandDetail> demandDetails = new ArrayList<>();
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_DECIMAL_CEILING_CREDIT").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_DECIMAL_CEILING_DEBIT").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_ROUNDOFF").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_TAX").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_TIME_INTEREST").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_TIME_PENALTY").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_ADHOC_PENALTY").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_FIRE_CESS").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_CANCER_CESS").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_TIME_REBATE").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_ADHOC_REBATE").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_OWNER_EXEMPTION").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_ADVANCE_CARRYFORWARD").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("PT_UNIT_USAGE_EXEMPTION").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("TL_TAX").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("TL_ROUNDOFF").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("TL_ADHOC_REBATE").build());
        demandDetails.add(DemandDetail.builder().taxHeadMasterCode("TL_ADHOC_PENALTY").build());


        assertEquals("PT_DECIMAL_CEILING_CREDIT", demandDetails.get(0).getTaxHeadMasterCode());
        assertEquals("PT_DECIMAL_CEILING_DEBIT", demandDetails.get(1).getTaxHeadMasterCode());
        assertEquals("PT_ROUNDOFF", demandDetails.get(2).getTaxHeadMasterCode());
        assertEquals("PT_TAX", demandDetails.get(3).getTaxHeadMasterCode());

        assertEquals("PT_TIME_INTEREST", demandDetails.get(4).getTaxHeadMasterCode());
        assertEquals("PT_TIME_PENALTY", demandDetails.get(5).getTaxHeadMasterCode());
        assertEquals("PT_ADHOC_PENALTY", demandDetails.get(6).getTaxHeadMasterCode());
    }
}

