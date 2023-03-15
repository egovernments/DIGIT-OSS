import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";
import { toggleConnHolderDetails } from "../CheckboxContainer/toggleFeilds"

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
    checkedG: null
  };

  componentDidMount = () => {
    /*const { preparedFinalObject, approveCheck, jsonPath, onFieldChange } = this.props;    
    let isChecked = get(preparedFinalObject, jsonPath);
    if (isChecked) this.setState({ checkedG: isChecked });
    else {
      this.setState({ checkedG: true })
      this.updateOwnerFileds();
    } */
    const { classes, content, label, isChecked, approveCheck, onFieldChange, jsonPath } = this.props;
    if(isChecked === false){
      toggleConnHolderDetails(onFieldChange, true);
      approveCheck(jsonPath, isChecked)
    }else{
      toggleConnHolderDetails(onFieldChange, false);
      approveCheck(jsonPath, isChecked)
    }
  };

  updateOwnerFileds = () => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      jsonPath,
      state
    } = this.props;

    toggleConnHolderDetails(onFieldChange, false);
    approveCheck(jsonPath, this.props.isChecked)

  }
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

    const isChecked = event.target.checked;
    if (isChecked) {
      toggleConnHolderDetails(onFieldChange, false);
    } else {
      toggleConnHolderDetails(onFieldChange, true);
    }

    this.setState({ [name]: isChecked }, () =>
      approveCheck(jsonPath, isChecked)
    );
  };

  render() {
    const { classes, content, label } = this.props;
    let isChecked = (this.state.checkedG === null)?this.props.isChecked:this.state.checkedG;
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={isChecked}
              onChange={this.handleChange("checkedG")}
              value={isChecked}
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




// if(sourceJsonPaths){
//   sourceJsonPaths.forEach((sourceJSonPath, index) => {
//     // approveCheck(
//     //   destinationJsonPaths[index],
//     //   get(preparedFinalObject, sourceJSonPath)
//     // );
//     onFieldChange(
//       screenKey,
//       disbaleComponentJsonPaths[index],
//       "props.value",
//       get(preparedFinalObject, sourceJSonPath)
//     );
//   });
// }


// sourceJsonPaths &&
// destinationJsonPaths &&
// destinationJsonPaths.forEach((destinationJsonPath, index) => {
//   approveCheck(destinationJsonPath[index], "");
// });

// disbaleComponentJsonPaths &&
    //   disbaleComponentJsonPaths.map(componentJsonPath => {
    //     onFieldChange(
    //       screenKey,
    //       componentJsonPath,
    //       "props.disabled",
    //       event.target.checked
    //     );
    //   });
    //true

      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.forEach((disbaleComponentJsonPath, index) => {
      //     approveCheck(disbaleComponentJsonPath[index], "");
      //   });
      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.map(componentJsonPath => {
      //     onFieldChange(screenKey, componentJsonPath, "props.value", "");
      //   });

      

      //  this.updateOwnerFileds();
      // if(destinationJsonPaths){
      //   destinationJsonPaths.forEach((destinationJsonPath, index) => {
      //     approveCheck(
      //       destinationJsonPaths[index],
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //     onFieldChange(
      //       screenKey,
      //       disbaleComponentJsonPaths[index],
      //       "props.value",
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //   });
      // }