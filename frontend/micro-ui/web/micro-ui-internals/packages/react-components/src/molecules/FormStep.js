import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import TextArea from "../atoms/TextArea";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import TextInput from "../atoms/TextInput";
import InputCard from "./InputCard";

const FormStep = ({
  t,
  children,
  config,
  onSelect,
  onSkip,
  value,
  onChange,
  isDisabled,
  _defaultValues = {},
  forcedError,
  componentInFront,
  onAdd,
  cardStyle = {},
  isMultipleAllow = false,
  showErrorBelowChildren = false,
  childrenAtTheBottom = true,
  textInputStyle
}) => {
  const { register, watch, errors, handleSubmit } = useForm({
    defaultValues: _defaultValues,
  });

  const goNext = (data) => {
    onSelect(data);
  };

  var isDisable = isDisabled ? true : config.canDisable && Object.keys(errors).filter((i) => errors[i]).length;

  const inputs = config.inputs?.map((input, index) => {
    if (input.type === "text") {
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <div className="field-container" style={{ justifyContent: "left" }}>
            {componentInFront ? <span className="citizen-card-input citizen-card-input--front">{componentInFront}</span> : null}
            <TextInput
              key={index}
              name={input.name}
              value={value}
              onChange={onChange}
              minlength={input.validation.minlength}
              maxlength={input.validation.maxlength}
              pattern={input.validation?.pattern}
              title={input.validation?.title}
              inputRef={register(input.validation)}
              isMandatory={errors[input.name]}
              disable={input.disable ? input.disable : false}
              textInputStyle={textInputStyle}
            />
          </div>
        </React.Fragment>
      );
    }
    if (input.type === "textarea")
      return (
        <React.Fragment key={index}>
          <CardLabel>{t(input.label)}</CardLabel>
          <TextArea key={index} name={input.name} value={value} onChange={onChange} inputRef={register(input.validation)} maxLength="1024"></TextArea>
        </React.Fragment>
      );
  });

  return (
    <form onSubmit={handleSubmit(goNext)}>
      <InputCard
        {...{ isDisable: isDisable, isMultipleAllow: isMultipleAllow }}
        {...config}
        cardStyle={cardStyle}
        submit
        {...{ onSkip: onSkip, onAdd: onAdd }}
        t={t}
      >
        {!childrenAtTheBottom && children}
        {inputs}
        {forcedError && !showErrorBelowChildren && <CardLabelError>{t(forcedError)}</CardLabelError>}
        {childrenAtTheBottom && children}
        {forcedError && showErrorBelowChildren && <CardLabelError>{t(forcedError)}</CardLabelError>}
      </InputCard>
    </form>
  );
};

FormStep.propTypes = {
  config: PropTypes.shape({}),
  onSelect: PropTypes.func,
  onSkip: PropTypes.func,
  onAdd: PropTypes.func,
  t: PropTypes.func,
};

FormStep.defaultProps = {
  config: {},
  onSelect: undefined,
  onSkip: undefined,
  onAdd: undefined,
  t: (value) => value,
};

export default FormStep;
