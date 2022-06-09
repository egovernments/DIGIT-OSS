package org.egov.demand.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.ArrayList;
import java.util.HashSet;

import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.UpdateBillCriteria;
import org.junit.jupiter.api.Test;

class BillQueryBuilderTest {


    @Test
    void testGetBillQuerySearch() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> billId = new HashSet<>();
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria("42", billId, 1L, 1L, true, true, true,
                new HashSet<>(), "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd"
                + "_partpaymentallowed, bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS"
                + " bd_collectionmodesnotallowed, ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail,"
                + " ad.glcode AS ad_glcode, ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription,"
                + " ad.amount AS ad_amount, ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode,"
                + " ad.demanddetailid, ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails"
                + " as b_additionaldetails,  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER"
                + " JOIN egbs_billdetail_v1 bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN"
                + " egbs_billaccountdetail_v1 ad ON bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid"
                + " LIKE ?  AND b.status != ? AND b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND"
                + " bd.fromperiod = ? AND bd.toperiod = ? AND bd.billno = ?) SELECT * FROM billresult  INNER JOIN (SELECT"
                + " bd_consumercode, min(b_createddate) as mindate FROM billresult GROUP BY bd_consumercode) as uniqbill"
                + " ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill.mindate=billresult.b_createddate"
                + "  ORDER BY billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(8, objectList.size());
    }



