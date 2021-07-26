import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import CardLabel from "../atoms/CardLabel";
import CardText from "../atoms/CardText";
// import CardLabelError from "../atoms/CardLabelError";
import CardSubHeader from "../atoms/CardSubHeader";
import CardSectionHeader from "../atoms/CardSectionHeader";
import CardLabelDesc from "../atoms/CardLabelDesc";
import CardLabelError from "../atoms/CardLabelError";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";
import LabelFieldPair from "../atoms/LabelFieldPair";

import { useTranslation } from "react-i18next";
import MobileNumber from "../atoms/MobileNumber";

export const FormComposer = (props) => {
  const { register, handleSubmit, setValue, getValues, watch, control, formState, errors, setError, clearErrors, unregister } = useForm({
    defaultValues: props.defaultValues,
  });
  const { t } = useTranslation();
  const formData = watch();

  useEffect(() => {
    props.getFormAccessors && props.getFormAccessors({ setValue, getValues });
  }, []);

  function onSubmit(data) {
    props.onSubmit(data);
  }

  function onSecondayActionClick(data) {
    props.onSecondayActionClick();
  }

  useEffect(() => {
    props.onFormValueChange && props.onFormValueChange(setValue, formData, formState);
  }, [formData]);

  const fieldSelector = (type, populators, isMandatory, disable = false, component, config) => {
    switch (type) {
      case "text":
      case "date":
      case "number":
      case "password":
        // if (populators.defaultValue) setTimeout(setValue(populators?.name, populators.defaultValue));
        return (
          <div className="field-container">
            {populators.componentInFront ? (
              <span className={`component-in-front ${disable && "disabled"}`}>{populators.componentInFront}</span>
            ) : null}
            <TextInput
              className="field"
              {...populators}
              inputRef={register(populators.validation)}
              isRequired={isMandatory}
              type={type}
              disable={disable}
              watch={watch}
            />
          </div>
        );
      case "textarea":
        // if (populators.defaultValue) setTimeout(setValue(populators?.name, populators.defaultValue));
        return (
          <TextArea className="field" name={populators?.name || ""} {...populators} inputRef={register(populators.validation)} disable={disable} />
        );
      case "mobileNumber":
        return (
          <Controller
            render={(props) => <MobileNumber className="field" onChange={props.onChange} value={props.value} disable={disable} />}
            defaultValue={populators.defaultValue}
            name={populators?.name}
            control={control}
          />
        );
      case "custom":
        return (
          <Controller
            render={(props) => populators.component({ ...props, setValue }, populators.customProps)}
            defaultValue={populators.defaultValue}
            name={populators?.name}
            control={control}
          />
        );
      case "component":
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Controller
            render={(props) => (
              <Component
                userType={"employee"}
                t={t}
                setValue={setValue}
                onSelect={setValue}
                config={config}
                data={formData}
                formData={formData}
                register={register}
                errors={errors}
                props={props}
                setError={setError}
                clearErrors={clearErrors}
                formState={formState}
                onBlur={props.onBlur}
              />
            )}
            name={config.key}
            control={control}
          />
        );
      default:
        return populators?.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            {section.head && <CardSectionHeader id={section.headId}>{t(section.head)}</CardSectionHeader>}
            {section.body.map((field, index) => {
              if (props.inline)
                return (
                  <React.Fragment key={index}>
                    {!field.withoutLabel && (
                      <CardLabel style={{ marginBottom: props.inline ? "8px" : "revert" }} className={field?.disable?"disabled":""}>
                        {t(field.label)}
                        {field.isMandatory ? " * " : null}
                      </CardLabel>
                    )}

                    {errors && errors[field.populators?.name] && Object.keys(errors[field.populators?.name]).length ? (
                      <CardLabelError>{field.populators.error}</CardLabelError>
                    ) : null}
                    <div style={field.withoutLabel ? { width: "100%" } : {}} className="field">
                      {fieldSelector(field.type, field.populators, field.isMandatory, field?.disable, field?.component, field)}
                      {field?.description && (
                        <CardLabel
                          style={{
                            marginTop: "-24px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#505A5F",
                            ...field?.descriptionStyles,
                          }}
                        >
                          {t(field.description)}
                        </CardLabel>
                      )}
                    </div>
                  </React.Fragment>
                );
              return (
                <LabelFieldPair key={index}>
                  {!field.withoutLabel && (
                    <CardLabel style={{ marginBottom: props.inline ? "8px" : "revert" }}>
                      {t(field.label)}
                      {field.isMandatory ? " * " : null}
                    </CardLabel>
                  )}
                  <div style={field.withoutLabel ? { width: "100%", ...props?.fieldStyle } : {}} className="field">
                    {fieldSelector(field.type, field.populators, field.isMandatory, field?.disable, field?.component, field)}
                  </div>
                  {field?.populators?.name && errors && errors[field?.populators?.name] && Object.keys(errors[field?.populators?.name]).length ? (
                    <CardLabelError>{field?.populators?.error}</CardLabelError>
                  ) : null}
                </LabelFieldPair>
              );
            })}
            {!props.noBreakLine && (array.length - 1 === index ? null : <BreakLine style={props?.breaklineStyle ? props?.breaklineStyle : {}}/>)}
          </React.Fragment>
        );
      }),
    [props.config, formData]
  );

  const getCardStyles = () => {
    let styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = { ...styles, boxShadow: "none" };
    return styles;
  };

  const isDisabled = props.isDisabled || false;

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={props.formId}>
      <Card style={getCardStyles()}>
        {!props.childrenAtTheBottom && props.children}
        {props.heading && <CardSubHeader style={{ ...props.headingStyle }}> {props.heading} </CardSubHeader>}
        {props.description && <CardLabelDesc> {props.description} </CardLabelDesc>}
        {props.text && <CardText>{props.text}</CardText>}
        {formFields}
        {props.childrenAtTheBottom && props.children}
        {props.submitInForm && <SubmitBar label={t(props.label)} submit="submit" className="w-full" />}
        {props.secondaryActionLabel && (
          <div className="primary-label-btn" style={{ margin: "20px auto 0 auto" }} onClick={onSecondayActionClick}>
            {props.secondaryActionLabel}
          </div>
        )}
        {!props.submitInForm && props.label && (
          <ActionBar>
            <SubmitBar label={t(props.label)} submit="submit" disabled={isDisabled} />
          </ActionBar>
        )}
      </Card>
    </form>
  );
};
