package org.egov.collection.repository.querybuilder;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceDetail;
import org.egov.collection.web.contract.RemittanceInstrument;
import org.egov.collection.web.contract.RemittanceReceipt;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

public class RemittanceQueryBuilder {

    public static final String INSERT_REMITTANCE_SQL = "INSERT INTO egcl_remittance(id, referencenumber, referencedate, voucherheader, fund, function, remarks, reasonfordelay, status, createdby, createddate, lastmodifiedby, lastmodifieddate, bankaccount, tenantid) "
            + "VALUES (:id, :referencenumber, :referencedate, :voucherheader, :fund, :function, :remarks, :reasonfordelay, :status, :createdby, :createddate, :lastmodifiedby, :lastmodifieddate, :bankaccount, :tenantid)";

    public static final String INSERT_REMITTANCE_DETAILS_SQL = "INSERT INTO egcl_remittancedetails(id, remittance, chartofaccount, creditamount, debitamount, tenantid) "
            + "VALUES (:id, :remittance, :chartofaccount, :creditamount, :debitamount, :tenantid)";

    public static final String INSERT_REMITTANCE_INSTRUMENT_SQL = "INSERT INTO egcl_remittanceinstrument(id, remittance, instrument, reconciled, tenantid)  "
            + "VALUES (:id, :remittance, :instrument, :reconciled, :tenantid)";
    
    public static final String INSERT_REMITTANCE_RECEIPT_SQL = "INSERT INTO egcl_remittancereceipt(id, remittance, receipt, tenantid)  "
            + "VALUES (:id, :remittance, :receipt, :tenantid)";

    private static final String SELECT_REMITTANCES_SQL = "Select rem.bankaccount as rem_bankaccount,rem.function as rem_function,"
            + "rem.fund as rem_fund, rem.id as rem_id, rem.reasonForDelay as rem_reasonForDelay, rem.referenceDate as rem_referenceDate,"
            + "rem.referenceNumber as rem_referenceNumber, rem.remarks as rem_remarks, rem.status as rem_status,rem.voucherHeader as  rem_voucherHeader,"
            + "rem.createdBy as rem_createdBy, rem.createdDate as rem_createdDate,"
            + "rem.lastModifiedBy as rem_lastModifiedBy, rem.lastModifiedDate as rem_lastModifiedDate,"
            + "rem.tenantId as rem_tenantId,"

            + "remDet.remittance as remDet_remittance, remDet.chartOfAccount as remDet_chartOfAccount,"
            + "remDet.creditAmount as remDet_creditAmount, remDet.debitAmount as remDet_debitAmount,"
            + "remDet.tenantId as remDet_tenantId, remDet.id as remDet_id,"

            + "remIsm.remittance as remIsm_remittance, remIsm.instrument as remIsm_instrument, remIsm.reconciled as remIsm_reconciled,"
            + "remIsm.tenantId as remIsm_tenantId, remIsm.id as remIsm_id,"
            
            + "remRec.remittance as remRec_remittance, remRec.receipt as remRec_receipt,"
            + "remRec.tenantId as remRec_tenantId, remRec.id as remRec_id"

            + " from egcl_remittance rem LEFT OUTER JOIN egcl_remittancedetails remDet ON rem.id=remDet.remittance " +
            "LEFT OUTER JOIN egcl_remittanceinstrument remIsm ON rem.id=remIsm.remittance " +
            "LEFT OUTER JOIN egcl_remittancereceipt remRec ON rem.id=remRec.remittance ";

