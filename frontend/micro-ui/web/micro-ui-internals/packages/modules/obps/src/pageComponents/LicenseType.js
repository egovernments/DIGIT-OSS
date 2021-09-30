import { CardLabel, FormStep, RadioOrSelect, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { stringReplaceAll } from "../utils";
import Timeline from "../components/Timeline";

const LicenseType = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [LicenseType, setLicenseType] = useState(formData?.LicneseType?.LicenseType || formData?.formData?.LicneseType?.LicenseType || "");
  const [ArchitectNo, setArchitectNo] = useState(formData?.LicneseType?.ArchitectNo || formData?.formData?.LicneseType?.ArchitectNo || null);

  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping");

  function getLicenseType(){
      let list=[];
      let found=false;
      data?.StakeholderRegistraition?.TradeTypetoRoleMapping.map((ob) => {
        found = list.some(el => el.i18nKey.includes(ob.tradeType.split(".")[0]));
        if(!found)list.push({role:ob.role,i18nKey:`TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, tradeType:ob.tradeType})
      } );
      return list;
  }




  const onSkip = () => onSelect();

  function selectLicenseType(value) {
    setLicenseType(value);
  }

  function selectArchitectNo(e){
    setArchitectNo(e.target.value);
  }

  function goNext() {
    if(!(formData?.result && formData?.result?.Licenses[0]?.id))
    onSelect(config.key, {LicenseType,ArchitectNo});
    else
    {
      let data = formData?.formData;
      data.LicneseType.LicenseType = LicenseType;
      onSelect("",formData)
    }
  }
  return (
    <div>
    <Timeline currentStep={1} flow="STAKEHOLDER" />
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={LicenseType && LicenseType?.i18nKey.includes("ARCHITECT") ? !LicenseType || !ArchitectNo:!LicenseType}>
      <CardLabel>{t("BPA_LICENSE_TYPE_QUES")}</CardLabel>
      <div className={"form-pt-dropdown-only"}>
        {data && (
          <RadioOrSelect
            t={t}
            optionKey="i18nKey"
            isMandatory={config.isMandatory}
            options={getLicenseType() || {}}
            selectedOption={LicenseType}
            onSelect={selectLicenseType}
          />
        )}
      </div>
      {LicenseType && LicenseType?.i18nKey.includes("ARCHITECT") && <div><CardLabel>{`${t("BPA_COUNCIL_NUMBER")}*`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="ArchitectNo"
          value={ArchitectNo}
          onChange={selectArchitectNo}
        />
        </div>}
    </FormStep>
    </div>
  );
};

export default LicenseType; 