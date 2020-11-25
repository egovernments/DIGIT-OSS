import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LocationSearchCard } from "@egovernments/digit-ui-react-components";

const LocationSearch = (props) => {
  let { t } = useTranslation();
  const history = useHistory();
  function onSave() {
    // props.save(selectedOption.key);
    history.push("/create-complaint/pincode");
  }
  return (
    <LocationSearchCard
      header={t("CS_ADDCOMPLAINT_PIN_LOCATION")}
      cardText={t("CS_ADDCOMPLAINT_PIN_LOCATION_TEXT")}
      nextText={t("PT_COMMONS_NEXT")}
      skipAndContinueText={t("CORE_COMMON_SKIP_CONTINUE")}
      skip={true}
      onSave={onSave}
    />
  );
};

export default LocationSearch;
