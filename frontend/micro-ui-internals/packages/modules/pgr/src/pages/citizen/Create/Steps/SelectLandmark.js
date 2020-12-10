import React, { useState } from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectLandmark = ({ t, config, onSelect }) => {
  const __initLandmark = Digit.SessionStorage.get("PGR_CREATE_LANDMARK");
  const [landmark, setLandmark] = useState(__initLandmark ? __initLandmark : "");

  function onChange(e) {
    setLandmark(e.target.value);
    Digit.SessionStorage.set("PGR_CREATE_LANDMARK", e.target.value);
  }

  return <FormStep config={config} value={landmark} onChange={onChange} onSelect={onSelect} t={t}></FormStep>;
};

export default SelectLandmark;
