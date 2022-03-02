import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSPlumberDetails = ({ t, userType }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_PROVIDED_BY")}:</CardLabel>
        <div className="field">
          <Dropdown></Dropdown>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_LICENSE_NUMBER")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_NAME")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_MOB_NUMBER")}:</CardLabel>
        <div className="field">
          <TextInput></TextInput>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSPlumberDetails;
