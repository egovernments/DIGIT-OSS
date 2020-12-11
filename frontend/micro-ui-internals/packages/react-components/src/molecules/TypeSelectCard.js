import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

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

TypeSelectCard.propTypes = {
  headerCaption: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  cardText: PropTypes.string.isRequired,
  submitBarLabel: PropTypes.string.isRequired,
  selectedOption: PropTypes.string.isRequired,
  menu: PropTypes.array.isRequired,
  optionsKey: PropTypes.string.isRequired,
  selected: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

TypeSelectCard.defaultProps = {
  headerCaption: "",
  header: "",
  cardText: "",
  submitBarLabel: "",
  selectedOption: "",
  menu: [],
  optionsKey: "",
  selected: undefined,
  onSave: undefined,
  t: undefined
};

export default TypeSelectCard;
