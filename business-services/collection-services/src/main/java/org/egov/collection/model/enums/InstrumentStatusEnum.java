package org.egov.collection.model.enums;

public enum InstrumentStatusEnum {
    NEW, DEPOSITED, CANCELLED, DISHONOURED, RECONCILED;

    public static boolean contains(String test) {
        for (InstrumentTypesEnum val : InstrumentTypesEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }
}
