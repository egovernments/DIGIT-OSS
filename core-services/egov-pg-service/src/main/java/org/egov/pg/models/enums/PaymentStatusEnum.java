package org.egov.pg.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatusEnum {
        NEW("NEW"),
        DEPOSITED("DEPOSITED"),
        CANCELLED("CANCELLED"),
        DISHONOURED("DISHONOURED"),
        RECONCILED("RECONCILED");


        private String value;

        PaymentStatusEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }


        @JsonCreator
        public static PaymentStatusEnum fromValue(String text) {
            for (PaymentStatusEnum b : PaymentStatusEnum.values()) {
                if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                    return b;
                }
            }
            return null;
        }

        public static boolean contains(String test) {
            for (PaymentStatusEnum val : PaymentStatusEnum.values()) {
                if (val.name().equalsIgnoreCase(test)) {
                    return true;
                }
            }
            return false;
        }
    }
