package org.egov.demand.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.enums.Type;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class DemandQueryBuilderTest {

    @Test
    void testGetDemandQueryForConsumerCodes() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashMap<String, Set<String>> businessConsumercodeMap = new HashMap<>();
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE dmd.tenantid=? AND dmd.status='ACTIVE' ",
                actualDemandQueryBuilder.getDemandQueryForConsumerCodes(businessConsumercodeMap, objectList, "42"));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetDemandQueryForConsumerCodes2() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashMap<String, Set<String>> stringSetMap = new HashMap<>();
        stringSetMap.put(DemandQueryBuilder.BASE_DEMAND_QUERY, new HashSet<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE dmd.tenantid=? AND dmd.status='ACTIVE' ",
                actualDemandQueryBuilder.getDemandQueryForConsumerCodes(stringSetMap, objectList, "42"));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetDemandQueryForConsumerCodes3() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);

        HashMap<String, Set<String>> stringSetMap = new HashMap<>();
        stringSetMap.put(DemandQueryBuilder.BASE_DEMAND_QUERY, stringSet);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE dmd.tenantid=? AND dmd.status='ACTIVE' AND dmd.businessservice='SELECT dmd.id AS"
                        + " did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice AS"
                        + " dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE ' AND dmd.consumercode IN ( ? )",
                actualDemandQueryBuilder.getDemandQueryForConsumerCodes(stringSetMap, objectList, "42"));
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetDemandQueryForConsumerCodes4() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);

        HashMap<String, Set<String>> stringSetMap = new HashMap<>();
        stringSetMap.put(DemandQueryBuilder.BASE_DEMAND_QUERY, stringSet);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE dmd.tenantid=? AND dmd.status='ACTIVE' AND dmd.businessservice='SELECT dmd.id AS"
                        + " did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice AS"
                        + " dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE ' AND dmd.consumercode IN ( ? , ? )",
                actualDemandQueryBuilder.getDemandQueryForConsumerCodes(stringSetMap, objectList, "42"));
        assertEquals(3, objectList.size());
    }




    @Test
    void testGetDemandQuery2() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> demandId = new HashSet<>();
        HashSet<String> payer = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", demandId, payer, consumerCode,
                DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42",
                "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  AND dmd.status=? AND dmd.businessservice=? AND dmd.ispaymentcompleted"
                        + " = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? ORDER BY dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(6, objectList.size());
    }




    @Test
    void testGetDemandQuery4() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        DemandCriteria demandCriteria = new DemandCriteria();
        demandCriteria.setTenantId("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  ORDER BY dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetDemandQuery5() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> demandId = new HashSet<>();
        HashSet<String> payer = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria(DemandQueryBuilder.BASE_DEMAND_QUERY, demandId, payer,
                consumerCode, DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS,
                "42", "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid = ?  AND dmd.status=? AND dmd.businessservice=? AND dmd.ispaymentcompleted"
                        + " = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? ORDER BY dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(6, objectList.size());
    }

    @Test
    void testGetDemandQuery6() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);
        HashSet<String> payer = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", stringSet, payer, consumerCode,
                DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42",
                "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  AND dmd.status=? AND dmd.id IN ( ? ) AND dmd.businessservice=?"
                        + " AND dmd.ispaymentcompleted = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? ORDER BY"
                        + " dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testGetDemandQuery7() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);
        HashSet<String> payer = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", stringSet, payer, consumerCode,
                DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42",
                "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  AND dmd.status=? AND dmd.id IN ( ? , ? ) AND dmd.businessservice=?"
                        + " AND dmd.ispaymentcompleted = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? ORDER BY"
                        + " dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(8, objectList.size());
    }


    @Test
    void testGetDemandQuery8() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);
        HashSet<String> demandId = new HashSet<>();
        HashSet<String> consumerCode = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", demandId, stringSet, consumerCode,
                DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42",
                "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  AND dmd.status=? AND dmd.payer IN ( ? ) AND dmd.businessservice=?"
                        + " AND dmd.ispaymentcompleted = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? ORDER BY"
                        + " dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(7, objectList.size());
    }


    @Test
    void testGetDemandQuery9() {
        DemandQueryBuilder actualDemandQueryBuilder = new DemandQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(DemandQueryBuilder.BASE_DEMAND_QUERY);
        HashSet<String> demandId = new HashSet<>();
        HashSet<String> payer = new HashSet<>();
        BigDecimal demandFrom = BigDecimal.valueOf(42L);
        DemandCriteria demandCriteria = new DemandCriteria("42", demandId, payer, stringSet,
                DemandQueryBuilder.BASE_DEMAND_QUERY, demandFrom, BigDecimal.valueOf(42L), 1L, 1L, Type.ARREARS, "42",
                "jane.doe@example.org", DemandQueryBuilder.BASE_DEMAND_QUERY, true, true);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT dmd.id AS did,dmd.consumercode AS dconsumercode,dmd.consumertype AS dconsumertype,dmd.businessservice"
                        + " AS dbusinessservice,dmd.payer,dmd.billexpirytime AS dbillexpirytime, dmd.fixedBillExpiryDate as"
                        + " dfixedBillExpiryDate, dmd.taxperiodfrom AS dtaxperiodfrom,dmd.taxperiodto AS dtaxperiodto,dmd"
                        + ".minimumamountpayable AS dminimumamountpayable,dmd.createdby AS dcreatedby,dmd.lastmodifiedby AS"
                        + " dlastmodifiedby,dmd.createdtime AS dcreatedtime,dmd.lastmodifiedtime AS dlastmodifiedtime,dmd.tenantid"
                        + " AS dtenantid,dmd.status,dmd.additionaldetails as demandadditionaldetails,dmd.ispaymentcompleted as"
                        + " ispaymentcompleted,dmdl.id AS dlid,dmdl.demandid AS dldemandid,dmdl.taxheadcode AS dltaxheadcode,dmdl"
                        + ".taxamount AS dltaxamount,dmdl.collectionamount AS dlcollectionamount,dmdl.createdby AS dlcreatedby"
                        + ",dmdl.lastModifiedby AS dllastModifiedby,dmdl.createdtime AS dlcreatedtime,dmdl.lastModifiedtime AS"
                        + " dllastModifiedtime,dmdl.tenantid AS dltenantid,dmdl.additionaldetails as detailadditionaldetails FROM"
                        + " egbs_demand_v1 dmd INNER JOIN egbs_demanddetail_v1 dmdl ON dmd.id=dmdl.demandid AND dmd.tenantid=dmdl"
                        + ".tenantid WHERE  dmd.tenantid LIKE ?  AND dmd.status=? AND dmd.businessservice=? AND dmd.ispaymentcompleted"
                        + " = ? AND dmd.taxPeriodFrom >= ? AND dmd.taxPeriodTo <= ? AND dmd.consumercode IN ( ? ) ORDER BY"
                        + " dmd.taxperiodfrom",
                actualDemandQueryBuilder.getDemandQuery(demandCriteria, objectList));
        assertEquals(7, objectList.size());
    }
}

