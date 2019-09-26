import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { footer } from "./applyResource/footer";
import { nocDetails } from "./applyResource/nocDetails";
import { propertyDetails } from "./applyResource/propertyDetails";
import { propertyLocationDetails } from "./applyResource/propertyLocationDetails";
import { applicantDetails } from "./applyResource/applicantDetails";
import { documentDetails } from "./applyResource/documentDetails";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import get from "lodash/get";

export const stepsData = [
  { labelName: "NOC Details", labelKey: "NOC_COMMON_NOC_DETAILS" },
  { labelName: "Property Details", labelKey: "NOC_COMMON_PROPERTY_DETAILS" },
  { labelName: "Applicant Details", labelKey: "NOC_COMMON_APPLICANT_DETAILS" },
  { labelName: "Documents", labelKey: "NOC_COMMON_DOCUMENTS" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-noc",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Fire NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "NOC_COMMON_APPLY_NOC"
  }),
  applicationNumber: applicationNumberContainer()
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    nocDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    propertyDetails,
    propertyLocationDetails
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const step = getQueryArg(window.location.href, "step");

    let pfo = {};
    if (applicationNumber && !step) {
      pfo = {
        nocType: "Provisional",
        provisionalNocNumber: "NOC-JLD-2018-09-8786",
        buildingDetails: {
          buildingType: "Multiple Building",
          building: [
            {
              buildingName: "eGov",
              buildingUsageType: "Commercial",
              buildingUsageSubType: "Commercial",
              noOfFloors: "3",
              noOfBasements: "1",
              plotSize: "6000",
              builtupArea: "5000",
              heightOfBuilding: "200"
            },
            {
              buildingName: "Novo Pay",
              buildingUsageType: "Commercial",
              buildingUsageSubType: "Non-Commercial",
              noOfFloors: "1",
              noOfBasements: "2",
              plotSize: "6000",
              builtupArea: "3000",
              heightOfBuilding: "100"
            }
          ]
        },
        address: {
          propertyId: "PROP1234",
          doorHouseNo: "101",
          buildingName: "eGovBuilding",
          street: "Sarjapura Road",
          mohalla: "Bellandur",
          pincode: "123456",
          additionalDetail: {
            fireStation: "Sarjapur Fire Station"
          }
        },
        applicantDetails: {
          applicantType: "Multiple",
          applicant: [
            {
              mobileNo: "9167765477",
              applicantName: "Avijeet",
              applicantGender: "Male",
              applicantDob: "1991-06-28",
              applicantEmail: "avi7@egov.org",
              applicantFatherHusbandName: "A",
              applicantRelationship: "Father",
              applicantPan: "BNHSP1234K",
              applicantAddress: "Corr",
              applicantCategory: "A"
            },
            {
              mobileNo: "9100879085",
              applicantName: "Sharath",
              applicantGender: "Male",
              applicantDob: "1997-04-26",
              applicantEmail: "sharath@egov.org",
              applicantFatherHusbandName: "A",
              applicantRelationship: "Father",
              applicantPan: "ABCDE1234F",
              applicantAddress: "asd",
              applicantCategory: "A"
            }
          ]
        }
      };
      dispatch(prepareFinalObject("noc", pfo));
    }
    if (step && get(state, "screenConfiguration.preparedFinalObject")) {
      pfo = get(state, "screenConfiguration.preparedFinalObject.noc", {});
    }

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
        "formwizardFourthStep"
      ];
      for (let i = 0; i < 4; i++) {
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

    // Preset multi-cards
    if (get(pfo, "buildingDetails.buildingType") === "Multiple Building") {
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer.props.style",
        {}
      );
    }
    if (get(pfo, "nocType") === "Provisional") {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber.props.style",
        { visibility: "hidden" }
      );
    }
    if (get(pfo, "applicantDetails.applicantType") === "Multiple") {
      set(
        action.screenConfig,
        "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
        {}
      );
    } else if (
      get(pfo, "applicantDetails.applicantType") === "Institutional-Private"
    ) {
      set(
        action.screenConfig,
        "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.props.style",
        {}
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantSubType.props.style",
        {}
      );
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
        footer
      }
    }
  }
};

export default screenConfig;
