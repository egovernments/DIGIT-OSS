package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;

@Data
public class ReceiptWorkflow {

    @NotNull
    @Length(min = 1)
    private String receiptNumber;

    @NotNull
    private ReceiptAction action;

    @NotNull
    @Length(min = 1)
    private String tenantId;

    private String reason;
    private JsonNode additionalDetails;

    /**
     * Current status of the transaction
     */
    public enum ReceiptAction {
        CANCEL("CANCEL"),
        DISHONOUR("DISHONOUR"),
        REMIT("REMIT");

        private String value;

        ReceiptAction(String value) {
            this.value = value;
        }

        @JsonCreator
        public static ReceiptAction fromValue(String text) {
            for (ReceiptAction b : ReceiptAction.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }
    }

}
