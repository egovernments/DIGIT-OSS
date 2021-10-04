import { CardLabel, CitizenInfoLabel, FormStep, LabelFieldPair, TextInput,CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
var validation ={};
const PTAllotmentDetails = ({ t, config, onSelect, value, userType, formData }) => {

  const [
    val, setValue
  ] = useState(formData?.[config.key]?.alotmentDetails||"");
  
  const goNext = () => {
    onSelect(config.key, {alotmentDetails:val});
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
          <CardLabel>{`${t("PT_VASIKA_ALLOTMENT_LABEL")}`}</CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="PlotSize"
            value={val}
            onChange={(e)=>setValue(e?.target?.value)}

          />
        </div>
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_VASIKA_DETAILS_INFO")} />}
    </React.Fragment>
  );
};

export default PTAllotmentDetails;
