import React from "react";
import { Button } from "components";
import Label from "../../../utils/translationNode";
import "./index.css";

const ActionFooter = ({ label1, label2, primaryAction, secondaryAction }) => {
  return (
    <div className="col-xs-12 wizard-footer" style={{ textAlign: "right" }}>
      <div className="col-xs-12" style={{ float: "right", padding: 0 }}>
        {label1 && (
          <Button
            label={<Label buttonLabel={true} label={label1} color= "#fe7a51" />}
            labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{ marginRight: 45, maxWidth: "30%" }}
            onClick={secondaryAction}

          />
        )}
        <Button
          label={<Label buttonLabel={true} label={label2} />}
          style={{ maxWidth: "30%" }}
          backgroundColor="#fe7a51"
          labelStyle={{ letterSpacing: 0.7, color: "#fff" }}
          buttonStyle={{ border: 0 }}
          onClick={primaryAction}
        />
      </div>
    </div>
  );
};

export default ActionFooter;
