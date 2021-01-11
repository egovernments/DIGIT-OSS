import { FormStep } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const SelectPincode = ({ t, config, onSelect, value }) => {
  const tenants = Digit.Hooks.fsm.useTenants();
  const [pincode, setPincode] = useState(() => {
    const { pincode } = value;
    return pincode;
  });

  function onChange(e) {
    setPincode(e.target.value);
  }

  const goNext = async (data) => {
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == data?.pincode));
    if (foundValue) {
      let response = await Digit.LocationService.getLocalities({ tenantId: foundValue.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      const filteredLocalities = __localityList.filter((obj) => obj.pincode?.find((item) => item == data.pincode));
      // Digit.SessionStorage.set("selected_localities", filteredLocalities?.length > 0 ? filteredLocalities : __localityList);
    }
    onSelect({ ...data, city_complaint: foundValue });
  };

  const onSkip = () => onSelect();
  return <FormStep t={t} config={config} onSelect={goNext} value={pincode} onChange={onChange} onSkip={onSkip}></FormStep>;
};

export default SelectPincode;
