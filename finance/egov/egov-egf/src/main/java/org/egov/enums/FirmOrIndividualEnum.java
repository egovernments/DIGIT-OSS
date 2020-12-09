package org.egov.enums;

public enum FirmOrIndividualEnum {
    
    FIRM("Firm"), INDIVIDUALS("Individuals");

    private String value;

    FirmOrIndividualEnum(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

}
