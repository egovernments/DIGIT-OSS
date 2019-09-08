package org.egov.web.models.enums;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonValue;

    public enum ReceiptType {
        ADHOC("Adhoc"),
        BILLBASED("BillBased"),
        CHALLAN("Challan");


        private String name;

        ReceiptType(final String name) {
            this.name = name;
        }

        @Override
        @JsonValue
        public String toString() {
            return StringUtils.capitalize(name());
        }

        public String getName() {
            return name;
        }

    }

