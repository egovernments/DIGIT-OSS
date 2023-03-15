import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import store from "ui-redux/store";

import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import "./index.css";
import { get } from "lodash";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51",
    },
  },
  checked: {},
};

class CheckboxLabels extends React.Component {
  state = {
    checkedG: false,
  };
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.checked !== this.state.checkedG) {
      this.setState({ checkedG: nextProps.checked });
    }
  }
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    const { jsonPath, prepareFinalObject, callBack } = this.props;

    prepareFinalObject(jsonPath, !this.state.checkedG);
    callBack && callBack(store.getState(), store.dispatch);
  };

  render() {
    const { classes, label } = this.props;
    return (
      <div style={{ display: "table" }} className="bnd-checkbox">
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
                  checked: classes.checked,
                }}
              />
            }
          />
          <span style={{ paddingTop: "15px", marginLeft: "-15px" }}>
            <LabelContainer
              labelName={label.labelValue}
              labelKey={label.labelKey}
            />
          </span>
        </FormGroup>
      </div>
    );
  }
}

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownprops) => {
  let {
    jsonPath,
    value,
    sourceJsonPath,
    labelsFromLocalisation,
    data,
    localePrefix,
  } = ownprops;
  let checked = get(
    state.screenConfiguration.preparedFinalObject,
    jsonPath,
    false
  );
  return { checked };
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels)
);

//export default withStyles(styles)(CheckboxLabels);