    @Test
    void testGetBillQueryWithGetTenantId() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria();
        billSearchCriteria.setTenantId("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd_partpaymentallowed"
                + ", bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
                + " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
                + " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription, ad.amount AS ad_amount,"
                + " ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid,"
                + " ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails as b_additionaldetails"
                + ",  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER JOIN egbs_billdetail_v1"
                + " bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN egbs_billaccountdetail_v1 ad ON"
                + " bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid LIKE ? ) SELECT * FROM billresult"
                + "  INNER JOIN (SELECT bd_consumercode, max(b_createddate) as maxdate FROM billresult GROUP BY"
                + " bd_consumercode) as uniqbill ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill"
                + ".maxdate=billresult.b_createddate ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetBillQueryWithBillId() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> billId = new HashSet<>();
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria(BillQueryBuilder.BILL_BASE_QUERY, billId, 1L, 1L,
                true, true, true, new HashSet<>(), "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd"
                + "_partpaymentallowed, bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS"
                + " bd_collectionmodesnotallowed, ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail,"
                + " ad.glcode AS ad_glcode, ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription,"
                + " ad.amount AS ad_amount, ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode,"
                + " ad.demanddetailid, ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails"
                + " as b_additionaldetails,  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER"
                + " JOIN egbs_billdetail_v1 bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN"
                + " egbs_billaccountdetail_v1 ad ON bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid"
                + " = ?  AND b.status != ? AND b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND"
                + " bd.fromperiod = ? AND bd.toperiod = ? AND bd.billno = ?) SELECT * FROM billresult  INNER JOIN (SELECT"
                + " bd_consumercode, min(b_createddate) as mindate FROM billresult GROUP BY bd_consumercode) as uniqbill"
                + " ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill.mindate=billresult.b_createddate"
                + "  ORDER BY billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(8, objectList.size());
    }


    @Test
    void testGetMinBillQueryWithAdd() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(BillQueryBuilder.BILL_BASE_QUERY);
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria("42", stringSet, 1L, 1L, true, true, true,
                new HashSet<>(), "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd_partpaymentallowed"
                + ", bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
                + " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
                + " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription, ad.amount AS ad_amount,"
                + " ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid,"
                + " ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails as b_additionaldetails"
                + ",  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER JOIN egbs_billdetail_v1"
                + " bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN egbs_billaccountdetail_v1 ad ON"
                + " bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid LIKE ?  AND b.id in ( ?) AND"
                + " b.status != ? AND b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND bd.fromperiod"
                + " = ? AND bd.toperiod = ? AND bd.billno = ?) SELECT * FROM billresult  INNER JOIN (SELECT bd_consumercode,"
                + " min(b_createddate) as mindate FROM billresult GROUP BY bd_consumercode) as uniqbill ON uniqbill.bd"
                + "_consumercode=billresult.bd_consumercode AND uniqbill.mindate=billresult.b_createddate  ORDER BY"
                + " billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(9, objectList.size());
    }


    @Test
    void testGetMinBillWithAdd() {

        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet.add(BillQueryBuilder.BILL_BASE_QUERY);
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria("42", stringSet, 1L, 1L, true, true, true,
                new HashSet<>(), "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd_partpaymentallowed"
                + ", bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
                + " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
                + " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription, ad.amount AS ad_amount,"
                + " ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid,"
                + " ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails as b_additionaldetails"
                + ",  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER JOIN egbs_billdetail_v1"
                + " bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN egbs_billaccountdetail_v1 ad ON"
                + " bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid LIKE ?  AND b.id in ( ?, ?) AND"
                + " b.status != ? AND b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND bd.fromperiod"
                + " = ? AND bd.toperiod = ? AND bd.billno = ?) SELECT * FROM billresult  INNER JOIN (SELECT bd_consumercode,"
                + " min(b_createddate) as mindate FROM billresult GROUP BY bd_consumercode) as uniqbill ON uniqbill.bd"
                + "_consumercode=billresult.bd_consumercode AND uniqbill.mindate=billresult.b_createddate  ORDER BY"
                + " billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(10, objectList.size());
    }


    @Test
    void testGetMAXBillQuery() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> billId = new HashSet<>();
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria("42", billId, 1L, 1L, false, true, true,
                new HashSet<>(), "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd"
                + "_partpaymentallowed, bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS"
                + " bd_collectionmodesnotallowed, ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail,"
                + " ad.glcode AS ad_glcode, ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription,"
                + " ad.amount AS ad_amount, ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode,"
                + " ad.demanddetailid, ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails"
                + " as b_additionaldetails,  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER"
                + " JOIN egbs_billdetail_v1 bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN"
                + " egbs_billaccountdetail_v1 ad ON bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid"
                + " LIKE ?  AND b.status = ? AND b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND"
                + " bd.fromperiod = ? AND bd.toperiod = ? AND bd.billno = ?) SELECT * FROM billresult  INNER JOIN (SELECT"
                + " bd_consumercode, max(b_createddate) as maxdate FROM billresult GROUP BY bd_consumercode) as uniqbill"
                + " ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill.maxdate=billresult.b_createddate"
                + "  ORDER BY billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(8, objectList.size());
    }


    @Test
    void testGetMINBillQuery() {

        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(BillQueryBuilder.BILL_BASE_QUERY);
        BillSearchCriteria billSearchCriteria = new BillSearchCriteria("42", new HashSet<>(), 1L, 1L, true, true, true,
                stringSet, "42", BillQueryBuilder.BILL_BASE_QUERY, true, 3L, 1L, "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, "42");

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("WITH billresult AS (SELECT b.id AS b_id,b.mobilenumber, b.tenantid AS b_tenantid, b.payername AS"
                + " b_payername, b.payeraddress AS b_payeraddress, b.payeremail AS b_payeremail,b.filestoreid AS"
                + " b_fileStoreId, b.isactive AS b_isactive, b.iscancelled AS b_iscancelled, b.createdby AS b_createdby,"
                + " b.status as b_status, b.createddate AS b_createddate, b.lastmodifiedby AS b_lastmodifiedby,"
                + " b.lastmodifieddate AS b_lastmodifieddate, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS"
                + " bd_tenantid,bd.businessservice AS bd_businessservice, bd.demandid,bd.fromperiod,bd.toperiod, bd.billno"
                + " AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS"
                + " bd_consumertype, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
                + " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount, bd.callbackforapportioning"
                + " AS bd_callbackforapportioning,bd.expirydate AS bd_expirydate, bd.partpaymentallowed AS bd_partpaymentallowed"
                + ", bd.isadvanceallowed as bd_isadvanceallowed,bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
                + " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
                + " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription, ad.amount AS ad_amount,"
                + " ad.adjustedamount AS ad_adjustedamount, ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid,"
                + " ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose, b.additionaldetails as b_additionaldetails"
                + ",  bd.additionaldetails as bd_additionaldetails  FROM egbs_bill_v1 b LEFT OUTER JOIN egbs_billdetail_v1"
                + " bd ON b.id = bd.billid AND b.tenantid = bd.tenantid LEFT OUTER JOIN egbs_billaccountdetail_v1 ad ON"
                + " bd.id = ad.billdetail AND bd.tenantid = ad.tenantid WHERE b.tenantid LIKE ?  AND b.status != ? AND"
                + " b.payeremail = ? AND b.mobileNumber = ? AND bd.businessservice = ? AND bd.fromperiod = ? AND bd.toperiod"
                + " = ? AND bd.billno = ? AND bd.consumercode IN ( ?)) SELECT * FROM billresult  INNER JOIN (SELECT"
                + " bd_consumercode, min(b_createddate) as mindate FROM billresult GROUP BY bd_consumercode) as uniqbill"
                + " ON uniqbill.bd_consumercode=billresult.bd_consumercode AND uniqbill.mindate=billresult.b_createddate"
                + "  ORDER BY billresult.bd_consumercode ", billQueryBuilder.getBillQuery(billSearchCriteria, objectList));
        assertEquals(9, objectList.size());
    }




    @Test
    void testGetBillStatusUpdateQueryWithBillStatusActive() {


        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();

        UpdateBillCriteria updateBillCriteria = new UpdateBillCriteria();
        updateBillCriteria.setStatusToBeUpdated(BillV2.BillStatus.ACTIVE);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("UPDATE egbs_bill_v1 SET status=?  WHERE status='ACTIVE' AND tenantId = ? ",
                billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, objectList));
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetBillStatusUpdateQueryWithBillStatusCancelled() {


        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();

        UpdateBillCriteria updateBillCriteria = new UpdateBillCriteria();
        updateBillCriteria.setStatusToBeUpdated(BillV2.BillStatus.CANCELLED);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("UPDATE egbs_bill_v1 SET status=?  WHERE status='ACTIVE' AND tenantId = ? ",
                billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, objectList));
        assertEquals(2, objectList.size());
    }

  /*  @Test

    void testGetBillStatusUpdateQuery5() {


        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> consumerCodes = new HashSet<>();
        MissingNode additionalDetails = MissingNode.getInstance();

        UpdateBillCriteria updateBillCriteria = new UpdateBillCriteria("42", consumerCodes, ", additionaldetails = ?",
                additionalDetails, new HashSet<>(), BillV2.BillStatus.ACTIVE);
        updateBillCriteria.setStatusToBeUpdated(BillV2.BillStatus.CANCELLED);
        billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, new ArrayList<>());
    }*/


    @Test
    void testGetBillStatusUpdateQueryWithIdStatusActive() {
        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        HashSet<String> consumerCodes = new HashSet<>();
        UpdateBillCriteria updateBillCriteria = new UpdateBillCriteria("42", consumerCodes, ", additionaldetails = ?",
                MissingNode.getInstance(), stringSet, BillV2.BillStatus.ACTIVE);

        assertEquals("UPDATE egbs_bill_v1 SET status=?  WHERE status='ACTIVE' AND tenantId = ?  AND id IN (  ?)",
                billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, new ArrayList<>()));
    }


    @Test
    void testGetBillStatusUpdateQueryUpdateAdditionalDetails() {

        BillQueryBuilder billQueryBuilder = new BillQueryBuilder();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(", additionaldetails = ?");
        stringSet.add("foo");
        HashSet<String> consumerCodes = new HashSet<>();
        UpdateBillCriteria updateBillCriteria = new UpdateBillCriteria("42", consumerCodes, ", additionaldetails = ?",
                MissingNode.getInstance(), stringSet, BillV2.BillStatus.ACTIVE);

        assertEquals("UPDATE egbs_bill_v1 SET status=?  WHERE status='ACTIVE' AND tenantId = ?  AND id IN (  ?, ?)",
                billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, new ArrayList<>()));
    }
}

