import { CardLabel, CheckBox, CitizenInfoLabel, FormStep, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Timeline from "../components/Timeline";

const CorrospondenceAddress = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [Correspondenceaddress, setCorrespondenceaddress] = useState(formData.LicneseDetails?.Correspondenceaddress || "");
  const [isAddressSame, setisAddressSame] = useState(formData.LicneseDetails?.isAddressSame || false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

function selectChecked(e){
    if(isAddressSame == false){
      setisAddressSame(true);
      setCorrespondenceaddress(formData?.LicneseDetails?.PermanentAddress); }
      else{
        Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
        setisAddressSame(false);
        setCorrespondenceaddress("");
      }
}
  function selectCorrespondenceaddress(e) {
    setCorrespondenceaddress(e.target.value);
  }

  const goNext = () => {

    let payload = {
        "Licenses": [
            {
                "tradeLicenseDetail": {
                    "owners": [
                        {
                            "gender": formData?.LicneseDetails?.gender?.code,
                            "mobileNumber": formData?.LicneseDetails?.mobileNumber,
                            "name": formData?.LicneseDetails?.name,
                            "dob": null,
                            "emailId": formData?.LicneseDetails?.email,
                            "permanentAddress": formData?.LicneseDetails?.PermanentAddress,
                            // "permanentPinCode": "143001"
                        }
                    ],
                    "subOwnerShipCategory": "INDIVIDUAL",
                    "tradeUnits": [
                        {
                            "tradeType": formData?.LicneseType?.LicenseType?.tradeType,
                        }
                    ],
                    "address": {
                        "city": "",
                        "landmark": "",
                        "pincode": ""
                    },
                    "institution": null,
                    "applicationDocuments": null
                },
                "licenseType": "PERMANENT",
                "businessService": "BPAREG",
                "tenantId": stateId,
                "action": "NOWORKFLOW"
            }
        ]
    } 
    
    Digit.OBPSService.BPAREGCreate(payload, tenantId)
                    .then((result, err) => {
                            let data = {result:result, formData:formData, Correspondenceaddress:Correspondenceaddress}
                            //1, units
                            onSelect("", data, "", true);
                        
                    })
                    .catch((e) => {
                        // setShowToast({ key: "error" });
                        // setError(e?.response?.data?.Errors[0]?.message || null);
                    });


    // sessionStorage.setItem("CurrentFinancialYear", FY);
    // onSelect(config.key, { TradeName });
  };

  return (
    <React.Fragment>
      <Timeline currentStep={2} />
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        //isDisabled={!TradeName}
      >
        <CheckBox
        label={t("BPA_SAME_AS_PERMANENT_ADDRESS")}
        onChange={(e) => selectChecked(e)}
        //value={field.isPrimaryOwner}
        checked={isAddressSame}
        style={{ paddingBottom: "10px", paddingTop:"10px" }}
         />
        <CardLabel>{`${t("BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="Correspondenceaddress"
          value={Correspondenceaddress}
          onChange={selectCorrespondenceaddress}
          //disable={isEdit}
          //{...(validation = { pattern: "^[a-zA-Z-.`' ]*$", isRequired: true, type: "text", title: t("TL_INVALID_TRADE_NAME") })}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default CorrospondenceAddress;