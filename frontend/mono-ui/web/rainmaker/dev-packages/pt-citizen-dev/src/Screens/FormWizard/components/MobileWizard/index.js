import React from "react";
import { Button, TimeLine, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const iconStyle = {
  display: "inline-block",
};

const activeStepperStyle = {
  width: 20,
  height: 20,
  boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  backgroundColor: "#fe7a51",
  borderRadius: "50%",
  position: "relative",
  zIndex: 100,
};

const defaultStepperStyle = {
  width: 18,
  height: 18,
};

const MobileWizard = ({ handleNext, handlePrev, iconAction, header, iconName, trianglePos, component, stepIndex }) => {
  const steps = [1, 2, 3, 4, 5].map((item, index) => {
    return {
      labelChildren: "",
      labelProps: {
        icon:
          stepIndex === index ? (
            <div style={activeStepperStyle} />
          ) : stepIndex > index ? (
            <Icon style={defaultStepperStyle} color="#ffffff" action="custom" name="check-circle" />
          ) : (
            <Icon style={defaultStepperStyle} color="#ffffff" action="custom" name="circle" />
          ),
        style: {
          padding: 0,
        },
        iconContainerStyle: {
          padding: 0,
          display: "flex",
        },
      },
    };
  });

  return (
    <div>
      <TimeLine
        stepperProps={{
          activeStep: stepIndex,
          style: { background: "rgb(0, 188, 209)", position: "relative", zIndex: 10000, padding: "0 24px" },
          connector: <div style={{ border: "1px solid #fff", width: "100%", marginLeft: "-2px", marginRight: "4px" }} />,
        }}
        steps={steps}
        horizontal={true}
      />

      <div>
        <Card
          style={{ margin: "24px 8px" }}
          textChildren={
            <div style={{ position: "relative" }}>
              <div style={{ left: trianglePos }} className="card-triangle" />
              <div className="pt-form-card-header-cont">
                <Icon name={iconName} action={iconAction} style={iconStyle} />
                <Label
                  label={header}
                  bold={true}
                  dark={true}
                  labelStyle={{ letterSpacing: 0.6 }}
                  containerStyle={{ display: "inline-block", marginLeft: 16 }}
                />
              </div>
              {component}
            </div>
          }
        />
        <div className="flexbox-container">
          <div className="flex-item">
            <Button
              onClick={handlePrev}
              fullWidth={true}
              primary={true}
              label={<Label buttonLabel={true} label="PT_COMMONS_GO_BACK" color="#fe7a51" />}
            />
          </div>
          <div className="flex-item">
            <Button onClick={handleNext} fullWidth={true} label={<Label buttonLabel={true} label="PT_COMMONS_NEXT" color="#ffffff" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWizard;
