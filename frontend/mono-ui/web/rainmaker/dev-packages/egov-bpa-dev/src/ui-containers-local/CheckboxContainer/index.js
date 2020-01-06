import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";

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

  componentDidMount = () => {
    const { preparedFinalObject, approveCheck, jsonPath } = this.props;
    let isChecked = get(preparedFinalObject, jsonPath);
    if (isChecked) this.setState({ checkedG: isChecked });
  };

  handleChange = name => event => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      jsonPath
    } = this.props;

    disbaleComponentJsonPaths &&
      disbaleComponentJsonPaths.map(componentJsonPath => {
        onFieldChange(
          screenKey,
          componentJsonPath,
          "props.disabled",
          event.target.checked
        );
      });
    if (event.target.checked) {
      sourceJsonPaths &&
        destinationJsonPaths &&
        sourceJsonPaths.forEach((sourceJSonPath, index) => {
          // approveCheck(
          //   destinationJsonPaths[index],
          //   get(preparedFinalObject, sourceJSonPath)
          // );
          onFieldChange(
            screenKey,
            disbaleComponentJsonPaths[index],
            "props.value",
            get(preparedFinalObject, sourceJSonPath)
          );
        });
    } else {
      sourceJsonPaths &&
        destinationJsonPaths &&
        destinationJsonPaths.forEach((destinationJsonPath, index) => {
          approveCheck(destinationJsonPaths[index], "");
        });
      disbaleComponentJsonPaths &&
        disbaleComponentJsonPaths.map(componentJsonPath => {
          onFieldChange(screenKey, componentJsonPath, "props.value", "");
        });
    }
    this.setState({ [name]: event.target.checked }, () =>
      approveCheck(jsonPath, this.state.checkedG)
    );
  };

  render() {
    const { classes, content, label } = this.props;

    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={this.state.checkedG}
              onChange={this.handleChange("checkedG")}
              value={this.state.checkedG}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          label={
            label &&
            label.key && (
              <LabelContainer
                className={classes.formLabel}
                labelName={label.name}
                labelKey={label.key}
              />
            )
          }
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxLabels)
);
