package org.egov.dataupload.utils.Constants;

import java.util.HashMap;
import java.util.Map;

public enum PTOwnerDetails {
    Tenant,
    Existing_Property_ID,
    Name,
    MobileNumber,
    Father_Or_Husband_Name,
    Relationship,
    PermanentAddress,
    Owner_Type,
    Id_Type,
    Document_No,
    Email,
    Gender,
    UNKNOWN;

    private static final Map<Integer, PTOwnerDetails> _map  = new HashMap<>();

    static {
        for (PTOwnerDetails val: PTOwnerDetails.values()) {
            _map.put(val.ordinal(), val);
        }
    }

    public static PTOwnerDetails from(int value) {
        if (_map.containsKey(value))
            return _map.get(value);
        return UNKNOWN;
    }
}
