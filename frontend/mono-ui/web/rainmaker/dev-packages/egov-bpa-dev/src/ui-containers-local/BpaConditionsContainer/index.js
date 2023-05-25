import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import {
  LabelContainer
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {},
  conditionNum: {
    width: "30px !important",
  }
};


// const requiredIcon = (
//   <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
// );

class BpaConditionsContainer extends Component {
  handleFieldChange = (event, value, condition, key) => {
    const { permitConditions, prepareFinalObject, bpaDetails } = this.props;
    let permitConditionsList = [], finalPermitList = [], appDocumentList;
    permitConditions.forEach(condtn => {
      if(condition === condtn.condition){
        condtn.conditionValue = !value;
      }
      permitConditionsList.push(condtn);
    })
    
    permitConditionsList.forEach(conditions => {
      if(conditions.conditionValue === true) {
        finalPermitList.push(conditions.condition);
      }
    })
    appDocumentList = {
      ...bpaDetails.additionalDetails,
      ["pendingapproval"]: finalPermitList
    }
    prepareFinalObject("permitTemp", finalPermitList);
    prepareFinalObject("BPA.additionalDetails",  appDocumentList);
  };


  render() {
    const { classes, permitConditions } = this.props;
    let index = 0;
    return (
      <div>
        {permitConditions && permitConditions.length > 0 &&
          permitConditions.map(conditions => {
            return (
                <Grid container={true}>
                    <Grid item={true} className={classes.conditionNum}>
                        <div >
                            <span>{index + 1}</span>
                        </div>
                    </Grid>
                    <Grid  item={true} xs={10} sm={5} md={10}>
                        <LabelContainer
                        labelKey={conditions.condition}
                          // labelKey={getTransformedLocale(conditions.condition)}
                        />
                    </Grid>
                    <Grid>
                    <Checkbox
                      classes={{
                        root: classes.root,
                        checked: classes.checked
                      }}          
                      onChange={event => this.handleFieldChange(event, conditions.conditionValue, conditions.condition, index++)}
                      value={index++}        
                    />
                    </Grid>
              </Grid>
            );
          })}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const permitConditions = get(
    screenConfiguration.preparedFinalObject,
    "permitConditions",
    {}
  );
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  )
  return { permitConditions, moduleName, bpaDetails };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BpaConditionsContainer)
);