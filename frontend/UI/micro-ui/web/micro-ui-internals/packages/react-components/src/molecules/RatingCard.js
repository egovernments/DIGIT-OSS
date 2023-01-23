import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import TextArea from "../atoms/TextArea";
import CardLabel from "../atoms/CardLabel";
import Rating from "../atoms/Rating";
import CheckBox from "../atoms/CheckBox";
import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import SubmitBar from "../atoms/SubmitBar";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";

const RatingCard = ({ config, onSelect, t }) => {
  const { register, watch, handleSubmit } = useForm();
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);

  const onSubmit = (data) => {
    data.rating = rating;
    onSelect(data);
  };

  const feedback = (e, ref, index) => {
    setRating(index);
  };

  const segments = config.inputs?.map((input, index) => {
    if (input.type === "rate") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          {input?.error}
          <Rating currentRating={rating} maxRating={input.maxRating} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
        </React.Fragment>
      );
    }

    if (input.type === "checkbox") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          {input.checkLabels &&
            input.checkLabels.map((label, index) => <CheckBox style={{ marginBottom: "16px" }} key={index} name={input.label} label={t(label)} value={label} inputRef={register} />)}
        </React.Fragment>
      );
    }

    if (input.type === "radio") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          <RadioButtons options={input.checkLabels} onSelect={input.onSelect} selectedOption={input.selectedOption} t={t} />
        </React.Fragment>
      );
    }

    if (input.type === "textarea") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          <TextArea name={input.name} value={comments} onChange={(e) => setComments(e.target.value)} inputRef={register}></TextArea>
        </React.Fragment>
      );
    }

    if (input.type === "dropDown") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          <Dropdown
            option={input.checkLabels}
            optionKey="i18nKey"
            id="dropdown"
            selected={input.selectedOption}
            select={input.onSelect}
            t={t}
            disable={false}
            autoFocus={false} />
        </React.Fragment>
      );
    }
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>{t(config.texts.header)}</CardHeader>
        {segments}
        <SubmitBar label={t(config.texts.submitBarLabel)} submit={true} />
      </Card>
    </form>
  );
};

RatingCard.propTypes = {
  config: PropTypes.object,
  onSubmit: PropTypes.func,
  t: PropTypes.func,
};

RatingCard.defaultProps = {
  config: {},
  onSubmit: undefined,
  t: (value) => value,
};

export default RatingCard;
