import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "../TaskStatusContainer";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";

const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  getPurposeString = action => {
    switch (action) {
      case "FORWARD":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
    }
  };

  tlUpdate = async label => {
    let { Licenses, toggleSnackbar, preparedFinalObject } = this.props;
    if (getQueryArg(window.location.href, "edited")) {
      const removedDocs = get(
        preparedFinalObject,
        "LicensesTemp[0].removedDocs",
        []
      );
      if (Licenses[0] && Licenses[0].commencementDate) {
        Licenses[0].commencementDate = convertDateToEpoch(
          Licenses[0].commencementDate,
          "dayend"
        );
      }
      let owners = get(Licenses[0], "tradeLicenseDetail.owners");
      owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
      set(Licenses[0], "tradeLicenseDetail.owners", owners);
      set(Licenses[0], "tradeLicenseDetail.applicationDocuments", [
        ...get(Licenses[0], "tradeLicenseDetail.applicationDocuments", []),
        ...removedDocs
      ]);
      let accessories = get(Licenses[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(Licenses[0], "tradeLicenseDetail.tradeUnits");
      set(
        Licenses[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      set(
        Licenses[0],
        "tradeLicenseDetail.accessories",
        getMultiUnits(accessories)
      );
    }
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    try {
      const payload = await httpRequest(
        "post",
        "/tl-services/v1/_update",
        "",
        [],
        {
          Licenses: Licenses
        }
      );

      this.setState({
        open: false
      });
      if (payload) {
        const licenseNumber = get(payload, "Licenses[0].licenseNumber");
        window.location.href = `acknowledgement?${this.getPurposeString(
          label
        )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;
      }
    } catch (e) {
      toggleSnackbar(
        true,
        { labelName: "TL update error!", labelKey: "ERR_TL_UPDATE_ERROR" },
        "error"
      );
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { Licenses, toggleSnackbar } = this.props;
    //setting the action to send in RequestInfo
    set(Licenses[0], "action", label);

    if (isDocRequired) {
      const documents = get(Licenses[0], "wfDocuments");
      if (documents && documents.length > 0) {
        this.tlUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.tlUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId) => {
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    switch (action) {
      case "PAY":
        return `egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}&businessService=NewTL`;
      case "EDIT":
        return isAlreadyEdited
          ? `/tradelicence/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
          : `/tradelicence/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
    }
  };

  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `TL_${action}_APPLICATION`
    };
    // switch (
    //   action
    // case "FORWARD":
    //   return {
    //     labelName: "Forward Application",
    //     labelKey: "TL_FORWARD_APPLICATION"
    //   };
    // case "MARK":
    //   return {
    //     labelName: "Mark Application",
    //     labelKey: "TL_MARK_APPLICATION"
    //   };
    // case "APPROVE":
    //   return {
    //     labelName: "Approve Application",
    //     labelKey: "TL_APPROVAL_CHECKLIST_BUTTON_APPRV_APPL"
    //   };
    // case "CANCEL":
    //   return {
    //     labelName: "Cancel Application",
    //     labelKey: "TL_WORKFLOW_CANCEL"
    //   };
    // case "SENDBACK":
    //   return {
    //     labelName: "Send Back Application",
    //     labelKey: "TL_WORKFLOW_SENDBACK"
    //   };
    // default:
    //   return {
    //     labelName: "Reject Application",
    //     labelKey: "TL_REJECTION_CHECKLIST_BUTTON_REJ_APPL"
    //   };
    // ) {
    // }
  };

  getEmployeeRoles = (nextAction, currentAction) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewTL" });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    }
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    //return [...new Set(roles)];
    return roles.toString();
  };

  checkIfTerminatedState = nextStateUUID => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewTL" });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.isTerminateState;
  };

  checkIfDocumentRequired = nextStateUUID => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewTL" });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewTL" });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: "NewTL",
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId)
      };
    }
    return editAction;
  };

  prepareWorkflowContract = data => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
    // const businessServiceData = JSON.parse(
    //   localStorageGet("businessServiceData")
    // );
    // const bu = find(businessServiceData, { businessService: "NewTL" });
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);

    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: !checkIfTerminatedState(item.nextState),
        roles: getEmployeeRoles(item.nextState, item.currentState),
        isDocRequired: checkIfDocumentRequired(item.nextState)
      };
    });
    let editAction = getActionIfEditable(applicationStatus, businessId);
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };

  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    const { createWorkFLow } = this;
    const { ProcessInstances, prepareFinalObject } = this.props;
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances);
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} />
        )}
        <Footer
          handleFieldChange={prepareFinalObject}
          variant={"contained"}
          color={"primary"}
          onDialogButtonClick={createWorkFLow}
          contractData={workflowContract}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { Licenses, workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, Licenses, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
