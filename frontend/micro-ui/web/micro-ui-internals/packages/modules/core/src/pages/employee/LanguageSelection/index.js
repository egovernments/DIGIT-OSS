import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CustomButton, SubmitBar } from "@egovernments/digit-ui-react-components";
import Background from "../../../components/Background";

const LanguageSelection = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { t } = useTranslation();
  const history = useHistory();
  const { languages, stateInfo } = storeData || {};
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const [selected, setselected] = useState(selectedLanguage);
  const handleChangeLanguage = (language) => {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };

  const handleSubmit = (event) => {
    history.push("/digit-ui/employee/user/login");
  }

  if (isLoading) return null;

  return (
    <Background>
      <Card className="bannerCard" >
        <div className="bannerHeader">
          <img className="bannerLogo" src={stateInfo?.logoUrl} />
          
          <p>{t(stateInfo?.name)}</p>
        </div>
        <div className="language-selector" style={{ justifyContent: "space-between", marginBottom: "24px" }}>
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
        <SubmitBar style={{ width: "100%" }} label={t(`CORE_COMMON_CONTINUE`)} onSubmit={handleSubmit} />
      </Card>
    </Background>
  )
};

export default LanguageSelection;