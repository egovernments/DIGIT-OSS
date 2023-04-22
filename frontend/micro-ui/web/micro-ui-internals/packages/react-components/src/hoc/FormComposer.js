import React, { useEffect, useMemo, useState, Fragment } from "react";
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
import LinkButton from "../atoms/LinkButton";

import { useTranslation } from "react-i18next";
import MobileNumber from "../atoms/MobileNumber";
import _ from "lodash";

export const FormComposer = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    control,
    formState,
    errors,
    setError,
    clearErrors,
    unregister,
  } = useForm({
    defaultValues: props.defaultValues,
  });
  const { t } = useTranslation();
  const formData = watch();

  useEffect(() => {
    const iseyeIconClicked = sessionStorage.getItem("eyeIconClicked");
    if (props?.appData && !(props?.appData?.ConnectionHolderDetails?.[0]?.sameAsOwnerDetails) && iseyeIconClicked && Object.keys(props?.appData)?.length > 0 && (!(_.isEqual(props?.appData?.ConnectionHolderDetails?.[0],formData?.ConnectionHolderDetails?.[0] ))) ) {
      reset({ ...props?.appData });
    }
  }, [props?.appData, formData, props?.appData?.ConnectionHolderDetails]);

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
    const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;

    switch (type) {
      case "text":
      case "date":
      case "number":
      case "password":
      case "time":
        // if (populators.defaultValue) setTimeout(setValue(populators?.name, populators.defaultValue));
        return (
          <div className="field-container">
            {populators?.componentInFront ? (
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

      case "form":
        return (
          <form>
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
              setError={setError}
              clearErrors={clearErrors}
              formState={formState}
              control={control}
            />
          </form>
        );
      default:
        return populators?.dependency !== false ? populators : null;
    }
  };

  const getCombinedStyle = (placementinBox) => {
    switch (placementinBox) {
      case 0:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "10px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
        };
      case 1:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          borderTop: "0px",
          borderBottom: "0px",
        };
      case 2:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
          borderTop: "0px",
        };
    }
  };

  const titleStyle = { color: "#505A5F", fontWeight: "700", fontSize: "16px" };

  const getCombinedComponent = (section) => {
    if (section.head && section.subHead) {
      return (
        <>
          <CardSectionHeader style={props?.sectionHeadStyle ? props?.sectionHeadStyle : { margin: "5px 0px" }} id={section.headId}>
            {t(section.head)}
          </CardSectionHeader>
          <CardSectionHeader style={titleStyle} id={`${section.headId}_DES`}>
            {t(section.subHead)}
          </CardSectionHeader>
        </>
      );
    } else if (section.head) {
      return (
        <>
          <CardSectionHeader style={props?.sectionHeadStyle ? props?.sectionHeadStyle : {}} id={section.headId}>
            {t(section.head)}
          </CardSectionHeader>
        </>
      );
    } else {
      return <div></div>;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            {section && getCombinedComponent(section)}
            {section.body.map((field, index) => {
              if (props.inline)
                return (
                  <React.Fragment key={index}>
                    <div style={field.isInsideBox ? getCombinedStyle(field?.placementinbox) : {}}>
                      {!field.withoutLabel && (
                        <CardLabel
                          style={{ color: field.isSectionText ? "#505A5F" : "", marginBottom: props.inline ? "8px" : "revert" }}
                          className={field?.disable ? "disabled" : ""}
                        >
                          {t(field.label)}
                          {field.isMandatory ? " * " : null}
                          {field.labelChildren && field.labelChildren}
                        </CardLabel>
                      )}
                      {errors && errors[field.populators?.name] && Object.keys(errors[field.populators?.name]).length ? (
                        <CardLabelError>{t(field.populators.error || errors[field.populators?.name]?.message)}</CardLabelError>
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
                    </div>
                  </React.Fragment>
                );
              return (
                <Fragment>
                  <LabelFieldPair key={index}>
                    {!field.withoutLabel && (
                      <CardLabel style={{ color: field.isSectionText ? "#505A5F" : "", marginBottom: props.inline ? "8px" : "revert" }}>
                        {t(field.label)}
                        {field.isMandatory ? " * " : null}
                        {field.labelChildren && field.labelChildren}
                      </CardLabel>
                    )}
                    <div style={field.withoutLabel ? { width: "100%", ...props?.fieldStyle } : {}} className="field">
                      {fieldSelector(field.type, field.populators, field.isMandatory, field?.disable, field?.component, field)}
                      {field?.description && <CardText style={{ fontSize: "14px", marginTop: "-24px" }}>{t(field?.description)}</CardText>}
                    </div>
                  </LabelFieldPair>
                  {field?.populators?.name && errors && errors[field?.populators?.name] && Object.keys(errors[field?.populators?.name]).length ? (
                    <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
                      {t(field?.populators?.error)}
                    </CardLabelError>
                  ) : null}
                </Fragment>
              );
            })}
            {!props.noBreakLine && (array.length - 1 === index ? null : <BreakLine style={props?.breaklineStyle ? props?.breaklineStyle : {}} />)}
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
  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} id={props.formId} className={props.className}>
      <Card style={getCardStyles()} className={props?.cardClassName ? props.cardClassName : ""}>
        {!props.childrenAtTheBottom && props.children}
        {props.heading && <CardSubHeader style={{ ...props.headingStyle }}> {props.heading} </CardSubHeader>}
        {props.description && <CardLabelDesc className={"repos"}> {props.description} </CardLabelDesc>}
        {props.text && <CardText>{props.text}</CardText>}
        {formFields}
        {props.childrenAtTheBottom && props.children}
        {props.submitInForm && (
          <SubmitBar label={t(props.label)} style={{ ...props?.buttonStyle }} submit="submit" disabled={isDisabled} className="w-full" />
        )}
        {props.secondaryActionLabel && (
          <div className="primary-label-btn" style={{ margin: "20px auto 0 auto" }} onClick={onSecondayActionClick}>
            {props.secondaryActionLabel}
          </div>
        )}
        {!props.submitInForm && props.label && (
          <ActionBar>
            <SubmitBar label={t(props.label)} submit="submit" disabled={isDisabled} />
            {props.onSkip && props.showSkip && <LinkButton style={props?.skipStyle} label={t(`CS_SKIP_CONTINUE`)} onClick={props.onSkip} />}
          </ActionBar>
        )}
      </Card>
    </form>
  );
};
