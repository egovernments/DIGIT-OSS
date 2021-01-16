import { Button } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { CustomButton } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";

const ChangeLanguage = () => {
  const commonState = useSelector((state) => state.common);
  const { languages, selectedLanguage, stateInfo } = commonState;
  const [selected, setselected] = useState(selectedLanguage);

  const handleChangeLanguage = (language) => {
    console.log("changing language", language);
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "5px" }}>Language</div>
      <div className="language-selector">
        {languages.map((language, index) => (
          <div className="language-button-container" key={index}>
            <CustomButton selected={language.value === selected} text={language.label} onClick={() => handleChangeLanguage(language)}></CustomButton>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ChangeLanguage;
