import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const ActionFooter = () => {
  return (
    <div className="wizard-footer col-xs-12" style={{ textAlign: "right" }}>
      <div className="col-xs-6" style={{ float: "right" }}>
        <Button
          label={<Label buttonLabel={true} label="PT_COMMONS_GO_BACK" color="#db251c" />}
          labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#db251c" }}
          buttonStyle={{ border: "1px solid #db251c" }}
          style={{ marginRight: 45, width: "36%" }}
        />
        <Button
          label="PAY ONE"
          style={{ width: "36%" }}
          backgroundColor="#db251c"
          labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
          buttonStyle={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default ActionFooter;
