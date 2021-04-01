import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  gotoHomeFooter,
  approvalSuccessFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";

const getNOCHeader=(applicationNumber)=>{
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Application for Noc`,
      labelKey: "NOC_COMMON_HEADER_LABEL"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      },
      visible: true
    }
  })
  }

const getAcknowledgementCard = (
  action,
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  businessService,
  moduleName
) => {  
  if (purpose === "approve" && status === "success") {
    return {
      header:getNOCHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "NOC Approved Successfully",
              labelKey: "NOC_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Approval has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      header:getNOCHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for NOC is rejected",
              labelKey: "NOC_BPA_APPROVAL_REJECTED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_BPA_APPROVAL_REJE_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "voided") {
    return {
      header:getNOCHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for NOC is voided",
              labelKey: "NOC_APPROVAL_VOIDED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_APPROVAL_VOIDED_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(window.location.href,"consumerCode") || getQueryArg(window.location.href,"applicationNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const secondNumber = getQueryArg(window.location.href, "receiptNumber");
    const businessService = getQueryArg(window.location.href, "businessService");
    const moduleName = getQueryArg(window.location.href, "moduleName");
    const data = getAcknowledgementCard(
      action,
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,
      businessService,
      moduleName
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
