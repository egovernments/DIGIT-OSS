import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { footer } from "./applyResource/footer";
import { basicDetails } from "./applyResource/basicDetails";
import {
  buildingPlanScrutinyDetails,
  blockWiseOccupancyAndUsageDetails,
  demolitiondetails,
  proposedBuildingDetails
} from "./applyResource/scrutinyDetails";
// import { propertyDetails } from "./applyResource/propertyDetails";
// import { propertyLocationDetails } from "./applyResource/propertyLocationDetails";
import { applicantDetails } from "./applyResource/applicantDetails";
import {
  boundaryDetails,
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
import { httpRequest } from "../../../../ui-utils";
import {
  sampleSearch,
  sampleSingleSearch,
  sampleDocUpload
} from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  getSearchResults,
  furnishNocResponse,
  setApplicationNumberBox,
  prepareNOCUploadData
} from "../../../../ui-utils/commons";
import { getTodaysDateInYMD } from "../utils"

//mdms mock json data
import { mdmsMockJson } from './mdmsMock';

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

// const applicationNumberContainer = () => {
//   const applicationNumber = getQueryArg(
//     window.location.href,
//     "applicationNumber"
//   );
//   if (applicationNumber)
//     return {
//       uiFramework: "custom-atoms-local",
//       moduleName: "egov-noc",
//       componentPath: "ApplicationNoContainer",
//       props: {
//         number: `${applicationNumber}`,
//         visibility: "hidden"
//       },
//       visible: true
//     };
//   else return {};
// };

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
    basicDetails
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
    boundaryDetails,
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
   // let payload = mdmsMockJson;
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const getTodaysDate = async(action, state, dispatch) => {
  const today = getTodaysDateInYMD();
    dispatch(prepareFinalObject("bpa.appdate", today));
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

export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const buildings = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
    []
  );
  if (applicationNumber && buildings.length == 0) {
    let response = await getSearchResults([
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "applicationNumber", value: applicationNumber }
    ]);
    // let response = sampleSingleSearch();

    response = furnishNocResponse(response);

    dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));
    if (applicationNumber) {
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }
    // Set no of buildings radiobutton and eventually the cards
    let noOfBuildings =
      get(response, "FireNOCs[0].fireNOCDetails.noOfBuildings", "SINGLE") ===
        "MULTIPLE"
        ? "MULTIPLE"
        : "SINGLE";
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
        "props.value",
        noOfBuildings
      )
    );

    // Set no of buildings radiobutton and eventually the cards
    let nocType =
      get(response, "FireNOCs[0].fireNOCDetails.fireNOCType", "NEW") === "NEW"
        ? "NEW"
        : "PROVISIONAL";
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
        "props.value",
        nocType
      )
    );

    // setCardsIfMultipleBuildings(state, dispatch);

    // Set sample docs upload
    // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
  }
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
    set(state, "screenConfiguration.moduleName", "bpa");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      // Set Dropdowns Data
      let buildingUsageTypeData = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.firenoc.BuildingType",
        []
      );
      buildingUsageTypeData = getFirstListFromDotSeparated(
        buildingUsageTypeData
      );
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.DropdownsData.BuildingUsageType",
          buildingUsageTypeData
        )
      );
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

      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch);
      prepareNOCUploadData(state, dispatch);
    });
    getTodaysDate(action, state, dispatch);

    // // Set Property City
    // dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.propertyDetails.address.city", getTenantId()));

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
