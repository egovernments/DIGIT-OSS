import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { download } from "../../../../ui-utils/commons";
import { generateBill, ifUserRoleExists } from "../utils";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { paymentFooter } from "./acknowledgementResource/paymentFooter";
import "./index.css";
import {postPaymentSuccess} from "egov-bnd/ui-config/screens/specs/utils";
import { getHeader } from "./pay";

const downloadprintMenu = (
  state,
  applicationNumber,
  tenantId,
  uiCommonPayConfig
) => {
  const receiptKey = get(
    uiCommonPayConfig,
    "receiptKey",
    "consolidatedreceipt"
  );
  const pdfModule = get(
    uiCommonPayConfig,
    "pdfModule",
    "PAYMENT"
  );
  let receiptDownloadObject = {
    label: {
      labelName: "DOWNLOAD RECEIPT",
      labelKey: "COMMON_DOWNLOAD_RECEIPT",
    },
    link: () => {
      const receiptQueryString = [
        { key: "receiptNumbers", value: applicationNumber },
        { key: "tenantId", value: tenantId },
        {
          key: "businessService",
          value: getQueryArg(window.location.href, "businessService"),
        },
      ];
      download(receiptQueryString, "download", receiptKey, pdfModule,state);
    },
    leftIcon: "receipt",
  };
  let receiptPrintObject = {
    label: { labelName: "PRINT RECEIPT", labelKey: "COMMON_PRINT_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "receiptNumbers", value: applicationNumber },
        { key: "tenantId", value: tenantId },
        {
          key: "businessService",
          value: getQueryArg(window.location.href, "businessService"),
        },
      ];
      download(receiptQueryString, "print", receiptKey, pdfModule,state );
    },
    leftIcon: "receipt",
  };
  let downloadMenu = [];
  let printMenu = [];
  downloadMenu = [receiptDownloadObject];
  printMenu = [receiptPrintObject];

  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "downloadprint-commonmenu",
      style: { textAlign: "right", display: "flex" },
    },
    children: {
      disabled: {
        uiFramework: "custom-atoms-local",
        componentPath: "DisabledComponent",
        moduleName: "egov-common",
      },
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
              style: { height: "60px", color: "#FE7A51", marginRight: "5px" },
              className: "tl-download-button",
            },
            menu: downloadMenu,
          },
        },
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
              className: "tl-print-button",
            },
            menu: printMenu,
          },
        },
      },
    },
  };
};
const getAcknowledgementCard = (
  state,
  dispatch,
  status,
  receiptNumber,
  consumerCode,
  tenant
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  let header = getHeader(state);
  const businessService = getQueryArg(window.location.href, "businessService");
  const transBusinessService = businessService
    ? businessService.toUpperCase().replace(/[._:-\s\/]/g, "_")
    : "DEFAULT";
  const uiCommonPayConfig = get(
    state.screenConfiguration.preparedFinalObject,
    "commonPayInfo"
  );
  if (status === "success") {
    return {
      header,
      headerdownloadprint: downloadprintMenu(
        state,
        receiptNumber,
        tenant,
        uiCommonPayConfig
      ),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelKey: roleExists
                ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE`
                : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE`,
            },
            body: {
              labelKey: roleExists
                ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`
                : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`,
            },
            tailText: {
              labelKey: roleExists
                ? `CITIZEN_SUCCESS_${transBusinessService}_PAYMENT_RECEIPT_NO`
                : `EMPLOYEE_SUCCESS_${transBusinessService}_PAYMENT_RECEIPT_NO`,
            },
            number: receiptNumber,
          }),
          linkComponent: {
            uiFramework: "custom-atoms-local",
            componentPath: "LinkComponent",
            moduleName: "egov-common",
          },
        },
      },
      paymentFooter: paymentFooter(
        state,
        consumerCode,
        tenant,
        status,
        businessService
      ),
    };
  } else if (status === "failure") {
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
              labelKey: roleExists
                ? `CITIZEN_FAILURE_${transBusinessService}_PAYMENT_MESSAGE`
                : `EMPLOYEE_FAILURE_${transBusinessService}_PAYMENT_MESSAGE`,
            },
            body: {
              labelKey: roleExists
                ? `CITIZEN_FAILURE_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`
                : `EMPLOYEE_FAILURE_${transBusinessService}_PAYMENT_MESSAGE_DETAIL`,
            },
          }),
          linkComponent: {
            uiFramework: "custom-atoms-local",
            componentPath: "LinkComponent",
            moduleName: "egov-common",
          }
        },
      },
      paymentFooter: paymentFooter(
        state,
        consumerCode,
        tenant,
        status,
        businessService
      ),
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
        className: "common-div-css",
      },
      children: {},
    },
  },
  beforeInitScreen: (action, state, dispatch) => {
    const status = getQueryArg(window.location.href, "status");
    const consumerCode = getQueryArg(window.location.href, "consumerCode");
    const receiptNumber = getQueryArg(window.location.href, "receiptNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const businessService = getQueryArg(
      window.location.href,
      "businessService"
    );
    if(businessService=="BIRTH_CERT" || businessService=="DEATH_CERT")
    {
        //Only for birth and death certificate.
        postPaymentSuccess({consumerCode:consumerCode, tenantId:tenant, businessService: businessService});
    }
    // Calling the Bill so that payer information can be set in the PDF for Citizen application
    if (process.env.REACT_APP_NAME === "Citizen") {
      if ((status == 'success'||status == 'failure') && localStorage.getItem('pay-channel')=="whatsapp" && localStorage.getItem('pay-redirectNumber')) {
        setTimeout(() => {
          const weblink = "https://api.whatsapp.com/send?phone=" + localStorage.getItem('pay-redirectNumber') + "&text=" + ``;
          window.location.href = weblink
        }, 1500)
      }
      generateBill(dispatch, consumerCode, tenant, businessService);
    }
    const data = getAcknowledgementCard(
      state,
      dispatch,
      status,
      receiptNumber,
      consumerCode,
      tenant
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  },
};

export default screenConfig;
