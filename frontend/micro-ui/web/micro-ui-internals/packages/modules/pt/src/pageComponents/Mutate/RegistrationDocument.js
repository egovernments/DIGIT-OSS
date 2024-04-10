import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, DatePicker, CardLabelError, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/TLTimeline";

const RegistrationDocument = (props) => {
  const { t, config, onSelect, userType, formData, setError, clearErrors, errors } = props;

  const [documentNumber, setDocNo] = useState(formData?.[config.key]?.documentNumber);
  const [documentValue, setDocValue] = useState(formData?.[config.key]?.documentValue);
  const [documentDate, setDocDate] = useState(formData?.[config.key]?.documentDate);
  const [error, setLocalError] = useState(null);

  const selectDocDate = (date) => {
    setLocalError(null);
    let _date = new Date(date);
    let to_date = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${new Date().getDate().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}`


    if (new Date(date).getTime() <= new Date(to_date).getTime()) setDocDate(date);
    else setLocalError("PT_DOCUMENT_DATE_ERROR_MESSAGE");
  };

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], documentNumber, documentValue, documentDate });
  };

  useEffect(() => {
    if (userType === "employee" && !errors?.[config.key] && error) {
      setError(config.key, { type: "invalid" });
    } else if (!error && errors?.[config.key]?.type === "invalid") {
      clearErrors(config.key);
    }
  }, [error]);

  useEffect(() => {
    if (userType === "employee") {
      if (!documentDate || !documentNumber || !documentValue) {
        setError(config.key, { type: "Required" });
      } else if (errors?.[config.key]?.type === "Required") clearErrors(config.key);
      goNext();
    }
  }, [documentNumber, documentValue, documentDate]);

  const onSkip = () => {};

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_DOCUMENT_NO") + " *"}
          </CardLabel>
          <div className="field">
            <TextInput type={"number"} min={0} value={documentNumber} onChange={(e) => setDocNo(e.target.value)} />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_DOCUMENT_VALUE") + " *"}
          </CardLabel>
          <div className="field">
            <TextInput type={"number"} min={0} value={documentValue} onChange={(e) => setDocValue(e.target.value)} />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_DOCUMENT_ISSUE_DATE") + " *"}
          </CardLabel>
          <div className="field">
            <DatePicker max={new Date().toLocaleDateString()} date={documentDate} onChange={selectDocDate} />
          </div>
        </LabelFieldPair>
        {error ? <CardLabelError style={{ marginLeft: "30%" }}>{t(error)}</CardLabelError> : null}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="PT_MUTATE" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!(documentNumber && documentValue && documentDate)}>
        <CardLabel>{t("PT_MUTATION_DOCUMENT_NO")}</CardLabel>
        <TextInput type={"number"} min={0} value={documentNumber} onChange={(e) => setDocNo(e.target.value)} />
        <CardLabel>{t("PT_MUTATION_DOCUMENT_VALUE")}</CardLabel>
        <TextInput type={"number"} min={0} value={documentValue} onChange={(e) => setDocValue(e.target.value)} />
        <CardLabel>{t("PT_MUTATION_DOCUMENT_ISSUE_DATE")}</CardLabel>
        <DatePicker max={new Date().toLocaleDateString()} date={documentDate} onChange={selectDocDate} style={{maxWidth: 540}} />
        {error ? <CardLabelError>{t(error)}</CardLabelError> : null}
      </FormStep>
    </React.Fragment>
  );
};

export default RegistrationDocument;
