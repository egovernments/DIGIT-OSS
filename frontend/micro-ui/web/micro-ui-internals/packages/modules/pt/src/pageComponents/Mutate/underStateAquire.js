import React, { useEffect, useState } from "react";
import { FormStep, RadioButtons, LabelFieldPair, CardLabel, TextInput, CheckBox } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/TLTimeline";

const PTPropertyUnderStateAquire = ({ ...props }) => {
  const { t, config, onSelect, userType, formData, setError, clearErrors, errors } = props;

  const menu = [{ code: "YES" }, { code: "NO" }];

  const [isPropertyUnderGovtPossession, setSelected] = useState(formData?.[config.key]?.isPropertyUnderGovtPossession);
  const [govtAcquisitionDetails, setReason] = useState(formData?.[config.key]?.govtAcquisitionDetails);

  useEffect(() => {
    if (isPropertyUnderGovtPossession?.code === "NO" && govtAcquisitionDetails?.length) setReason("");
    if (userType === "employee") {
      if (!isPropertyUnderGovtPossession) {
        setError(config.key, { type: "Required" });
      } else if (errors?.[config.key]) clearErrors(config.key);
      goNext();
    }
  }, [isPropertyUnderGovtPossession, govtAcquisitionDetails]);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], isPropertyUnderGovtPossession, govtAcquisitionDetails });
  };

  const onSkip = () => {};

  function setPropertyUnderGovtPossession(e) {
    if (e.target.checked == true) {
      setSelected({ code: "YES" });
    } else {
      setSelected({ code: "NO" });
    }
  }

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_STATE_ACQUISITION") + " *"}
          </CardLabel> */}
          <div className="field" style={{ width: "55%" }}>
            <CheckBox
              label={`${t("PT_MUTATION_STATE_ACQUISITION")}*`}
              name={"isPropertyUnderGovtPossession"}
              onChange={setPropertyUnderGovtPossession}
              checked={isPropertyUnderGovtPossession?.code === "YES" ? true : false}
              style={{ paddingBottom: "10px", paddingTop: "3px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#0b0c0c" }}
            />
            {/* <RadioButtons
              style={{ display: "flex" }}
              innerStyles={{ paddingRight: "250px" }}
              t={t}
              optionsKey="i18nKey"
              isMandatory={config.isMandatory}
              options={menu}
              selectedOption={isPropertyUnderGovtPossession}
              onSelect={(v) => {
                setSelected(v);
              }}
              labelKey="PT_MUTATION_STATE_ACQUISITION"
              isDependent={true}
            /> */}
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_GOVT_ACQUISITION_DETAILS")}
          </CardLabel>
          <div className="field">
            <TextInput
              disable={isPropertyUnderGovtPossession?.code !== "YES"}
              value={govtAcquisitionDetails}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </LabelFieldPair>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="PT_MUTATE" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isPropertyUnderGovtPossession?.code}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={isPropertyUnderGovtPossession}
          onSelect={(v) => {
            setSelected(v);
          }}
          labelKey="PT_MUTATION_STATE_ACQUISITION"
          isDependent={true}
        />
        <CardLabel>{t("PT_MUTATION_GOVT_ACQUISITION_DETAILS")}</CardLabel>
        <TextInput
          disable={isPropertyUnderGovtPossession?.code !== "YES"}
          value={govtAcquisitionDetails}
          onChange={(e) => setReason(e.target.value)}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default PTPropertyUnderStateAquire;
