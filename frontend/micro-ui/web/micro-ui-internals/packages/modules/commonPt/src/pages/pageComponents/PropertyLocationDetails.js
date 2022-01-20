import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber, Localities } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation, useRouteMatch } from "react-router-dom";
import { stringReplaceAll } from "../utils";

const PropertyLocationDetails = ({ t, config, onSelect, userType, formData, onBlur}) => {
  let validation = {};

  const allCities = Digit.Hooks.pt.useTenants();

  const [cityCode, setCityCode] = useState(formData?.cityCode);
  const [locality, setLocality] = useState(formData?.locality);
  const [houseDoorNo, setHouseDoorNo] = useState(formData.houseDoorNo);
  const [buildingColonyName, setBuildingColonyName] = useState(formData.buildingColonyName);
  const [landmarkName, setLandmarkName] = useState(formData.landmarkName);

  let index = 0;
  let locationDet = formData.locationDet;
  const locationDetStep = { ...locationDet, cityCode, locality, houseDoorNo, buildingColonyName, landmarkName };
  
  function setCity(val) {
    setCityCode(val.code);
    onSelect(config.key, { ...formData[config.key], ...locationDetStep, city: val }, false, index);
  }

  function setLocality1(value) {
    setLocality(value);
    onSelect(config.key, { ...formData[config.key], ...locationDetStep, locality: value }, false, index);
  }

  function setHouseDoorNumb(e) {
    setHouseDoorNo(e.target.value)
    onSelect(config.key, { ...formData[config.key], ...locationDetStep, houseDoorNo: e.target.value }, false, index);
  }

  function setBuildingColony(e) {
    setBuildingColonyName(e.target.value)
    onSelect(config.key, { ...formData[config.key], ...locationDetStep, buildingColonyName: e.target.value }, false, index);
  }

  function setLandmark(e) {
    setLandmarkName(e.target.value)
    onSelect(config.key, { ...formData[config.key], ...locationDetStep, landmarkName: e.target.value }, false, index);
  }

  return (
    <div>
      <CardLabel>{t('PT_PROP_CITY')}</CardLabel>
      <Dropdown
        className="form-field"
        selected={cityCode}
        disable={allCities?.length === 1}
        option={allCities}
        select={setCity}
        optionKey="code"
        // onBlur={props.onBlur}
        t={t}
      />

      <CardLabel>{t("PT_PROP_LOCALITY")}</CardLabel>
      <Localities
        selectLocality={setLocality1}
        tenantId={cityCode}
        boundaryType="revenue"
        keepNull={false}
        optionCardStyles={{ height: "600px", overflow: "auto", zIndex: "10" }}
        selected={locality}
        disable={!cityCode}
        disableLoader={true}
      />

      <CardLabel>{`${t("PT_HOUSE_DOOR_NO")}`}</CardLabel>
      <TextInput
        t={t}
        type={"number"}
        isMandatory={false}
        optionKey="i18nKey"
        name="houseDoorNo"
        value={houseDoorNo}
        onChange={setHouseDoorNumb}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_HOUSE_DOOR_NO_ERROR_MESSAGE") })}
      />

      <CardLabel>{`${t("PT_BUILDING_COLONY_NAME")}`}</CardLabel>
      <TextInput
        t={t}
        type={"text"}
        isMandatory={false}
        optionKey="i18nKey"
        name="buildingColonyName"
        value={buildingColonyName}
        onChange={setBuildingColony}
      />

      <CardLabel>{`${t("PT_LANDMARK_NAME")}`}</CardLabel>
      <TextInput
        t={t}
        type={"text"}
        isMandatory={false}
        optionKey="i18nKey"
        name="landmarkName"
        value={landmarkName}
        onChange={setLandmark}
      />
     
    </div>
  );
};

export default PropertyLocationDetails;
