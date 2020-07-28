package org.egov.collection.repository.querybuilder.v1;

import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toSet;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.v1.ReceiptSearchCriteria_v1;

public class CollectionQueryBuilder_v1 {

    private static final String SELECT_RECEIPTS_SQL = "Select rh.id as rh_id,rh.payername as rh_payername,rh" +
            ".payerAddress as rh_payerAddress, rh.payerEmail as rh_payerEmail, rh.payermobile as rh_payermobile, rh" +
            ".paidBy as rh_paidBy, rh.referenceNumber as rh_referenceNumber, rh.referenceDate as rh_referenceDate,rh.receiptType as "
            +
            "rh_receiptType, rh.receiptNumber as rh_receiptNumber, rh.receiptDate as rh_receiptDate, rh.referenceDesc" +
            " as rh_referenceDesc, rh.manualReceiptNumber as rh_manualReceiptNumber, rh.fund as rh_fund, rh.function as rh_function, rh.department as rh_department,  rh.manualreceiptdate as "
            +
            "rh_manualreceiptdate, rh.businessDetails as rh_businessDetails,  rh.collectionType as rh_collectionType,rh.stateId as rh_stateId,rh.location as "
            +
            "rh_location,  rh.isReconciled as rh_isReconciled,rh.status as rh_status,rh.reasonForCancellation as " +
            "rh_reasonForCancellation , rh.minimumAmount as rh_minimumAmount,rh.totalAmount as rh_totalAmount, rh" +
            ".collectedamount as rh_collectedamount, rh.collModesNotAllwd as rh_collModesNotAllwd,rh.consumerCode as " +
            "rh_consumerCode,rh.function as rh_function,  rh.version as rh_version,rh.channel as rh_channel,rh.reference_ch_id as "
            +
            "rh_reference_ch_id,  rh.consumerType as rh_consumerType,rh.fund as rh_fund,rh.fundSource as " +
            "rh_fundSource, rh.boundary as rh_boundary, rh.department as rh_department,rh.depositedBranch as " +
            "rh_depositedBranch, rh.tenantId as rh_tenantId, rh.displayMsg as rh_displayMsg,rh.voucherheader as " +
            "rh_voucherheader, rh.cancellationRemarks as rh_cancellationRemarks, rh.additionalDetails as " +
            "rh_additionalDetails, rh.createdBy as  rh_createdBy, rh.createdDate as rh_createdDate,rh.lastModifiedBy " +
            "as rh_lastModifiedBy, rh.lastModifiedDate as " +
            "rh_lastModifiedDate, rh.demandid as rh_demandid, rh.demandFromDate as rh_demandfromdate, " +
            "rh.demandToDate as rh_demandtodate, rh.transactionid as rh_transactionid, rd.id as rd_id,  rd.amount as rd_amount, " +
            "rd.adjustedamount as rd_adjustedamount, rd.ordernumber as " +
            "rd_ordernumber,  rd.description as rd_description,rd" +
            ".isActualDemand  as rd_isActualDemand,  rd.financialYear as rd_financialYear,rd.purpose as rd_purpose, " +
            "rd.additionalDetails as rd_additionalDetails, rd.tenantId as rd_tenantId, rd.taxheadcode as rd_taxheadcode, "+
            "rd.demanddetailid as rd_demanddetailid, ins.id as ins_instrumentheader, " +
            "ins.amount as ins_amount, ins.transactionDate as ins_transactiondate, ins.transactionNumber as " +
            "ins_transactionNumber, ins.instrumenttype as ins_instrumenttype, ins .instrumentstatus" +
            " as ins_instrumentstatus,  ins.bankid as ins_bankid , ins.branchname as ins_branchname , ins" +
            ".bankaccountid as ins_bankaccountid,  ins.ifsccode as ins_ifsccode , ins.financialstatus as " +
            "ins_financialstatus ,  ins.transactiontype as ins_transactiontype , ins.payee as ins_payee , ins.drawer " +
            "as ins_drawer ,  ins.surrenderreason as ins_surrenderreason , ins.serialno as ins_serialno , ins" +
            ".additionalDetails as ins_additionalDetails, ins.createdby as ins_createdby ,  ins.createddate as ins_createddate , ins.lastmodifiedby as "
            +
            "ins_lastmodifiedby ,  ins.lastmodifieddate as ins_lastmodifieddate , ins.tenantid as ins_tenantid , " +
            " ins.instrumentDate as ins_instrumentDate, ins.instrumentNumber as ins_instrumentNumber " +
            "from egcl_receiptheader_v1 rh LEFT OUTER JOIN egcl_receiptdetails_v1 rd ON rh.id=rd.receiptheader " +
            "LEFT OUTER JOIN egcl_receiptinstrument_v1 recins ON rh.id=recins.receiptheader " +
            "LEFT JOIN egcl_instrumentheader_v1 ins ON recins.instrumentheader=ins.id ";

