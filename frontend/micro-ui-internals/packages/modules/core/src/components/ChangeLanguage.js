import { ActionBar, Button, Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { CustomButton, Menu } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";

const ChangeLanguage = (prop) => {
  const isDropdown = prop.dropdown || false;
  console.log({ isDropdown });
  const commonState = useSelector((state) => state.common);
  const { languages, selectedLanguage, stateInfo } = commonState;
  const [selected, setselected] = useState(selectedLanguage);
  const handleChangeLanguage = (language) => {
    console.log("changing language", language);
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };

  if (isDropdown) {
    return (
      <div>
        <Dropdown
          option={languages}
          selected={languages.find((language) => language.value === selectedLanguage)}
          optionKey={"label"}
          select={handleChangeLanguage}
          freeze={true}
          customSelector={<label className="cp">{languages.find((language) => language.value === selected).label}</label>}
        />
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <div style={{ marginBottom: "5px" }}>Language</div>
        <div className="language-selector">
          {languages.map((language, index) => (
            <div className="language-button-container" key={index}>
              <CustomButton
                selected={language.value === selected}
                text={language.label}
                onClick={() => handleChangeLanguage(language)}
              ></CustomButton>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
};

export default ChangeLanguage;
