import { CardLabel, CitizenInfoLabel, FormStep, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/TLTimeline";

const RentalDetails = ({ t, config, onSelect, value, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  let validation = {};
  const onSkip = () => onSelect();
  let RentArea, AnnualRent;
  let setRentArea, setAnnualRent;
  if (!isNaN(index)) {
    [RentArea, setRentArea] = useState(formData.units && formData.units[index] && formData.units[index].RentArea);
    [AnnualRent, setAnnualRent] = useState(formData.units && formData.units[index] && formData.units[index].AnnualRent);
  } else {
    [RentArea, setRentArea] = useState(formData.Constructiondetails?.RentArea);
    [AnnualRent, setAnnualRent] = useState(formData.Constructiondetails?.AnnualRent);
  }
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "RentalDetails");

  if (Menu) {
    config.texts.cardText = Menu?.PropertyTax?.RentalDetails[0]?.code
      ? `PT_ASSESSMENT_FLOW_RENTAL_DETAIL_${Menu?.PropertyTax?.RentalDetails[0]?.code}`
      : "";
  }

  /*  useEffect(() => {
    if (userType !== "employee" && formData?.IsThisFloorSelfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      /* let index = window.location.href.charAt(window.location.href.length - 1);
      let unit = formData.units && formData.units[index];
      onSelect(config.key, unit, true, index); 

      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, {}, true, index);
      }
    }
  }); */

  const [unitareaerror, setunitareaerror] = useState(null);
  const [areanotzeroerror, setareanotzeroerror] = useState(null);

  function setPropertyRentArea(e) {
    setRentArea(e.target.value);
    setunitareaerror(null);
    setareanotzeroerror(null);
    if (formData?.PropertyType?.code === "BUILTUP.INDEPENDENTPROPERTY") {
      let totalarea = parseInt(formData?.units[index]?.floorarea || 0) + parseInt(e.target.value);
      if (parseInt(formData?.units[index]?.builtUpArea) < totalarea) {
        setunitareaerror("PT_TOTUNITAREA_LESS_THAN_BUILTUP_ERR_MSG");
      }
    }
    if (
      formData?.PropertyType?.code === "BUILTUP.SHAREDPROPERTY" &&
      parseInt(formData?.floordetails?.builtUpArea) < parseInt(e.target.value) + parseInt(formData?.landarea?.floorarea || "0")
    ) {
      setunitareaerror("PT_RENTED_AREA_LESS_THAN_BUILTUP");
    }
    if (parseInt(e.target.value) == 0) {
      setareanotzeroerror("PT_AREA_NOT_0_MSG");
    }
  }
  function setPropertyAnnualRent(e) {
    setAnnualRent(e.target.value);
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
      let floordet = { ...unit, RentArea, AnnualRent };
      onSelect(config.key, floordet, false, index);
    } else {
      onSelect("Constructiondetails", { RentArea, AnnualRent });
    }
  };
  //const onSkip = () => onSelect();

  return (
    <React.Fragment>
          {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
      <FormStep
        config={((config.texts.headerCaption = getheaderCaption()), config)}
        onSelect={goNext}
        onSkip={onSkip}
        forcedError={t(unitareaerror) || t(areanotzeroerror)}
        t={t}
        isDisabled={unitareaerror || areanotzeroerror || !RentArea || !AnnualRent}
        showErrorBelowChildren={true}
      >
        <CardLabel>{`${t("PT_FLOOR_DETAILS_RENTED_AREA_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"number"}
          optionKey="i18nKey"
          name="RentArea"
          value={RentArea}
          onChange={setPropertyRentArea}
          {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_RENT_AREA_ERROR_MESSAGE") })}
        />
        <CardLabel>{`${t("PT_FLOOR_DETAILS_ANNUAL_RENT_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"number"}
          optionKey="i18nKey"
          name="AnnualRent"
          value={AnnualRent}
          onChange={setPropertyAnnualRent}
          {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_BUILT_AREA_ERROR_MESSAGE") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_RENTAL_AREA_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default RentalDetails;
