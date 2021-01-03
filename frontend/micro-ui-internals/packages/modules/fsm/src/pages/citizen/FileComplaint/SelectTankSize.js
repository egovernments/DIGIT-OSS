import React, { useState } from "react";
import { FormStep, CardText, TextInput } from "@egovernments/digit-ui-react-components";

const SelectTankSize = ({ config, onSelect, t }) => {
  const [size, setSize] = useState({});

  const handleChange = (event) => {
    const { name, value } = event;
    setSize({ ...size, [name]: value });
  };

  const handleSubmit = () => {
    onSelect({ size });
  };

  return (
    <FormStep config={config} onSelect={handleSubmit} t={t}>
      <div className="inputWrapper">
        <div>
          <TextInput name="length" value={size["length"]} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>Length (m)</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="breadth" value={size["breadth"]} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>Breadth (m)</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="height" value={size["height"]} onChange={handleChange} />
          <CardText style={{ textAlign: "center" }}>Height (m)</CardText>
        </div>
      </div>
    </FormStep>
  );
};

export default SelectTankSize;
