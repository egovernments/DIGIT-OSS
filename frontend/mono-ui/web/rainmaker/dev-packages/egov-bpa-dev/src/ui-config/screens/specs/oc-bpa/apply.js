import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareDocumentsUploadData,
  getAppSearchResults,
  createUpdateOCBpaApplication,
  prepareNOCUploadData,
  getNocSearchResults
} from "../../../../ui-utils/commons";

import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage,
  getFileUrlFromAPI,
  getTransformedLocale,
  orderWfProcessInstances
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import get from "lodash/get";
import jp from "jsonpath";
import {
  basicDetails,
  buildingPlanScrutinyDetails,
  proposedBuildingDetails,
  abstractProposedBuildingDetails
} from "./applyResource/scrutinyDetails";
import { documentAndNocDetails } from './applyResource/documentAndNocDetails';
import { summaryDetails } from "./summary";
import { footer, showRisktypeWarning } from "./applyResource/footer";
import {
  getBpaMdmsData,
  getOcEdcrDetails,
  getTodaysDateInYYYMMDD,
  edcrDetailsToBpaDetails,
  setProposedBuildingData,
  applicantNameAppliedByMaping
} from "../utils";
import { changeStep } from "./applyResource/footer";
import { edcrHttpRequest, httpRequest } from "../../../../ui-utils/api";
import { comparisondialog } from "./comparisondialog";
import { nocDetailsApply } from "../egov-bpa/noc";
import { prepareNocFinalCards } from "../utils";

