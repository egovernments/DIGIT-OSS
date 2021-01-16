import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import TextArea from "../atoms/TextArea";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import TextInput from "../atoms/TextInput";
import InputCard from "./InputCard";

const FormStep = ({ t, children, config, onSelect, onSkip, value, onChange, isDisabled, forcedError }) => {
  const { register, watch, errors, handleSubmit } = useForm();

  console.log("config", config);
  const goNext = (data) => {
    console.log("data", data);
    onSelect(data);
  };

  var isDisable = isDisabled ? true : config.canDisable && Object.keys(errors).filter((i) => errors[i]).length;

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
      <InputCard {...{ isDisable: isDisable }} {...config} submit {...{ onSkip: onSkip }} t={t}>
        {inputs}
        {forcedError && <CardLabelError>{t(forcedError)}</CardLabelError>}
        {children}
      </InputCard>
    </form>
  );
};

FormStep.propTypes = {
  config: PropTypes.shape({}),
  onSelect: PropTypes.func,
  onSkip: PropTypes.func,
  t: PropTypes.func,
};

FormStep.defaultProps = {
  config: {},
  onSelect: undefined,
  onSkip: undefined,
  t: (value) => value,
};

export default FormStep;
