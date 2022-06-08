import React from "react";
import { Step, Stepper, StepLabel, StepContent } from "material-ui/Stepper";
import PropTypes from "prop-types";

const TimeLineUi = ({ divStyle, stepperProps, steps, horizontal }) => {
  return (
    <div {...divStyle}>
      <Stepper {...stepperProps}>
        {horizontal
          ? //Code duplication to handle annoying warning - Refer https://github.com/mui-org/material-ui/issues/6004
            steps.map((step, stepIndex) => {
              return (
                <Step key={stepIndex} {...step.props}>
                  <StepLabel {...step.labelProps}>{step.labelChildren}</StepLabel>
                </Step>
              );
            })
          : steps.map((step, stepIndex) => {
              return (
                <Step key={stepIndex} {...step.props}>
                  <StepLabel {...step.labelProps}>{step.labelChildren}</StepLabel>
                  <StepContent {...step.contentProps}>{step.contentChildren}</StepContent>
                </Step>
              );
            })}
      </Stepper>
    </div>
  );
};

export default TimeLineUi;

TimeLineUi.propTypes = {
  divStyle: PropTypes.object,
};
