import React, { useEffect, useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, Dropdown } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectPaymentType = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: paymentData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PaymentType");
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const [paymentType, setPaymentType] = useState(null);
  const [isSlum, setIsSlum] = useState();

  const inputs = [
    {
      label: "Payment Preference",
      type: "RadioButton",
      name: "paymentPreference",
      options: paymentData,
      isMandatory: false,
    },
  ];

  useEffect(() => {
    if (!isLoading && paymentData) {
      const preFilledPaymentType = paymentData.filter(
        (paymentType) => paymentType.code === (formData?.paymentPreference?.code || formData?.paymentPreference)
      )[0];
      preFilledPaymentType ? setPaymentType(preFilledPaymentType) : setPaymentType(paymentData.find((i) => i.code === "POST_PAY"));
    }
  }, [formData, formData?.paymentPreference?.code, formData?.paymentPreference, paymentData]);

  useEffect(() => {
    if (formData?.address) {
      const { slum: slumDetails } = formData.address;
      slumDetails ? setIsSlum(true) : setIsSlum(false);
    }
  }, [formData]);

  function selectPaymentType(value) {
    setPaymentType(value);
    onSelect(config.key, value.code);
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {formData?.tripData?.amountPerTrip !== 0 && input.type === "RadioButton" && (
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? " * " : null}
              </CardLabel>
              <div className="field">
                <RadioButtons
                  selectedOption={paymentType}
                  onSelect={selectPaymentType}
                  style={{ display: "flex", marginBottom: 0 }}
                  innerStyles={{ marginLeft: "10px" }}
                  options={input.options}
                  optionsKey="i18nKey"
                  disabled={editScreen}
                />
              </div>
            </LabelFieldPair>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectPaymentType;
