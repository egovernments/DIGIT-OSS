import React from "react";
import { ButtonGroup, Button, Card, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";

const selectedLabelStyle = {
  color: "#ffffff",
};

const selectedStyle = {
  backgroundColor: "#fe7a51",
  border: "1px solid #fe7a51",
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

const LanguageSelectionForm = ({ items, onLanguageSelect, value, onClick, logoUrl }) => {
  return (
    <Card
      className="col-sm-offset-4 col-sm-4 user-screens-card language-selection-card"
      textChildren={
        <div>
          <div className="web-user-logo" style={{ marginBottom: "24px" }}>
            <Image className="mseva-logo employee-login-logo" source={logoUrl ? logoUrl : `${logo}`} />
          </div>
          <form>
            <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
              {items &&
                items.map((item, index) => {
                  return (
                    <div>
                      <Label bold={true} label={`LANGUAGE_${item.value.toUpperCase()}`} className="language-label" />
                      {index !== items.length - 1 && <span>|</span>}
                    </div>
                  );
                })}
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
