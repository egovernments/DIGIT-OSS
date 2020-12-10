import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "../atoms/TextArea";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import TextInput from "../atoms/TextInput";
import InputCard from "./InputCard";

const FormStep = ({ t, children, config, onSelect, onSkip, value, onChange }) => {
  const { register, watch, errors, handleSubmit } = useForm();

  console.log("config", config);
  const goNext = (data) => {
    console.log("data", data);
    onSelect(data);
  };
  const inputs = config.inputs?.map((input, index) => {
    if (input.type === "text") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <TextInput
            key={index}
            name={input.name}
            value={value}
            onChange={onChange}
            inputRef={register(input.validation)}
            isMandatory={errors[input.name]}
          />
        </React.Fragment>
      );
    }
    if (input.type === "textarea")
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          <TextArea key={index} name={input.name} value={value} onChange={onChange} inputRef={register(input.validation)}></TextArea>
        </React.Fragment>
      );
  });

  return (
    <form onSubmit={handleSubmit(goNext)}>
      <InputCard {...config} submit {...{ onSkip: onSkip }} t={t}>
        {inputs}
        {children}
      </InputCard>
    </form>
  );
};

export default FormStep;
