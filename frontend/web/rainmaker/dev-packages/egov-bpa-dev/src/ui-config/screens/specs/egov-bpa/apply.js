import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getSelectField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { footer, showApplyLicencePicker } from "./applyResource/footer";
import { basicDetails } from "./applyResource/basicDetails";
import { bpaLocationDetails } from "./applyResource/propertyLocationDetails";
import {
  buildingPlanScrutinyDetails,
  blockWiseOccupancyAndUsageDetails,
  demolitiondetails,
  proposedBuildingDetails
} from "./applyResource/scrutinyDetails";
import { applicantDetails } from "./applyResource/applicantDetails";
import {
  detailsofplot
} from "./applyResource/boundarydetails";
import { documentDetails } from "./applyResource/documentDetails";
import { statusOfNocDetails } from "./applyResource/updateNocDetails";
import { getQueryArg, getFileUrlFromAPI, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
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
import { getTodaysDateInYYYMMDD, getTenantMdmsData, setProposedBuildingData } from "../utils";
import jp from "jsonpath";
import { bpaSummaryDetails } from "../egov-bpa/summaryDetails";
import { changeStep } from "./applyResource/footer";

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
    labelName: `Apply for building permit (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: ""
  }),
  //applicationNumber: applicationNumberContainer()
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
    blockWiseOccupancyAndUsageDetails,
    demolitiondetails,
    proposedBuildingDetails
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
    documentDetails
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
      tenantId: getTenantId(), //tenantId,
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
    console.log(e);
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
    { key: "applicationNos", value: applicationNumber }
  ]);

  const edcrNumber = response.Bpa["0"].edcrNumber;
  const ownershipCategory = response.Bpa["0"].ownershipCategory;
  const appDate = response.Bpa["0"].auditDetails.createdTime;
  const latitude = response.Bpa["0"].address.geoLocation.latitude;
  const longitude = response.Bpa["0"].address.geoLocation.longitude;
  
  dispatch(prepareFinalObject("BPA", response.Bpa[0]));
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
    "search", []
    );

  dispatch(prepareFinalObject(`scrutinyDetails`, edcrRes.edcrDetail[0] ));

  if(ownershipCategory) {
    let ownerShipMajorType =  dispatch(
      prepareFinalObject( "BPA.ownerShipMajorType", ownershipCategory.split('.')[0] ));
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
    "BPA.address.geoLocation.latitude",
    latitude
  ));
  dispatch(prepareFinalObject(
    "BPA.address.geoLocation.longitude",
    longitude
  ));
 }
  dispatch(prepareFinalObject("BPAs.appdate", appDate));
  const docs = await prepareDocumentsUploadData(state, dispatch);
  const documentDetailsUploadRedux = await prepareDocumentDetailsUploadRedux(state, dispatch);
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
        docObj.isDocumentRequired = doc.required;
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
      bpaDocs.forEach(bpaDoc => {
        let bpaDetailsDoc = (upDoc.documentType).split('.')[0]+"."+(upDoc.documentType).split('.')[1];
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
          bpaDoc.documents = [
            {
              fileName : name,
              fileStoreId : upDoc.fileStoreId,
              fileUrl : url,
              id : upDoc.id
            }
          ]
        }
      })
    })
    dispatch(prepareFinalObject("documentDetailsUploadRedux", bpaDocs));
  }
}
const selectLicenceType = (state, dispatch) => {
  let value = get(
    state.screenConfiguration.preparedFinalObject , 
    "BPA.licenceType", ""
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

if(isTrue) {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialog", "props.open", !toggle)
  );
  changeStep(state, dispatch, "", 1);
}
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "BPA");
    getTenantMdmsData(action, state, dispatch).then(response => {
      dispatch(prepareFinalObject("BPA.address.city", tenantId));
    });

    let isEdit = true;
    if(step || step == 0) {
      isEdit = false
    }
    if (applicationNumber && isEdit) {
      setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    } else {
      setProposedBuildingData(state, dispatch);
      getTodaysDate(action, state, dispatch);
    }
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "BPA" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

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
      let applicationType = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.ApplicationType[0].code"
      );
      dispatch(prepareFinalObject("BPA.applicationType", applicationType));
      // Set Documents Data (TEMP)
      // prepareDocumentsUploadData(state, dispatch);
      // prepareNOCUploadData(state, dispatch);
    });

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
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        formwizardFifthStep,
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
                  jsonPath: "BPA.licenceType",
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
                          labelKey: "TL_CITIZEN_SELECT"
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
                          labelKey: "TL_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
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
    },
  }
};

export default screenConfig;
