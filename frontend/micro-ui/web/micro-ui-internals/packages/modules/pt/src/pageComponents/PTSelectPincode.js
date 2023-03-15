import { CardLabel, CardLabelError, FormStep, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const PTSelectPincode = ({ t, config, onSelect, formData = {}, userType, register, errors, setError, formState, clearErrors }) => {
  const tenants = Digit.Hooks.pt.useTenants();
  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");

  const [pincode, setPincode] = useState(() => {
    if (presentInModifyApplication && userType === "employee") return formData?.originalData?.address?.pincode || "";
    return formData?.address?.pincode || "";
  });

  let isEditProperty = formData?.isEditProperty || false;
  if (formData?.isUpdateProperty) isEditProperty = true;
  const inputs = [
    {
      label: "PT_PROPERTY_ADDRESS_PINCODE",
      type: "text",
      name: "pincode",
      disable: isEditProperty,
      validation: {
        minlength: 6,
        maxlength: 7,
        pattern: "[0-9]+",
        max: "9999999",
        title: t("PT_PROPERTY_ADDRESS_PINCODE_INVALID"),
      },
    },
  ];
  const [pincodeServicability, setPincodeServicability] = useState(null);
  const [error, setLocalError] = useState("");

  useEffect(() => {
    if (formData?.address?.pincode) {
      setPincode(formData.address.pincode);
    }
  }, [formData?.address?.pincode]);

  function onChange(e) {
    setPincode(e.target.value);
    setPincodeServicability(null);
    setLocalError("");
    let validPincode = Digit.Utils.getPattern("Pincode").test(e.target.value);

    if (userType === "employee") {
      if (e.target.value && !validPincode) setLocalError(t("ERR_DEFAULT_INPUT_FIELD_MSG"));
      if (validPincode) {
        const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item.toString() === e.target.value));
        if (!foundValue) setLocalError(t("PT_COMMON_PINCODE_NOT_SERVICABLE"));
      }
      onSelect(config.key, { ...formData.address, pincode: e.target.value });
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
        <React.Fragment>
          <LabelFieldPair key={index}>
            <CardLabel className="card-label-smaller">{t(input.label)}</CardLabel>
            <div className="field">
              <TextInput key={input.name} value={pincode} onChange={onChange} {...input.validation} disable={presentInModifyApplication} autoFocus={presentInModifyApplication} />
            </div>
          </LabelFieldPair>
          {error ? <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{error}</CardLabelError> : null}
        </React.Fragment>
      );
    });
  }
  const onSkip = () => onSelect();
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={1}/> : null}
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
            </React.Fragment>
  );
};

export default PTSelectPincode;
