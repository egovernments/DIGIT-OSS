import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Icon from "@material-ui/core/Icon";
import StepContent from "@material-ui/core/StepContent";


const styles = theme => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  iconConatiner: {
    boxShadow: "0 4px 20px 0px rgba(0, 0, 0, 0.14)",
    color: "#FFFFFF",
    width: "50px",
    height: "50px",
    marginLeft: "-12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%  "
  },
  stepContentContainer: {
    padding:"16px 16px 16px 32px",
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14) ",
    borderRadius: "6px",
    marginLeft: "8px",
    marginTop: "8px",
    color: "#3C4858",
    fontWeight: 300,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    lineHeight: "1.35417em",
    background: "#eee"
  },
  stepConnector: {
    width: "3px",
    bottom: 0,
    content: " ",
    backgroundColor: "#E5E5E5"
  },
  stepLabel: {
    borderRadius: "12px",
    color: "white",
    padding: "5px 12px",
    display: "inline - block",
    textTransform: "uppercase",
    fontSize: "10px"
  }
});

class VerticalLinearStepper extends React.Component {
  render() {
    const { classes,steps } = this.props;

    return (
      <div className={classes.root}>
        <Stepper orientation="vertical" style={{background:"inherit"}}>
          {steps.map((step, index) => {
            return (
              <Step key={index} active={true}>
                <StepLabel
                  icon={
                    <div
                      className={classes.iconConatiner}
                      style={{
                        background: `linear-gradient(60deg,${
                          step.iconColorOne
                        } ,${step.iconColorTwo} )`
                      }}
                    >
                      <Icon>{step.iconName}</Icon>
                    </div>
                  }
                >
                  <span
                    style={{
                      background: `linear-gradient(60deg,${
                        step.iconColorOne
                      } ,${step.iconColorTwo} )`
                    }}
                    className={classes.stepLabel}
                  >
                    {step.displayLabel}
                  </span>
                </StepLabel>
                <StepContent>
                  <ul className={classes.stepContentContainer}>
                    {step.displaySubLabel.map((list, labelKey) => {
                      return <li key={labelKey}>{list}</li>;
                    })}
                  </ul>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(VerticalLinearStepper);