    private static final String PAGINATION_WRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY rh_id) offset_ FROM " +
            "({baseQuery})" +
            " result) result_offset " +
            "WHERE offset_ > :offset AND offset_ <= :limit";

    @SuppressWarnings("rawtypes")
    public static String getReceiptSearchQuery(ReceiptSearchCriteria_v1 searchCriteria,
                                               Map<String, Object> preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(SELECT_RECEIPTS_SQL);

        addWhereClause(selectQuery, preparedStatementValues, searchCriteria);

        addPaginationClause(selectQuery, preparedStatementValues, searchCriteria);
        
        return selectQuery.toString();
    }

    private static void addClauseIfRequired(Map<String, Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }


    @SuppressWarnings({ "unchecked", "rawtypes", "deprecation" })
    private static void addWhereClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                       ReceiptSearchCriteria_v1 searchCriteria) {

        if (StringUtils.isNotBlank(searchCriteria.getTenantId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            if(searchCriteria.getTenantId().split("\\.").length > 1) {
                selectQuery.append(" rh.tenantId =:tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId());
            }
            else {
                selectQuery.append(" rh.tenantId LIKE :tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId() + "%");
            }

        }

        if (searchCriteria.getReceiptNumbers() != null && !searchCriteria.getReceiptNumbers().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.receiptNumber IN (:receiptNumbers)  ");
            preparedStatementValues.put("receiptNumbers", searchCriteria.getReceiptNumbers());
        }

        if (!isNull(searchCriteria.getConsumerCode()) && !searchCriteria.getConsumerCode().isEmpty()) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.consumerCode in (:consumerCodes)");
            preparedStatementValues.put("consumerCodes", searchCriteria.getConsumerCode());
        }

        if (!isNull(searchCriteria.getStatus()) && !searchCriteria.getStatus().isEmpty()) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(rh.status) in (:status)");
            preparedStatementValues.put("status",
                    searchCriteria.getStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (!isNull(searchCriteria.getInstrumentType()) && !searchCriteria.getInstrumentType().isEmpty()) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(ins.instrumenttype) in (:instrumenttype)");
            preparedStatementValues.put("instrumenttype",
                    searchCriteria.getInstrumentType()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (StringUtils.isNotBlank(searchCriteria.getFund())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.fund = :fund");
            preparedStatementValues.put("fund", searchCriteria.getFund());
        }

        if (StringUtils.isNotBlank(searchCriteria.getDepartment())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.department = :department");
            preparedStatementValues.put("department", searchCriteria.getDepartment());
        }

        if (StringUtils.isNotBlank(searchCriteria.getCollectedBy())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.createdBy = :collectedBy");
            preparedStatementValues.put("collectedBy", new Long(searchCriteria
                    .getCollectedBy()));
        }

        if (searchCriteria.getFromDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.receiptDate >= :fromDate");
            preparedStatementValues.put("fromDate", searchCriteria.getFromDate());
        }

        if (searchCriteria.getToDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.receiptDate <= :toDate");
            Calendar c = Calendar.getInstance();
            c.setTime(new Date(searchCriteria.getToDate()));
            c.add(Calendar.DATE, 1);
            searchCriteria.setToDate(c.getTime().getTime());

            preparedStatementValues.put("toDate", searchCriteria.getToDate());
        }

        if (StringUtils.isNotBlank(searchCriteria.getBusinessCode())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.businessDetails = :businessCode");
            preparedStatementValues.put("businessCode", searchCriteria.getBusinessCode());
        }

        if (searchCriteria.getBusinessCodes() != null && !searchCriteria.getBusinessCodes().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.businessDetails IN (:businessCodes)  ");
            preparedStatementValues.put("businessCodes", searchCriteria.getBusinessCodes());
        }

        if (searchCriteria.getIds() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.id IN (:ids)");
            preparedStatementValues.put("ids", searchCriteria.getIds());
        }

        if (StringUtils.isNotBlank(searchCriteria.getTransactionId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.transactionid = :transactionId ");
            preparedStatementValues.put("transactionId", searchCriteria.getTransactionId());
        }

        if (searchCriteria.getManualReceiptNumbers() != null && !searchCriteria.getManualReceiptNumbers().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.manualreceiptnumber IN (:manualReceiptNumbers) ");
            preparedStatementValues.put("manualReceiptNumbers", searchCriteria.getManualReceiptNumbers());
        }

        if (searchCriteria.getBillIds() != null && !searchCriteria.getBillIds().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.referencenumber IN (:billIds) ");
            preparedStatementValues.put("billIds", searchCriteria.getBillIds());
        }

        if (searchCriteria.getPayerIds() != null && !searchCriteria.getPayerIds().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.payerid IN (:payerid)  ");
            preparedStatementValues.put("payerid", searchCriteria.getPayerIds());
        }

        if (StringUtils.isNotBlank(searchCriteria.getMobileNo())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.payermobile = :payermobile");
            preparedStatementValues.put("payermobile", searchCriteria.getMobileNo());
        }
    }

    private static void addPaginationClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                              ReceiptSearchCriteria_v1 criteria) {

		if (criteria.getLimit() != null && criteria.getLimit() != 0) {
			addClauseIfRequired(preparedStatementValues, selectQuery);
			selectQuery.append(
					" rh.id in (select id from egcl_receiptheader_v1 where tenantid = :tenantId order by createddate offset :offset limit :limit)");
			preparedStatementValues.put("offset", criteria.getOffset());
			preparedStatementValues.put("limit", criteria.getLimit());
		}
	}

}
