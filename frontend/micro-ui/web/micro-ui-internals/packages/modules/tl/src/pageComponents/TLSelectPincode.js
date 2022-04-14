import { FormStep, TextInput, CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const TLSelectPincode = ({ t, config, onSelect, formData = {}, userType, register, errors, props }) => {
  const tenants = Digit.Hooks.tl.useTenants();
  const [pincode, setPincode] = useState(() => formData?.address?.pincode || "");
  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");
  // let isEditProperty = formData?.isEditProperty || false;
  let isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  const isRenewal = window.location.href.includes("edit-application") || window.location.href.includes("tl/renew-application-details");
  
  //if (formData?.isUpdateProperty) isEditProperty = true;
  const inputs = [
    {
      label: "CORE_COMMON_PINCODE",
      type: "text",
      name: "pincode",
      disable: isEdit,
      validation: {
        minlength: 6,
        maxlength: 7,
        pattern: "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$",
        max: "9999999",
        title: t("CORE_COMMON_PINCODE_INVALID"),
      },
    },
  ];
  const [pincodeServicability, setPincodeServicability] = useState(null);

  useEffect(() => {
    if (formData?.address?.pincode) {
      setPincode(formData.address.pincode);
    }
  }, [formData?.address?.pincode]);

  function onChange(e) {
    setPincode(e.target.value);
    setPincodeServicability(null);
    if (userType === "employee") {
      const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item.toString() === e.target.value));
      if (foundValue) {
        const city = tenants.filter((obj) => obj.pincode?.find((item) => item == e.target.value))[0];
        onSelect(config.key, { ...formData.address, city, pincode: e.target.value, slum: null });
      } else {
        onSelect(config.key, { ...formData.address, pincode: e.target.value });
        setPincodeServicability("TL_COMMON_PINCODE_NOT_SERVICABLE");
      }
    }
  }

  const goNext = async (data) => {
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == data?.pincode));
    if (foundValue) {
      onSelect(config.key, { pincode });
    } else {
      setPincodeServicability("TL_COMMON_PINCODE_NOT_SERVICABLE");
    }
  };

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">{`${t(input.label)}`}</CardLabel>
          <div className="field">
            <TextInput 
              key={input.name} 
              value={pincode} 
              onChange={onChange}
              disable={isRenewal}
              {...input.validation} 
              autoFocus={presentInModifyApplication} 
            />
          </div>
        </LabelFieldPair>
      );
    });
  }
  const onSkip = () => onSelect();
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={2}/> : null}
    <FormStep
      t={t}
      config={{ ...config, inputs }}
      onSelect={goNext}
      _defaultValues={{ pincode }}
      onChange={onChange}
      onSkip={onSkip}
      forcedError={t(pincodeServicability)}
      isDisabled={!pincode || isEdit}
    ></FormStep>
    </React.Fragment>
  );
};

export default TLSelectPincode;
