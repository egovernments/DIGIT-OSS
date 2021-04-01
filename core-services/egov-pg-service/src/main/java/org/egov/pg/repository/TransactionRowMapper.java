package org.egov.pg.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import org.egov.pg.models.AuditDetails;
import org.egov.pg.models.TaxAndPayment;
import org.egov.pg.models.Transaction;
import org.egov.pg.web.models.User;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.RowMapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import static java.util.Objects.isNull;

public class TransactionRowMapper implements RowMapper<Transaction> {

    private static ObjectMapper objectMapper = new ObjectMapper();
    private static ObjectReader taxAndPaymentsReader =
            objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
            TaxAndPayment.class));

    @Override
    public Transaction mapRow(ResultSet resultSet, int i) throws SQLException {

        AuditDetails auditDetails = new AuditDetails(
                resultSet.getString("created_by"),
                resultSet.getLong("created_time"),
                resultSet.getString("last_modified_by"),
                resultSet.getLong("last_modified_time"));

        User user = User.builder()
                .uuid(resultSet.getString("user_uuid"))
                .userName(resultSet.getString("user_name"))
                .mobileNumber(resultSet.getString("mobile_number"))
                .emailId(resultSet.getString("email_id"))
                .name(resultSet.getString("name"))
                .tenantId(resultSet.getString("user_tenant_id"))
                .build();

        JsonNode additionalDetails = null;
        List<TaxAndPayment> taxAndPayments = null;

        if( ! isNull(resultSet.getObject("additional_details"))){
            String additionalDetailsJson = ((PGobject) resultSet.getObject("additional_details")).getValue();
            try {
                additionalDetails = objectMapper.readTree(additionalDetailsJson);

                if(additionalDetails.hasNonNull("taxAndPayments")){
                    taxAndPayments = taxAndPaymentsReader.readValue(additionalDetails.get("taxAndPayments"));
                }
            } catch (IOException e) {
                throw new CustomException("TXN_FETCH_FAILED", "Failed to deserialize data");
            }
        }

        return Transaction.builder()
                .txnId(resultSet.getString("txn_id"))
                .txnAmount(resultSet.getString("txn_amount"))
                .txnStatus(Transaction.TxnStatusEnum.fromValue(resultSet.getString("txn_status")))
                .txnStatusMsg(resultSet.getString("txn_status_msg"))
                .gateway(resultSet.getString("gateway"))
                .billId(resultSet.getString("bill_id"))
                .productInfo(resultSet.getString("product_info"))
                .user(user)
                .tenantId(resultSet.getString("tenant_id"))
                .gatewayTxnId(resultSet.getString("gateway_txn_id"))
                .gatewayPaymentMode(resultSet.getString("gateway_payment_mode"))
                .gatewayStatusCode(resultSet.getString("gateway_status_code"))
                .gatewayStatusMsg(resultSet.getString("gateway_status_msg"))
                .receipt(resultSet.getString("receipt"))
                .consumerCode(resultSet.getString("consumer_code"))
                .additionalDetails(additionalDetails)
                .taxAndPayments(taxAndPayments)
                .auditDetails(auditDetails)
                .build();
    }
}
