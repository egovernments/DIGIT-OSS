import {
  CardLabel,
  CitizenInfoLabel,
  FormStep,
  Loader,
  TextInput,
  Dropdown
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
// import SelectOwnerDetails from "./SelectOwnerDetails";
import SelectStreet from "./SelectStreet";
import TLSelectPropertyID from "./TLSelectPropertyID";
import TLTradeDetailsEmployee from "./TLTradeDetailsEmployee";
import TLOwnerDetailsEmployee from "./TLOwnerDetialsEmployee";

const SelectTradeName = ({
  t,
  config,
  onSelect,
  value,
  userType,
  formData,
}) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [TradeName, setTradeName] = useState(formData.TradeDetails?.TradeName);
  const [FY,setFY] = useState(formData?.[config.key]?.FY)
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit =
    window.location.href.includes("/edit-application/") ||
    window.location.href.includes("renew-trade");
  const { isLoading, data: fydata = {} } =
    window.Digit.Hooks.tl.useTradeLicenseMDMS(
      stateId,
      "egf-master",
      "FinancialYear"
    );

    
    let mdmsFinancialYear = fydata["egf-master"]
    ? fydata["egf-master"].FinancialYear.filter((y) => y.module === "TL")
    : [];
  
  
    // let FY =
    // mdmsFinancialYear &&
    // mdmsFinancialYear.length > 0 &&
    // mdmsFinancialYear.sort((x, y) => y.endingDate - x.endingDate)[0]?.code;
  
    function setSelectTradeName(e) {
      setTradeName(e.target.value);
  }
  
    console.log(mdmsFinancialYear, config.key, formData, "financial years");
    
  const goNext = () => {
    sessionStorage.setItem("CurrentFinancialYear",FY?.code);
    onSelect(config.key, { ...formData?.[config.key], TradeName, FY });
  };

  if (isLoading) {
    return <Loader></Loader>;
  }
  console.log("ayush",FY)
  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        t={t}
        onSkip={onSkip}
        isDisabled={!TradeName}
      >
        <CardLabel>{t("TL_SELECT_FINANCIAL_YEAR")}</CardLabel>
        <Dropdown selected={FY} option={mdmsFinancialYear} optionKey="code" select={setFY} />

        <CardLabel>{`${t("TRADE_NAME")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="TradeName"
          value={TradeName}
          onChange={setSelectTradeName}
          disable={isEdit}
          {...(validation = {
            pattern: "^[^{0-9}^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,._:;“”‘’]*$",
            isRequired: true,
            type: "text",
            title: t("TL_INVALID_TRADE_NAME"),
          })}
        />
      </FormStep>
      {
        <CitizenInfoLabel
          info={t("CS_FILE_APPLICATION_INFO_LABEL")}
          text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") + ` ${FY?FY.name:""}`}
        />
      }
    </React.Fragment>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectTradeName",
    SelectTradeName
  );
  // window.Digit.ComponentRegistryService.setComponent(
  //   "SelectOwnerDetails",
  //   SelectOwnerDetails
  // );
  window.Digit.ComponentRegistryService.setComponent(
    "SelectStreet",
    SelectStreet
  );
  window.Digit.ComponentRegistryService.setComponent(
    "TLSelectPropertyID",
    TLSelectPropertyID
  );
  window.Digit.ComponentRegistryService.setComponent(
    "TLTradeDetailsEmployee",
    TLTradeDetailsEmployee
  );
  window.Digit.ComponentRegistryService.setComponent(
    "TLOwnerDetailsEmployee",
    TLOwnerDetailsEmployee
  );
};

export default customize;
