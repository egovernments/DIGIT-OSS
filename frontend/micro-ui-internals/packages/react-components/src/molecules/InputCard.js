import React from "react";

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

export default InputCard;
