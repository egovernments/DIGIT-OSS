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
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
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
import { getTodaysDateInYYYMMDD, getTenantMdmsData, calculationType } from "../utils";

export const stepsData = [
  { labelName: "Basic Details", labelKey: "" },
  { labelName: "Scrutiny Details", labelKey: "" },
  { labelName: "Owner Info", labelKey: "" },
  { labelName: "Plot & Boundary Info", labelKey: "" },
  { labelName: "Document Details", labelKey: "" },
  { labelName: "NOC Details", labelKey: "" }
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
    bpaLocationDetails
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
    detailsofplot
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
    documentDetails
  },
  visible: false
};

export const formwizardSixthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    statusOfNocDetails
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
  calculationType(state, dispatch)
};

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
      getTodaysDate(action, state, dispatch);
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
        "formwizardFifthStep",
        "formwizardSixthStep"
      ];
      for (let i = 0; i < 6; i++) {
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
        formwizardSixthStep,
        footer
      }
    }
  }
};

export default screenConfig;
