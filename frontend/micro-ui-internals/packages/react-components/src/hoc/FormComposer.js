import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import CardLabel from "../atoms/CardLabel";
import CardSubHeader from "../atoms/CardSubHeader";
import CardSectionHeader from "../atoms/CardSectionHeader";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";
import LabelFieldPair from "../atoms/LabelFieldPair";

import { useTranslation } from "react-i18next";

export const FormComposer = (props) => {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation();

  function onSubmit(data) {
    props.onSubmit(data);
  }

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return (
          <div
            className="field-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {populators.componentInFront ? populators.componentInFront : null}
            <TextInput className="field" {...populators} inputRef={register(populators.validation)} />
          </div>
        );
      case "textarea":
        return <TextArea className="field" {...populators} inputRef={register(populators.validation)} />;
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            {section.head && <CardSectionHeader>{section.head}</CardSectionHeader>}
            {section.body.map((field, index) => {
              const FieldPair = () => (
                <React.Fragment>
                  <CardLabel style={props.inline && { marginBottom: "8px" }}>
                    {field.label}
                    {field.isMandatory ? " * " : null}
                  </CardLabel>
                  <div className="field">{fieldSelector(field.type, field.populators)}</div>
                </React.Fragment>
              );

              if (props.inline) return <FieldPair key={index} />;

              return (
                <LabelFieldPair key={index}>
                  <FieldPair />
                </LabelFieldPair>
              );
            })}
            {array.length - 1 === index ? null : <BreakLine />}
          </React.Fragment>
        );
      }),
    [props.config]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card style={props.noBoxShadow && { boxShadow: "none" }}>
        {!props.childrenAtTheBottom && props.children}
        {props.heading && <CardSubHeader>{props.heading}</CardSubHeader>}
        {formFields}
        {props.childrenAtTheBottom && props.children}
        {props.label && (
          <ActionBar>
            <SubmitBar label={t(props.label)} submit="submit" />
          </ActionBar>
        )}
      </Card>
    </form>
  );
};
