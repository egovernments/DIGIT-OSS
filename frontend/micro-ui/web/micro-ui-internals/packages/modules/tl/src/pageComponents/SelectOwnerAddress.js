import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CheckBox, CardLabel, LabelFieldPair, TextArea, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectOwnerAddress = ({ t, config, onSelect, userType, formData }) => {
  const [permanentAddress, setPermanentAddress] = useState(formData?.owners?.permanentAddress || "");
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(formData?.owners?.isCorrespondenceAddress);
  let isedittrade = window.location.href.includes("edit-application");
  let isrenewtrade = window.location.href.includes("renew-trade");
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  let ismultiple = formData?.ownershipCategory?.code.includes("SINGLEOWNER") ? false : true;

  useEffect(() => {
    if (formData?.owners?.permanentAddress == null && isrenewtrade && permanentAddress === "") {
      let obj = {
        doorNo: formData?.address?.doorNo,
        street: formData?.address?.street || formData?.address?.buildingName,
        landmark: formData?.address?.landmark,
        locality: formData?.address?.locality?.name,
        city: formData?.address?.city?.code?.split(".")[1],
        pincode: formData?.address?.pincode,
      };
      let addressDetails = "";
      for (const key in obj) {
        if (key == "pincode" || (!obj["pincode"] && key =="city")) addressDetails += obj[key] ? obj[key] : "";
        else if(obj[key]) addressDetails += obj[key] ? t(`${obj[key]}`) + ", " : "";
      }
      setPermanentAddress(addressDetails);
    }
  }, [formData]);
  function setOwnerPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }
  function setCorrespondenceAddress(e) {
    if (formData?.cpt?.details && Object.keys(formData?.cpt?.details).length > 0 && e.target.checked == true) {
      let obj = {
        doorNo: formData?.cpt?.details?.address?.doorNo,
        street: formData?.cpt?.details?.address?.street || formData?.cpt?.details?.address?.buildingName,
        landmark: formData?.cpt?.details?.address?.landmark,
        locality: formData?.cpt?.details?.address?.locality?.name,
        city: formData?.cpt?.details?.address?.city,
        pincode: formData?.address?.pincode,
      };
      let addressDetails = "";
      for (const key in obj) {
        if (key == "pincode" || (!obj["pincode"] && key =="city")) addressDetails += obj[key] ? obj[key] : "";
        else if(obj[key]) addressDetails += obj[key] ? t(`${obj[key]}`) + ", " : "";
      }
      setPermanentAddress(addressDetails);
    } else if (e.target.checked == true) {
      let obj = {
        doorNo: formData?.address?.doorNo,
        street: formData?.address?.street || formData?.address?.buildingName,
        landmark: formData?.address?.landmark,
        locality: formData?.address?.locality?.i18nkey,
        city: formData?.address?.city?.name,
        pincode: formData?.address?.pincode,
      };
      let addressDetails = "";
      for (const key in obj) {
        if (key == "pincode" || (!obj["pincode"] && key =="city")) addressDetails += obj[key] ? obj[key] : "";
        else if(obj[key]) addressDetails += obj[key] ? t(`${obj[key]}`) + ", " : "";
      }
      setPermanentAddress(addressDetails);
    } else {
      setPermanentAddress("");
    }
    setIsCorrespondenceAddress(e.target.checked);
  }

  const goNext = () => {
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], permanentAddress, isCorrespondenceAddress });
    } else {
      let ownerDetails = formData.owners;
      ownerDetails["permanentAddress"] = permanentAddress;
      ownerDetails["isCorrespondenceAddress"] = isCorrespondenceAddress;
      onSelect(config.key, ownerDetails);
    }
  };

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [permanentAddress]);

  if (userType === "employee") {
    return (
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={editScreen ? { color: "#B1B4B6" } : {}}>
          {t("PT_OWNERS_ADDRESS")}
        </CardLabel>
        <div className="field">
          <TextInput name="address" onChange={setOwnerPermanentAddress} value={permanentAddress} disable={editScreen} />
        </div>
      </LabelFieldPair>
    );
  }

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={2} /> : null}
      <FormStep config={config} t={t} onSelect={goNext} isDisabled={isedittrade || isrenewtrade ? false : !permanentAddress}>
        <TextArea
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="address"
          onChange={setOwnerPermanentAddress}
          value={permanentAddress}
          //disable={isUpdateProperty || isEditProperty}
        />
        {/* <CardLabel>{t("PT_OWNER_S_ADDRESS")}</CardLabel> */}
        <CheckBox
          label={t("TL_COMMON_SAME_AS_TRADE_ADDRESS")}
          onChange={setCorrespondenceAddress}
          value={isCorrespondenceAddress}
          checked={isCorrespondenceAddress || false}
          style={{ paddingTop: "10px" }}
          //disable={isUpdateProperty || isEditProperty}
        />
      </FormStep>
      {ismultiple ? <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_PRIMARY_ADDR_INFO_MSG")} /> : ""}
    </React.Fragment>
  );
};

export default SelectOwnerAddress;
