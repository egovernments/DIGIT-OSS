import React from "react";
import Card from "../atoms/Card";
import SubmitBar from "../atoms/SubmitBar";

const PageBasedInput = ({ children, texts, onSubmit }) => {
  return (
    <div className="PageBasedInputWrapper PageBased">
      <Card>
        {children}
        <SubmitBar className="SubmitBarInCardInDesktopView" label={texts.submitBarLabel} onSubmit={onSubmit} />
      </Card>
      <div className="SubmitBar">
        <SubmitBar label={texts.submitBarLabel} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default PageBasedInput;
