import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CheckBox, CardLabel, LabelFieldPair, TextArea } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectOwnerAddress = ({ t, config, onSelect, userType, formData, ownerIndex = 0 }) => {
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const isMutation = url.includes("property-mutation");
  let index = isMutation ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);
  const [permanentAddress, setPermanentAddress] = useState(
    (formData.owners && formData.owners[index] && formData.owners[index]?.permanentAddress) ||
      formData.owners[index]?.correspondenceAddress ||
      formData?.owners?.permanentAddress ||
      ""
  );
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(
    formData.owners && formData.owners[index] && formData.owners[index]?.isCorrespondenceAddress
  );
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;

  function setOwnerPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }

  function setCorrespondenceAddress(e) {
    if (e.target.checked == true) {
      const address = isMutation ? formData?.searchResult?.property?.address : formData?.address;
      let obj = {
        doorNo: address?.doorNo,
        street: address?.street,
        landmark: address?.landmark,
        locality: address?.locality?.i18nkey,
        city: address?.city?.code,
        pincode: address?.pincode,
      };

      let addressDetails = formData?.searchResult?.data?.property_address?formData?.searchResult?.data?.property_address:"";
      for (const key in obj) {
        if (key == "pincode") addressDetails += obj[key] ? obj[key] : "";
        else addressDetails += obj[key] ? t(obj[key]) + ", " : "";
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
      if (isMutation) onSelect(config.key, [ownerDetails], "", index);
      else onSelect(config.key, ownerDetails, "", index);
    }
  };

  useEffect(() => {
    if (!isCorrespondenceAddress && isUpdateProperty) {
      let e = { target: { checked: true } };
      setCorrespondenceAddress(e);
    }
  });

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
  const checkMutatePT = window.location.href.includes("citizen/pt/property/property-mutation/") ? (
    <Timeline currentStep={1} flow="PT_MUTATE" />
  ) : (
    <Timeline currentStep={2} />
  );
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? checkMutatePT : null}
      <FormStep config={config} t={t} onSelect={goNext} isDisabled={!permanentAddress}>
        <TextArea
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="address"
          onChange={setOwnerPermanentAddress}
          value={permanentAddress}
          disable={isUpdateProperty || isEditProperty}
        />
        {/* <CardLabel>{t("PT_OWNER_S_ADDRESS")}</CardLabel> */}
        <CheckBox
          label={t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}
          onChange={setCorrespondenceAddress}
          value={isCorrespondenceAddress}
          checked={isCorrespondenceAddress || false}
          style={{ paddingTop: "10px" }}
          disable={isUpdateProperty || isEditProperty}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectOwnerAddress;
