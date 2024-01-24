import React, { useState } from "react";
import { LocationSearchCard } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectGeolocation = ({ t, config, onSelect, formData = {} }) => {
  const [pincode, setPincode] = useState(formData?.address?.pincode || "");
  const [geoLocation, setGeoLocation] = useState(formData?.address?.geoLocation || {});
  const tenants = Digit.Hooks.fsm.useTenants();
  const [pincodeServicability, setPincodeServicability] = useState(null);

  const onSkip = () => onSelect();
  const onChange = (code, location) => {
    setPincodeServicability(null);
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == code));
    if (!foundValue) {
      setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
    } else {
      setPincode(code);
      setGeoLocation(location);
    }
  };

  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <LocationSearchCard
        header={t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_HEADER")}
        cardText={t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_TEXT")}
        nextText={t("CS_COMMON_NEXT")}
        skipAndContinueText={t("CORE_COMMON_SKIP_CONTINUE")}
        skip={onSkip}
        t={t}
        position={geoLocation}
        onSave={() => onSelect(config.key, { geoLocation, pincode })}
        onChange={(code, location) => onChange(code, location)}
        disabled={pincode === ""}
        forcedError={t(pincodeServicability)}
      />
    </React.Fragment>
  );
};

export default SelectGeolocation;
