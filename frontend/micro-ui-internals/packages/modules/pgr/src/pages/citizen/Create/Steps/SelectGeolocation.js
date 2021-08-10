import React from "react";
import { LocationSearchCard } from "@egovernments/digit-ui-react-components";

const SelectGeolocation = ({ onSelect, onSkip, value, t }) => {
  let pincode = "";
  return (
    <LocationSearchCard
      header={t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_HEADER")}
      cardText={t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_TEXT")}
      nextText={t("CS_COMMON_NEXT")}
      skipAndContinueText={t("CS_COMMON_SKIP")}
      skip={() => onSelect()}
      onSave={() => onSelect({ pincode })}
      onChange={(code) => (pincode = code)}
    />
  );
};

export default SelectGeolocation;
