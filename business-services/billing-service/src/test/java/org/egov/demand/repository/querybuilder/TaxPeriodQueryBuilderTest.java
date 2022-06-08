package org.egov.demand.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.HashSet;

import org.egov.demand.model.AuditDetail;

import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.PeriodCycle;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class TaxPeriodQueryBuilderTest {
    @Autowired
    private TaxPeriodQueryBuilder taxPeriodQueryBuilder;

    @Test
    void testPrepareSearchQuery() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria();
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, new ArrayList<>()));
    }

    @Test
    void testPrepareSearchQuery3() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> service = new HashSet<>();
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("42", service, PeriodCycle.MONTH, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.periodcycle = ?"
                        + "  and taxperiod.fromdate >= ?  and taxperiod.todate <= ?  and taxperiod.code = ?  and taxperiod.fromdate"
                        + " <= ? and taxperiod.todate >= ? ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testPrepareSearchQuery4() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria();
        taxPeriodCriteria.setFromDate(1L);
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, new ArrayList<>()));
    }


    @Test
    void testPrepareSearchQuery5() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> service = new HashSet<>();
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria(" WHERE ", service, PeriodCycle.MONTH, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.periodcycle = ?"
                        + "  and taxperiod.fromdate >= ?  and taxperiod.todate <= ?  and taxperiod.code = ?  and taxperiod.fromdate"
                        + " <= ? and taxperiod.todate >= ? ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testPrepareSearchQuery6() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> service = new HashSet<>();
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("", service, PeriodCycle.MONTH, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  and taxperiod.periodcycle = ?  and taxperiod.fromdate"
                + " >= ?  and taxperiod.todate <= ?  and taxperiod.code = ?  and taxperiod.fromdate <= ? and taxperiod.todate"
                + " >= ? ", actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(6, objectList.size());
    }


    @Test
    void testPrepareSearchQuery7() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("SELECT * FROM EGBS_TAXPERIOD taxperiod ");
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("42", stringSet, PeriodCycle.MONTH, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.service IN "
                        + " ('SELECT * FROM EGBS_TAXPERIOD taxperiod ') and taxperiod.periodcycle = ?  AND (fromdate >=  CASE"
                        + " WHEN ((SELECT fromdate FROM egbs_taxperiod WHERE tenantId =? AND ( ? BETWEEN fromdate AND  todate) "
                        + "  AND service IN  ('SELECT * FROM EGBS_TAXPERIOD taxperiod ') AND periodcycle=?) NOTNULL) THEN ( SELECT"
                        + " fromdate FROM egbs_taxperiod WHERE tenantId =? AND ( ? BETWEEN fromdate AND  todate) AND service IN"
                        + "  ('SELECT * FROM EGBS_TAXPERIOD taxperiod ') AND periodcycle=?) ELSE (SELECT min(fromdate) FROM"
                        + " egbs_taxperiod WHERE tenantId =?) END AND todate <= ( SELECT todate FROM egbs_taxperiod WHERE tenantId"
                        + " = ? AND (? BETWEEN fromdate AND  todate)  AND service IN  ('SELECT * FROM EGBS_TAXPERIOD taxperiod"
                        + " ') AND periodcycle=?)) and taxperiod.code = ?  and taxperiod.fromdate <= ? and taxperiod.todate >= ?" + " ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(15, objectList.size());
    }


    @Test
    void testPrepareSearchQuery8() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet.add("SELECT * FROM EGBS_TAXPERIOD taxperiod ");
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("42", stringSet, PeriodCycle.MONTH, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.service IN "
                + " ('SELECT * FROM EGBS_TAXPERIOD taxperiod ','foo') and taxperiod.periodcycle = ?  and taxperiod.fromdate"
                + " >= ?  and taxperiod.todate <= ?  and taxperiod.code = ?  and taxperiod.fromdate <= ? and taxperiod.todate"
                + " >= ? ", actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testPrepareSearchQuery9() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("SELECT * FROM EGBS_TAXPERIOD taxperiod ");
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("42", new HashSet<>(), PeriodCycle.MONTH, stringSet,
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.periodcycle ="
                + " ?  and taxperiod.fromdate >= ?  and taxperiod.todate <= ?  and taxperiod.code = ?  and taxperiod.id"
                + " IN  ('SELECT * FROM EGBS_TAXPERIOD taxperiod ') and taxperiod.fromdate <= ? and taxperiod.todate"
                + " >= ? ", actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testPrepareSearchQuery10() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("SELECT * FROM EGBS_TAXPERIOD taxperiod ");
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria("42", stringSet, null, new HashSet<>(),
                "SELECT * FROM EGBS_TAXPERIOD taxperiod ", 1L, 1L, 1L);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT * FROM EGBS_TAXPERIOD taxperiod  WHERE  taxperiod.tenantId = ?  and taxperiod.service IN "
                        + " ('SELECT * FROM EGBS_TAXPERIOD taxperiod ') and taxperiod.fromdate >= ?  and taxperiod.todate <= ? "
                        + " and taxperiod.code = ?  and taxperiod.fromdate <= ? and taxperiod.todate >= ? ",
                actualTaxPeriodQueryBuilder.prepareSearchQuery(taxPeriodCriteria, objectList));
        assertEquals(6, objectList.size());
    }


    @Test
    void testPrepareQueryForValidation() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        assertEquals("select exists (select * from egbs_taxperiod taxperiod where  )",
                actualTaxPeriodQueryBuilder.prepareQueryForValidation(new ArrayList<>(), "Mode"));
    }



    @Test
    void testPrepareQueryForValidation4() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriod taxPeriod = new TaxPeriod("42", "42", 1L, 1L, PeriodCycle.MONTH, "Service", "Code", "Financial Year",
                new AuditDetail());
        taxPeriod.setFromDate(0L);

        ArrayList<TaxPeriod> taxPeriodList = new ArrayList<>();
        taxPeriodList.add(taxPeriod);
        assertEquals(
                "select exists (select * from egbs_taxperiod taxperiod where  (  taxperiod.service = 'Service' and "
                        + " taxperiod.code = 'Code' and  taxperiod.tenantId = '42' and (( 0 BETWEEN fromdate AND todate OR 1"
                        + " BETWEEN fromdate AND todate) OR (fromdate BETWEEN 0 AND 1 OR todate BETWEEN 0 AND 1))) )",
                actualTaxPeriodQueryBuilder.prepareQueryForValidation(taxPeriodList, "Mode"));
    }

    @Test
    void testPrepareQueryForValidation5() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriod taxPeriod = new TaxPeriod("42", " ( ", 1L, 1L, PeriodCycle.MONTH, "Service", "Code", "Financial Year",
                new AuditDetail());
        taxPeriod.setFromDate(0L);

        ArrayList<TaxPeriod> taxPeriodList = new ArrayList<>();
        taxPeriodList.add(taxPeriod);
        assertEquals(
                "select exists (select * from egbs_taxperiod taxperiod where  (  taxperiod.service = 'Service' and "
                        + " taxperiod.code = 'Code' and  taxperiod.tenantId = ' ( ' and (( 0 BETWEEN fromdate AND todate OR 1"
                        + " BETWEEN fromdate AND todate) OR (fromdate BETWEEN 0 AND 1 OR todate BETWEEN 0 AND 1))) )",
                actualTaxPeriodQueryBuilder.prepareQueryForValidation(taxPeriodList, "Mode"));
    }


    @Test
    void testPrepareQueryForValidation6() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriod taxPeriod = new TaxPeriod("42", "", 1L, 1L, PeriodCycle.MONTH, "Service", "Code", "Financial Year",
                new AuditDetail());
        taxPeriod.setFromDate(0L);

        ArrayList<TaxPeriod> taxPeriodList = new ArrayList<>();
        taxPeriodList.add(taxPeriod);
        assertEquals("select exists (select * from egbs_taxperiod taxperiod where  (  taxperiod.service = 'Service' and "
                        + " taxperiod.code = 'Code' and 0 BETWEEN fromdate AND todate OR 1 BETWEEN fromdate AND todate) OR (fromdate"
                        + " BETWEEN 0 AND 1 OR todate BETWEEN 0 AND 1))) )",
                actualTaxPeriodQueryBuilder.prepareQueryForValidation(taxPeriodList, "Mode"));
    }


    @Test
    void testPrepareQueryForValidation7() {
        TaxPeriodQueryBuilder actualTaxPeriodQueryBuilder = new TaxPeriodQueryBuilder();
        TaxPeriod taxPeriod = new TaxPeriod("42", "42", 1L, 1L, PeriodCycle.MONTH, "Service", "Code", "Financial Year",
                new AuditDetail());
        taxPeriod.setFromDate(0L);

        ArrayList<TaxPeriod> taxPeriodList = new ArrayList<>();
        taxPeriodList.add(taxPeriod);
        assertEquals("select exists (select * from egbs_taxperiod taxperiod where  (  taxperiod.service = 'Service' and "
                + " taxperiod.code = 'Code' and  taxperiod.id != '42' and  taxperiod.tenantId = '42' and (( 0 BETWEEN"
                + " fromdate AND todate OR 1 BETWEEN fromdate AND todate) OR (fromdate BETWEEN 0 AND 1 OR todate BETWEEN"
                + " 0 AND 1))) )", actualTaxPeriodQueryBuilder.prepareQueryForValidation(taxPeriodList, "edit"));
    }
}

