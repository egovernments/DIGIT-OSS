import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import "./index.scss";
import { connect } from "react-redux";
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


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
    checkedG: true
  };

  handleChange = name => event => {
    // this.setState({ [name]: event.target.checked });
    const { jsonPath, prepareFinalObject, preparedFinalObject } = this.props;
    const checkedG = get(preparedFinalObject, jsonPath, false);
    prepareFinalObject(jsonPath, !checkedG);
  };

  render() {
    const { classes, content, jsonPath, preparedFinalObject } = this.props;
    const checkedG = get(preparedFinalObject, jsonPath, false);
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={checkedG}
              onChange={this.handleChange("checkedG")}
              value="checkedG"
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          label={<LabelContainer
            labelName={content}
            labelKey={content}
          />}
        />
      </FormGroup>
    );
  }
}

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps) => {
  let preparedFinalObject = get(state, 'screenConfiguration.preparedFinalObject', {})
  return { preparedFinalObject: { ...preparedFinalObject } };
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(CheckboxLabels))
);

