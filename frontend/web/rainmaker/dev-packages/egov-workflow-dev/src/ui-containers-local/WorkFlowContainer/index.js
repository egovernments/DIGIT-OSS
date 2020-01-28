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
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
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
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    if (moduleName === "NewTL") {
      if (getQueryArg(window.location.href, "edited")) {
        const removedDocs = get(
          preparedFinalObject,
          "LicensesTemp[0].removedDocs",
          []
        );
        if (data[0] && data[0].commencementDate) {
          data[0].commencementDate = convertDateToEpoch(
            data[0].commencementDate,
            "dayend"
          );
        }
        let owners = get(data[0], "tradeLicenseDetail.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "tradeLicenseDetail.owners", owners);
        set(data[0], "tradeLicenseDetail.applicationDocuments", [
          ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
          ...removedDocs
        ]);

        // Accessories issue fix by Gyan
        let accessories = get(data[0], "tradeLicenseDetail.accessories");
        let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
        set(
          data[0],
          "tradeLicenseDetail.tradeUnits",
          getMultiUnits(tradeUnits)
        );
        set(
          data[0],
          "tradeLicenseDetail.accessories",
          getMultiUnits(accessories)
        );
      }
    }
    if(dataPath === "BPA") {
      data.assignees = [];
      if(data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid : assigne
          });
        });
      }
      if(data.wfDocuments) {
        for(let i = 0; i < data.wfDocuments.length; i++) {
          data.wfDocuments[i].fileStore = data.wfDocuments[i].fileStoreId
      }
      }
    }
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    try {
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });

      this.setState({
        open: false
      });

      if (payload) {
        let path = "";
        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        window.location.href = `acknowledgement?${this.getPurposeString(
          label
        )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;
      }
    } catch (e) {
      if(moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow update error!",
            labelKey: "ERR_WF_UPDATE_ERROR"
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = get(preparedFinalObject, dataPath, []);
    
    if (dataPath !== "BPA") {
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = dataPath === "FireNOCs" ? "fireNOCDetails." : "";
    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      const documents = get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");

    if (moduleName === "NewTL") {
      switch (action) {
        case "PAY":
          return `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
        case "EDIT":
          return isAlreadyEdited
            ? `/tradelicence/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
            : `/tradelicence/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
      }
    } else if (moduleName === "FIRENOC") {
      switch (action) {
        case "PAY":
          return `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
        case "EDIT":
          return isAlreadyEdited
            ? `/fire-noc/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
            : `/fire-noc/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
      }
    } else if (moduleName === "BPA") {
      const { ProcessInstances } = this.props;
      let applicationStatus;
      if ( ProcessInstances && ProcessInstances.length > 0 ) {
          applicationStatus = get( ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus" );
      }
      switch (action) {
        case "PAY":
          let bservice = ((applicationStatus =="PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" :"BPA.NC_SAN_FEE");
          return `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}&businessService=${bservice}`;
        case "EDIT":
          return isAlreadyEdited
            ? `/egov-bpa/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
            : `/egov-bpa/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
      }
    }
  };

  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
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
    return roles.toString();
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.isTerminateState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
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
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };

  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];
    
      filteredActions = get(data[data.length - 1], "nextActions", []).filter(
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
        buttonUrl: getRedirectUrl(item.action, businessId, moduleName),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: !checkIfTerminatedState(item.nextState, moduleName) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, moduleName),
        isDocRequired: checkIfDocumentRequired(item.nextState, moduleName)
      };
    });
    actions=actions.filter(item=>item.buttonLabel!=='INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      moduleName
    );
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
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);

      let showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      
      if(dataPath === "BPA"){
        showFooter = true;
      }

    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} />
        )}
       {showFooter&& 
        <Footer
          handleFieldChange={prepareFinalObject}
          variant={"contained"}
          color={"primary"}
          onDialogButtonClick={this.createWorkFLow}
          contractData={workflowContract}
          dataPath={dataPath}
          moduleName={moduleName}
        />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
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
