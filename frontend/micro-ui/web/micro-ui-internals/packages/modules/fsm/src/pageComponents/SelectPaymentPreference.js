import React, { useState, useEffect } from "react";
import {
  FormStep,
  Loader,
  RadioOrSelect,
  CitizenInfoLabel,
  LabelFieldPair,
  CardLabel,
  TextInput,
  CardLabelError,
  KeyNote,
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectPaymentPreference = ({ config, formData, t, onSelect, userType }) => {
  const tenantId = Digit.ULBService.getCitizenCurrentTenant();
  const stateId = Digit.ULBService.getStateId();
  const [advanceAmount, setAdvanceAmount] = useState(null);
  const [MinAmount, setMinAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const [billError, setError] = useState(false);

  const inputs = [
    {
      label: "ES_NEW_APPLICATION_ADVANCE_COLLECTION",
      type: "number",
      name: "advanceAmount",
      validation: {
        isRequired: true,
      },
      disable: MinAmount === totalAmount ? true : false,
      default: formData?.selectPaymentPreference?.advanceAmount,
      isMandatory: true,
    },
  ];

  const setAdvanceAmountValue = (value) => {
    setAdvanceAmount(value);
  };

  const onSkip = () => {
    onSelect(config.key, { advanceAmount: MinAmount });
  };

  const onSubmit = () => {
    onSelect(config.key, { advanceAmount });
  };

  useEffect(() => {
    (async () => {
      if (formData?.propertyType && formData?.subtype && formData?.address && formData?.selectTripNo?.vehicleCapacity.capacity) {
        const capacity = formData?.selectTripNo?.vehicleCapacity.capacity;
        const { slum: slumDetails } = formData.address;
        const slum = slumDetails ? "YES" : "NO";
        const billingDetails = await Digit.FSMService.billingSlabSearch(tenantId, {
          propertyType: formData?.subtype?.code,
          capacity,
          slum,
        });

        const billSlab = billingDetails?.billingSlab?.length && billingDetails?.billingSlab[0];
        Digit.SessionStorage.set("amount_per_trip", billSlab.price);

        if (billSlab?.price) {
          let totaltripAmount = billSlab.price * formData?.selectTripNo?.tripNo?.code;
          const { advanceAmount: advanceBalanceAmount } = await Digit.FSMService.advanceBalanceCalculate(tenantId, {
            totalTripAmount: totaltripAmount,
          });
          setMinAmount(advanceBalanceAmount);
          setTotalAmount(totaltripAmount);
          Digit.SessionStorage.set("total_amount", totaltripAmount);
          Digit.SessionStorage.set("advance_amount", advanceBalanceAmount);
          formData?.selectPaymentPreference?.advanceAmount
            ? setAdvanceAmount(formData?.selectPaymentPreference?.advanceAmount)
            : setAdvanceAmount(advanceBalanceAmount);

          setError(false);
        } else if (billSlab?.price === 0) {
          Digit.SessionStorage.set("total_amount", 0);
          onSkip();
        } else {
          sessionStorage.removeItem("Digit.total_amount");
          sessionStorage.removeItem("Digit.advance_amount");
          setError(true);
        }
      }
    })();
  }, [
    formData?.propertyType,
    formData?.subtype,
    formData?.address,
    formData?.selectTripNo?.vehicleCapacity.capacity,
    formData?.selectTripNo?.tripNo?.code,
  ]);

  if (userType === "employee") {
    return null;
  }
  let currentValue = advanceAmount;
  let max = Digit.SessionStorage.get("total_amount");
  let min = Digit.SessionStorage.get("advance_amount");

  if (advanceAmount === null) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Timeline currentStep={3} flow="APPLY" />
      <FormStep
        config={config}
        onSelect={onSubmit}
        onSkip={onSkip}
        isDisabled={currentValue > max ? true : false || currentValue < min ? true : false}
        t={t}
      >
        <KeyNote keyValue={t("ADV_TOTAL_AMOUNT") + " (₹)"} note={max} />
        <KeyNote keyValue={t("FSM_ADV_MIN_PAY") + " (₹)"} note={min} />
        {inputs?.map((input, index) => {
          return (
            <React.Fragment key={index}>
              <LabelFieldPair key={index}>
                <CardLabel>
                  {t(input.label) + " (₹)"}
                  {input.isMandatory ? " * " : null}
                </CardLabel>
                <div>
                  <TextInput
                    type={input.type}
                    key={input.name}
                    disable={input.disable}
                    onChange={(e) => setAdvanceAmountValue(e.target.value)}
                    value={advanceAmount}
                    {...input.validation}
                  />
                  {currentValue > max && (
                    <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "14px", marginBottom: "0px" }}>
                      {t("FSM_ADVANCE_AMOUNT_MAX")}
                    </CardLabelError>
                  )}
                  {currentValue < min && (
                    <CardLabelError style={{ width: "100%", marginTop: "-15px", fontSize: "14px", marginBottom: "0px" }}>
                      {t("FSM_ADVANCE_AMOUNT_MIN")}
                    </CardLabelError>
                  )}
                </div>
              </LabelFieldPair>
            </React.Fragment>
          );
        })}
      </FormStep>
    </React.Fragment>
  );
};

export default SelectPaymentPreference;
