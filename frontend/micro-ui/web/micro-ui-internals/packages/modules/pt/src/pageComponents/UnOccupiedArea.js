import React, { useState, useEffect } from "react";
import { FormStep, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

const UnOccupiedArea = ({ t, config, onSelect, value, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const onSkip = () => onSelect();
  let UnOccupiedArea, setUnOccupiedArea;
  if (!isNaN(index)) {
    [UnOccupiedArea, setUnOccupiedArea] = useState(formData.units && formData.units[index] && formData.units[index].UnOccupiedArea);
  } else {
    [UnOccupiedArea, setUnOccupiedArea] = useState(formData?.UnOccupiedArea?.UnOccupiedArea);
  }

  let validation = {};
  const [unitareaerror, setunitareaerror] = useState(null);
  const [areanotzeroerror, setareanotzeroerror] = useState(null);

  function setPropertyUnOccupiedArea(e) {
    setUnOccupiedArea(e.target.value);
    setunitareaerror(null);
    setareanotzeroerror(null);
    if (formData?.PropertyType?.code === "BUILTUP.INDEPENDENTPROPERTY") {
      let totalarea = parseInt(formData?.units[index]?.floorarea || 0) + parseInt(formData?.units[index]?.RentArea || 0) + parseInt(e.target.value);
      if (parseInt(formData?.units[index]?.builtUpArea) < totalarea) {
        setunitareaerror("PT_TOTUNITAREA_LESS_THAN_BUILTUP_ERR_MSG");
      } else if (
        formData?.units[index]?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" &&
        parseInt(formData?.units[index]?.builtUpArea) == parseInt(e.target.value)
      ) {
        setunitareaerror("PT_BUILTUP_UNOCCUPIED_AREA_NOT_SAME");
      }
    }
    if (
      formData?.PropertyType?.code === "BUILTUP.SHAREDPROPERTY" &&
      parseInt(formData?.floordetails?.builtUpArea) <
        parseInt(e.target.value) + parseInt(formData?.landarea?.floorarea || "0") + parseInt(formData?.Constructiondetails?.RentArea || "0")
    ) {
      setunitareaerror("PT_TOTUNITAREA_LESS_THAN_BUILTUP_ERR_MSG");
    } else if (
      formData?.PropertyType?.code === "BUILTUP.SHAREDPROPERTY" &&
      formData?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" &&
      parseInt(formData?.floordetails?.builtUpArea) == parseInt(e.target.value)
    ) {
      setunitareaerror("PT_BUILTUP_UNOCCUPIED_AREA_NOT_SAME");
    }
    if (parseInt(e.target.value) == 0) {
      setareanotzeroerror("PT_AREA_NOT_0_MSG");
    }
  }

  const getheaderCaption = () => {
    if (formData?.PropertyType?.i18nKey === "COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY") {
      return "PT_FLOOR_DETAILS_HEADER";
    } else {
      return `PROPERTYTAX_FLOOR_${index}_DETAILS`;
    }
  };

  const goNext = () => {
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      //units["RentalArea"] = RentArea;
      //units["AnnualRent"] = AnnualRent;
      let floordet = { ...unit, UnOccupiedArea };
      onSelect(config.key, floordet, false, index);
      //onSelect(config.key, floordet, false, index);
      if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_ONE_OPTION" && index < 1 && index > -1) {
        let newIndex1 = parseInt(index) + 1;
        onSelect("floordetails", {}, true, newIndex1, true);
      } else if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_TWO_OPTION" && index < 2 && index > -1) {
        let newIndex2 = parseInt(index) + 1;
        onSelect("floordetails", {}, true, newIndex2, true);
      } else if (
        (formData?.noOofBasements?.i18nKey === "PT_ONE_BASEMENT_OPTION" || formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION") &&
        index > -1
      ) {
        onSelect("floordetails", {}, true, "-1", true);
      } else if (formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION" && index != -2) {
        onSelect("floordetails", {}, true, "-2", true);
      }
    } else {
      onSelect("UnOccupiedArea", { UnOccupiedArea });
    }
  };

  function onChange(e) {
    if (e.target.value.length > 1024) {
      setError("CS_COMMON_LANDMARK_MAX_LENGTH");
    } else {
      setError(null);
      setUnOccupiedArea(e.target.value);
      if (userType === "employee") {
        const value = e?.target?.value;
        const key = e?.target?.id;
        onSelect(key, value);
      }
    }
  }

  return (
    <FormStep
      config={((config.texts.headerCaption = getheaderCaption()), config)}
      onChange={onChange}
      onSelect={goNext}
      forcedError={t(unitareaerror) || t(areanotzeroerror)}
      onSkip={onSkip}
      t={t}
      isDisabled={unitareaerror || areanotzeroerror || !UnOccupiedArea}
      showErrorBelowChildren={true}
    >
      <CardLabel>{`${t("PT_UNOCCUPIED_AREA_SQ_FEET_LABEL")}`}</CardLabel>
      <TextInput
        t={t}
        isMandatory={false}
        type={"number"}
        optionKey="i18nKey"
        name="RentArea"
        value={UnOccupiedArea}
        onChange={setPropertyUnOccupiedArea}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_BUILT_AREA_ERROR_MESSAGE") })}
      />
    </FormStep>
  );
};

export default UnOccupiedArea;
