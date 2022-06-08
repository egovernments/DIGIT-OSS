import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TaskStatusComponents from "../TaskStatusComponents";
import Divider from "@material-ui/core/Divider";
import { getCurrentStatus } from "../TaskStatusComponents";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import "./index.css";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

class VerticalLinearStepper extends React.Component {
  render() {
    const { classes, content } = this.props;

    return (
      <div className={classes.root}>
        <Stepper orientation="vertical">
          {content.map(
            (item, index) =>
              item && (
                <Step key={index} active={true}>
                  <StepLabel classes={{ label: "stepper-label" }}>
                    <LabelContainer
                      labelName={getCurrentStatus(item.state.applicationStatus)}
                      labelKey={
                        item.businessService
                          ? `WF_${item.businessService.toUpperCase()}_${
                              item.state.applicationStatus
                            }`
                          : ""
                      }
                    />
                  </StepLabel>
                  <StepContent>
                    <TaskStatusComponents currentObj={item} index={index} />
                    <Divider className={classes.root} />
                  </StepContent>
                </Step>
              )
          )}
        </Stepper>
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(VerticalLinearStepper);
