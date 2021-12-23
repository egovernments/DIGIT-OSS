import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, FormStep, Loader } from "@egovernments/digit-ui-react-components";

const SelectSlumName = ({ config, onSelect, t, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [slum, setSlum] = useState();
  const slumTenantId = formData?.address?.city ? formData?.address?.city.code : tenantId;
  const { data: slumData, isLoading: slumDataLoading } = Digit.Hooks.fsm.useMDMS(slumTenantId, "FSM", "Slum");
  // console.log("find slum data here", locality,slumData && slumData[locality]), formData?.address?.locality;

  const [slumMenu, setSlumMenu] = useState();

  useEffect(() => {
    if (userType !== "employee" && formData?.address?.slumArea?.code === false) onSelect(config.key, {}, true);
  }, [formData?.address?.slumArea]);

  useEffect(() => {
    if (slumMenu && formData?.address) {
      const preSelectedSlum = slumMenu.filter((slum) => slum.code === formData?.address?.slum)[0];
      setSlum(preSelectedSlum);
    }
  }, [formData?.address?.slum, slumMenu]);

  useEffect(() => {
    const locality = formData?.address?.locality?.code;
    // console.log("find locality code here", locality)
    if (userType === "employee" && !slumDataLoading && slumData) {
      // console.log("find slum data here", slumData[locality], formData)
      const optionalSlumData = slumData[locality]
        ? [
            {
              code: null,
              active: true,
              name: "Not residing in slum area",
              i18nKey: "ES_APPLICATION_NOT_SLUM_AREA",
            },
            ...slumData[locality],
          ]
        : [
            {
              code: null,
              active: true,
              name: "Not residing in slum area",
              i18nKey: "ES_APPLICATION_NOT_SLUM_AREA",
            },
            ...Object.keys(slumData)
              .map((key) => slumData[key])
              .reduce((prev, curr) => [...prev, ...curr]),
          ];
      // console.log("find slum dta here", optionalSlumData)
      setSlumMenu(optionalSlumData);
      // console.log("ok setting slum name to none",{
      //   code: null,
      //   active: true,
      //   name: "Not residing in slum area",
      //   i18nKey: "ES_APPLICATION_NOT_SLUM_AREA",
      // })
      if (!formData?.address?.slum) {
        setSlum({
          code: null,
          active: true,
          name: "Not residing in slum area",
          i18nKey: "ES_APPLICATION_NOT_SLUM_AREA",
        });
        onSelect(config.key, { ...formData[config.key], slum: null });
      }
    }
    if (userType !== "employee" && !slumDataLoading && slumData) {
      // console.log("find citizen slum menu here", slumData, slumData[locality], formData)
      const allSlum = Object.keys(slumData)
        .map((key) => slumData[key])
        .reduce((prev, curr) => [...prev, ...curr]);
      // console.log("find slum data here", slumData, allSlum)
      slumData[locality] ? setSlumMenu(slumData[locality]) : setSlumMenu(allSlum);
    }
  }, [slumDataLoading, formData?.address?.locality?.code]);

  function selectSlum(value) {
    setSlum(value);
    onSelect(config.key, { ...formData[config.key], slum: value.code });
  }

  function onSkip() {
    onSelect();
  }

  function goNext() {
    onSelect(config.key, { ...formData[config.key], slum: slum.code, slumData: slum });
  }

  if (slumDataLoading) return <Loader />;

  return userType === "employee" ? (
    <LabelFieldPair>
      <CardLabel className="card-label-smaller">{t("ES_NEW_APPLICATION_SLUM_NAME")}</CardLabel>
      <Dropdown t={t} option={slumMenu} className="form-field" optionKey="i18nKey" id="slum" selected={slum} select={selectSlum} />
    </LabelFieldPair>
  ) : (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
      <Dropdown t={t} option={slumMenu} optionKey="i18nKey" id="i18nKey" selected={slum} select={setSlum} />
    </FormStep>
  );
};

export default SelectSlumName;
