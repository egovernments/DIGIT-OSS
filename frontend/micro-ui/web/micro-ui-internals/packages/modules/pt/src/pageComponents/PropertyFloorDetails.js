import { CardLabel, CitizenInfoLabel, Dropdown, FormStep, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/TLTimeline";

const PropertyFloorsDetails = ({ t, config, onSelect, formData, userType }) => {
  const [FloorDetails, setFloorDetails] = useState(formData?.noOfFloors);
  const stateId = Digit.ULBService.getStateId();
  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Floor") || {};

  const menu = [
    {
      //i18nKey: "Ground Floor Only",
      i18nKey: "PT_GROUND_FLOOR_OPTION",
      code: 0,
    },
    {
      //i18nKey: "Ground +1",
      i18nKey: "PT_GROUND_PLUS_ONE_OPTION",
      code: 1,
    },
    {
      //i18nKey: "Ground +2",
      i18nKey: "PT_GROUND_PLUS_TWO_OPTION",
      code: 2,
    },
    /* {
      i18nKey: "NONE",
      code: "NONE",
    }, */ //in case of independent roperty floor can't be none, if it is then user need to select vacant type.
  ];

  const employeeMenu = Menu?.PropertyTax?.Floor?.filter((floor) => floor?.code > 0) || [];

  const onSkip = () => onSelect();

  function selectFloorDetails(value) {
    setFloorDetails(value);
  }

  function goNext() {
    let index = window.location.href.charAt(window.location.href.length - 1);
    onSelect(config.key, FloorDetails,"", index);
  }

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [FloorDetails]);

  if (userType === "employee") {
    return null;
  }

  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!FloorDetails} isMultipleAllow={true}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={FloorDetails}
          onSelect={selectFloorDetails}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_USAGE_TYPE_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default PropertyFloorsDetails;
