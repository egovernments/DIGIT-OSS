import { FormStep, TextInput, CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PTSelectPincode = ({ t, config, onSelect, formData = {}, userType, register, errors, props }) => {
  const tenants = Digit.Hooks.pt.useTenants();
  const [pincode, setPincode] = useState(() => formData?.address?.pincode || "");
  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");
  let isEditProperty = formData?.isEditProperty || false;
  if (formData?.isUpdateProperty) isEditProperty = true;
  const inputs = [
    {
      label: "CORE_COMMON_PINCODE",
      type: "text",
      name: "pincode",
      disable: isEditProperty,
      validation: {
        minlength: 6,
        maxlength: 7,
        pattern: "[0-9]+",
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
        setPincodeServicability("PT_COMMON_PINCODE_NOT_SERVICABLE");
      }
    }
  }

  const goNext = async (data) => {
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == data?.pincode));
    if (foundValue) {
      onSelect(config.key, { pincode });
    } else {
      setPincodeServicability("PT_COMMON_PINCODE_NOT_SERVICABLE");
    }
  };

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">{t(input.label)}</CardLabel>
          <div className="field">
            <TextInput key={input.name} value={pincode} onChange={onChange} {...input.validation} autoFocus={presentInModifyApplication} />
          </div>
        </LabelFieldPair>
      );
    });
  }
  const onSkip = () => onSelect();
  return (
    <FormStep
      t={t}
      config={{ ...config, inputs }}
      onSelect={goNext}
      _defaultValues={{ pincode }}
      onChange={onChange}
      onSkip={onSkip}
      forcedError={t(pincodeServicability)}
      isDisabled={!pincode || isEditProperty}
    ></FormStep>
  );
};

export default PTSelectPincode;
