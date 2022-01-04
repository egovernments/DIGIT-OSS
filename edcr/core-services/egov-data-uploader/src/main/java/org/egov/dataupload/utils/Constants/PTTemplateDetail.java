package org.egov.dataupload.utils.Constants;

import java.util.HashMap;
import java.util.Map;


public enum PTTemplateDetail {
    Process,
    Tenant,
    City,
    Existing_Property_Id,
    Financial_Year,
    PropertyType,
    Property_Sub_Type,
    Is_your_property_height_above_36,
    Do_you_Store_Inflammable_material,
    Usage_Category_Major,
    Usage_Category_Minor,
    Land_Area_Buildup_Area,
    No_of_Floors,
    Ownership_Category,
    Sub_Ownership_Category,
    Locality,
    Door_No,
    Building_Name,
    Street_Name,
    Pincode,
    UNKNOWN;

    private static final Map<Integer, PTTemplateDetail> _map  = new HashMap<>();

    static {
        for (PTTemplateDetail val: PTTemplateDetail.values()) {
            _map.put(val.ordinal(), val);
        }
    }

    public static PTTemplateDetail from(int value) {
        if (_map.containsKey(value))
            return _map.get(value);
        return UNKNOWN;
    }
}


