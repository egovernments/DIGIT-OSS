import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import "./index.css";

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  radioRoot: {
    marginBottom: 0
  }
});

class RadioButtonsGroup extends React.Component {
  state = {
    value: "No"
  };

  handleChange = event => {
    this.setState({ value: event.target.value }, () => {
      approveCheck(jsonPath, this.state.value);
    });
  };

  render() {
    const { classes, buttons } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
            {buttons &&
              buttons.map((button, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    classes={{ label: "radio-button-label" }}
                    value={button}
                    control={
                      <Radio
                        classes={{
                          root: "radio-root"
                        }}
                        color="primary"
                      />
                    }
                    label={button}
                  />
                );
              })}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RadioButtonsGroup);
