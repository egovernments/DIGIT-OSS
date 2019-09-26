import {
  getCommonCard,
  getCommonHeader,
  getCommonContainer,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { propertySummary } from "./summaryResource/propertySummary";
import { applicantSummary } from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { footer } from "./summaryResource/footer";
import { taskStatus } from "./taskDetailsResource/taskStatus";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-noc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "taskDetails",
  beforeInitScreen: (action, state, dispatch) => {
    let pfo = {
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
              ...titlebar
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
        },
        body: getCommonCard({
          estimateSummary: estimateSummary,
          nocSummary: nocSummary,
          propertySummary: propertySummary,
          applicantSummary: applicantSummary,
          documentsSummary: documentsSummary
        })
        // footer: footer
      }
    }
  }
};

export default screenConfig;
