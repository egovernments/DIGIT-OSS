import React from "react";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";
import CardCaption from "../atoms/CardCaption";
import TextInput from "../atoms/TextInput";

const InputCard = ({ t, children, texts = {}, submit = false, inputs = [], inputRef, onNext, onSkip, isDisable }) => {
  // TODO: inputs handle
  console.log("FIND ME", isDisable);
  return (
    <Card>
      {texts.headerCaption && <CardCaption>{t(texts.headerCaption)}</CardCaption>}
      <CardHeader>{t(texts.header)}</CardHeader>
      <CardText>{t(texts.cardText)}</CardText>
      {children}
      <SubmitBar disabled={isDisable} submit={submit} label={t(texts.nextText)} onSubmit={onNext} />
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
