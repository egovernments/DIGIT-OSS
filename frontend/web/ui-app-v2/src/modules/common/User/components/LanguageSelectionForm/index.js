import React from "react";
import { ButtonGroup, Button, Card } from "components";
import Label from "utils/translationNode";
import "./index.css";

const selectedLabelStyle = {
  color: "#ffffff",
};

const selectedStyle = {
  backgroundColor: "#00bcd1",
  border: "1px solid #00bcd1",
};

const defaultStyle = {
  border: "1px solid #484848",
  borderRadius: "1px",
  marginRight: "4.65%",
  height: "44px",
  lineHeight: "44px",
  width: "28.48%",
  padding: "0 16px",
};

const defaultLabelStyle = {
  textTransform: "none",
  fontWeight: "500",
  color: "#484848",
  verticalAlign: "initial",
  padding: 0,
};

const LanguageSelectionForm = ({ items, onLanguageSelect, value, onClick }) => {
  return (
    <Card
      className="user-screens-card language-selection-card"
      textChildren={
        <div>
          <form>
            <div className="text-center">
              <Label bold={true} label="LANGUAGE" className="language-label" />
              <span>|</span>
              <Label bold={true} label="भाषा" className="language-label" />
              <span>|</span>
              <Label bold={true} label="ਭਾਸ਼ਾ" className="language-label" />
            </div>
            <div className="button-toggle-container">
              <ButtonGroup
                items={items}
                onClick={onClick}
                selected={value}
                defaultStyle={defaultStyle}
                defaultLabelStyle={defaultLabelStyle}
                selectedStyle={selectedStyle}
                selectedLabelStyle={selectedLabelStyle}
                multiple={false}
              />
            </div>
            <div className="button-container">
              <Button
                id="continue-action"
                onClick={onLanguageSelect}
                primary={true}
                label={<Label buttonLabel={true} label="CORE_COMMON_CONTINUE" />}
                fullWidth={true}
              />
            </div>
          </form>
        </div>
      }
    />
  );
};

export default LanguageSelectionForm;
