import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const ActionFooter = () => {
  return (
    <div className="wizard-footer col-xs-12" style={{ textAlign: "right" }}>
      <div className="col-xs-6" style={{ float: "right" }}>
        <Button
          label={<Label buttonLabel={true} label="PT_COMMONS_GO_BACK" color="mediumpurple" />}
          labelStyle={{ letterSpacing: 0.7, padding: 0, color: "mediumpurple" }}
          buttonStyle={{ border: "1px solid mediumpurple" }}
          style={{ marginRight: 45, width: "36%" }}
        />
        <Button
          label="PAY ONE"
          style={{ width: "36%" }}
          backgroundColor="mediumpurple"
          labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
          buttonStyle={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default ActionFooter;