export const stepsData = [
  { labelName: "Scrutiny Details", labelKey: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER" },
  { labelName: "Document and NOC details", labelKey: "BPA_STEPPER_DOCUMENT_NOC_DETAILS_HEADER" },
  { labelName: "Application Summary", labelKey: "BPA_STEPPER_SUMMARY_HEADER" }
];

export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Occupancy Certificate New Building Construction`,
    labelKey: "BPA_APPLY_FOR_BUILDING_PERMIT_OC_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    basicDetails,
    buildingPlanScrutinyDetails,
    proposedBuildingDetails,
    abstractProposedBuildingDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentAndNocDetails,
    nocDetailsApply
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    summaryDetails,
    nocDetailsApply
  },
  visible: false
};

const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            },
            {
              name: "OwnerType"
            }
          ]
        },
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping"
            },
            {
              name: "ApplicationType"
            },
            {
              name: "ServiceType"
            },
            {
              name: "RiskTypeComputation"
            },
            {
              name: "OccupancyType"
            },
            {
              name: "SubOccupancyType"
            },
            {
              name: "DeviationParams"
            }
          ]
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping"
            },
          ]
        }
      ]
    }
  };
  let payload = await getBpaMdmsData(action, state, dispatch, mdmsBody);
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  let applicationType = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.ApplicationType[1].code"
  );
  dispatch(prepareFinalObject("BPA.applicationType", applicationType));
  await prepareDocumentsUploadData(state, dispatch);

};

const procedToNextStep = async (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialog", "props.open", !toggle)
  );
  var isFormValid = await createUpdateOCBpaApplication(state, dispatch, "INITIATE");
  if(isFormValid) {
    prepareDocumentsUploadData(state, dispatch);
    changeStep(state, dispatch, "", 1);
  }
  let applicationNumber = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA.applicationNo"
  );
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "BPA.tenantId"
  );
  const payload = await getNocSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "sourceRefId", value: applicationNumber }
  ], state);
  dispatch(prepareFinalObject("Noc", payload.Noc)); 
  await prepareNOCUploadData(state, dispatch);
  prepareNocFinalCards(state, dispatch);
}

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId, action
) => {
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  
  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + get(response, "BPA[0].edcrNumber") + "&tenantId=" + tenantId,
    "search", []
    );

  dispatch(prepareFinalObject(`ocScrutinyDetails`, edcrRes.edcrDetail[0] ));
  dispatch(prepareFinalObject("BPAs.appdate", get(response, "BPA[0].auditDetails.createdTime")));
  await setProposedBuildingData(state, dispatch, "ocApply", "ocApply");
  await edcrDetailsToBpaDetails(state, dispatch);
  await applicantNameAppliedByMaping(state, dispatch, get(response, "BPA[0]"), get(edcrRes, "edcrDetail[0]"));
  await prepareDocumentsUploadData(state, dispatch);
  await prepareDocumentDetailsUploadRedux(state, dispatch);
};

export const prepareDocumentDetailsUploadRedux = async (state, dispatch) => {
  let docs = get (state.screenConfiguration.preparedFinalObject, "documentsContract");
  let bpaDocs = [];
  if (docs && docs.length > 0) {
    docs.forEach(section => {
      section.cards.forEach(doc => {
        let docObj = {};
        docObj.documentType = section.code;
        docObj.documentCode = doc.code;
        if(uploadedDocs && uploadedDocs.length > 0) {
          docObj.isDocumentRequired = false;
        }
        else {
          docObj.isDocumentRequired = doc.required;          
        }
        docObj.isDocumentTypeRequired = doc.required;
        bpaDocs.push(docObj);
      })
    });
  }
  
  let bpaDetails = get (state.screenConfiguration.preparedFinalObject, "BPA");
  let uploadedDocs = bpaDetails.documents;
  
  if(uploadedDocs && uploadedDocs.length > 0) {
    let fileStoreIds = jp.query(uploadedDocs, "$.*.fileStoreId");
    let fileUrls = fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    uploadedDocs.forEach(upDoc => {
      bpaDocs.forEach((bpaDoc,index) => {
        let bpaDetailsDoc;
        if(upDoc.documentType) bpaDetailsDoc = (upDoc.documentType).split('.')[0]+"."+(upDoc.documentType).split('.')[1];
        if(bpaDetailsDoc == bpaDoc.documentCode) {
          let url = (fileUrls && fileUrls[upDoc.fileStoreId] && fileUrls[upDoc.fileStoreId].split(",")[0]) || "";
          let name = (fileUrls[upDoc.fileStoreId] && 
            decodeURIComponent(
              fileUrls[upDoc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
          bpaDoc.dropDownValues = {};
          bpaDoc.dropDownValues.value =  upDoc.documentType;
          if(bpaDoc.documents ){
            bpaDoc.documents.push(
              {
                title: getTransformedLocale(bpaDoc.dropDownValues.value),
                dropDownValues : bpaDoc.dropDownValues.value,    
                name: name,
                linkText: "View",
                fileName : name,
                fileStoreId : upDoc.fileStoreId,
                fileUrl : url,
                wfState: upDoc.wfState ,
                isClickable:false,
                additionalDetails: upDoc.additionalDetails                                
              }
            );
          }else{
            bpaDoc.documents = [
              {
                title: getTransformedLocale(bpaDoc.dropDownValues.value),
                dropDownValues : bpaDoc.dropDownValues.value,             
                name: name,
                linkText: "View",
                fileName : name,
                fileStoreId : upDoc.fileStoreId,
                fileUrl : url,
                wfState: upDoc.wfState,
                isClickable:false,
                additionalDetails: upDoc.additionalDetails                                 
              }
            ];
          }
        }
      })
    })
    let previewStoreIds = jp.query(bpaDocs, "$..[*].*.fileStoreId");
    let previewFileUrls = previewStoreIds.length > 0 ? await getFileUrlFromAPI(previewStoreIds) : {};
      
    bpaDocs.forEach(doc => {

      if (doc.documents && doc.documents.length > 0) {
          doc.documents.forEach(docDetail =>{
            docDetail["link"] = fileUrls[docDetail.fileStoreId];
            return docDetail;
          });
      }
    });
    dispatch(prepareFinalObject("documentDetailsUploadRedux", bpaDocs));
  }
}

const setTaskStatus = async(state,applicationNumber,tenantId,dispatch,componentJsonpath)=>{
  const queryObject = [
    { key: "businessIds", value: applicationNumber },
    { key: "history", value: true },
    { key: "tenantId", value: tenantId }
  ];
  let processInstances =[];
    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    if (payload && payload.ProcessInstances.length > 0) {
      processInstances= orderWfProcessInstances(
        payload.ProcessInstances
      );      
      dispatch(prepareFinalObject("BPAs.taskStatusProcessInstances",processInstances));
      
      let sendToArchitect = (processInstances && processInstances.length>1 && processInstances[processInstances.length-1].action)||"";
      
      if(sendToArchitect =="SEND_TO_ARCHITECT"){
        dispatch(handleField("apply", 'components.div.children.taskStatus', "visible", true));
      }
     
    }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch, componentJsonpath) => {
    dispatch(prepareFinalObject("BPA", {}));
    dispatch(prepareFinalObject("documentsContract", []));
    dispatch(prepareFinalObject("documentDetailsUploadRedux", {}));
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
    set(state, "screenConfiguration.moduleName", "BPA");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    getMdmsData(action, state, dispatch);

    if (applicationNumber) {
      setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    } else {
      const edcrNumber = getQueryArg(window.location.href, "edcrNumber");
      if(edcrNumber) {
        dispatch(prepareFinalObject("BPA.edcrNumber", edcrNumber));
        getOcEdcrDetails(state, dispatch)
      }
      const today = getTodaysDateInYYYMMDD();
      dispatch(prepareFinalObject("BPAs.appdate", today));
    }

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "BPA_OC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    setTaskStatus(state,applicationNumber,tenantId,dispatch,componentJsonpath);

    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep",
        "formwizardThirdStep"
      ];
      for (let i = 0; i < 3; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        taskStatus: {
          moduleName: "egov-workflow",
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",          
          visible: false,
          componentJsonpath:'components.div.children.taskStatus',
          props: {
            dataPath: "BPA",
            moduleName: "BPA",
            updateUrl: "/bpa-services/v1/bpa/_update"
          }
          },
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        footer
      }
    },
    cityPickerDialog :{
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
          },
          children: {
            popup: getCommonContainer({
              header: getCommonHeader({
                labelName: "The Risk type in permit order XXXX is high where as the risk type in occupancy is Low , do you want to continue",
                labelKey: "BPA_RISK_TYPE_VALIDATION_WARNING"
              }),
              riskTypeWarning: getCommonContainer({
                div: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  children: {
                    selectButton: {
                      componentPath: "Button",
                      props: {
                        variant: "contained",
                        color: "primary",
                        style: {
                          width: "40px",
                          height: "20px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "YES",
                          labelKey: "BPA_ADD_HOC_CHARGES_POPUP_BUTTON_YES"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: procedToNextStep
                      }
                    },
                    cancelButton: {
                      componentPath: "Button",
                      props: {
                        variant: "outlined",
                        color: "primary",
                        style: {
                          width: "40px",
                          height: "20px",
                          marginRight: "4px",
                          marginTop: "16px"
                        }
                      },
                      children: {
                        previousButtonLabel: getLabel({
                          labelName: "NO",
                          labelKey: "BPA_ADD_HOC_CHARGES_POPUP_BUTTON_NO"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: showRisktypeWarning
                      }
                    }
                  }
                }
              })
            })
          }
        }
      }
    },
    cityPickerDialogofComparison :{
      componentPath: "Dialog",
      props: {
        open: false,
       // maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          // props: {
          //   classes: {
          //     root: "city-picker-dialog-style"
          //   }
          // },
          children: {
            popup: comparisondialog
          }
        }
      }
    },
  }
};

export default screenConfig;
