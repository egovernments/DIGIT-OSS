import React, { useState } from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectLandmark = ({ t, config, onSelect, value }) => {
  const [landmark, setLandmark] = useState(() => {
    const { landmark } = value;
    return landmark ? landmark : "";
  });

  function onChange(e) {
    setLandmark(e.target.value);
  }

  const onSkip = () => onSelect();

  return <FormStep config={config} value={landmark} onChange={onChange} onSelect={(data) => onSelect(data)} onSkip={onSkip} t={t}></FormStep>;
};

export default SelectLandmark;
