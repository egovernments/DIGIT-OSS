import { CardLabel, CitizenInfoLabel, FormStep, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

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
          <CardLabel>{`${t("PT_FLOOR_DETAILS_PLOT_SIZE_LABEL")}`}</CardLabel>
          <TextInput
            t={t}
            type={"number"}
            isMandatory={false}
            optionKey="i18nKey"
            name="PlotSize"
            value={val}
            onChange={setValue}

          />
        </div>
        <CardLabel>{`${t("PT_FLOOR_DETAILS_BUILT_UP_AREA_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          type={"number"}
          isMandatory={false}
          optionKey="i18nKey"
          name="BuiltUpArea"
          value={other}
          onChange={setOther}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_FLOOR_AREA_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default PTVasikaDetails;
