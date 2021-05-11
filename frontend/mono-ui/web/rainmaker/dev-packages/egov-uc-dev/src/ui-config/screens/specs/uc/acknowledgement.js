import {
  getCommonContainer, getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import { getSearchResults } from "../../../../ui-utils/commons";
import { downloadEchallan, printEchallan } from "../utils";
import {
  acknowledgementFailureFooter, acknowledgementSuccesFooter
} from "./acknowledgementResource/acknowledgementFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import './index.css';
;
const header = getCommonHeader({
  labelName: `mCollect`,
  labelKey: "ACTION_TEST_UNIVERSAL_COLLECTION",
});



const downloadprintMenu = (state, dispatch, applicationNumber, tenantId) => {
  let applicationDownloadObject = {
    label: { labelName: "Challan", labelKey: "UC_CHALLAN" },
    link: () => {
      //const { Challan } = state.screenConfiguration.preparedFinalObject;
      const Challan = [
        { key: "challanNo", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ]
      downloadEchallan(Challan, `CHALLAN-${applicationNumber}.pdf`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Challan", labelKey: "UC_CHALLAN" },
    link: () => {

      const Challan = [
        { key: "challanNo", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ]
      printEchallan(Challan);
    },
    leftIcon: "assignment"
  };
  let downloadMenu = [];
  let printMenu = [];
  downloadMenu = [applicationDownloadObject];
  printMenu = [applicationPrintObject];


  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    visible: !JSON.parse(window.localStorage.getItem('isPOSmachine')),

    props: {
      className: "downloadprint-commonmenu",
      style: { textAlign: "right", display: "flex", paddingTop: "10px" }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: {
              variant: "outlined",
              style: {
                height: "60px", color: "#FE7A51",
                marginRight: "5px"
              },
              className: "uc-download-button"
            },
            menu: downloadMenu
          }
        }
      },
      printMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "PRINT", labelKey: "TL_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: {
              variant: "outlined",
              style: { height: "60px", color: "#FE7A51" },
              className: "uc-print-button"
            },
            menu: printMenu
          }
        }
      }

    },
  }

}

const consumerCode = (challanNumber) => {
  return {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-common",
    componentPath: "ApplicationNoContainer",
    props: {
      number: challanNumber,
      label: {
        labelKey: "PAYMENT_UC_CONSUMER_CODE",
      },
    }
  }
}
/*icon- success/failure icon Tick/Cross
* color-background color of icon Green/Red
* headerKey,headername - message header display localization code
* bodyKey,bodyname - message body display localization code
* billNumber - bill number related to challan for cancel and failure bill number will be null
*/
const applicationSuccessNotificationCard = (icon, color, headerkey, headername, bodykey, bodyname, billNumber) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
      card: acknowledgementCard({
        icon: icon,
        backgroundColor: color,
        header: {
          labelName: headername,
          labelKey: headerkey
        },
        body: {
          labelName: bodyname,
          labelKey: bodykey
        },
        tailText: {
          labelName: "Bill No.",
          labelKey: "UC_BILL_NO_LABEL"
        },
        number: billNumber
      })
    }
  }
}

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  billNumber,
  challanNumber,
  tenantId

) => {
  if (purpose === "challan" && status === "success") {
    return {
      header: getCommonContainer({
        header: header,
        consumerCode: consumerCode(challanNumber),
      }),
      headerdownloadprint: downloadprintMenu(state, dispatch, challanNumber, tenantId),
      applicationSuccessCard: applicationSuccessNotificationCard("done", "#39CB74", "UC_BILL_GENERATED_SUCCESS_MESSAGE", "create", "UC_BILL_GENERATION_MESSAGE_SUB", "createsuccessmsg", billNumber),

      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: acknowledgementSuccesFooter
    };
  }
  else if (purpose === "update" && status === "success") {
    return {
      header: getCommonContainer({
        header: header,
        consumerCode: consumerCode(challanNumber),
      }),
      headerdownloadprint: downloadprintMenu(state, dispatch, challanNumber, tenantId),
      applicationSuccessCard: applicationSuccessNotificationCard("done", "#39CB74", "UC_BILL_UPDATED_SUCCESS_MESSAGE", "update", "UC_BILL_GENERATION_MESSAGE_SUB", "updatesuccessmsg", billNumber),

      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: acknowledgementSuccesFooter
    };
  }
  else if (purpose === "cancel" && status === "success") {
    return {
      header: getCommonContainer({
        header: header,
        consumerCode: consumerCode(challanNumber),
      }),
      headerdownloadprint: downloadprintMenu(state, dispatch, challanNumber, tenantId),
      applicationSuccessCard: applicationSuccessNotificationCard("done", "#39CB74", "UC_BILL_CANCELLED_SUCCESS_MESSAGE", "cancel", "UC_BILL_GENERATION_MESSAGE_SUB", "cancelmsg", null),

      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      paymentFailureFooter: acknowledgementFailureFooter
    }
  }
  // else if (purpose === "challan" && status === "failure") {
  //   return{
  //     header :getCommonContainer({
  //       header:header        
  //     }),
  //     applicationSuccessCard:applicationSuccessNotificationCard("close","#E54D42","UC_FAILURE_MESSAGE","failure","UC_FAILURE_MESSAGE_BODY","failuremsg",null),

  //      iframeForPdf: {
  //        uiFramework: "custom-atoms",
  //        componentPath: "Div"
  //      },
  //      paymentFailureFooter: acknowledgementFailureFooter
  //    }   
  // }

  //For all kinds of failures irrespective of create/update/cancel
  else {
    return {
      header: getCommonContainer({
        header: header
      }),
      applicationSuccessCard: applicationSuccessNotificationCard("close", "#E54D42", "UC_FAILURE_MESSAGE", "failure", "UC_FAILURE_MESSAGE_BODY", "failuremsg", null),

      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      paymentFailureFooter: acknowledgementFailureFooter
    }


  }

};

const getSearchData = async (dispatch, queryObj) => {
  const response = await getSearchResults(queryObj);
  response &&
    response.Receipt &&
    response.Receipt.length > 0 &&
    dispatch(
      prepareFinalObject("receiptSearchResponse.Receipt", response.Receipt)
    );
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
    const billNumber = getQueryArg(window.location.href, "billNumber");
    const challanNumber = getQueryArg(window.location.href, "challanNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const businessService = getQueryArg(window.location.href, "serviceCategory");

    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      billNumber,
      challanNumber,
      tenantId
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;