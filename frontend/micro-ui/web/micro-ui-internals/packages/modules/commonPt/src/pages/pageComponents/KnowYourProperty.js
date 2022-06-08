import React, { useState } from "react";
import { FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/CPTTimeline";

const KnowYourProperty = ({ t, config, onSelect, userType, formData }) => {
  const [KnowProperty, setKnowProperty] = useState(formData?.PropDetails?.KnowProperty);
  if(window.location.href.includes("/tl/tradelicence/edit-application/") || window.location.href.includes("/renew-trade/") )
  {
    let EditformData = JSON.parse(sessionStorage.getItem("EditFormData"));
    formData = {...formData,...EditformData};
  }
 
  const menu = [
    { i18nKey: "TL_COMMON_YES", code: "YES" },
    { i18nKey: "TL_COMMON_NO", code: "NO" },
  ];

  const onSkip = () => onSelect();

  function selectKnowProperty(value) {
    setKnowProperty(value);
  }

  function goNext() {
    sessionStorage.setItem("KnowProperty", KnowProperty.i18nKey);
    onSelect(config.key, { KnowProperty });
  }
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline /> : null}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!KnowProperty}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={KnowProperty}
          onSelect={selectKnowProperty}
        />
      </FormStep>
    </React.Fragment>
  );
};
export default KnowYourProperty;
