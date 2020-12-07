import React from "react";
import { useForm } from "react-hook-form";
import {
  BreakLine,
  Card,
  CardLabel,
  CardSubHeader,
  CardSectionHeader,
  TextArea,
  TextInput,
  ActionBar,
  SubmitBar,
  LabelFieldPair,
} from "@egovernments/digit-ui-react-components";

const FormComposer = (props) => {
  const { register, watch, handleSubmit } = useForm();

  function onSubmit(data) {
    props.onSubmit(data);
  }

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return <TextInput className="field" {...populators} inputRef={register} />;
      case "textarea":
        return <TextArea className="field" {...populators} inputRef={register} />;
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = props.config?.map((section, index) => {
    return (
      <React.Fragment key={index}>
        <CardSectionHeader>{section.head}</CardSectionHeader>
        {section.body.map((field, index) => {
          return (
            <LabelFieldPair key={index}>
              <CardLabel>{field.label}</CardLabel>
              {fieldSelector(field.type, field.populators)}
            </LabelFieldPair>
          );
        })}
        <BreakLine />
      </React.Fragment>
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {formFields}
        {props.children}
        {/* <input type="submit" value="submit"/> */}
        <ActionBar>
          <SubmitBar label="Submit Complaint" onSubmit={onSubmit} />
        </ActionBar>
      </Card>
    </form>
  );
};

export default FormComposer;
