import React from "react";
import { useTranslation } from "react-i18next";

import Card from "../atoms/Card";
import CardCaption from "../atoms/CardCaption";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import RadioButtons from "../atoms/RadioButtons";
import SubmitBar from "../atoms/SubmitBar";

const TypeSelectCard = ({ headerCaption, header, cardText, submitBarLabel, selectedOption, menu, optionsKey, selected, onSave }) => {
  return (
    <Card>
      <CardCaption>{headerCaption}</CardCaption>
      <CardHeader>{header}</CardHeader>
      <CardText>{cardText}</CardText>
      {menu ? <RadioButtons selectedoption={selectedOption} options={menu} optionskey={optionsKey} onSelect={selected} /> : null}
      <SubmitBar label={submitBarLabel} onSubmit={onSave} />
    </Card>
  );
};

export default TypeSelectCard;
