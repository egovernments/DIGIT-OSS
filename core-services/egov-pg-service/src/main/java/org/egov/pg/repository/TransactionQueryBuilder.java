package org.egov.pg.repository;


import org.egov.pg.web.models.TransactionCriteria;

import java.util.*;

class TransactionQueryBuilder {
    private static final String SEARCH_TXN_SQL = "SELECT pg.txn_id, pg.txn_amount, pg.txn_status, pg.txn_status_msg, " +
            "pg.gateway, pg.module, pg.consumer_code, pg.bill_id, pg.product_info, pg.user_uuid, pg.user_name, pg" +
            ".mobile_number, pg.email_id, pg.name, pg.user_tenant_id, pg.tenant_id, pg.gateway_txn_id, pg.gateway_payment_mode, " +
            "pg.gateway_status_code, pg.gateway_status_msg, pg.receipt, pg.additional_details,  pg.created_by, pg" +
            ".created_time, pg.last_modified_by, pg.last_modified_time " +
            "FROM eg_pg_transactions pg ";

    private TransactionQueryBuilder() {
    }

    static String getPaymentSearchQueryByCreatedTimeRange(TransactionCriteria transactionCriteria, List<Object> preparedStmtList) {
        String query = buildQuery(transactionCriteria, preparedStmtList);
        query = addOrderByClause(query);
        query = addPagination(query, transactionCriteria, preparedStmtList);
        return query;
    }

    static String getPaymentSearchQueryByCreatedTimeRange(TransactionCriteria transactionCriteria, Long startTime, Long endTime, List<Object> preparedStmtList) {
        return buildQueryForTimeRange(transactionCriteria, startTime, endTime, preparedStmtList);
    }

    private static String buildQueryForTimeRange(TransactionCriteria transactionCriteria, Long startTime, Long endTime, List<Object> preparedStmtList) {
        String preparedQuery = buildQuery(transactionCriteria, preparedStmtList);

        StringBuilder builder = new StringBuilder(preparedQuery);

        if (!preparedQuery.contains("WHERE"))
            builder.append(" WHERE ");
        else
            builder.append(" AND ");

        builder.append(" pg.created_time >= ? ");
        preparedStmtList.add(startTime);
        builder.append(" AND ");
        builder.append(" pg.created_time <= ? ");
        preparedStmtList.add(endTime);

        return builder.toString();
    }


    private static String buildQuery(TransactionCriteria transactionCriteria, List<Object> preparedStmtList) {
        StringBuilder builder = new StringBuilder(TransactionQueryBuilder.SEARCH_TXN_SQL);
        Map<String, Object> queryParams = new HashMap<>();

        if (!Objects.isNull(transactionCriteria.getTenantId())) {
            queryParams.put("pg.tenant_id", transactionCriteria.getTenantId());
        }

        if (!Objects.isNull(transactionCriteria.getTxnId())) {
            queryParams.put("pg.txn_id", transactionCriteria.getTxnId());
        }

        if (!Objects.isNull(transactionCriteria.getUserUuid())) {
            queryParams.put("pg.user_uuid", transactionCriteria.getUserUuid());
        }

        if (!Objects.isNull(transactionCriteria.getBillId())) {
            queryParams.put("pg.bill_id", transactionCriteria.getBillId());
        }

        if (!Objects.isNull(transactionCriteria.getTxnStatus())) {
            queryParams.put("pg.txn_status", transactionCriteria.getTxnStatus().toString());
        }

        if (!Objects.isNull(transactionCriteria.getConsumerCode())) {
            queryParams.put("pg.consumer_code", transactionCriteria.getConsumerCode());
        }

        if (!Objects.isNull(transactionCriteria.getReceipt())) {
            queryParams.put("pg.receipt", transactionCriteria.getReceipt());
        }



        if (!queryParams.isEmpty()) {

            builder.append(" WHERE ");

            Iterator<Map.Entry<String, Object>> iterator = queryParams.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, Object> entry = iterator.next();
                builder.append(entry.getKey()).append(" = ? ");

                preparedStmtList.add(entry.getValue());

                if (iterator.hasNext())
                    builder.append(" AND ");
            }
        }

        return builder.toString();
    }

    private static String addPagination(String query, TransactionCriteria transactionCriteria, List<Object>
            preparedStmtList){
        if (transactionCriteria.getLimit() > 0) {
            query = query + " limit ? ";
            preparedStmtList.add(transactionCriteria.getLimit());
        }
        if (transactionCriteria.getOffset() > 0) {
            query = query + " offset ? ";
            preparedStmtList.add(transactionCriteria.getOffset());
        }

        return query;
    }

    private static String addOrderByClause(String query){
        return query + " order by pg.created_time desc ";
    }

}
