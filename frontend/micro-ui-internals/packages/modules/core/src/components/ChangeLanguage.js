import { Button } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { CustomButton } from "@egovernments/digit-ui-react-components";

const ChangeLanguage = (props) => {
  const languages = ["English", "हिंदी", "ਪੰਜਾਬੀ"];
  const [selected, setselected] = useState("English");

  const handleChangeLanguage = (language) => {
    console.log("handleChangeLanguage::::>", language);
    setselected(language);
  };
  return (
    <React.Fragment>
      <div className="language-selector">
        {languages.map((language, index) => (
          <div className="language-button-container" key={index}>
            {/* <Button size="small" key={index} label={language} onSubmit={() => handleChangeLanguage(language)} /> */}
            <CustomButton selected={language === selected} text={language} onClick={() => handleChangeLanguage(language)}></CustomButton>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ChangeLanguage;
