package org.egov.collection.repository.rowmapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceDetail;
import org.egov.collection.web.contract.RemittanceInstrument;
import org.egov.collection.web.contract.RemittanceReceipt;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

@Service
public class RemittanceResultSetExtractor implements ResultSetExtractor<List<Remittance>> {

    @Override
    public List<Remittance> extractData(ResultSet resultSet) throws SQLException, DataAccessException {

        Map<String, Remittance> remittances = new LinkedHashMap<>();

        while (resultSet.next()) {
            String id = resultSet.getString("rem_id");
            Remittance remittance;
            Set<RemittanceDetail> remittanceDetails;
            Set<RemittanceInstrument> remittanceInstruments;
            Set<RemittanceReceipt> remittanceReceipts;
            if (!remittances.containsKey(id)) {

                AuditDetails auditDetails = AuditDetails.builder()
                        .createdBy(resultSet.getString("rem_createdBy"))
                        .createdDate(resultSet.getLong("rem_createdDate"))
                        .lastModifiedBy(resultSet.getString("rem_lastModifiedBy"))
                        .lastModifiedDate(resultSet.getLong("rem_lastModifiedDate"))
                        .build();

                BigDecimal creditAmount = getBigDecimalValue(resultSet.getBigDecimal("remDet_creditAmount"));
                BigDecimal debitAmount = getBigDecimalValue(resultSet.getBigDecimal("remDet_debitAmount"));

                RemittanceDetail details = RemittanceDetail.builder().chartOfAccount(resultSet.getString("remDet_chartOfAccount"))
                        .remittance(resultSet.getString("remDet_remittance"))
                        .creditAmount(creditAmount).debitAmount(debitAmount).id(resultSet.getString("remDet_id"))
                        .tenantId(resultSet.getString("remDet_tenantId")).build();

                RemittanceInstrument instrument = RemittanceInstrument.builder()
                        .instrument(resultSet.getString("remIsm_instrument"))
                        .remittance(resultSet.getString("remIsm_remittance"))
                        .id(resultSet.getString("remIsm_id"))
                        .reconciled(resultSet.getBoolean("remIsm_reconciled"))
                        .tenantId(resultSet.getString("remIsm_tenantId")).build();

                RemittanceReceipt receipt = RemittanceReceipt.builder()
                        .receipt(resultSet.getString("remRec_receipt"))
                        .remittance(resultSet.getString("remRec_remittance"))
                        .id(resultSet.getString("remRec_id"))
                        .tenantId(resultSet.getString("remRec_tenantId")).build();

                remittance = Remittance.builder().bankaccount(resultSet.getString("rem_bankaccount"))
                        .function(resultSet.getString("rem_function")).fund(resultSet.getString("rem_fund"))
                        .id(resultSet.getString("rem_id")).reasonForDelay(resultSet.getString("rem_reasonForDelay"))
                        .referenceDate(resultSet.getLong("rem_referenceDate"))
                        .referenceNumber(resultSet.getString("rem_referenceNumber")).remarks(resultSet.getString("rem_remarks"))
                        .status(resultSet.getString("rem_status")).tenantId(resultSet.getString("rem_tenantId"))
                        .voucherHeader(resultSet.getString("rem_voucherHeader")).auditDetails(auditDetails)
                        .remittanceDetails(Collections.singleton(details))
                        .remittanceInstruments(Collections.singleton(instrument))
                        .remittanceReceipts(Collections.singleton(receipt)).build();

                remittances.put(id, remittance);

            } else {
                remittance = remittances.get(id);

                BigDecimal creditAmount = getBigDecimalValue(resultSet.getBigDecimal("remDet_creditAmount"));
                BigDecimal debitAmount = getBigDecimalValue(resultSet.getBigDecimal("remDet_debitAmount"));
                RemittanceDetail details = RemittanceDetail.builder().chartOfAccount(resultSet.getString("remDet_chartOfAccount"))
                        .remittance(resultSet.getString("remDet_remittance"))
                        .creditAmount(creditAmount).debitAmount(debitAmount).id(resultSet.getString("remDet_id"))
                        .tenantId(resultSet.getString("remDet_tenantId")).build();
                remittanceDetails = new HashSet<>(remittance.getRemittanceDetails());
                remittanceDetails.add(details);
                remittance.setRemittanceDetails(remittanceDetails);

                RemittanceInstrument instrument = RemittanceInstrument.builder()
                        .instrument(resultSet.getString("remIsm_instrument"))
                        .remittance(resultSet.getString("remIsm_remittance"))
                        .id(resultSet.getString("remIsm_id"))
                        .reconciled(resultSet.getBoolean("remIsm_reconciled"))
                        .tenantId(resultSet.getString("remIsm_tenantId")).build();

                remittanceInstruments = new HashSet<>(remittance.getRemittanceInstruments());
                remittanceInstruments.add(instrument);
                remittance.setRemittanceInstruments(remittanceInstruments);

                RemittanceReceipt receipt = RemittanceReceipt.builder()
                        .receipt(resultSet.getString("remRec_receipt"))
                        .remittance(resultSet.getString("remRec_remittance"))
                        .id(resultSet.getString("remRec_id"))
                        .tenantId(resultSet.getString("remRec_tenantId")).build();

                remittanceReceipts = new HashSet<>(remittance.getRemittanceReceipts());
                remittanceReceipts.add(receipt);
                remittance.setRemittanceReceipts(remittanceReceipts);
            }

        }

        return new ArrayList<>(remittances.values());
    }

    private BigDecimal getBigDecimalValue(BigDecimal amount) {
        return Objects.isNull(amount) ? BigDecimal.ZERO : amount;
    }

}
