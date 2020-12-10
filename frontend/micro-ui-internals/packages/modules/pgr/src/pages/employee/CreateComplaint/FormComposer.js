import React from "react";
import { useForm } from "react-hook-form";
import { useWindowSize } from "rooks"
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
  const { innerWidth } = useWindowSize();
  const { register, watch, handleSubmit } = useForm();

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

  const formFields = props.config?.map((section, index, array) => {
    return (
      <React.Fragment key={index}>
        <CardSectionHeader>{section.head}</CardSectionHeader>
        {section.body.map((field, index) => {
          return (
            <LabelFieldPair key={index}>
              <CardLabel>
                {field.label}
                {field.isMandatory ? " * " : null}
              </CardLabel>
              <div className="field">{fieldSelector(field.type, field.populators)}</div>
            </LabelFieldPair>
          );
        })}
        {array.length - 1 === index ? null : <BreakLine />}
      </React.Fragment>
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card style={{ paddingRight: innerWidth <= 640 ? 8 : 320 }}>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {formFields}
        {props.children}
        {/* <input type="submit" value="submit"/> */}
        <ActionBar>
          <SubmitBar label="Submit Complaint" submit="submit" />
        </ActionBar>
      </Card>
    </form>
  );
};

export default FormComposer;
