import { CardLabel, CitizenInfoLabel, FormStep, LabelFieldPair, TextInput,CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
var validation ={};
const PTVasikaDetails = ({ t, config, onSelect, value, userType, formData }) => {


  const [
    val, setValue
  ] = useState(formData?.[config.key]?.vasikaNo||"");
  const [
    other, setOther
  ] = useState(formData?.[config.key]?.vasikaArea||"");
  const goNext = () => {
    onSelect(config.key, {vasikaNo:val,vasikaArea:other});
  };


  if (userType === "employee") {
    return (
        <React.Fragment>
          <LabelFieldPair >
            <CardLabel className="card-label-smaller">{t("PT_VASIKA_NO_LABEL") }</CardLabel>
            <div className="field">
              <TextInput
               t={t}
            type={"number"}
            isMandatory={false}
            name="PlotSize"
                value={val}
                onChange={(e)=>setValue(e?.target?.value)}
                // autoFocus={presentInModifyApplication}
              />
            </div>
          </LabelFieldPair>
        
        </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <FormStep
        config={config}
        header="ground"
        onSelect={goNext}
        onSkip={goNext}
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
          type={"text"}
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
