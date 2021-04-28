package org.egov.collection.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.repository.querybuilder.RemittanceQueryBuilder;
import org.egov.collection.repository.rowmapper.RemittanceResultSetExtractor;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceDetail;
import org.egov.collection.web.contract.RemittanceInstrument;
import org.egov.collection.web.contract.RemittanceReceipt;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class RemittanceRepository {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private RemittanceResultSetExtractor remittanceResultSetExtractor;

    public void saveRemittance(Remittance remittance) {
        try {

            namedParameterJdbcTemplate.update(RemittanceQueryBuilder.INSERT_REMITTANCE_SQL,
                    RemittanceQueryBuilder.getParametersForRemittance(remittance));

            List<MapSqlParameterSource> remittanceDetailSource = new ArrayList<>();
            List<MapSqlParameterSource> remittanceInstrumentSource = new ArrayList<>();
            List<MapSqlParameterSource> remittanceReceiptSource = new ArrayList<>();

            for (RemittanceDetail detail : remittance.getRemittanceDetails()) {
                remittanceDetailSource.add(RemittanceQueryBuilder.getParametersForRemittanceDetails(detail));
            }

            for (RemittanceInstrument instrument : remittance.getRemittanceInstruments()) {
                remittanceInstrumentSource.add(RemittanceQueryBuilder.getParametersForRemittanceInstrument(instrument));
            }

            for (RemittanceReceipt receipt : remittance.getRemittanceReceipts()) {
                remittanceReceiptSource.add(RemittanceQueryBuilder.getParametersForRemittanceReceipt(receipt));
            }

            namedParameterJdbcTemplate.batchUpdate(RemittanceQueryBuilder.INSERT_REMITTANCE_DETAILS_SQL,
                    remittanceDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(RemittanceQueryBuilder.INSERT_REMITTANCE_INSTRUMENT_SQL,
                    remittanceInstrumentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(RemittanceQueryBuilder.INSERT_REMITTANCE_RECEIPT_SQL,
                    remittanceReceiptSource.toArray(new MapSqlParameterSource[0]));

        } catch (Exception e) {
            log.error("Failed to persist remittance to database", e);
            throw new CustomException("REMITTANCE_CREATION_FAILED", "Unable to create remittance");
        }
    }

    public void updateRemittance(Remittance remittance) {
    }

    public List<Remittance> fetchRemittances(RemittanceSearchRequest remittanceSearchRequest) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = RemittanceQueryBuilder.getRemittanceSearchQuery(remittanceSearchRequest, preparedStatementValues);
        log.debug(query);
        List<Remittance> remittances = namedParameterJdbcTemplate.query(query, preparedStatementValues,
                remittanceResultSetExtractor);
        return remittances;
    }

}
