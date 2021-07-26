import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { gotoHomeFooter } from "./acknowledgementResource/footers";
import './index.css';

const getLabelKey = () => {
  const service = getQueryArg(window.location.href, "service");
  if(service == "WATER") {
    return "WS_COMMON_WATER_BILL_HEADER";
  } else {
    return "WS_COMMON_SEWERAGE_BILL_HEADER"
  }
}

const getHeader = (applicationNumber) => {
  return getCommonContainer({
    header: getCommonHeader({
      labelName: ``,
      labelKey: getLabelKey()
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-abg",
      componentPath: "ApplicationContainer",
      props: {
        number: applicationNumber,
        label: {
          labelValue: "Consumber No",
          labelKey: "WS_COMMON_CONSUMER_NO_LABEL"
        }
      },
      visible: true
    }
  })
  }

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  moduleName,
  consumerNumber
) => {
  if (purpose === "apply" && status === "failure") {

    return {
      header: getHeader(consumerNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Bill Cancellation Failed",
              labelKey: "ABG_BILLCANCELLATION_FAILED__MESSAGE_HEAD"
            },
            body: {
              labelName: "A notification regarding bill has been sent to consumer at registered Mobile No.",
              labelKey: "ABG_BILLCANCELLATION_FAILED__MESSAGE_SUB_HEAD"
            },
          })
        }
      },
      gotoHomeFooter
    };
  }
  else if (purpose === "apply" && status === "success") {
    return {
      header: getHeader(consumerNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Bill Cancellation Sucessfully",
              labelKey: "ABG_BILLCANCELLATION_SUCESS_MESSAGE_HEAD"
            },
            body: {
              labelName: "A notification regarding bill has been sent to consumer at registered Mobile No.",
              labelKey: "ABG_BILLCANCELLATION_FAILED__MESSAGE_SUB_HEAD"
            },
            tailText: {
              labelName: "Bill No.",
              labelKey: "PAYMENT_BILL_NO"
            },
            number: applicationNumber
          }),
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
    const applicationNumber = getQueryArg(window.location.href, "billNo");
    const moduleName = getQueryArg(window.location.href, "moduleName");
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const consumerNumber = getQueryArg(window.location.href, "consumerNumber");

    const service = getQueryArg(window.location.href, "service");
    if (service == "SEWERAGE") {
      set(
        action.screenConfig,
        "components.div.children.header.children.header.children.key.props.labelKey",
        "WS_COMMON_SEWERAGE_BILL_HEADER"
      );
    } else {
      set(
        action.screenConfig,
        "components.div.children.header.children.header.children.key.props.labelKey",
        "WS_COMMON_WATER_BILL_HEADER"
      );
    }

    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant, 
      moduleName,
      consumerNumber
    );

    set(action, "screenConfig.components.div.children", data);
    // Hiding edit section

    return action;
  }
};
export default screenConfig;