    private static final String PAGINATION_WRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY rem_id) offset_ FROM " +
            "({baseQuery})" +
            " result) result_offset " +
            "WHERE offset_ > :offset AND offset_ <= :limit";

    public static MapSqlParameterSource getParametersForRemittance(Remittance remittance) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", remittance.getId());
        sqlParameterSource.addValue("referencenumber", remittance.getReferenceNumber());
        sqlParameterSource.addValue("referencedate", remittance.getReferenceDate());
        sqlParameterSource.addValue("voucherheader", remittance.getVoucherHeader());
        sqlParameterSource.addValue("fund", remittance.getFund());
        sqlParameterSource.addValue("function", remittance.getFunction());
        sqlParameterSource.addValue("remarks", remittance.getRemarks());
        sqlParameterSource.addValue("reasonfordelay", remittance.getReasonForDelay());
        sqlParameterSource.addValue("status", remittance.getStatus());
        sqlParameterSource.addValue("bankaccount", remittance.getBankaccount());
        sqlParameterSource.addValue("tenantid", remittance.getTenantId());
        sqlParameterSource.addValue("createdby", remittance.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", remittance.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", remittance.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", remittance.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;

    }

    public static MapSqlParameterSource getParametersForRemittanceDetails(RemittanceDetail remittanceDetails) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", remittanceDetails.getId());
        sqlParameterSource.addValue("remittance", remittanceDetails.getRemittance());
        sqlParameterSource.addValue("chartofaccount", remittanceDetails.getChartOfAccount());
        sqlParameterSource.addValue("creditamount", remittanceDetails.getCreditAmount());
        sqlParameterSource.addValue("debitamount", remittanceDetails.getDebitAmount());
        sqlParameterSource.addValue("tenantid", remittanceDetails.getTenantId());

        return sqlParameterSource;

    }

    public static MapSqlParameterSource getParametersForRemittanceInstrument(RemittanceInstrument remittanceInstrument) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", remittanceInstrument.getId());
        sqlParameterSource.addValue("remittance", remittanceInstrument.getRemittance());
        sqlParameterSource.addValue("instrument", remittanceInstrument.getInstrument());
        sqlParameterSource.addValue("reconciled", remittanceInstrument.getReconciled());
        sqlParameterSource.addValue("tenantid", remittanceInstrument.getTenantId());

        return sqlParameterSource;

    }

    public static MapSqlParameterSource getParametersForRemittanceReceipt(RemittanceReceipt remittanceReceipt) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", remittanceReceipt.getId());
        sqlParameterSource.addValue("remittance", remittanceReceipt.getRemittance());
        sqlParameterSource.addValue("receipt", remittanceReceipt.getReceipt());
        sqlParameterSource.addValue("tenantid", remittanceReceipt.getTenantId());

        return sqlParameterSource;

    }

    @SuppressWarnings("rawtypes")
    public static String getRemittanceSearchQuery(RemittanceSearchRequest searchCriteria,
            Map<String, Object> preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(SELECT_REMITTANCES_SQL);

        addWhereClause(selectQuery, preparedStatementValues, searchCriteria);
        addOrderByClause(selectQuery, searchCriteria);

        return addPaginationClause(selectQuery, preparedStatementValues, searchCriteria);
    }

    @SuppressWarnings({ "unchecked", "rawtypes", "deprecation" })
    private static void addWhereClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
            RemittanceSearchRequest searchCriteria) {

        if (StringUtils.isNotBlank(searchCriteria.getTenantId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.tenantId =:tenantId");
            preparedStatementValues.put("tenantId", searchCriteria.getTenantId());

        }

        if (searchCriteria.getReferenceNumbers() != null && !searchCriteria.getReferenceNumbers().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.referenceNumber IN (:referenceNumbers)  ");
            preparedStatementValues.put("referenceNumbers", searchCriteria.getReferenceNumbers());
        }

        if (StringUtils.isNotBlank(searchCriteria.getBankaccount())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.bankaccount in (:bankaccount)");
            preparedStatementValues.put("bankaccount", searchCriteria.getBankaccount());
        }

        if (StringUtils.isNotBlank(searchCriteria.getStatus())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.status = :status");
            preparedStatementValues.put("status", searchCriteria.getStatus());
        }

        if (StringUtils.isNotBlank(searchCriteria.getFund())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.fund = :fund");
            preparedStatementValues.put("fund", searchCriteria.getFund());
        }

        if (StringUtils.isNotBlank(searchCriteria.getFunction())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.function = :function");
            preparedStatementValues.put("function", searchCriteria.getFunction());
        }

        if (StringUtils.isNotBlank(searchCriteria.getReasonForDelay())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.reasonForDelay = :reasonForDelay");
            preparedStatementValues.put("reasonForDelay", searchCriteria.getReasonForDelay());
        }

        if (StringUtils.isNotBlank(searchCriteria.getRemarks())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.remarks = :remarks");
            preparedStatementValues.put("remarks", searchCriteria.getRemarks());
        }

        if (searchCriteria.getFromDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.referenceDate >= :fromDate");
            preparedStatementValues.put("fromDate", searchCriteria.getFromDate());
        }

        if (searchCriteria.getToDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rh.referenceDate <= :toDate");
            Calendar c = Calendar.getInstance();
            c.setTime(new Date(searchCriteria.getToDate()));
            c.add(Calendar.DATE, 1);
            searchCriteria.setToDate(c.getTime().getTime());

            preparedStatementValues.put("toDate", searchCriteria.getToDate());
        }

        if (StringUtils.isNotBlank(searchCriteria.getVoucherHeader())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.voucherHeader = :voucherHeader");
            preparedStatementValues.put("voucherHeader", searchCriteria.getVoucherHeader());
        }

        if (searchCriteria.getIds() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" rem.id IN (:ids)");
            preparedStatementValues.put("ids", searchCriteria.getIds());
        }

    }

    private static void addClauseIfRequired(Map<String, Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }

    private static void addOrderByClause(StringBuilder selectQuery,
            RemittanceSearchRequest criteria) {
        String sortBy = (criteria.getSortBy() == null ? "rem.referenceDate" : "rem." + criteria.getSortBy());
        String sortOrder = (criteria.getSortOrder() == null ? "DESC" : criteria
                .getSortOrder());
        selectQuery.append(" ORDER BY ").append(sortBy).append(" ").append(sortOrder);
    }

    private static String addPaginationClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
            RemittanceSearchRequest criteria) {

        if (criteria.getLimit() != 0) {
            String finalQuery = PAGINATION_WRAPPER.replace("{baseQuery}", selectQuery);
            preparedStatementValues.put("offset", criteria.getOffset());
            preparedStatementValues.put("limit", criteria.getOffset() + criteria.getLimit());

            return finalQuery;
        } else
            return selectQuery.toString();
    }

}
