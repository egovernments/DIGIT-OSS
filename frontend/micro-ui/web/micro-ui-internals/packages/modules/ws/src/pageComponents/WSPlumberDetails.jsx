import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSPlumberDetails = ({ t, userType }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("Plumber Provided By")}:</CardLabel>
        <div className="field">
          <Dropdown></Dropdown>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("Plumber License Number")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("Plumber Name")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("Plumber Mobile Number")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSPlumberDetails;
