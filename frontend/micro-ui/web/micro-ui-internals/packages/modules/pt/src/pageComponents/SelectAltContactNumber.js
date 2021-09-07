import React, { useEffect, useState } from "react";
import { TextInput, CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectAltContactNumber = ({ t, config, onSelect, userType, formData }) => {
  const [altContactNumber, setAltContactNumber] = useState(formData?.owners?.altContactNumber);
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  const goNext = () => {
    onSelect(config.key, { ...formData[config.key], altContactNumber });
  };

  useEffect(() => {
    goNext();
  }, [altContactNumber]);

  return (
    <LabelFieldPair>
      <CardLabel className="card-label-smaller" style={editScreen ? { color: "#B1B4B6" } : {}}>
        {t("ES_PT_ALT_CONTACT_NUMBER")}
      </CardLabel>
      <div className="field">
        <TextInput name="altContactNumber" onChange={(e) => setAltContactNumber(e.target.value)} value={altContactNumber} disable={editScreen} />
      </div>
    </LabelFieldPair>
  );
};

export default SelectAltContactNumber;
