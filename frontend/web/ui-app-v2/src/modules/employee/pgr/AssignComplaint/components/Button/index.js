import React from "react";
import { Button } from "components";
import "./index.css";

const ButtonComponent = ({ label, onClick }) => {
  return (
    <div className="btn-without-bottom-nav">
      <Button id="assign-complaint-button" onClick={onClick} primary={true} label={<Label buttonLabel={true} label={label} />} fullWidth={true} />;
    </div>
  );
};
export default ButtonComponent;
