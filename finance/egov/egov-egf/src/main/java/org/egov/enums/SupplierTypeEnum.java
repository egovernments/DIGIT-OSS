package org.egov.enums;

public enum SupplierTypeEnum {

    FIRM("Firm"), INDIVIDUALS("Individuals");

    private String value;

    SupplierTypeEnum(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

}
