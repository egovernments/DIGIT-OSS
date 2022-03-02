import { CardLabel, LabelFieldPair, TextInput, DatePicker } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSActivationDetails = ({ t, userType }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`Meter ID`)}:`}</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`Meter Installation Date`)}:`}</CardLabel>
        <div className="field">
          <DatePicker date={new Date()} ></DatePicker>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`Initial Meter Reading`)}:`}</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`Connection Execution Date`)}:`}</CardLabel>
        <div className="field">
          <DatePicker date={new Date()}></DatePicker>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSActivationDetails;
