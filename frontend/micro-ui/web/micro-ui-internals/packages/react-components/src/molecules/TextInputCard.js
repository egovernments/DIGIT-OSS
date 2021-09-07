import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";
import CardSubHeader from "../atoms/CardSubHeader";
import CardLabel from "../atoms/CardLabel";
import TextInput from "../atoms/TextInput";

const TextInputCard = ({ header, subHeader, cardText, cardLabel, nextText, skipAndContinueText, skip, onSave, onSkip, textInput }) => {
  return (
    <Card>
      <CardSubHeader>{subHeader}</CardSubHeader>
      <CardHeader>{header}</CardHeader>
      <CardText>
        {/* If you know the pincode of the complaint address, provide below. It will
      help us identify complaint location easily or you can skip and continue */}
        {cardText}
      </CardText>
      <CardLabel>{cardLabel}</CardLabel>
      <TextInput onChange={textInput} />
      <SubmitBar label={nextText} onSubmit={onSave} />
      {skip ? <LinkButton label={skipAndContinueText} onClick={onSkip} /> : null}
    </Card>
  );
};

TextInputCard.propTypes = {
  header: PropTypes.string,
  subHeader: PropTypes.string,
  cardText: PropTypes.string,
  cardLabel: PropTypes.string,
  nextText: PropTypes.string,
  skipAndContinueText: PropTypes.string,
  skip: PropTypes.bool,
  onSave: PropTypes.func,
  onSkip: PropTypes.func,
  textInput: PropTypes.string,
};

TextInputCard.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabel: "",
  nextText: "",
  skipAndContinueText: "",
  skip: true,
  onSave: undefined,
  onSkip: undefined,
  textInput: "",
};

export default TextInputCard;
