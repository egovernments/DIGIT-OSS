package org.egov.pg.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.pg.models.Transaction;
import org.egov.pg.web.models.TransactionCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@Slf4j
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;
    private static final TransactionRowMapper rowMapper = new TransactionRowMapper();

    @Autowired
    TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Transaction> fetchTransactions(TransactionCriteria transactionCriteria) {
        List<Object> params = new ArrayList<>();
        String query = TransactionQueryBuilder.getPaymentSearchQueryByCreatedTimeRange(transactionCriteria, params);
        log.debug(query);
        return jdbcTemplate.query(query, params.toArray(), rowMapper);
    }

    public List<Transaction> fetchTransactionsByTimeRange(TransactionCriteria transactionCriteria, Long startTime, Long endTime) {
        List<Object> params = new ArrayList<>();
        String query = TransactionQueryBuilder.getPaymentSearchQueryByCreatedTimeRange(transactionCriteria, startTime, endTime, params);
        log.debug(query);
        return jdbcTemplate.query(query, params.toArray(), rowMapper);
    }

}
