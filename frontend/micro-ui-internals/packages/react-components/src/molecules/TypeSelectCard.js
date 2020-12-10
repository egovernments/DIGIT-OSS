import React from "react";
import { useTranslation } from "react-i18next";

import Card from "../atoms/Card";
import CardCaption from "../atoms/CardCaption";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import RadioButtons from "../atoms/RadioButtons";
import SubmitBar from "../atoms/SubmitBar";

const TypeSelectCard = ({ t, headerCaption, header, cardText, submitBarLabel, selectedOption, menu, optionsKey, selected, onSave }) => {
  console.log("cardText", t("ULBGRADE_MUNICIPAL_CORPORATION"), cardText);
  return (
    <Card>
      <CardCaption>{t(headerCaption)}</CardCaption>
      <CardHeader>{t(header)}</CardHeader>
      <CardText>{t(cardText)}</CardText>
      {menu ? <RadioButtons selectedoption={selectedOption} options={menu} optionskey={optionsKey} onSelect={selected} /> : null}
      <SubmitBar label={t(submitBarLabel)} onSubmit={onSave} />
    </Card>
  );
};

export default TypeSelectCard;
