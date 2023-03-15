import { CitizenInfoLabel, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/TLTimeline";

const PropertyBasementsDetails = ({ t, config, onSelect, userType, formData }) => {
  const [BasementDetails, setBasementDetails] = useState(formData?.noOofBasements);

  const menu = [
    {
      //i18nKey: "No Basement",
      code: 0,
      i18nKey: "PT_NO_BASEMENT_OPTION",
    },
    {
      //i18nKey: "1 Basement",
      code: 1,
      i18nKey: "PT_ONE_BASEMENT_OPTION",
    },
    {
      //i18nKey: "2 Basement",
      code: 2,
      i18nKey: "PT_TWO_BASEMENT_OPTION",
    },
  ];

  const onSkip = () => onSelect();

  function selectBasementDetails(value) {
    setBasementDetails(value);
  }

  function goNext() {
    // let index = window.location.href.charAt(window.location.href.length - 1);
    //let index = window.location.href.split("/").pop();
    sessionStorage.setItem("noOofBasements", BasementDetails.i18nKey);
    onSelect(config.key, BasementDetails,);
  }

  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!BasementDetails} isMultipleAllow={true}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={BasementDetails}
          onSelect={setBasementDetails}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_BASEMENT_NUMBER_INFO_MSG", BasementDetails)} />}
    </React.Fragment>
  );
};

export default PropertyBasementsDetails;
