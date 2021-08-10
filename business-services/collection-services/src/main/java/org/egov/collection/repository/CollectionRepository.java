/*package org.egov.collection.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.ReceiptSearchCriteria;
import org.egov.collection.repository.querybuilder.CollectionsQueryBuilder;
import org.egov.collection.repository.rowmapper.CollectionResultSetExtractor;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.collection.web.contract.Receipt;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.egov.collection.repository.querybuilder.CollectionsQueryBuilder.*;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.*;

@Repository
@Slf4j
public class CollectionRepository {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private CollectionResultSetExtractor collectionResultSetExtractor;


    @Transactional
    public void saveReceipt(Receipt receipt){
        Bill bill = receipt.getBill().get(0);
        try {
            namedParameterJdbcTemplate.update(INSERT_INSTRUMENT_HEADER_SQL, getParametersForInstrumentHeader(receipt
                    .getInstrument(), receipt.getAuditDetails()));

            List<MapSqlParameterSource> receiptHeaderSource = new ArrayList<>();
            List<MapSqlParameterSource> receiptDetailSource = new ArrayList<>();
            List<MapSqlParameterSource> instrumentSource = new ArrayList<>();

            for (BillDetail billDetail : bill.getBillDetails()) {
                receiptHeaderSource.add(getParametersForReceiptHeader(receipt, billDetail));
                instrumentSource.add(getParametersForInstrument(receipt.getInstrument(), billDetail
                        .getId()));


                for (BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
                    receiptDetailSource.add(getParametersForReceiptDetails(billAccountDetail, billDetail.getId()));
                }

            }

            namedParameterJdbcTemplate.batchUpdate(INSERT_RECEIPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(INSERT_RECEIPT_DETAILS_SQL,  receiptDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(INSERT_INSTRUMENT_SQL, instrumentSource.toArray(new MapSqlParameterSource[0]));

        }catch (Exception e){
            log.error("Failed to persist receipt to database", e);
            throw new CustomException("RECEIPT_CREATION_FAILED", e.getMessage());
        }
    }

    
    public void updateReceipt(List<Receipt> receipts){
        List<MapSqlParameterSource> receiptHeaderSource = new ArrayList<>();
        List<MapSqlParameterSource> receiptDetailSource = new ArrayList<>();
        List<MapSqlParameterSource> instrumentHeaderSource = new ArrayList<>();
        try {


            for (Receipt receipt : receipts) {
                BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
                receiptHeaderSource.add(getParametersForReceiptHeaderUpdate(receipt, billDetail));
                for (BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
                    receiptDetailSource.add(getParametersForReceiptDetails(billAccountDetail, billDetail.getId()));
                }
                instrumentHeaderSource.add(getParametersForInstrumentHeaderUpdate(receipt.getInstrument(),
                        receipt.getAuditDetails()));
            }
            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_DETALS_SQL, receiptDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_INSTRUMENT_HEADER_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_RECEIPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_INSTRUMENT_HEADER_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));

        }catch (Exception e){
            log.error("Failed to update receipt to database", e);
            throw new CustomException("RECEIPT_UPDATION_FAILED", "Unable to update receipt");
        }
    }

    public void updateStatus(List<Receipt> receipts){
        List<MapSqlParameterSource> receiptHeaderSource = new ArrayList<>();
        List<MapSqlParameterSource> receiptDetailSource = new ArrayList<>();
        List<MapSqlParameterSource> instrumentHeaderSource = new ArrayList<>();
        try {

            for(Receipt receipt : receipts){
                BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
                receiptHeaderSource.add(getParametersForReceiptStatusUpdate(billDetail, receipt.getAuditDetails()));
                for (BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
                    receiptDetailSource.add(getParametersForReceiptDetails(billAccountDetail, billDetail.getId()));
                }
                instrumentHeaderSource.add(getParametersForInstrumentStatusUpdate(receipt.getInstrument(), receipt.getAuditDetails
                        ()));
            }

            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_DETALS_SQL, receiptDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_INSTRUMENT_HEADER_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_RECEIPT_STATUS_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_INSTRUMENT_STATUS_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));
        }
        catch(Exception e){
            log.error("Failed to persist cancel Receipt to database", e);
            throw new CustomException("CANCEL_RECEIPT_FAILED", "Unable to cancel Receipt");
        }
    }

    public void saveInstrument(Receipt receipt){
        Bill bill = receipt.getBill().get(0);
        try {

            List<MapSqlParameterSource> instrumentSource = new ArrayList<>();

            for (BillDetail billDetail : bill.getBillDetails()) {
                instrumentSource.add(getParametersForInstrument(receipt.getInstrument(), billDetail
                        .getId()));
            }

            namedParameterJdbcTemplate.batchUpdate(INSERT_INSTRUMENT_SQL, instrumentSource.toArray(new MapSqlParameterSource[0]));
        }catch (Exception e){
            log.error("Failed to persist instrument to database", e);
            throw new CustomException("INSTRUMENT_CREATION_FAILED", "Unable to create instrument");
        }
    }

    public List<Receipt> fetchReceipts(ReceiptSearchCriteria receiptSearchCriteria){
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = CollectionsQueryBuilder.getReceiptSearchQuery(receiptSearchCriteria, preparedStatementValues);
        log.debug(query);
        List<Receipt> receipts = namedParameterJdbcTemplate.query(query, preparedStatementValues,
                collectionResultSetExtractor);
        return receipts;
    }

}
*/