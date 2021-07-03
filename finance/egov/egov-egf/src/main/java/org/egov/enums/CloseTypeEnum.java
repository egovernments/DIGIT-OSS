package org.egov.enums;

public enum CloseTypeEnum {

    SOFTCLOSE("Soft Close"), HARDCLOSE("Hard Close");

    private String value;

    CloseTypeEnum(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

}
