import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
// import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Fire NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "NOC_COMMON_APPLY_FIRE_NOC_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-noc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    },
    visible: true
  }
});

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "apply" && status === "success") {
    loadPdfGenerationData(applicationNumber, tenant);
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "NOC_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  } else if (purpose === "pay" && status === "success") {
    loadPdfGenerationData(applicationNumber, tenant);
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Payment has been collected successfully!",
              labelKey: "NOC_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Payment Collection has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_PAYMENT_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "NOC_PMT_RCPT_NO"
            },
            number: secondNumber
          })
        }
      },
      paymentSuccessFooter: paymentSuccessFooter()
    };
  } else if (purpose === "approve" && status === "success") {
    loadPdfGenerationData(applicationNumber, tenant);
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Fire NOC Approved Successfully",
              labelKey: "NOC_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Fire NOC Approval has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Fire NOC No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_NOC_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Fire NOC Application Rejected",
              labelKey: "NOC_APPROVAL_REJ_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Fire NOC Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_APPROVAL_REJ_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Fire NOC Cancelled",
              labelKey: "Fire_NOC_CANCELLED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Fire NOC cancellation has been sent to building owner at registered Mobile No.",
              labelKey: "Fire_NOC_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Fire NOC No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_NOC_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "NOC_PAYMENT_FAILURE_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the building owner and applicant.",
              labelKey: "NOC_PAYMENT_FAILURE_MESSAGE_SUB"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  } else if (purpose === "mark" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Marked Successfully",
              labelKey: "NOC_MARK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "NOC_APPLICATION_MARKED_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "forward" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "NOC_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "NOC_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "sendback" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application sent back Successfully",
              labelKey: "NOC_SENDBACK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been sent back successfully",
              labelKey: "NOC_APPLICATION_SENDBACK_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "refer" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application referred Successfully",
              labelKey: "NOC_REFER_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been referred successfully",
              labelKey: "NOC_APPLICATION_REFER_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const setApplicationData = async (dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  const response = await getSearchResults(queryObject);
  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));
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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant
    );
    setApplicationData(dispatch, applicationNumber, tenant);
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
