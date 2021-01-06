import { Button } from "@egovernments/digit-ui-react-components";
import React from "react";

const ChangeLanguage = (props) => {
  const handleChangeLanguage = (language) => {
    console.log("handleChangeLanguage::::>", language);
  };
  return (
    <div className="language-selector">
      {props.languages.map((language, index) => (
        <div className="language-button-container">
          {/* <Button size="small" key={index} label={language} onSubmit={() => handleChangeLanguage(language)} /> */}
          <CustomButton></CustomButton>
        </div>
      ))}
    </div>
  );
};

export default ChangeLanguage;
