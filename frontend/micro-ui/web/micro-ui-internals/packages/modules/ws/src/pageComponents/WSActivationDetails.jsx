import { CardLabel, LabelFieldPair, TextInput, DatePicker } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSActivationDetails = ({ t, userType }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_METER_ID`)}:`}</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_METER_INSTALLATION_DATE`)}:`}</CardLabel>
        <div className="field">
          <DatePicker date={new Date()} ></DatePicker>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_INIT_METER_READING`)}:`}</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_CONN_EXEC_DATE`)}:`}</CardLabel>
        <div className="field">
          <DatePicker date={new Date()}></DatePicker>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSActivationDetails;
