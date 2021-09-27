import { getAddress } from 'egov-billamend/ui-config/screens/specs/bill-amend/searchResources/function.js';
import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { generateBillAmendAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateBillAmendAcknowledgement";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import get from "lodash/get";
import set from "lodash/set";
import commonConfig from "../../../../config/common";
import { getBillAmendSearchResult, searchBill } from "../../../../ui-utils/commons";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { applicationSuccessFooter } from "./acknowledgementResource/applicationSuccessFooter";
import { approvalSuccessFooter } from "./acknowledgementResource/approvalSuccessFooter";
import "./index.css";
import { generateBillAmendPdf } from "./utils";

const searchResults = async (dispatch, applicationNo, tenantId, businessService) => {
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "amendmentId", value: applicationNo },
    { key: "businessService", value: businessService },
  ];
  let payload = await getBillAmendSearchResult(queryObject);

  await setDocuments(
    payload,
    "Amendments[0].documents",
    "bill-amend-review-document-data",
    dispatch, 'BILLAMEND'
  );



  let newQuery = [{
    key: "tenantId",
    value: tenantId
  },
  {
    key: "consumerCode",
    value: get(
      payload,
      "Amendments[0].consumerCode",
      ''
    )
  },
  {
    key: "businessService",
    value: businessService
  }]
  let resp = await searchBill(newQuery, dispatch);
  let connectionDetail = get(resp, 'Bill[0]', {});

  let consumerName = get(connectionDetail, "additionalDetails.ownerName", "NA");
  let consumerAddress = getAddress(get(connectionDetail, "tenantId"), get(connectionDetail, "additionalDetails.locality"));
  set(payload, 'Amendments[0].additionalDetails.ownerName', consumerName);
  set(payload, 'Amendments[0].additionalDetails.ownerAddress', consumerAddress);



  payload && dispatch(
    prepareFinalObject(
      "Amendment", get(
        payload,
        "Amendments[0]",
        {}
      )))

};

const downloadprintMenu = (state, dispatch, status) => {
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "BILL_APPLICATION" },
    link: () => {

      const { Amendment } = state.screenConfiguration.preparedFinalObject;
      generateBillAmendAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), `billamend-acknowledgement-${Amendment.amendmentId}.pdf`)
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "BILL_APPLICATION" },
    link: () => {
      const { Amendments } = state.screenConfiguration.preparedFinalObject;
      generateBillAmendAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), 'print')
    },
    leftIcon: "assignment"
  };

  let certificateDownloadObject = {
    label: { labelName: "Application", labelKey: "BILL_COUPON" },
    link: () => {

      const { Amendment } = state.screenConfiguration.preparedFinalObject;
      generateBillAmendPdf([Amendment], commonConfig.tenantId, 'download');
    },
    leftIcon: "assignment"
  };
  let certificatePrintObject = {
    label: { labelName: "Application", labelKey: "BILL_COUPON" },
    link: () => {

      const { Amendment } = state.screenConfiguration.preparedFinalObject;
      generateBillAmendPdf([Amendment], commonConfig.tenantId, 'print');
    },
    leftIcon: "assignment"
  };


  let downloadMenu = [];
  let printMenu = [];
  switch (status) {
    case 'apply':
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case 'approve':
      downloadMenu = [certificateDownloadObject];
      printMenu = [certificatePrintObject];
      break;
    default:
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
  }



  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "downloadprint-commonmenu",
      style: { textAlign: "right", display: "flex", }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "Download", labelKey: "BILL_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "tl-download-button" },
            menu: downloadMenu
          }
        }
      },
      printMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "PRINT", labelKey: "BILL_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
            menu: printMenu
          }
        }
      }

    },
  }

}
const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  businessService
) => {
  if (purpose === "apply" && status === "success") {
    searchResults(dispatch, applicationNumber, tenant, businessService);
    return {
      headerDiv: getCommonContainer({
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            headerTitle: getCommonHeader({
              labelName: `Acknowledgement for Bill Amendment`,
              labelKey: "BILL_COMMON_APPLICATION_NEW_AMENDMENT",
              dynamicArray: [],
              style: { alignSelf: "center" }
            })
          }
        },
        headerdownloadprint: downloadprintMenu(state, dispatch, 'apply'),
      }, { style: { justifyContent: "space-between" } }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "BILL_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "BILL_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BILL_APPLICATION_NUMBER"
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
  } else if (purpose === "approve" && status === "success") {
    searchResults(dispatch, applicationNumber, tenant, businessService);
    return {
      headerDiv: getCommonContainer({
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            headerTitle: getCommonHeader({
              labelName: `Acknowledgement for Bill Amendment`,
              labelKey: "BILL_COMMON_APPLICATION_NEW_AMENDMENT",
              dynamicArray: [],
              style: { alignSelf: "center" }
            })
          }
        },
        headerdownloadprint: downloadprintMenu(state, dispatch, 'approve'),
      }, { style: { justifyContent: "space-between" } }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "BILL_APPROVED_MESSAGE_HEAD"
            },
            body: {
              labelName: "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "BILL_APPROVED_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BILL_APPLICATION_NUMBER"
            },
            number: applicationNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      headerDiv: getCommonContainer({
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            headerTitle: getCommonHeader({
              labelName: `Acknowledgement for Bill Amendment`,
              labelKey: "BILL_COMMON_APPLICATION_NEW_AMENDMENT",
              dynamicArray: [],
              style: { alignSelf: "center" }
            })
          }
        },
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application is Rejected Successfully",
              labelKey: "BILL_REJECTED_MESSAGE_HEAD"
            },
            body: {
              labelName: "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "BILL_REJECTED_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BILL_APPLICATION_NUMBER"
            },
            number: applicationNumber
          })
        }
      },
      approvalSuccessFooter
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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const businessService = getQueryArg(
      window.location.href,
      "businessService"
    );

    const secondNumber = getQueryArg(window.location.href, "consumerCode");
    const tenant = getQueryArg(window.location.href, "tenantId");
    loadUlbLogo(tenant);
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,
      businessService
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;