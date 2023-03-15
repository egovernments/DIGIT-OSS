import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, FormStep, Loader } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectSlumName = ({ config, onSelect, t, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [slum, setSlum] = useState();
  const slumTenantId = formData?.address?.city ? formData?.address?.city.code : tenantId;
  const { data: slumData, isLoading: slumDataLoading } = Digit.Hooks.fsm.useMDMS(slumTenantId, "FSM", "Slum");

  const [slumMenu, setSlumMenu] = useState();

  useEffect(() => {
    if (userType !== "employee" && formData?.address?.slumArea?.code === false) onSelect(config.key, { slumData: null, slum: null }, true);
  }, [formData?.address?.slumArea]);

  useEffect(() => {
    if (slumMenu && formData?.address) {
      const preSelectedSlum = slumMenu.filter((slum) => slum.code === formData?.address?.slum)[0];
      setSlum(preSelectedSlum);
    }
  }, [formData?.address?.slum, slumMenu]);

  useEffect(() => {
    const locality = formData?.address?.locality?.code;
    if (userType === "employee" && !slumDataLoading && slumData) {
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
      setSlumMenu(optionalSlumData);

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
      const allSlum = Object.keys(slumData)
        .map((key) => slumData[key])
        .reduce((prev, curr) => [...prev, ...curr]);
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
    sessionStorage.removeItem("Digit.total_amount");
    onSelect(config.key, { ...formData[config.key], slum: slum.code, slumData: slum });
  }

  if (slumDataLoading) return <Loader />;

  return userType === "employee" ? (
    <LabelFieldPair>
      <CardLabel className="card-label-smaller">{t("ES_NEW_APPLICATION_SLUM_NAME")}</CardLabel>
      <Dropdown t={t} option={slumMenu} className="form-field" optionKey="i18nKey" id="slum" selected={slum} select={selectSlum} />
    </LabelFieldPair>
  ) : (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
        <Dropdown t={t} option={slumMenu} optionKey="i18nKey" id="i18nKey" selected={slum} select={setSlum} />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectSlumName;
