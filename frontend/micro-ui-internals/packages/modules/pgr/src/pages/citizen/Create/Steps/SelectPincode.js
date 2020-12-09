import { FormStep } from "@egovernments/digit-ui-react-components";
import React from "react";
import useTenants from "../../../../hooks/useTenants";

const SelectPincode = ({ config, onSelect }) => {
  const tenants = useTenants();

  console.log("pincodceeeee", tenants);
  tenants.map;
  const goNext = async (data) => {
    console.log("iiiiiiiii", data);
    var foundValue = tenants.filter((obj) => obj.pincode.find((item) => item == data.pincode))[0];
    console.log("foundValue", foundValue);
    if (foundValue) {
      Digit.SessionStorage.set("city_complaint", foundValue);
      let response = await Digit.LocationService.getLocalities({ tenantId: foundValue.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      const filteredLocalities = __localityList.filter((obj) => obj.pincode?.find((item) => item == data.pincode));
      console.log('filter localities', filteredLocalities, __localityList);
      Digit.SessionStorage.set("selected_localities", filteredLocalities?.length > 0 ? filteredLocalities : __localityList);
    } else {
      Digit.SessionStorage.set("city_complaint", undefined);
      Digit.SessionStorage.set("selected_localities", undefined);
    }
    onSelect(data);
  };

  const onSkip = () => onSelect();
  return <FormStep config={config} onSelect={goNext} onSkip={onSkip}></FormStep>;
};

export default SelectPincode;
