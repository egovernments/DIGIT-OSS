package org.egov.dataupload.utils.Constants;

import java.util.HashMap;
import java.util.Map;

public enum PTUnitDetail {
    Tenant,
    Existing_Property_Id,
    Floor_No,
    Unit_No,
    Unit_Usage,
    Unit_Sub_usage,
    Occupancy,
    Built_up_area,
    Annual_rent,
    UsageCategorySubMinor,
    UsageCategoryDetail,
    UNKNOWN;

    private static final Map<Integer, PTUnitDetail> _map  = new HashMap<>();

    static {
        for (PTUnitDetail val: PTUnitDetail.values()) {
            _map.put(val.ordinal(), val);
        }
    }

    public static PTUnitDetail from(int value) {
        if (_map.containsKey(value))
            return _map.get(value);
        return UNKNOWN;
    }
}
