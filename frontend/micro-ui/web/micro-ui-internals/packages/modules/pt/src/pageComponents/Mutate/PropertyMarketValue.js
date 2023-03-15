import React, { useEffect, useState } from "react";
import { FormStep, TextInput, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/TLTimeline";

const PropertyMarketValue = (props) => {
  const { t, config, onSelect, userType, formData, setError, clearErrors, errors } = props;
  const [marketValue, setSelected] = useState(formData?.[config.key]?.marketValue);

  useEffect(() => {
    if (userType === "employee") {
      if (!marketValue) {
        setError(config.key, { type: "Required" });
      } else if (errors?.[config.key]) clearErrors(config.key);
      goNext();
    }
  }, [marketValue]);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], marketValue });
  };
  const onSkip = () => {};

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_MARKET_VALUE") + " *"}
          </CardLabel>
          <div className="field">
            <TextInput type={"number"} min={0} onChange={(e) => setSelected(e.target.value)} value={marketValue} />
          </div>
        </LabelFieldPair>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="PT_MUTATE" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!marketValue}>
        <div className="field-container">
          <span className="citizen-card-input citizen-card-input--front">₹</span>
          <TextInput type={"number"} min={0} onChange={(e) => setSelected(e.target.value)} value={marketValue} />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default PropertyMarketValue;
