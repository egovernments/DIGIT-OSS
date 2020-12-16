import React from "react";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";
import CardCaption from "../atoms/CardCaption";
import TextInput from "../atoms/TextInput";

const InputCard = ({ t, children, texts = {}, submit = false, inputs = [], inputRef, onNext, onSkip }) => {
  // TODO: inputs handle
  return (
    <Card>
      {texts.headerCaption && <CardCaption>{t(texts.headerCaption)}</CardCaption>}
      <CardHeader>{t(texts.header)}</CardHeader>
      <CardText>{t(texts.cardText)}</CardText>
      {children}
      <SubmitBar submit={submit} label={t(texts.nextText)} onSubmit={onNext} />
      {texts.skipText ? <LinkButton label={t(texts.skipText)} onClick={onSkip} /> : null}
    </Card>
  );
};

InputCard.propTypes = {
  text: PropTypes.object,
  submit: PropTypes.bool,
  onNext: PropTypes.func,
  onSkip: PropTypes.func,
  t: PropTypes.func,
};

InputCard.defaultProps = {
  texts: {},
  submit: false,
  onNext: undefined,
  onSkip: undefined,
  t: (value) => value,
};

export default InputCard;
