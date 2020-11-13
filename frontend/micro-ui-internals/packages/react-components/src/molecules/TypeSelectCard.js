import React from "react";
import { useTranslation } from "react-i18next";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import RadioButtons from "../atoms/RadioButtons";
import SubmitBar from "../atoms/SubmitBar";

const TypeSelectCard = ({ complaintTypePlaceHolder, cardText, submitBarLabel, selectedOption, menu, selected, onSave }) => {
  return (
    <Card>
      <CardHeader>{`${complaintTypePlaceHolder}`}</CardHeader>
      <CardText>{`${cardText}`}</CardText>
      {menu ? <RadioButtons selectedOption={selectedOption} options={menu} optionsKey="name" onSelect={selected} /> : null}
      <SubmitBar label={`${submitBarLabel}`} onSubmit={onSave} />
    </Card>
  );
};

export default TypeSelectCard;
