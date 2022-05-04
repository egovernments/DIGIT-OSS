import React, { useState } from "react";
import { TextInput, FormStep, TextArea, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/TLTimeline";

const Comments = (props) => {
  const { t, config, onSelect, userType, formData } = props;

  const [remarks, setSelected] = useState(formData?.[config.key]?.remarks);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], remarks });
  };
  const onSkip = () => {};

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_REMARKS")}
          </CardLabel>
          <div className="field">
            <TextArea onChange={(e) => setSelected(e.target.value)} value={remarks} />
          </div>
        </LabelFieldPair>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="PT_MUTATE" />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
        <div>
          <TextArea onChange={(e) => setSelected(e.target.value)} value={remarks} />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default Comments;
