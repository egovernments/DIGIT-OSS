import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "../atoms/TextArea";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import TextInput from "../atoms/TextInput";
import InputCard from "./InputCard";

const FormStep = ({ children, config, onSelect, onSkip }) => {
  const { register, watch, handleSubmit } = useForm();

  console.log("config", config);
  const goNext = (data) => {
    console.log("data", data);
    onSelect(data);
  };
  const inputs = config.inputs?.map((input, index) => {
    if (input.type === "text") {
      const watchInput = watch(input.name);
      return (
        <React.Fragment key={index}>
          <CardLabel>{input.label}</CardLabel>
          {watchInput && <CardLabelError>{input.error}</CardLabelError>}
          <TextInput key={index} name={input.name} inputRef={register(input.validation)} isMandatory={watchInput} />
        </React.Fragment>
      );
    }
    if (input.type === "textarea")
      return (
        <React.Fragment>
          <CardLabel>{input.label}</CardLabel>
          <TextArea key={index} name={input.name} inputRef={register(input.validation)}></TextArea>
        </React.Fragment>
      );
  });

  return (
    <form onSubmit={handleSubmit(goNext)}>
      <InputCard {...config} submit {...{ onSkip: onSkip }}>
        {inputs}
        {children}
      </InputCard>
    </form>
  );
};

export default FormStep;
