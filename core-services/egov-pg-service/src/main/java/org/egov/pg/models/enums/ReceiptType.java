package org.egov.pg.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.util.StringUtils;

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
