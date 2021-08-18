import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CheckBox, CardLabel, LabelFieldPair, TextArea } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectOwnerAddress = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const [permanentAddress, setPermanentAddress] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index].permanentAddress) || formData?.owners?.permanentAddress || ""
  );
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(
    formData.owners && formData.owners[index] && formData.owners[index].isCorrespondenceAddress
  );
  const isUpdateProperty = formData?.isUpdateProperty || false;
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  function setOwnerPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }
  function setCorrespondenceAddress(e) {
    if (e.target.checked == true) {
      let obj = {
        doorNo: formData?.address?.doorNo,
        street: formData?.address?.street,
        landmark: formData?.address?.landmark,
        locality: formData?.address?.locality?.name,
        city: formData?.address?.city?.name,
        pincode: formData?.address?.pincode,
      };
      let addressDetails = "";
      for (const key in obj) {
        if (key == "pincode") addressDetails += obj[key] ? obj[key] : "";
        else addressDetails += obj[key] ? obj[key] + ", " : "";
      }
      setPermanentAddress(addressDetails);
    } else {
      setPermanentAddress("");
    }
    setIsCorrespondenceAddress(e.target.checked);
  }

  const goNext = () => {
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], permanentAddress, isCorrespondenceAddress }, index);
    } else {
      let ownerDetails = formData.owners && formData.owners[index];
      ownerDetails["permanentAddress"] = permanentAddress;
      ownerDetails["isCorrespondenceAddress"] = isCorrespondenceAddress;
      onSelect(config.key, ownerDetails, "", index);
    }
  };

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [permanentAddress]);

  if (userType === "employee") {
    return (
      <LabelFieldPair key={index}>
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
    <FormStep config={config} t={t} onSelect={goNext} isDisabled={!permanentAddress}>
      <TextArea
        isMandatory={false}
        optionKey="i18nKey"
        t={t}
        name="address"
        onChange={setOwnerPermanentAddress}
        value={permanentAddress}
        disable={isUpdateProperty}
      />
      {/* <CardLabel>{t("PT_OWNER_S_ADDRESS")}</CardLabel> */}
      <CheckBox
        label={t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}
        onChange={setCorrespondenceAddress}
        value={isCorrespondenceAddress}
        checked={isCorrespondenceAddress || false}
        style={{ paddingTop: "10px" }}
        disable={isUpdateProperty}
      />
    </FormStep>
  );
};

export default SelectOwnerAddress;
