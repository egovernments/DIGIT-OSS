
import { getAcknowledgementCard } from "egov-ui-framework/ui-containers/acknowledgementResource/acknowledgementUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, ifUserRoleExists } from "egov-ui-framework/ui-utils/commons";
import { generateNOCAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateNOCAcknowledgement";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResults } from "../../../../ui-utils/commons";
import generatePdf from "../utils/receiptPdf";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import "./index.css";
import { prepareDocumentsView } from "./search-preview";

const downloadprintMenuConfig = (state, dispatch, purpose) => {

  let preparedFinalObject = get(
    state,
    "screenConfiguration.preparedFinalObject", {});
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      generateNOCAcknowledgement(preparedFinalObject, `noc-acknowledgement-${get(preparedFinalObject, 'FireNOCs[0].fireNOCDetails.applicationNumber', '')}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      generateNOCAcknowledgement(preparedFinalObject, 'print');
    },
    leftIcon: "assignment"
  };
  let certificateDownloadObject = {
    label: { labelName: "Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      generatePdf(state, dispatch, "certificate_download");
    },
    leftIcon: "assignment"
  };
  let certificatePrintObject = {
    label: { labelName: "Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      generatePdf(state, dispatch, "certificate_print");
    },
    leftIcon: "assignment"
  };

  let downloadMenu = [];
  let printMenu = [];
  switch (purpose) {
    case "apply":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "approve":
      downloadMenu = [certificateDownloadObject];
      printMenu = [certificatePrintObject];
      break;
    default:
      downloadMenu = false;
      printMenu = false;
      break;

  }

  return { downloadMenu, printMenu }

}


const setApplicationData = async (dispatch, applicationNumber, tenant,state) => {
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
  prepareDocumentsView(state, dispatch);
};

const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/fire-noc/home"
    : "/inbox";
  return redirectionURL;
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-containers",
      componentPath: "AcknowledgementContainer",
      props: {
        className: "common-div-css",
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
    const { downloadMenu, printMenu } = downloadprintMenuConfig(state, dispatch, purpose);

    const appName =
      process.env.REACT_APP_NAME === "Citizen"
        ? "citizen"
        : "employee";

    

    const footerUrlConfig = [{

      url: getRedirectionURL(),
      labelName: "NOC_COMMON_BUTTON_HOME",
      labelKey: "NOC_COMMON_BUTTON_HOME",
      style: {
        minWidth: "180px",
        height: "48px"
      }
    }]

    if (purpose === "apply" && status === "success") {
      footerUrlConfig.push({
        url:  `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=FIRENOC` ,
        labelName: "NOC_PROCEED_PAYMENT",
        labelKey: "NOC_PROCEED_PAYMENT",
        style: {
          minWidth: "180px",
          height: "48px",
          color: "#fff",
          backgroundColor: " #FE7A51"
        }
      })
    }
    if (purpose === "pay" && status === "failure") {
      footerUrlConfig.push({
        url: `/fire-noc/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}`,
        labelName: "NOC_PAYMENT_RETRY",
        labelKey: "NOC_PAYMENT_RETRY",
        style: {
          minWidth: "180px",
          height: "48px",
          color: "#fff",
          backgroundColor: " #FE7A51"
        }
      })
    }

    loadPdfGenerationData(applicationNumber, tenant);
    const config = {
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,
      moduleName: "Fire Noc",
      footerUrlConfig,
      downloadMenu,
      printMenu
    }
    const data = getAcknowledgementCard(config);
    setApplicationData(dispatch, applicationNumber, tenant,state);
    set(action, "screenConfig.components.div.props", data);
    return action;
  }
};

export default screenConfig;
