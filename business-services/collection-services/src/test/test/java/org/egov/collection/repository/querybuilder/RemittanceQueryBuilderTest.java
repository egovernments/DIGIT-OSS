package org.egov.collection.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceDetail;
import org.egov.collection.web.contract.RemittanceInstrument;
import org.egov.collection.web.contract.RemittanceReceipt;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class RemittanceQueryBuilderTest {

    @Test
    void testGetParametersForRemittance5() {
        Remittance remittance = new Remittance();
        remittance.setAuditDetails(new AuditDetails("42", 1L, "42", 1L));
        assertEquals(15, RemittanceQueryBuilder.getParametersForRemittance(remittance).getParameterNames().length);
    }

    @Test
    void testGetParametersForRemittanceDetails() {
        assertEquals(6,
                RemittanceQueryBuilder.getParametersForRemittanceDetails(new RemittanceDetail()).getParameterNames().length);
    }

    @Test
    void testGetParametersForRemittanceInstrument() {
        assertEquals(5, RemittanceQueryBuilder.getParametersForRemittanceInstrument(new RemittanceInstrument())
                .getParameterNames().length);
    }

    @Test
    void testGetParametersForRemittanceReceipt() {
        assertEquals(4,
                RemittanceQueryBuilder
                        .getParametersForRemittanceReceipt(new RemittanceReceipt("42", "42", "Remittance", "Receipt"))
                        .getParameterNames().length);
    }

    @Test
    void testGetRemittanceSearchQuery() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader"
                        + " AND rem.id IN (:ids) ORDER BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND"
                        + " offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(13, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery2() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount(" WHERE ");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader"
                        + " AND rem.id IN (:ids) ORDER BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND"
                        + " offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(13, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery3() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount(null);
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.status = :status AND rem.fund = :fund AND rem.function = :function AND rem.reasonForDelay"
                        + " = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate AND rem.referenceDate"
                        + " <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY rem.Sort By asc)"
                        + " result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery4() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.status = :status AND rem.fund = :fund AND rem.function = :function AND rem.reasonForDelay"
                        + " = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate AND rem.referenceDate"
                        + " <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY rem.Sort By asc)"
                        + " result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery5() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(null);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY"
                        + " rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery6() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction(null);
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate"
                        + " AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER"
                        + " BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery7() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund(null);
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.function = :function"
                        + " AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate"
                        + " AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER"
                        + " BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery8() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(0);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("Select rem.bankaccount as rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id"
                        + " as rem_id, rem.reasonForDelay as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem"
                        + ".referenceNumber as rem_referenceNumber, rem.remarks as rem_remarks, rem.status as rem_status,rem"
                        + ".voucherHeader as  rem_voucherHeader,rem.createdBy as rem_createdBy, rem.createdDate as rem_createdDate"
                        + ",rem.lastModifiedBy as rem_lastModifiedBy, rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId"
                        + " as rem_tenantId,remDet.remittance as remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount"
                        + ",remDet.creditAmount as remDet_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId"
                        + " as remDet_tenantId, remDet.id as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument"
                        + " as remIsm_instrument, remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId,"
                        + " remIsm.id as remIsm_id,remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec"
                        + ".tenantId as remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN"
                        + " egcl_remittancedetails remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument"
                        + " remIsm ON rem.id=remIsm.remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance"
                        + "  WHERE  rem.tenantId =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND"
                        + " rem.fund = :fund AND rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks"
                        + " = :remarks AND rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader"
                        + " = :voucherHeader AND rem.id IN (:ids) ORDER BY rem.Sort By asc",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(11, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery11() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay(null);
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate AND rem.referenceDate"
                        + " <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY rem.Sort By asc)"
                        + " result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery12() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("Select rem.bankaccount as rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id"
                + " as rem_id, rem.reasonForDelay as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem"
                + ".referenceNumber as rem_referenceNumber, rem.remarks as rem_remarks, rem.status as rem_status,rem"
                + ".voucherHeader as  rem_voucherHeader,rem.createdBy as rem_createdBy, rem.createdDate as rem_createdDate"
                + ",rem.lastModifiedBy as rem_lastModifiedBy, rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId"
                + " as rem_tenantId,remDet.remittance as remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount"
                + ",remDet.creditAmount as remDet_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId"
                + " as remDet_tenantId, remDet.id as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument"
                + " as remIsm_instrument, remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId,"
                + " remIsm.id as remIsm_id,remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt"
                + ",remRec.tenantId as remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN"
                + " egcl_remittancedetails remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument"
                + " remIsm ON rem.id=remIsm.remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec"
                + ".remittance ");

        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(stringList);
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.referenceNumber IN (:referenceNumbers)   AND rem.bankaccount in (:bankaccount) AND"
                        + " rem.status = :status AND rem.fund = :fund AND rem.function = :function AND rem.reasonForDelay ="
                        + " :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate AND rem.referenceDate"
                        + " <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY rem.Sort By asc)"
                        + " result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(14, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery13() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks(null);
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.referenceDate >= :fromDate"
                        + " AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER"
                        + " BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery14() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy(null);
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader"
                        + " AND rem.id IN (:ids) ORDER BY rem.referenceDate asc) result) result_offset WHERE offset_ > :offset"
                        + " AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(13, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery15() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder(null);
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader"
                        + " AND rem.id IN (:ids) ORDER BY rem.Sort By DESC) result) result_offset WHERE offset_ > :offset AND"
                        + " offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(13, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery16() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus(null);
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.fund = :fund AND rem.function = :function"
                        + " AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate >= :fromDate"
                        + " AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER"
                        + " BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery17() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId(null);
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE "
                        + " rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND rem.function ="
                        + " :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND rem.referenceDate"
                        + " >= :fromDate AND rem.referenceDate <= :toDate AND rem.voucherHeader = :voucherHeader AND rem.id IN"
                        + " (:ids) ORDER BY rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <=" + " :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery18() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(null);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.voucherHeader = :voucherHeader AND rem.id IN (:ids) ORDER BY"
                        + " rem.Sort By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(12, stringObjectMap.size());
    }

    @Test
    void testGetRemittanceSearchQuery19() {
        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader(null);
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT * FROM (SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM (Select rem.bankaccount as"
                        + " rem_bankaccount,rem.function as rem_function,rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay"
                        + " as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,rem.referenceNumber as rem_referenceNumber,"
                        + " rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,rem.createdBy"
                        + " as rem_createdBy, rem.createdDate as rem_createdDate,rem.lastModifiedBy as rem_lastModifiedBy,"
                        + " rem.lastModifiedDate as rem_lastModifiedDate,rem.tenantId as rem_tenantId,remDet.remittance as"
                        + " remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,remDet.creditAmount as remDet"
                        + "_creditAmount, remDet.debitAmount as remDet_debitAmount,remDet.tenantId as remDet_tenantId, remDet.id"
                        + " as remDet_id,remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument,"
                        + " remIsm.reconciled as remIsm_reconciled,remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id"
                        + ",remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,remRec.tenantId as"
                        + " remRec_tenantId, remRec.id as remRec_id from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails"
                        + " remDet ON rem.id=remDet.remittance LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm"
                        + ".remittance LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance  WHERE  rem.tenantId"
                        + " =:tenantId AND rem.bankaccount in (:bankaccount) AND rem.status = :status AND rem.fund = :fund AND"
                        + " rem.function = :function AND rem.reasonForDelay = :reasonForDelay AND rem.remarks = :remarks AND"
                        + " rem.referenceDate >= :fromDate AND rem.referenceDate <= :toDate AND rem.id IN (:ids) ORDER BY rem.Sort"
                        + " By asc) result) result_offset WHERE offset_ > :offset AND offset_ <= :limit",
                RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, stringObjectMap));
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
        assertEquals(12, stringObjectMap.size());
    }
}

