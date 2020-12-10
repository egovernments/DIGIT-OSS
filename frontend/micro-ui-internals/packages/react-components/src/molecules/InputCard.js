import React from "react";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";
import CardCaption from "../atoms/CardCaption";
import TextInput from "../atoms/TextInput";

const InputCard = ({ children, texts = {}, submit = false, inputs = [], inputRef, onNext, onSkip }) => {
  // TODO: inputs handle
  return (
    <Card>
      {texts.headerCaption && <CardCaption>{texts.headerCaption}</CardCaption>}
      <CardHeader>{texts.header}</CardHeader>
      <CardText>{texts.cardText}</CardText>
      {children}
      <SubmitBar submit={submit} label={texts.nextText} onSubmit={onNext} />
      {texts.skipText ? <LinkButton label={texts.skipText} onClick={onSkip} /> : null}
    </Card>
  );
};

InputCard.propTypes = {
  text: PropTypes.object.isRequired,
  submit: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRewquired,
  onSkip: PropTypes.func.isRequired,
};

InputCard.defaultProps = {
  texts: {},
  submit: false,
  onNext: undefined,
  onSkip: undefined,
};

export default InputCard;
