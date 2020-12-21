import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectDetails = ({ t, config, onSelect }) => {
  const __initDetails = Digit.SessionStorage.get("PGR_CREATE_DETAIL");
  const [details, setDetails] = React.useState(__initDetails ? __initDetails : "");

  const handleChange = (event) => {
    const { value } = event.target;
    setDetails(value);
    Digit.SessionStorage.set("PGR_CREATE_DETAIL", value);
  };

  return <FormStep config={config} onChange={handleChange} onSelect={onSelect} t={t} value={details} />;
};

export default SelectDetails;
