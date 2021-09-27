import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LabelContainer from "../../ui-containers/LabelContainer";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: "100%"
  }
});




const theme = createMuiTheme({
  overrides: {
    MuiStepIcon: {
      completed: {
        color: '#39CB74!important',
      },
      active: {
        color: '#fe7a51!important',
      },
      text:{
        fontSize: "12px!important",
      }
    },
    MuiStepLabel:{
      label:{
        fontSize:'14px!important'
      },
      labelContainer:{
        fontSize:'14px!important'
      }
    }
  },
})

class HorizontalLabelPositionBelowStepper extends React.Component {
  render() {
    const { classes, activeStep, steps } = this.props;
    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            style={{
              background: "inherit"
            }}
          >
            {steps.map(label => {
              return (
                <Step key={label}>
                  <StepLabel>
                    <LabelContainer {...label} />
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    );
  }
}

HorizontalLabelPositionBelowStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);
