import { FormStep } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const SelectPincode = ({ t, config, onSelect, value }) => {
  const tenants = Digit.Hooks.pgr.useTenants();
  // const __initPincode = Digit.SessionStorage.get("PGR_CREATE_PINCODE");
  const [pincode, setPincode] = useState(() => {
    const { pincode } = value;
    return pincode;
  });

  function onChange(e) {
    setPincode(e.target.value);
    // Digit.SessionStorage.set("PGR_CREATE_PINCODE", e.target.value);
  }

  const goNext = async (data) => {
    var foundValue = tenants.find((obj) => obj.pincode?.find((item) => item == data?.pincode));
    if (foundValue) {
      Digit.SessionStorage.set("city_complaint", foundValue);
      let response = await Digit.LocationService.getLocalities({ tenantId: foundValue.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      const filteredLocalities = __localityList.filter((obj) => obj.pincode?.find((item) => item == data.pincode));
      Digit.SessionStorage.set("selected_localities", filteredLocalities?.length > 0 ? filteredLocalities : __localityList);
    } else {
      Digit.SessionStorage.set("city_complaint", undefined);
      Digit.SessionStorage.set("selected_localities", undefined);
    }
    onSelect(data);
  };

  const onSkip = () => onSelect();
  return <FormStep t={t} config={config} onSelect={goNext} value={pincode} onChange={onChange} onSkip={onSkip}></FormStep>;
};

export default SelectPincode;
