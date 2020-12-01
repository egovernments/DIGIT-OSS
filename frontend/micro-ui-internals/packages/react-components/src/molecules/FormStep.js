import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../atoms/TextInput";
import InputCard from "./InputCard";

const FormStep = ({ children, config, onSelect }) => {
  const { register, handleSubmit } = useForm();

  console.log("config", config);
  const goNext = (data) => {
    console.log("data", data);
    onSelect(data);
  };

  const inputs = config.inputs?.map((input, index) => {
    if (input.type === "text") return <TextInput key={index} name={input.name} inputRef={register(input.validation)} />;
    if (input.type === "textarea") return <textarea></textarea>;
  });

  return (
    <form onSubmit={handleSubmit(goNext)}>
      <InputCard {...config} submit>
        {inputs}
        {children}
      </InputCard>
    </form>
  );
};

export default FormStep;
