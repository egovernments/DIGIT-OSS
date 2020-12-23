import React, { useState } from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectDetails = ({ t, config, onSelect, value }) => {
  const [details, setDetails] = useState(() => {
    const { details } = value;
    return details ? details : "";
  });

  const onChange = (event) => {
    const { value } = event.target;
    setDetails(value);
  };

  return <FormStep config={config} onChange={onChange} onSelect={() => onSelect({ details })} value={details} t={t} />;
};

export default SelectDetails;
