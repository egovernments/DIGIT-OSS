import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getSelectField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getScrutinyDetails } from "../utils";
import { footer, showApplyLicencePicker } from "./applyResource/footer";
import { basicDetails } from "./applyResource/basicDetails";
import { bpaLocationDetails } from "./applyResource/propertyLocationDetails";
import {
  buildingPlanScrutinyDetails,
  blockWiseOccupancyAndUsageDetails,
  demolitiondetails,
  proposedBuildingDetails,
  abstractProposedBuildingDetails
} from "./applyResource/scrutinyDetails";
import { applicantDetails } from "./applyResource/applicantDetails";
import {
  detailsofplot
} from "./applyResource/boundarydetails";
import { documentDetails } from "./applyResource/documentDetails";
import { statusOfNocDetails } from "./applyResource/updateNocDetails";
import { getQueryArg, getFileUrlFromAPI, setBusinessServiceDataToLocalStorage, getTransformedLocale, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest, edcrHttpRequest } from "../../../../ui-utils/api";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  getSearchResults,
  furnishNocResponse,
  setApplicationNumberBox,
  prepareNOCUploadData,
  getAppSearchResults
} from "../../../../ui-utils/commons";
import { getTodaysDateInYYYMMDD, getTenantMdmsData, setProposedBuildingData, edcrDetailsToBpaDetails } from "../utils";
import jp from "jsonpath";
import { bpaSummaryDetails } from "../egov-bpa/summaryDetails";
import { changeStep } from "./applyResource/footer";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { nocDetailsApply } from "./noc";

