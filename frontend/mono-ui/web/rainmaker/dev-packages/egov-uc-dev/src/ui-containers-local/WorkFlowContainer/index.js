import { convertDateToEpoch } from "./node_modules/egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "./node_modules/egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, toggleSpinner } from "./node_modules/egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "./node_modules/egov-ui-framework/ui-utils/api";
import { addWflowFileUrl, getMultiUnits, getQueryArg, orderWfProcessInstances } from "./node_modules/egov-ui-framework/ui-utils/commons";
import { getUserInfo, localStorageGet } from "./node_modules/egov-ui-kit/utils/localStorageUtils";
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
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated"
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      toggleSpinner,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      beforeSubmitHook
    } = this.props;

    //Added toggleSpinner for Search
    toggleSpinner();
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
      if(get(data, "workflow.comment")) {
        data.workflow.comments = get(data, "workflow.comment");
      }
    }
    if (dataPath == 'Property') {
      if (data.workflow && data.workflow.wfDocuments) {
        data.workflow.documents = data.workflow.wfDocuments;
      }
    }

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      data = data[0];
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          })
        })
      }
      data.processInstance = {
        documents: data.wfDocuments,
        assignes: data.assignees,
        comment: data.comment,
        action: data.action
      }
      data.waterSource = data.waterSource + "." + data.waterSubSource;
    }

    if (moduleName === "NewSW1") {
      dataPath = "SewerageConnection";
    }

    
    try {     
      if (beforeSubmitHook) {
        data = beforeSubmitHook(data);
      }
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });    
      this.setState({
        open: false
      });

      if (payload) {
        let path = "";

        if (moduleName == "PT.CREATE") {
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

        
        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        // window.location.href = `acknowledgement?${this.getPurposeString(
        //   label
        // )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`;
       
        this.props.setRoute(
          `/tradelicence/acknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`
        ); 
        if (moduleName === "NewWS1" || moduleName === "NewSW1") {
          window.location.href = `acknowledgement?${this.getPurposeString(label)}&applicationNumber=${applicationNumber}&tenantId=${tenant}`;
        }

      }
      toggleSpinner();
    } catch (e) {
      toggleSpinner();
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
      if( dataPath === "BPA") {
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
      const { Licenses } = preparedFinalObject;
      const status = Licenses[0].status;
    
      switch(status){
        case "FIELDINSPECTION":
          const tradeSubType = get(
            preparedFinalObject,
            `Licenses[0].tradeLicenseDetail.additionalDetail.tradeSubType`,
            //"screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.additionalDetail.tradeSubType",
            []
          );
          if (tradeSubType == null ||tradeSubType == "")  {
            toggleSnackbar(
              true,
              { labelName: "Please fill all mandatory fields !", labelKey: "COMMON_MANDATORY_MISSING_ERROR" },
              "error"
            );
          }
          else {
          this.wfUpdate(label);
          }
          break;
        case "PENDINGAPPROVAL":
         const  cbrnDate = get(
            preparedFinalObject,
            `Licenses[0].tradeLicenseDetail.additionalDetail.cbrnDate`,
            // "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.additionalDetail.cbrnDate",
            []
          );
         const cbrnNumber = get(
            preparedFinalObject,
            `Licenses[0].tradeLicenseDetail.additionalDetail.cbrnNumber`,
            // "screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail.additionalDetail.cbrnNumber",
            []
          );
          if (cbrnDate == null || cbrnNumber == null||cbrnDate == ""|| cbrnNumber == "") {
            toggleSnackbar(
              true,
              { labelName: "Please fill all mandatory fields !", labelKey: "COMMON_MANDATORY_MISSING_ERROR" },
              "error"
            );
          }
         else if(cbrnNumber.length>50){
            toggleSnackbar(
              true,
              { labelName: "CBR Number should be of length less than 50", labelKey: "COMMON_MANDATORY_MISSING_ERROR"},
              "error"
            );
          }
          
          else {
          this.wfUpdate(label);
          }
          break;
          default :
          this.wfUpdate(label);

      }
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let baseUrl = "";
    let bservice = "";
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
    } else if (moduleName === "NewWS1" || moduleName === "NewSW1") {
      baseUrl = "wns"
      if (moduleName === "NewWS1") {
        bservice = "WS.ONE_TIME_FEE"
      } else {
        bservice = "SW.ONE_TIME_FEE"
      }
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.MUTATION") {
      bservice = "PT.MUTATION"
    } else {
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "tradelicense-citizen" : "tradelicence";
      bservice = "TL"
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
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
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    // const nextState = data && data.length > 0 find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? find(data.states, { uuid: nextStateUUID }).isTerminateState : false;
    return isLastState;
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
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
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
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: (businessService === "NewWS1" || businessService === "NewSW1") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
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
    // if (moduleName === 'NewWS1' || moduleName === 'NewSW1') {
    //   showFooter = true;
    // } else if (moduleName == "PT.CREATE") {
    //   showFooter = true;
    // } else if (moduleName == "ASMT") {
    //   showFooter = true;
    // } else if (moduleName == "PT.MUTATION") {
    //   showFooter = true;
    // } else {
    //   showFooter = process.env.REACT_APP_NAME === "Citizen" ? true : true;
    // }
    if (moduleName === 'BPA' || moduleName === 'BPA_LOW' || moduleName === 'BPA_OC') {
      showFooter = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName}/>
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
    toggleSpinner: () =>
      dispatch(toggleSpinner()),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
