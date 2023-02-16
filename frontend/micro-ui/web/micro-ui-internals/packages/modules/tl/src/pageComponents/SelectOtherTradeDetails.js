import { CardLabel, CitizenInfoLabel, FormStep, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/TLTimeline";

const SelectOtherTradeDetails = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [TradeGSTNumber, setTradeGSTNumber] = useState(formData.TradeDetails?.TradeGSTNumber);
  const [OperationalSqFtArea, setOperationalSqFtArea] = useState(formData.TradeDetails?.OperationalSqFtArea);
  const [NumberOfEmployees, setNumberOfEmployees] = useState(formData.TradeDetails?.NumberOfEmployees);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");

 // let mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(y => y.module === "TL") : [];
 // let FY = mdmsFinancialYear && mdmsFinancialYear.length > 0 && mdmsFinancialYear.sort((x, y) => y.endingDate - x.endingDate)[0]?.code;
  function selectTradeGSTNumber(e) {
    setTradeGSTNumber(e.target.value);
  }
  function selectOperationalSqFtArea(e) {
    setOperationalSqFtArea(e.target.value);
  }
  function selectNumberOfEmployees(e) {
    setNumberOfEmployees(e.target.value);
  }

  const goNext = () => {
    //sessionStorage.setItem("CurrentFinancialYear", FY);
    onSelect(config.key, { TradeGSTNumber, OperationalSqFtArea, NumberOfEmployees });
  };
  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline /> : null}
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        //isDisabled={!TradeGSTNumber || !OperationalSqFtArea || !NumberOfEmployees}
      >
        <CardLabel>{`${t("TL_TRADE_GST_NO")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="TradeGSTNumber"
          value={TradeGSTNumber}
          onChange={selectTradeGSTNumber}
          //disable={isEdit}
          {...(validation = { pattern: "^[a-zA-Z-0-9_@/#&+-.`' ]*$", isRequired: false, title: t("TL_INVALID_TRADE_GST_NO") })}
        />
        <CardLabel>{`${t("TL_OPERATIONAL_AREA")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"number"}
          optionKey="i18nKey"
          name="OperationalSqFtArea"
          value={OperationalSqFtArea}
          onChange={selectOperationalSqFtArea}
          //disable={isEdit}
          //{...(validation = { pattern: "^[a-zA-Z-0-9_@/#&+-.`' ]*$", isRequired: true, title: t("TL_INVALID_TRADE_NAME") })}
        />
        <CardLabel>{`${t("TL_NO_OF_EMPLOYEES")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"number"}
          optionKey="i18nKey"
          name="NumberOfEmployees"
          value={NumberOfEmployees}
          onChange={selectNumberOfEmployees}
          //disable={isEdit}
          //{...(validation = { pattern: "^[a-zA-Z-0-9_@/#&+-.`' ]*$", isRequired: true, title: t("TL_INVALID_TRADE_NAME") })}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectOtherTradeDetails;