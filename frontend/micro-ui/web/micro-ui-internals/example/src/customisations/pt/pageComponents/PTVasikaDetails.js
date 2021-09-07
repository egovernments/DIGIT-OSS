import { CardLabel, CitizenInfoLabel, FormStep, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
var validation ={};
const PTVasikaDetails = ({ t, config, onSelect, value, userType, formData }) => {

  const onSkip = () => onSelect();

  const [
    val, setValue
  ] = useState("")
  const [
    other, setOther
  ] = useState("")
  const goNext = () => {
    onSkip()
  };


  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel >{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
          <div className="field">
            <TextInput
              type={"text"}
              t={t}
              isMandatory={false}
              name="mobileNumber"
              value={val}
              onChange={(e)=>setValue(e?.target?.value)}
              {...(validation = {
                isRequired: true,
                pattern: "[6-9]{1}[0-9]{9}",
                type: "tel",
                title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
              })}

            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel >{`${t("PT_OWNER_NAME")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              name="name"
              value={other}
              onChange={(e)=>setOther(e?.target?.value)}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "tel",
                title: t("PT_NAME_ERROR_MESSAGE"),
              })}

            />
          </div>
        </LabelFieldPair>
      </div>
    );
  }
  return (
    <React.Fragment>
      <FormStep
        config={config}
        header="ground"
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        showErrorBelowChildren={true}
      >

        <div>
          <CardLabel>{`${t("PT_VASIKA_NO_LABEL")}`}</CardLabel>
          <TextInput
            t={t}
            type={"number"}
            isMandatory={false}
            optionKey="i18nKey"
            name="PlotSize"
            value={val}
            onChange={(e)=>setValue(e?.target?.value)}

          />
        </div>
        <CardLabel>{`${t("PT_VASIKA_AREA_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"number"}
          isMandatory={false}
          optionKey="i18nKey"
          name="BuiltUpArea"
          value={other}
          onChange={(e)=>setOther(e?.target?.value)}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_VASIKA_DETAILS_INFO")} />}
    </React.Fragment>
  );
};

export default PTVasikaDetails;
