package org.egov.collection.util.migration;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.repository.CollectionRepository;
import org.egov.collection.repository.rowmapper.CollectionResultSetExtractor;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.collection.web.contract.Receipt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ReceiptMigration {

	public static final String COUNT_QUERY = "select count(*) from egcl_receiptheader rh WHERE rh.businessdetails IN ('PT','TL')";

	public static final String RECEIPT_SEARCH_QUERY = "Select rh.id as rh_id,rh.payeename as rh_payername,rh.payeeAddress as rh_payerAddress, rh.payeeEmail as rh_payerEmail,"
			+ " rh.payeemobile as rh_payermobile, rh.paidBy as rh_paidBy, rh.referenceNumber as rh_referenceNumber, rh.referenceDate "
			+ " as rh_referenceDate,rh.receiptType as rh_receiptType, rh.receiptNumber as rh_receiptNumber, rh.receiptDate as rh_receiptDate,"
			+ " rh.referenceDesc as rh_referenceDesc, rh.manualReceiptNumber as rh_manualReceiptNumber, rh.fund as rh_fund, rh.function "
			+ " as rh_function, rh.department as rh_department,  rh.manualreceiptdate as rh_manualreceiptdate, rh.businessDetails as "
			+ " rh_businessDetails,  rh.collectionType as rh_collectionType,rh.stateId as rh_stateId,rh.location as rh_location,  rh.isReconciled"
			+ " as rh_isReconciled,rh.status as rh_status,rh.reasonForCancellation as rh_reasonForCancellation , rh.minimumAmount as "
			+ " rh_minimumAmount,rh.totalAmount as rh_totalAmount, rh.collectedamount as rh_collectedamount, rh.collModesNotAllwd as "
			+ " rh_collModesNotAllwd,rh.consumerCode as rh_consumerCode,rh.function as rh_function,  rh.version as rh_version,rh.channel"
			+ " as rh_channel,rh.reference_ch_id as rh_reference_ch_id,  rh.consumerType as rh_consumerType,rh.fund as rh_fund,rh.fundSource"
			+ " as rh_fundSource, rh.boundary as rh_boundary, rh.department as rh_department,rh.depositedBranch as rh_depositedBranch, "
			+ " rh.tenantId as rh_tenantId, rh.displayMsg as rh_displayMsg,rh.voucherheader as rh_voucherheader, rh.cancellationRemarks "
			+ " as rh_cancellationRemarks, rh.additionalDetails as rh_additionalDetails, rh.createdBy as  rh_createdBy, rh.createdDate as"
			+ " rh_createdDate,rh.lastModifiedBy as rh_lastModifiedBy, rh.lastModifiedDate as rh_lastModifiedDate, d.id as rh_demandid,"
			+ " d.taxperiodfrom as rh_demandfromdate, d.taxperiodto as rh_demandtodate, rh.transactionid as rh_transactionid, rd.id as "
			+ " rd_id, (CASE WHEN rd.dramount > 0 THEN rd.dramount*-1 ELSE rd.actualcramounttobepaid END) as rd_amount,"
			+ " rd.cramount as rd_adjustedamount, rd.description as rd_description,rd.isActualDemand  as rd_isActualDemand,"
			+ " rd.financialYear as rd_financialYear, rd.additionalDetails as rd_additionalDetails, rd.tenantId as rd_tenantId,"
			+ " (CASE WHEN rd.purpose IN ('ARREAR_AMOUNT','CURRENT_AMOUNT','ADVANCE_AMOUNT') THEN SPLIT_PART(rd.purpose,'_','1') ELSE purpose END) as rd_purpose,"
			+ " (CASE WHEN SPLIT_PART(description,'-',1) IN ('TL_ADHOC_REBATE','PT_TIME_REBATE','PT_UNIT_USAGE_EXEMPTION','PT_OWNER_EXEMPTION',"
			+ " 'PT_ADHOC_REBATE','PT_ADVANCE_CARRYFORWARD') THEN 0 "
			+ " WHEN SPLIT_PART(description,'-',1) IN ('PT_DECIMAL_CEILING_DEBIT','PT_DECIMAL_CEILING_CREDIT') THEN 1 "
			+ " WHEN SPLIT_PART(description,'-',1)='PT_TIME_INTEREST' THEN 2 "
			+ " WHEN SPLIT_PART(description,'-',1) IN ('PT_ADHOC_PENALTY','PT_TIME_PENALTY','TL_ADHOC_PENALTY') THEN 3 "
			+ " WHEN SPLIT_PART(description,'-',1) IN ('PT_FIRE_CESS','PT_CANCER_CESS') THEN 4 "
			+ " WHEN SPLIT_PART(description,'-',1) IN ('PT_TAX','TL_TAX') THEN 5 ELSE ordernumber END ) as rd_ordernumber,  "
			+ " (CASE WHEN SPLIT_PART(rd.description,'-',1) IN ('PT_DECIMAL_CEILING_CREDIT','PT_DECIMAL_CEILING_DEBIT') THEN 'PT_ROUNDOFF' ELSE SPLIT_PART(rd.description,'-',1) END)"
			+ " as rd_taxheadcode, null as rd_demanddetailid, ins.id as ins_instrumentheader, ins.amount as ins_amount, ins.transactionDate as ins_transactiondate, "
			+ " ins.transactionNumber as ins_transactionNumber, ins.instrumenttype as ins_instrumenttype, ins .instrumentstatus as "
			+ " ins_instrumentstatus,  ins.bankid as ins_bankid , ins.branchname as ins_branchname , ins.bankaccountid as ins_bankaccountid,"
			+ " ins.ifsccode as ins_ifsccode , ins.financialstatus as ins_financialstatus ,  ins.transactiontype as ins_transactiontype , "
			+ " ins.payee as ins_payee , ins.drawer as ins_drawer ,  ins.surrenderreason as ins_surrenderreason , ins.serialno as ins_serialno "
			+ " , ins.additionalDetails as ins_additionalDetails, ins.createdby as ins_createdby ,  ins.createddate as ins_createddate ,"
			+ " ins.lastmodifiedby as ins_lastmodifiedby ,  ins.lastmodifieddate as ins_lastmodifieddate , ins.tenantid as ins_tenantid ,"
			+ " ins.instrumentDate as ins_instrumentDate, ins.instrumentNumber as ins_instrumentNumber " + " "
			+ " from egcl_receiptheader rh LEFT OUTER JOIN egcl_receiptdetails rd ON rh.id=rd.receiptheader "
			+ " LEFT OUTER JOIN egcl_receiptinstrument recins ON rh.id=recins.receiptheader "
			+ " LEFT JOIN egcl_instrumentheader ins ON recins.instrumentheader=ins.id "
			+ " LEFT OUTER JOIN egbs_demand d ON d.consumercode=rh.consumercode AND "
			+ " d.taxperiodfrom=SPLIT_PART(rd.description,'-',2)::BIGINT AND d.taxperiodto=SPLIT_PART(rd.description,'-',3)::BIGINT "
			+ " WHERE rh.businessdetails IN ('PT','TL') AND rh.id IN (select id from egcl_receiptheader offset ? limit ?)"
			+ " ORDER BY rd.ordernumber ";

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private CollectionResultSetExtractor collectionRowMapper;

	@Autowired
	private CollectionRepository repository;

	public Map<String, String> migrateToV1(Integer startBatch, Integer batchSizeInput) {

		Map<String, String> resultMap = new LinkedHashMap<>();

		Integer count = jdbcTemplate.queryForObject(COUNT_QUERY, Integer.class);
		log.info(" the total data count : " + count);
		int i = 0;
		if (null != startBatch && startBatch > 0)
			i = startBatch;

		for (; i < count; i = i + batchSizeInput) {

			List<Receipt> receipts = jdbcTemplate.query(RECEIPT_SEARCH_QUERY, new Object[] { i, batchSizeInput },
					collectionRowMapper);
			try {
				apportionAndSaveReceipts(receipts, resultMap);
			} catch (Exception e) {

				log.error("Migration failed at batch count :  " + i, e.getMessage());
				resultMap.put("Migration failed at batch count :  " + i, e.getMessage());
				return resultMap;
			}
		}
		log.info(" the total data count : " + count);
		return resultMap;
	}

	private void apportionAndSaveReceipts(List<Receipt> receipts, Map<String, String> resultMap) {

		for (Receipt receipt : receipts) {

			Bill bill = receipt.getBill().get(0);
			BillDetail detail = bill.getBillDetails().get(0);
			BigDecimal amountPaid = detail.getAmountPaid();
			detail.getBillAccountDetails().sort(Comparator.comparing(BillAccountDetail::getAmount).thenComparing(Comparator.comparing(BillAccountDetail::getOrder)));
			
			for (BillAccountDetail accDetail : detail.getBillAccountDetails()) {

				if (null != accDetail.getTaxHeadCode())
					amountPaid = apportionBillAccDetail(accDetail, amountPaid);
			}
			
			try {
				repository.saveReceipt(receipt);
			}catch (Exception e) {
				log.error( receipt.getReceiptNumber() + " : FAILED");
				resultMap.put(receipt.getReceiptNumber(), " : FAILED");
				throw e;
			}
			
			log.error( receipt.getReceiptNumber() + " : SUCCESS");
			resultMap.put(receipt.getReceiptNumber(), " : SUCCESS");
		}
	}

	private BigDecimal apportionBillAccDetail(BillAccountDetail accDetail, BigDecimal amountPaid) {

		BigDecimal amt = accDetail.getAmount();
		if (BigDecimal.ZERO.compareTo(amt) > 0) {

			accDetail.setAdjustedAmount(amt);
			return amountPaid.subtract(amt);
		} else if (BigDecimal.ZERO.compareTo(amt) < 0) {

			if (amt.compareTo(amountPaid) > 0) {

				accDetail.setAdjustedAmount(amountPaid);
				return BigDecimal.ZERO;
			} else {

				accDetail.setAdjustedAmount(amt);
				return amountPaid.subtract(amt);
			}
		}
		return amountPaid;
	}
}
