import React, { useState, useEffect, useMemo } from "react";
import { Loader, TypeSelectCard, Dropdown, FormStep, CardLabel, RadioOrSelect } from "@egovernments/digit-ui-react-components";

const SelectPropertySubtype = ({ config, onSelect, t, userType, formData }) => {
  // console.log("find subtype here", { config, onSelect, t, userType, formData });

  const select = (items) => items.map((item) => ({ ...item, i18nKey: t(item.i18nKey) }));
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { isLoading: propertySubtypesDataLoading, data: propertySubtypesData } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertySubtype", {
    select,
  });

  const [subtype, setSubtype] = useState();

  const [subtypeOptions, setSubtypeOptions] = useState([]);
  const { propertyType } = formData || {};

  useEffect(() => {
    if (!propertySubtypesDataLoading && propertySubtypesData) {
      const preFillSubtype = propertySubtypesData?.filter((subType) => subType.code === (formData?.subtype?.code || formData?.subtype))[0];
      // console.log("find pre fill subtype here", propertyType, preFillSubtype)
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
    // console.log("find proptype here", propertyType, propertySubtypesDataLoading, propertySubtypesData);
    // setSubtypeOptions([]);
    // if (userType === "employee") onSelect(config.key, undefined);
    if (!propertySubtypesDataLoading && propertyType) {
      const subTypes = propertySubtypesData.filter((item) => item.propertyType === (propertyType?.code || propertyType));
      setSubtypeOptions(subTypes);
    }
  }, [propertyType, propertySubtypesDataLoading, propertySubtypesData]);

  const selectedValue = (value) => {
    setSubtype(value);
  };

  const goNext = () => {
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
    return <Dropdown option={subtypeOptions} optionKey="i18nKey" id="propertySubType" selected={subtype} select={selectedSubType} t={t} />;
  } else {
    return (
      <FormStep config={config} onSelect={goNext} isDisabled={!subtype} t={t}>
        <CardLabel>{`${t("CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL")} *`}</CardLabel>
        <RadioOrSelect options={subtypeOptions} selectedOption={subtype} optionKey="i18nKey" onSelect={selectedValue} t={t} />
      </FormStep>
    );
  }
};

export default SelectPropertySubtype;
