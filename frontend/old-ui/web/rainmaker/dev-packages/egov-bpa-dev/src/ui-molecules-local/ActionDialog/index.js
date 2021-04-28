import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { 
  prepareFinalObject, 
  toggleSnackbar, 
  handleScreenConfigurationFieldChange as handleField
 } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import "./index.css";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    }
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "WF_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  }
};

class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: "",

  };

  render() {

    let {
      onClose,
      handleFieldChange,
      updateTheApplication,
      applicationAction,
      error,
      errorMessage
    } = this.props;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }

    onClose = () => {
      const {handleField, bpaDetails } = this.props;
      this.props.handleField();
    }

    handleFieldChange  = (jsonPath, value) => {
      const { prepareFinalObject, bpaDetails } = this.props;
      if(bpaDetails &&  bpaDetails.workflow) {
        bpaDetails.workflow.comments = value
      } else {
        bpaDetails.workflow = {};
        bpaDetails.workflow.comments = value
      }
      
      prepareFinalObject(`BPA`, bpaDetails);
    };

    updateTheApplication = async() => {
      let { bpaDetails, applicationAction, toggleSnackbar, prepareFinalObject, applicationProcessInstances } = this.props;
      let applicationNumber = get(bpaDetails, "applicationNo");
      let tenantId = getQueryArg(window.location.href, "tenantId");
      let comment = get(bpaDetails, "workflow.comments");
      set(bpaDetails, "workflow.action", applicationAction);
      if( get(bpaDetails,"status").includes("CITIZEN_ACTION_PENDING")) {
        let getId = get(applicationProcessInstances, "assigner.uuid");
        let uuids = { uuid: getId };
        bpaDetails.assignees = [uuids];
        bpaDetails.assignee = [getId];
      }
      if((comment && applicationAction === "SEND_TO_ARCHITECT") || (applicationAction === "APPROVE") || (applicationAction === "FORWARD")) {
        let response = await httpRequest(
          "post",
          "bpa-services/v1/bpa/_update",
          "",
          [],
          { BPA: bpaDetails }
        );
        if (response && response.BPA && response.BPA.length > 0) {
          let appPath = "egov-bpa";
          if(get(response, "BPA[0].businessService") === "BPA_OC") {
            appPath = "oc-bpa"
          }
          const acknowledgementUrl =
            process.env.REACT_APP_SELF_RUNNING === "true"
              ? `/egov-ui-framework/${appPath}/acknowledgement?purpose=${applicationAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
              : `/${appPath}/acknowledgement?purpose=${applicationAction}&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
              this.props.setRoute(acknowledgementUrl);
        }
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Please fill comment",
            labelKey: "BPA_REMARKS_LABEL"
          },
          "info"
        );
      }
    }

    return (
      <div>
        <Grid
          container="true"
          spacing={12}
          marginTop={16}
          className="action-container"
        >
          <Grid
            style={{
              alignItems: "center",
              display: "flex"
            }}
            item
            sm={10}
          >
            <Typography component="h2" variant="subheading">
              {/* <LabelContainer {...dialogHeader} /> */}
            </Typography>
          </Grid>
          <Grid
            item
            sm={2}
            style={{
              textAlign: "right",
              cursor: "pointer",
              position: "absolute",
              right: "16px",
              top: "16px"
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </Grid>
          <Grid item sm="12">
            <TextFieldContainer
              InputLabelProps={{ shrink: true }}
              label={fieldConfig.comments.label}
              required
              error={error}
              helperText={errorMessage}
              onChange={e =>
                handleFieldChange(`BPA.workflow.comments`, e.target.value)
              }
              jsonPath={`BPA.workflow.comments`}
              placeholder={fieldConfig.comments.placeholder}
            />
          </Grid>
          <Grid item sm="12">
            <Typography
              component="h3"
              variant="subheading"
              style={{
                color: "rgba(0, 0, 0, 0.8700000047683716)",
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                marginBottom: "8px"
              }}
            >
              <div className="rainmaker-displayInline">
                <LabelContainer
                  labelName="Supporting Documents"
                  labelKey="WF_APPROVAL_UPLOAD_HEAD"
                />
                 {/* {isDocRequired && (
                    <span style={{ marginLeft: 5, color: "red" }}>*</span>
                  )} */}
              </div>
            </Typography>
            <div
              style={{
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: "Roboto",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px"
              }}
            >
              <LabelContainer
                labelName="Only .jpg and .pdf files. 5MB max file size."
                labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
              />
            </div>
            <UploadMultipleFiles
              maxFiles={4}
              inputProps={{
                accept: "image/*, .pdf, .png, .jpeg"
              }}
              buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "BPA_UPLOAD_FILES_BUTTON" }}
              jsonPath={`BPA.workflow.varificationDocuments`}
              maxFileSize={5000}
            />
            <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
              <Button
                variant={"contained"}
                color={"primary"}
                style={{
                  minWidth: "200px",
                  height: "48px"
                }}
                className="bottom-button"
                onClick={(e) => updateTheApplication(`BPA`, e)}
              >
                <LabelContainer
                  labelName={"send to architect"}
                  labelKey={`BPA_${applicationAction}_BUTTON`}
                />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ( state, ownprops ) => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const applicationAction = ownprops.applicationAction;
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  const applicationProcessInstances = get(
    screenConfiguration.preparedFinalObject,
    "applicationProcessInstances"
  );
  const applicationProps = screenConfiguration;
  return {applicationProps, moduleName, bpaDetails, applicationAction, applicationProcessInstances };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
      toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
      setRoute: route => dispatch(setRoute(route)),
      handleField: value => dispatch(
        handleField(
          "search-preview", 
          "components.div.children.sendToArchPickerDialog", 
          "props.open", false))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActionDialog)
);

