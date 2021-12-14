import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
const { forwardRef, useRef, useImperativeHandle } = React;
import {
  BreakLine,
  Card,
  CardLabel,
  CardLabelError,
  CardSubHeader,
  CardSectionHeader,
  TextArea,
  TextInput,
  ActionBar,
  SubmitBar,
  LabelFieldPair,
} from "@egovernments/digit-ui-react-components";

import { useTranslation } from "react-i18next";

export const FormComposer = forwardRef((props, ref) => {

  //TODO: @naveen @vamshi please migrate to HOC/FormComposer
  let setFormData = props.setFormData;
  const { register, handleSubmit, errors, setValue } = useForm();
  const { t } = useTranslation();
  // const [isDisabled, setIsDisabled] = useState(false);

  function onSubmit(data) {
    props.onSubmit(data);
  }

  /*  {
    setValue("ADVT_HOARDINGS_CGST", `10`);
  }

  useEffect(() => {
    setValue("ADVT_HOARDINGS_CGST", `10`);
  }, ["ADVT_HOARDINGS_CGST"]);
 */
  useEffect(() => {
    //setFormData && setValue("ADVT_HOARDINGS_CGST", `${setFormData["ADVT_HOARDINGS_CGST"]}`);
    if (setFormData) {
      const entries = Object.keys(setFormData);
      setFormData && entries.map((entry) => setValue(`${entry}`, `${setFormData[`${entry}`] == null ? "" : setFormData[`${entry}`]}`));
    }
  }, [setFormData]);
  if (setFormData) {
    setValue("name", `${setFormData["name"]}`);
    setValue("mobileNumber", `${setFormData["mobileNumber"]}`);
    //setValue("ADVT_HOARDINGS_CGST", `${setFormData["ADVT_HOARDINGS_CGST"]}`);
    setValue("doorNo", `${setFormData["doorNo"]}`);
    setValue("buildingName", `${setFormData["buildingName"]}`);
    setValue("street", `${setFormData["street"]}`);
    setValue("pincode", `${setFormData["pincode"] === null ? "" : setFormData["pincode"]}`);
    setValue("comments", `${setFormData["comments"]}`);
  }
  /* useImperativeHandle(ref, () => ({
    setValues() {
      if (setFormData) {
        setValue("name", `${setFormData["name"]}`);
        setValue("mobileNumber", `${setFormData["mobileNumber"]}`);
      }
    },
  }));  */

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return (
          <div className="field-container">
            {populators.componentInFront ? populators.componentInFront : null}
            <TextInput className="field desktop-w-full" {...populators} inputRef={register(populators.validation)} />
          </div>
        );
      case "textarea":
        return <TextArea className="field desktop-w-full" name={populators.name || ""} {...populators} inputRef={register(populators.validation)} />;
      case "custom":
        return <TaxForm register={register} {...populators} errors={errors} />;
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            <CardSectionHeader>{section.head}</CardSectionHeader>
            {section.body.map((field, index) => {
              return (
                <React.Fragment key={index}>
                  {/* {errors[field.populators.name] && (field.populators?.validate ? errors[field.populators.validate] : true) && (
                    <CardLabelError>{field.populators.error}</CardLabelError>
                  )} */}
                  {field.label ? (
                    <LabelFieldPair>
                      <CardLabel>
                        {field.label}
                        {field.isMandatory ? " * " : null}
                      </CardLabel>
                      <div className="field">{fieldSelector(field.type, field.populators)}</div>
                    </LabelFieldPair>
                  ) : (
                    <div className="field">{fieldSelector(field.type, field.populators)}</div>
                  )}
                   {props.errors[field.populators.name] && (field.populators?.validate ? errors[field.populators.validate] : true) && (
                    <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{field.populators.error}</CardLabelError>
                  )}
                </React.Fragment>
              );
            })}
            {array.length - 1 === index ? null : <BreakLine />}
          </React.Fragment>
        );
      }),
    [props.config, errors]
  );

  const isDisabled = props.isDisabled || false;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {formFields}
        {props.children}
        <ActionBar>
          <SubmitBar disabled={isDisabled} label={t(props.label)} submit="submit" />
        </ActionBar>
      </Card>
    </form>
  );
});
