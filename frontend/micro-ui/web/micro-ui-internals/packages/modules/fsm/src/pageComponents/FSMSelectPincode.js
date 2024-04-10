import { FormStep, TextInput, CardLabel, LabelFieldPair, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimelineInFSM";

const SelectPincode = ({ t, config, onSelect, formData = {}, userType, register, errors, props }) => {
  const tenants = Digit.Hooks.fsm.useTenants();
  const [pincode, setPincode] = useState(formData?.address?.pincode || "");
  const [pincodeServicability, setPincodeServicability] = useState(null);

  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");

  const inputs = [
    {
      label: "CORE_COMMON_PINCODE",
      type: "text",
      name: "pincode",
      validation: {
        minlength: 6,
        maxlength: 6,
        pattern: "^[1-9][0-9]*",
        max: "9999999",
        title: t("CORE_COMMON_PINCODE_INVALID"),
      },
    },
  ];

  useEffect(() => {
    if (formData?.address?.pincode) {
      setPincode(formData.address.pincode);
    }
  }, [formData?.address?.pincode]);

  useEffect(() => {
    if (formData?.address?.locality?.pincode !== pincode && userType === "employee") {
      setPincode(formData?.address?.locality?.pincode || "");
      setPincodeServicability(null);
    }
  }, [formData?.address?.locality]);

  useEffect(() => {
    if (userType === "employee" && pincode) {
      onSelect(config.key, { ...formData.address, pincode: pincode?.[0] || pincode });
    }
  }, [pincode]);

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
        setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
      }
    }
  }

  const goNext = async (data) => {
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == data?.pincode));
    if (foundValue) {
      onSelect(config.key, { pincode });
    } else {
      setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
    }
  };

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <>
          <LabelFieldPair key={index}>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {config.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field">
              <TextInput key={input.name} value={pincode} onChange={onChange} {...input.validation} />
            </div>
          </LabelFieldPair>
          {pincodeServicability && (
            <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
              {t(pincodeServicability)}
            </CardLabelError>
          )}
        </>
      );
    });
  }
  const onSkip = () => onSelect();
  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep
        t={t}
        config={{ ...config, inputs }}
        onSelect={goNext}
        _defaultValues={{ pincode }}
        onChange={onChange}
        onSkip={onSkip}
        forcedError={t(pincodeServicability)}
        isDisabled={!pincode}
      ></FormStep>
    </React.Fragment>
  );
};

export default SelectPincode;
