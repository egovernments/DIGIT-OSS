import React from "react";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardCaption from "../atoms/CardCaption";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import RadioButtons from "../atoms/RadioButtons";
import SubmitBar from "../atoms/SubmitBar";

const TypeSelectCard = ({
  t,
  headerCaption,
  header,
  cardText,
  disabled = false,
  submitBarLabel,
  selectedOption,
  menu,
  optionsKey,
  selected,
  onSave,
}) => {
  return (
    <Card>
      <CardCaption>{t(headerCaption)}</CardCaption>
      <CardHeader>{t(header)}</CardHeader>
      <CardText>{t(cardText)}</CardText>
      {menu ? <RadioButtons selectedOption={selectedOption} options={menu} optionsKey={optionsKey} onSelect={selected} /> : null}
      <SubmitBar disabled={disabled} label={t(submitBarLabel)} onSubmit={onSave} />
    </Card>
  );
};

TypeSelectCard.propTypes = {
  headerCaption: PropTypes.string,
  header: PropTypes.string,
  cardText: PropTypes.string,
  submitBarLabel: PropTypes.string,
  selectedOption: PropTypes.any,
  menu: PropTypes.any,
  optionsKey: PropTypes.string,
  selected: PropTypes.func,
  onSave: PropTypes.func,
  t: PropTypes.func,
};

TypeSelectCard.defaultProps = {};

export default TypeSelectCard;
