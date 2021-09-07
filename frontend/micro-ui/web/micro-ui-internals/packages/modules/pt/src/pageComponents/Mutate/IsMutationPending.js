import React, { useEffect, useState } from "react";
import { FormStep, RadioButtons, LabelFieldPair, CardLabel, Dropdown, Loader, TextInput } from "@egovernments/digit-ui-react-components";

const IsMutationPending = (props) => {
  const { t, config, onSelect, userType, formData, setError, clearErrors, errors } = props;

  const menu = [{ code: "YES" }, { code: "NO" }];

  const [isMutationInCourt, setMutationInCourt] = useState(formData?.[config.key]?.isMutationInCourt);
  const [caseDetails, setCaseDetails] = useState(formData?.[config.key]?.caseDetails || "");

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], isMutationInCourt, caseDetails });
  };

  useEffect(() => {
    if (isMutationInCourt?.code === "NO" && caseDetails?.length) setCaseDetails("");
    if (userType === "employee") {
      if (!isMutationInCourt) {
        setError(config.key, { type: "Required" });
      } else if (errors?.[config.key]) clearErrors(config.key);
      goNext();
    }
  }, [isMutationInCourt, caseDetails]);

  const onSkip = () => {};

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_COURT_PENDING_OR_NOT") + " *"}
          </CardLabel>
          <div className="field">
            <RadioButtons
              style={{ display: "flex" }}
              innerStyles={{ paddingRight: "250px" }}
              t={t}
              optionsKey="i18nKey"
              isMandatory={config.isMandatory}
              options={menu}
              selectedOption={isMutationInCourt}
              onSelect={(v) => {
                setMutationInCourt(v);
              }}
              labelKey="PT_MUTATION_PENDING"
              isDependent={true}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair style={{ marginBottom: "50px" }}>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_COURT_CASE_DETAILS")}
          </CardLabel>
          <div className="field">
            <TextInput disable={isMutationInCourt?.code !== "YES"} value={caseDetails} onChange={(e) => setCaseDetails(e.target.value)} />
          </div>
        </LabelFieldPair>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isMutationInCourt}>
        <div>
          <RadioButtons
            t={t}
            optionsKey="i18nKey"
            isMandatory={config.isMandatory}
            options={menu}
            selectedOption={isMutationInCourt}
            onSelect={(v) => {
              setMutationInCourt(v);
            }}
            labelKey="PT_MUTATION_PENDING"
            isDependent={true}
          />
          <CardLabel>{t("PT_MUTATION_COURT_CASE_DETAILS")}</CardLabel>
          <TextInput disable={isMutationInCourt?.code !== "YES"} value={caseDetails} onChange={(e) => setCaseDetails(e.target.value)} />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default IsMutationPending;
