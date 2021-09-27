import React from "react";
import { Card, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const moduleCardButtonStyle1 = {
  width: "93%",
};

const moduleCardButtonStyle2 = {
  width: "100%",
};
const buttonsContainerStyle1 = {
  padding: "0px",
  margin: "0px",
  width: "50%",
};

const buttonsContainerStyle2 = {
  padding: "0px",
  margin: "0px",
  width: "100%",
};

const ModuleCard = ({ items, onButton1Click, onPGRClick, onButton2Click, history }) => {
  return (
    <div>
      {items &&
        items.map((item, key) => {
          return (
            <div key={key} className={`col-sm-6 ${item.className}`}>
              <Card
                id="home-complaint-card"
                className="clearfix landingPageCard"
                style={item.borderLeftColor}
                textChildren={
                  <div className="clearfix" style={{ position: "relative", minHeight: item.moduleDescription ? "200px" : "inherit" }}>
                    <div style={{ padding: "0", margin: "0", display: "flex" }}>
                      <Icon action={item.iconAction} name={item.iconName} style={item.iconStyle} />
                      <Label className="moduleCardTitle" label={item.moduleTitle} />
                    </div>
                    <div>
                      <Label className="moduleCardDescription" label={item.moduleDescription} />
                    </div>
                    <div
                      className={
                        item.moduleDescription ? "col-sm-12 landing-page-button landing-page-button-container" : "col-sm-12 landing-page-button"
                      }
                    >
                      <div className="col-sm-6" style={item.button2 ? buttonsContainerStyle1 : buttonsContainerStyle2}>
                        <Button
                          onClick={() => {
                            onButton1Click(item, history, onPGRClick);
                          }}
                          label={<Label label={item.button1} color="#fff" />}
                          primary={true}
                          style={{ align: "left" }}
                          style={item.button2 ? moduleCardButtonStyle1 : moduleCardButtonStyle2}
                          buttonStyle={{ border: "1px solid #fe7a51" }}
                          id={item.id}
                          labelStyle={{
                            padding: "0 12px 0 12px ",
                            letterSpacing: "0.6px",
                            display: "inline-block",
                            height: "22px",
                            lineHeight: "22px",
                            fontSize: "14px",
                          }}
                        />
                      </div>
                      {item.button2 && (
                        <div className="col-sm-6" style={buttonsContainerStyle1}>
                          <Button
                            onClick={() => {
                              onButton2Click(item, history);
                            }}
                            label={<Label label={item.button2} color="#fe7a51" />}
                            style={{ align: "right" }}
                            style={moduleCardButtonStyle1}
                            buttonStyle={{ border: "1px solid #fe7a51" }}
                            className="moduleSecondButton"
                            labelStyle={{
                              padding: "0 12px 0 12px ",
                              letterSpacing: "0.6px",
                              display: "inline-block",
                              height: "22px",
                              lineHeight: "22px",
                              fontSize: "14px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          );
        })}
    </div>
  );
};

export default ModuleCard;
