import {
  getCommonCard,
  getCommonHeader,
  getCommonContainer,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { propertySummary } from "./summaryResource/propertySummary";
import { applicantSummary } from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { footer } from "./summaryResource/footer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Fire NOC - Application Summary",
    labelKey: "NOC_SUMMARY_HEADER"
  })
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    // if (applicationNumber) 
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
        body: getCommonCard({
          estimateSummary: estimateSummary,
          nocSummary: nocSummary,
          propertySummary: propertySummary,
          applicantSummary: applicantSummary,
          documentsSummary: documentsSummary
        }),
        footer: footer
      }
    }
  }
};

export default screenConfig;