export const stepsData = [
  { labelName: "Basic Details", labelKey: "BPA_STEPPER_BASIC_DETAILS_HEADER" },
  { labelName: "Scrutiny Details", labelKey: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER" },
  { labelName: "Owner Info", labelKey: "BPA_STEPPER_OWNER_INFO_HEADER" },
  { labelName: "Document and NOC details", labelKey: "BPA_STEPPER_DOCUMENT_NOC_DETAILS_HEADER" },
  { labelName: "Application Summary", labelKey: "BPA_STEPPER_SUMMARY_HEADER" }
];

export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply for building permit`,
    labelKey: "BPA_APPLY_FOR_BUILDING_PERMIT_HEADER"
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
    bpaLocationDetails,
    detailsofplot
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    buildingPlanScrutinyDetails,  
    proposedBuildingDetails,
    demolitiondetails,
    abstractProposedBuildingDetails
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
    applicantDetails
  },
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    documentDetails,
    nocDetailsApply
  },
  visible: false
};

export const formwizardFifthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    bpaSummaryDetails
  },
  visible: false
};

const getMdmsData = async (action, state, dispatch) => {
  let tenantId = tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId.value"
  ) || getTenantId();
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
            },
            {
              name: "OwnerShipCategory"
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
              name: "Usages"
            },
            {
              name: "ProposedLandUse"
            },
            {
              name: "TownPlanningScheme"
            }
          ]
        },
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "TradeType", filter: `[?(@.type == "BPA")]` }
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
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
  }
};

const getTodaysDate = async(action, state, dispatch) => {
  const today = getTodaysDateInYYYMMDD();
    dispatch(prepareFinalObject("BPAs.appdate", today));
}

const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};

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
  
  const edcrNumber = get(response, "BPA[0].edcrNumber");
  const ownershipCategory = get(response, "BPA[0].landInfo.ownershipCategory");
  const appDate = get(response, "BPA[0].auditDetails.createdTime");
  const latitude = get(response, "BPA[0].address.geoLocation.latitude");
  const longitude = get(response, "BPA[0].address.geoLocation.longitude");

  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
    "search", []
    );

  dispatch(prepareFinalObject(`scrutinyDetails`, edcrRes.edcrDetail[0] ));
  await edcrDetailsToBpaDetails(state, dispatch);

  const riskType = get (
    state.screenConfiguration.preparedFinalObject,
    "BPA.riskType"
  )
  let bpaService = "BPA";
  if(riskType === "LOW") {
    bpaService = "BPA_LOW";
  }
  const queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: bpaService }
  ];
  setBusinessServiceDataToLocalStorage(queryObject, dispatch);

  if(ownershipCategory) {
    dispatch(prepareFinalObject( "BPA.landInfo.ownerShipMajorType", ownershipCategory.split('.')[0] ));
  }
  
 if(latitude && longitude) {
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.bpaDetailsConatiner.children.tradeLocGISCoord.children.gisTextField",
      "props.value",
      `${latitude}, ${longitude}`
    )
  );
  dispatch(prepareFinalObject(
    "BPA.landInfo.address.geoLocation.latitude",
    latitude
  ));
  dispatch(prepareFinalObject(
    "BPA.landInfo.address.geoLocation.longitude",
    longitude
  ));
 }
  dispatch(prepareFinalObject("BPAs.appdate", appDate));
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

          // if(bpaDoc.documents ){
          //   bpaDoc.documents.push(
          //     {
          //       title: getTransformedLocale(bpaDoc.dropDownValues.value),               
          //       name: name,
          //       linkText: "View",
          //       fileName : name,
          //       fileStoreId : upDoc.fileStoreId,
          //       fileUrl : url,
          //       wfState: upDoc.wfState                                
          //     }
          //   );
          // }else{
          //   bpaDoc.documents = [
          //     {
          //       title: getTransformedLocale(bpaDoc.dropDownValues.value),               
          //       name: name,
          //       linkText: "View",
          //       fileName : name,
          //       fileStoreId : upDoc.fileStoreId,
          //       fileUrl : url,
          //       wfState: upDoc.wfState                                
          //     }
          //   ];
          // }
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
    // bpaDocs.forEach(doc => {

    //   if (doc.documents && doc.documents.length > 0) {
    //       doc.documents.forEach(docDetail =>{
    //         docDetail["link"] = fileUrls[docDetail.fileStoreId];
    //         return docDetail;
    //       });
    //   }
    // });
    dispatch(prepareFinalObject("documentDetailsUploadRedux", bpaDocs));
  }
}
const selectLicenceType = (state, dispatch) => {
  let value = get(
    state.screenConfiguration.preparedFinalObject , 
    "BPA.tradeType", ""
    );
  let plotArea = get(
    state.screenConfiguration.preparedFinalObject , 
    "scrutinyDetails.planDetail.plot.area"
    );
  let numOfFloors = get(
    state.screenConfiguration.preparedFinalObject , 
    "scrutinyDetails.planDetail.blocks[0].building.totalFloors"
    );
  let heighOfTheBuilding = get(
    state.screenConfiguration.preparedFinalObject , 
    "scrutinyDetails.planDetail.blocks[0].building.buildingHeight"
  )
  let tradeTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.TradeLicense.TradeType", []
    );
  let isTrue = false;
  if(value === "ENGINEER" || value === "SUPERVISOR" ) {
    tradeTypes.forEach(type =>{
      if(type.code.split('.')[0] === value) {
        if(type.restrictions) {
          if(plotArea <= type.restrictions.maxPlotArea && 
            heighOfTheBuilding < type.restrictions.maxBulidingheight && 
            numOfFloors <= type.restrictions.maxBulidingheight) {
              isTrue = true;
            } else {
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Not able to create the application for this role",
                    labelKey: "BPA_NOT_ABLE_TO_CREATE_LABEL"
                  },
                  "error"
                )
              );
            }
        }
      }
    });
  } else {
    if(value != "") {
      isTrue = true;
    } else {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Not able to create the application for this role",
            labelKey: "BPA_NOT_ABLE_TO_CREATE_LABEL"
          },
          "error"
        )
      );
    }
  }

/*if(isTrue) {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialog", "props.open", !toggle)
  );
  changeStep(state, dispatch, "", 1);
}*/
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

export const getMohallaDetails = async (state, dispatch, tenantId) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
      "_search",
      [{ key: "tenantId", value: tenantId }],
      {}
    );
    const mohallaData =
      payload &&
      payload.TenantBoundary[0] &&
      payload.TenantBoundary[0].boundary &&
      payload.TenantBoundary[0].boundary.reduce((result, item) => {
        result.push({
          ...item,
          name: `${tenantId
            .toUpperCase()
            .replace(
              /[.]/g,
              "_"
            )}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
        });
        return result;
      }, []);
    dispatch(
      prepareFinalObject(
        "mohalla.tenant.localities",
        mohallaData
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
        "props.suggestions",
        mohallaData
        // payload.TenantBoundary && payload.TenantBoundary[0].boundary
      )
    );
    const mohallaLocalePrefix = {
      moduleName: tenantId,
      masterName: "REVENUE"
    };
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
        "props.localePrefix",
        mohallaLocalePrefix
      )
    );
  } catch (e) {
  }
}
const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch,componentJsonpath) => {
   
    dispatch(prepareFinalObject("BPA", {}));
    dispatch(prepareFinalObject("documentsContract", []));
    dispatch(prepareFinalObject("documentDetailsUploadRedux", {}));
    dispatch(prepareFinalObject("BPA.OccupanciesList", []));
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "BPA");
    getTenantMdmsData(action, state, dispatch).then(response => {
      dispatch(prepareFinalObject("BPA.landInfo.address.city", tenantId));
    });

    let isEdit = true;
    if(step || step == 0) {
      isEdit = false
    }
    if (applicationNumber && isEdit) {
      setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    } else {
      const edcrNumber = getQueryArg(window.location.href, "edcrNumber");
      if(edcrNumber) {
        dispatch(prepareFinalObject("BPA.edcrNumber", edcrNumber));
        getScrutinyDetails(state, dispatch);
        getMohallaDetails(state, dispatch, tenantId);
      }
      setProposedBuildingData(state, dispatch);
      getTodaysDate(action, state, dispatch);
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: "BPA" }
      ];
      setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    }

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      // Set Dropdowns Data
      let ownershipCategory = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
        []
      );
      ownershipCategory = getFirstListFromDotSeparated(ownershipCategory);
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.DropdownsData.OwnershipCategory",
          ownershipCategory
        )
      );
    });
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
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
        "formwizardThirdStep",
        "formwizardFourthStep",
        "formwizardFifthStep"
      ];
      for (let i = 0; i < 5; i++) {
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
        formwizardFourthStep,
        formwizardFifthStep,
        footer
      }
    },
    /*cityPickerDialog :{
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
                labelName: "Select Licensee Type",
                labelKey: "BPA_SELECT_LICENSE_TYPE_LABEL"
              }),
              cityPicker: getCommonContainer({
                licenceDropdown: getSelectField({
                  label: {
                    labelName: "Licensee Type",
                    labelKey: "BPA_LICENSE_TYPE_LABEL"
                  },
                  placeholder: {
                    labelName: "Select Licensee Type",
                    labelKey: "BPA_SELECT_LICENSE_TYPE_LABEL"
                  },
                  jsonPath: "BPA.tradeType",
                  sourceJsonPath: "applyScreenMdmsData.licenceTypes",
                  required: true,
                  gridDefination: {
                    xs: 12,
                    sm: 12
                  }
                }),
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
                          labelName: "SELECT",
                          labelKey: "BPA_CITIZEN_SELECT_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: selectLicenceType
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
                          labelName: "CANCEL",
                          labelKey: "BPA_CITIZEN_CANCEL_BUTTON"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: showApplyLicencePicker
                      }
                    }
                  }
                }
              })
            })
          }
        }
      }
    },*/
  }
};

export default screenConfig;
