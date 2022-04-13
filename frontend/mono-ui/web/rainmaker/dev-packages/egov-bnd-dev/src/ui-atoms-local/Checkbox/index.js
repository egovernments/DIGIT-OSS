import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import "./index.css";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class CheckboxLabels extends React.Component {
  state = {
    checkedG: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    const { jsonPath, prepareFinalObject } = this.props;
    prepareFinalObject(jsonPath, !this.state.checkedG);
  };

  render() {
    const { classes, label } = this.props;
    return (
      <div style={{display:"table"}}>
        <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-label" }}
              control={
                <Checkbox
                  checked={this.state.checkedG}
                  onChange={this.handleChange("checkedG")}
                  value="checkedG"
                  classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}
                />
              } 
            />
            <span style={{paddingTop:"15px",marginLeft:"-15px"}}>
            <LabelContainer
              labelName={label.labelValue}
              labelKey={label.labelKey}/>
            </span>
        </FormGroup>
      </div>
    );
  }
}

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(CheckboxLabels)
);

//export default withStyles(styles)(CheckboxLabels);
