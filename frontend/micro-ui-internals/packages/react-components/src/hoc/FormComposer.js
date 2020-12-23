import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import CardLabel from "../atoms/CardLabel";
import CardLabelError from "../atoms/CardLabelError";
import CardSubHeader from "../atoms/CardSubHeader";
import CardSectionHeader from "../atoms/CardSectionHeader";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";
import LabelFieldPair from "../atoms/LabelFieldPair";
import { useTranslation } from "react-i18next";
const FormComposer = (props) => {
  const { errors, register, handleSubmit } = useForm();
  const { t } = useTranslation();
  function onSubmit(data) {
    props.onSubmit(data);
  }
  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return <TextInput className="field" {...populators} inputRef={register(populators.validation)} />;
      case "textarea":
        return <TextArea className="field" {...populators} inputRef={register(populators.validation)} />;
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {props.config?.map((section, index, array) => {
          return (
            <React.Fragment key={index}>
              <CardSectionHeader>{section.head}</CardSectionHeader>
              {section.body.map((field, index) => {
                console.log(field.populators?.validation, field.populators?.validation, "error");
                return (
                  <LabelFieldPair key={index}>
                    <CardLabel>
                      {field.label}
                      {field.isMandatory ? " * " : null}
                    </CardLabel>
                    <div className="field">
                      {fieldSelector(field.type, field.populators)}
                      {field.populators?.validation && errors[field.populators?.name] && <CardLabelError>{field.populators.error}</CardLabelError>}
                    </div>
                  </LabelFieldPair>
                );
              })}
              {array.length - 1 === index ? null : <BreakLine />}
            </React.Fragment>
          );
        })}
        {props.children}
        <ActionBar>
          <SubmitBar label={props.label} submit="submit" />
        </ActionBar>
      </Card>
    </form>
  );
};
export default FormComposer;
