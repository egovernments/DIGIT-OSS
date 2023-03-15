import { CardLabel, CheckBox, CitizenInfoLabel, FormStep, Loader, TextInput, TextArea, OpenLinkContainer, BackButton } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/Timeline";

const PermanentAddress = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [PermanentAddress, setPermanentAddress] = useState(formData?.LicneseDetails?.PermanentAddress || formData?.formData?.LicneseDetails?.PermanentAddress);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let isopenlink = window.location.href.includes("/openlink/");
  const isCitizenUrl = Digit.Utils.browser.isMobile() ? true : false;
  //const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  //const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");

  //   let mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(y => y.module === "TL") : [];
  //   let FY = mdmsFinancialYear && mdmsFinancialYear.length > 0 && mdmsFinancialYear.sort((x, y) => y.endingDate - x.endingDate)[0]?.code;

  if(isopenlink)  
  window.onunload = function () {
    sessionStorage.removeItem("Digit.BUILDING_PERMIT");
  }


  function selectPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }

  const goNext = () => {

    // sessionStorage.setItem("CurrentFinancialYear", FY);
    if (!(formData?.result && formData?.result?.Licenses[0]?.id))
      onSelect(config.key, { PermanentAddress: PermanentAddress });
    else {
      let data = formData?.formData;
      data.LicneseDetails.PermanentAddress = PermanentAddress;
      onSelect("", formData)
    }
  };

  return (
    <React.Fragment>
      <div className={isopenlink ? "OpenlinkContainer" : ""}>

        {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
        <Timeline currentStep={2} flow="STAKEHOLDER" />
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={!PermanentAddress}
        >
          <CardLabel>{`${t("BPA_PERMANANT_ADDRESS_LABEL")}*`}</CardLabel>
          <TextArea
            t={t}
            isMandatory={false}
            type={"text"}
            optionKey="i18nKey"
            name="PermanentAddress"
            onChange={selectPermanentAddress}
            value={PermanentAddress}
          />
        </FormStep>
      </div>
    </React.Fragment>
  );
};

export default PermanentAddress;