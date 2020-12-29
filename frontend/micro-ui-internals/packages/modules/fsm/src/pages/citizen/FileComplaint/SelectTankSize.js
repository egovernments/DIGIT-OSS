import React from "react";
import { FormStep, CardText, TextInput } from "@egovernments/digit-ui-react-components";

const SelectTankSize = ({ config, onSelect, t }) => {
  return (
    <FormStep config={config} onSelect={onSelect} t={t}>
      <div className="inputWrapper">
        <div>
          <TextInput name="length" />
          <CardText>Length (m)</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="breadth" />
          <CardText>Breadth (m)</CardText>
        </div>
        <span>x</span>
        <div>
          <TextInput name="height" />
          <CardText>Height (m)</CardText>
        </div>
      </div>
    </FormStep>
  );
};

export default SelectTankSize;
