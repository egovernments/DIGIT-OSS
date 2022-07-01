import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { addWflowFileUrl, getMultiUnits, getQueryArg, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { Footer } from "../../ui-molecules-local";
import TaskStatusContainer from "../TaskStatusContainer";

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
      case "VERIFY":
        return "purpose=verify&status=success";
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
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "APPROVE_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated"
      case "VOID":
        return "purpose=application&status=voided"
      case "REOPEN":
        return "purpose=reopen&status=success";
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      redirectQueryString,
      beforeSubmitHook
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
    if (dataPath === "BPA") {
      data.workflow.assignes = [];
      if (data.workflow.assignee) {
        data.workflow.assignes = data.workflow.assignee
      }
      if (data.workflow && data.workflow.varificationDocuments) {
        for (let i = 0; i < data.workflow.varificationDocuments.length; i++) {
          data.workflow.varificationDocuments[i].fileStore = data.workflow.varificationDocuments[i].fileStoreId
        }
      }
      if (get(data, "workflow.comment")) {
        data.workflow.comments = get(data, "workflow.comment");
      }
    }
    if (dataPath == 'Property') {
      if (data.workflow && data.workflow.wfDocuments) {
        data.workflow.documents = data.workflow.wfDocuments;
      }
    }
    if (moduleName === "Amendment") {
      data.workflow = {};
      data.workflow.documents = get(data[0], "wfDocuments", []);
      data.workflow.comment = get(data[0], "comment", "");
      data.workflow.assignee = get(data[0], "assignee", []);
      data.workflow.action = get(data[0], "action", "");
      data.workflow.businessId = get(data, "amendmentId", "");
      data.workflow.tenantId = get(data, "tenantId", "");
      data.workflow.businessService = "BS.AMENDMENT";
      data.workflow.moduleName = "BS";
    }

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    this.props.showSpinner();
    try {
      if (beforeSubmitHook) {
        if (moduleName === "BPA" || moduleName === "BPA_OC" || moduleName === "BPA_LOW") {
          data = await beforeSubmitHook(data);
        } else {
          data = beforeSubmitHook(data);
        }
      }

      if (window.location.href.includes("wns/search-preview")) {
          if(data.roadCuttingInfo && data.roadCuttingInfo.length > 0) {
            data.roadCuttingInfo = [];
            data.roadCuttingInfo = data.roadCuttingInfos || [];
            data.roadCuttingInfos = [];
          }
      }
      if(get(preparedFinalObject, "FireNOCs[0].fireNOCDetails.action") === "SENDBACKTOCITIZEN") {
        set(data[0], 'fireNOCDetails.status', "CITIZENACTIONREQUIRED");
        set(data[0],'fireNOCDetails.additionalDetail.assignee' ,[get(preparedFinalObject, "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].uuid", "")]);
      }
      
      let payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });

      this.setState({
        open: false
      });
      payload = payload == '' ? true : payload;
      if (payload) {
        let path = "";
        this.props.hideSpinner();
        if (moduleName == "PT.CREATE" ||moduleName == "PT.UPDATE" || moduleName == "PT.LEGACY") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Properties[0].acknowldgementNumber', "")}&tenantId=${get(payload, 'Properties[0].tenantId', "")}`);
          return;
        }
        if (moduleName == "ASMT") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Assessments[0].assessmentNumber', "")}&tenantId=${get(payload, 'Assessments[0].tenantId', "")}`);
          return;
        }
        if (moduleName == 'Amendment') {
          this.props.setRoute(`acknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${get(payload, 'Amendments[0].businessService', "")}`);
          return;
        }
        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        if (redirectQueryString) {
          this.props.setRoute(`acknowledgement?${this.getPurposeString(label)}&${redirectQueryString}`);
        } else {
          this.props.setRoute(`acknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`);
        }
      }
    } catch (e) {
      this.props.hideSpinner();
      if (moduleName === "BPA") {
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
            labelName: "Please fill all the mandatory fields!",
            labelKey: e.message
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property" || dataPath === "Noc") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property" || dataPath === "BPA" || dataPath === "Noc") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }


    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      let documents = get(data, "wfDocuments");
      if (dataPath === "BPA") {
        documents = get(data, "workflow.varificationDocuments");
      }
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
    const { ProcessInstances, baseUrlTemp, bserviceTemp, preparedFinalObject } = this.props;
    const { PTApplication = {} } = preparedFinalObject;
    const { propertyId } = PTApplication;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    // needs to remove this initialization if all other module integrated this changes.
    let baseUrl = (baseUrlTemp) ? baseUrlTemp : ""
    let bservice = (bserviceTemp) ? bserviceTemp : ""

    if (moduleName === "FIRENOC") {
      baseUrl = "fire-noc";
      bservice = "FIRENOC";
    } else if (moduleName === "BPA" || moduleName === "BPA_LOW" || moduleName === "BPA_OC") {
      baseUrl = "egov-bpa";
      if (moduleName === "BPA") {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
      } else if (moduleName === "BPA_OC") {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_OC_APP_FEE" : "BPA.NC_OC_SAN_FEE");
      } else {
        bservice = "BPA.LOW_RISK_PERMIT_FEE"
      }
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.CREATE" || moduleName === "PT.UPDATE" || moduleName === "PT.LEGACY") {
      return `/property-tax/assessment-form?assessmentId=0&purpose=update&propertyId=${propertyId}&tenantId=${tenant}&mode=WORKFLOWEDIT`
    } else if (moduleName === "PT.MUTATION") {
      bservice = "PT.MUTATION";
      baseUrl = "pt-mutation";
    } else if (!baseUrl && !bservice) {
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "tradelicense-citizen" : "tradelicence";
      bservice = "TL"
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&workflowService=${moduleName}`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&workflowService=${moduleName}`;
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
          state &&
          state.actions &&
          state.actions.length > 0 && 
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = data && data.states && find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.length > 0 && 
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
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    const nextState = data && data.states && data.states.length > 0 && find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? nextState && nextState.isTerminateState : false;
    return isLastState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = data && data.states && find(data.states, { uuid: nextStateUUID });
    return nextState && nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId, moduleName, applicationState) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const state = applicationState ? data && data.states && find(data.states, { applicationStatus: status, state: applicationState }) : data && data.states && find(data.states, { applicationStatus: status });
    let actions = [];
    state &&
    state.actions &&
    state.actions.length > 0 &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    // state.isStateUpdatable = true; // Hardcoded configuration for PT mutation Edit
    if (state && state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: (this.props.editredirect) ? this.props.editredirect : this.getRedirectUrl("EDIT", businessId, moduleName)
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
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    let businessId = get(data[data.length - 1], "businessId");
    let applicationState = get(data[data.length - 1], "state.state");
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
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: process.env.REACT_APP_NAME === "Citizen"?false:(businessService === "NewWS1" || businessService === "ModifyWSConnection" || businessService === "ModifySWConnection" || businessService === "NewSW1") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "APPROVE_CONNECTION" && item.action !== "APPROVE_FOR_CONNECTION" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService,
      applicationState
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
    let showFooter = true;
    if (moduleName === 'BPA' || moduleName === 'BPA_LOW' || moduleName === 'BPA_OC') {
      showFooter = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    }
    if ((moduleName === 'Noc') && window.location.href.includes("isFromBPA=true")) {
      showFooter = false
    }

    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName} />
        )}
        {showFooter &&
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
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route)),
    showSpinner: () =>
      dispatch(showSpinner()),
    hideSpinner: () =>
      dispatch(hideSpinner())
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
