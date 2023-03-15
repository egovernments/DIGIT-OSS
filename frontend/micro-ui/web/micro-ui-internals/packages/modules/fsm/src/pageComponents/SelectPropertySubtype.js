import React, { useState, useEffect, useMemo } from "react";
import { Loader, TypeSelectCard, Dropdown, FormStep, CardLabel, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";
import { useLocation } from "react-router-dom";

const SelectPropertySubtype = ({ config, onSelect, t, userType, formData }) => {
  const { pathname: url } = useLocation();
  const select = (items) => items.map((item) => ({ ...item, i18nKey: t(item.i18nKey) }));
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { isLoading: propertySubtypesDataLoading, data: propertySubtypesData } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertySubtype", {
    select,
  });

  const [subtype, setSubtype] = useState();

  const [subtypeOptions, setSubtypeOptions] = useState([]);
  const { propertyType } = formData || {};

  useEffect(() => {
    if (!propertySubtypesDataLoading && propertySubtypesData) {
      const preFillSubtype = propertySubtypesData?.filter((subType) => subType.code === (formData?.subtype?.code || formData?.subtype))[0];
      if (
        (typeof propertyType === "string" && preFillSubtype?.code.split(".")[0] === propertyType) ||
        preFillSubtype?.code.split(".")[0] === propertyType?.code
      ) {
        setSubtype(preFillSubtype);
      } else {
        setSubtype(null);
      }
    }
  }, [propertyType, formData?.subtype, propertySubtypesData]);

  useEffect(() => {
    if (!propertySubtypesDataLoading && propertyType) {
      const subTypes = propertySubtypesData.filter((item) => item.propertyType === (propertyType?.code || propertyType));
      setSubtypeOptions(subTypes);
    }
  }, [propertyType, propertySubtypesDataLoading, propertySubtypesData]);

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
    sessionStorage.removeItem("Digit.total_amount");
    onSelect(config.key, subtype);
  };

  function selectedSubType(value) {
    onSelect(config.key, value.code);
  }

  if (propertySubtypesDataLoading) {
    return <Loader />;
  }

  // const subtypeOptions = useMemo(() => {
  //   return propertySubtypesData.filter((item) => item.propertyType === (propertyType?.code || propertyType));
  // }, [propertyType])

  if (userType === "employee") {
    return <Dropdown option={subtypeOptions} optionKey="i18nKey" id="propertySubType" selected={subtype} select={selectedSubType} t={t} disable={url.includes("/modify-application/") || url.includes("/new-application") ? false : true} />;
  } else {
    return (
      <React.Fragment>
        <Timeline currentStep={1} flow="APPLY" />
        <FormStep config={config} onSelect={goNext} isDisabled={!subtype} t={t}>
          <CardLabel>{`${t("CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL")} *`}</CardLabel>
          <RadioOrSelect options={subtypeOptions} selectedOption={subtype} optionKey="i18nKey" onSelect={selectedValue} t={t} />
        </FormStep>
      </React.Fragment>
    );
  }
};

export default SelectPropertySubtype;
