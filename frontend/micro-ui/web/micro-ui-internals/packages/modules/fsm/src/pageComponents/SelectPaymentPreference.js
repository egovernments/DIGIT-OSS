import React, { useState, useEffect } from "react";
import { FormStep, Dropdown, Loader, RadioOrSelect, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectPaymentPreference = ({ config, formData, t, onSelect, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: PaymentTypeData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PaymentType");
  const [paymentType, setPaymentType] = useState(formData?.paymentType);

  useEffect(() => {
    if (!isLoading && PaymentTypeData) {
      const preFilledPaymentType = PaymentTypeData.filter(
        (paymentType) => paymentType.code === (formData?.selectPaymentPreference?.code || formData?.selectPaymentPreference)
      )[0];
      preFilledPaymentType ? setPaymentType(preFilledPaymentType) : setPaymentType(PaymentTypeData.find((i) => i.code === "POST_PAY"))
    }
  }, [formData?.selectPaymentPreference, PaymentTypeData]);

  const selectPaymentType = (value) => {
    setPaymentType(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("paymentDetail", null);
    }
  };

  const onSkip = () => {
    onSelect();
  };

  const onSubmit = () => {
    onSelect(config.key, paymentType);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (userType === "employee") {
    return null;
  }
  return (
    <React.Fragment>
      <Timeline currentStep={3} flow="APPLY" />
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!paymentType} t={t}>
        <RadioOrSelect
          options={PaymentTypeData}
          selectedOption={paymentType}
          optionKey="i18nKey"
          onSelect={selectPaymentType}
          t={t}
          isMandatory={config.isMandatory}
        />
      </FormStep>
      {paymentType && paymentType.code === "PRE_PAY" && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_NOW", paymentType)} />}
      {paymentType && paymentType.code === "POST_PAY" && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_PAY_LATER", paymentType)} />}
    </React.Fragment>
  );
};

export default SelectPaymentPreference;