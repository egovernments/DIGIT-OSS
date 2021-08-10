import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import {Div,Button} from '../../ui-atoms';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});



class StepperNonLinearWithoutAction extends React.Component {
  state = {
    activeStep: 0,
  };


  handleNext = () => {
    const {steps} =this.props;
    let activeStep;
    activeStep = this.state.activeStep + 1;
    if (activeStep<steps.length) {
      this.setState({
        activeStep,
      });
    }
    else {
      activeStep = 0;
      this.setState({
        activeStep,
      });
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step,
    });
  };



  render() {
    const { activeStep } = this.state;
    const { steps,getStepContent,classes } = this.props;

    return (
      <div className={classes.root}>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepButton
                  onClick={this.handleStep(index)}
                >
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <div>

            <div>
              <Div className={classes.instructions}>{getStepContent(activeStep)}</Div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  Next
                </Button>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

StepperNonLinearWithoutAction.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(StepperNonLinearWithoutAction);
