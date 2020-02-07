import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { footer } from "./applyResource/footer";
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
  handleScreenConfigurationFieldChange as handleField
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
import { getTodaysDateInYYYMMDD, getTenantMdmsData, calculationType, setProposedBuildingData } from "../utils";
import jp from "jsonpath";
import { bpaSummaryDetails } from "../egov-bpa/summaryDetails";

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
      tenantId: 'pb', //tenantId,
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
              name: "CalculationType"
            },
            {
              name: "OccupancyType"
            },
            {
              name: "SubOccupancyType"
            },
            {
              name: "Usages"
            }
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
    dispatch(prepareFinalObject("BPA.appdate", today));
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
  dispatch(prepareFinalObject("BPA.appdate", appDate));
  calculationType(state, dispatch);
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
    }
  }
};

export default screenConfig;
