import React from "react";
import { Button } from "components";
import "./index.css";

const ButtonComponent = ({ label, onClick }) => {
  return (
    <div className="create-comp-csr-cont">
      <Button
        className="create-complaint-submit-button"
        id="assign-complaint-button"
        onClick={onClick}
        primary={true}
        label={<Label buttonLabel={true} label={label} />}
        fullWidth={true}
      />;
    </div>
  );
};
export default ButtonComponent;
