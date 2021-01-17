import React, { useState } from "react";
import { FormStep, CardText, TextInput } from "@egovernments/digit-ui-react-components";

const SelectTankSize = ({ config, onSelect, t, value }) => {
  const [size, setSize] = useState(() => {
    const { pitDetail } = value;
    return pitDetail || {};
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(isNaN(value), "is not a number");
    if (!isNaN(value)) {
      setSize({ ...size, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSelect({ pitDetail: size });
  };

  return (
    <FormStep config={config} onSelect={handleSubmit} t={t}>
      <div className="inputWrapper">
        <div>
          <TextInput name="length" value={size["length"] || ""} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>{t("CS_FILE_PROPERTY_LENGTH")}</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="width" value={size["width"] || ""} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>{t("CS_FILE_PROPERTY_WIDTH")}</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="height" value={size["height"] || ""} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>{t("CS_FILE_PROPERTY_HEIGHT")}</CardText>
        </div>
      </div>
    </FormStep>
  );
};

export default SelectTankSize;
