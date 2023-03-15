import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { downloadWNSBillFromConsumer } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";

// const connectionNo = getQueryArg(window.location.href, "connectionNumber");
// const tenantId = getQueryArg(window.location.href, "tenantId");
// const businessService = connectionNo.includes("WS") ? "WS" : "SW";

const getRedirectionForPayment = async (state, dispatch) => {
  let connectionNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].connectionNo", "");
  if (!connectionNo) { connectionNo = getQueryArg(window.location.href, "connectionNumber") };
  let tenantId = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].tenantId", "");
  if (!tenantId) { tenantId = getQueryArg(window.location.href, "tenantId"); }
  const businessService = connectionNo.includes("WS") ? "WS" : "SW";
  let environment = "";
  if (process.env.NODE_ENV === "production") {
    environment = (process.env.REACT_APP_NAME === "Citizen") ? "citizen" : "employee"
  }
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  window.location.assign(`${origin}${environment}/egov-common/pay?consumerCode=${connectionNo}&tenantId=${tenantId}&businessService=${businessService}`);
};

const callDownloadBill = (mode) => {
  let conCode = getQueryArg(window.location.href, "connectionNumber");
  let tenantId = getQueryArg(window.location.href, "tenantId");
  const businessService = getQueryArg(window.location.href, "connectionNumber") && getQueryArg(window.location.href, "connectionNumber").includes("WS") ? "WS" : "SW";

  downloadWNSBillFromConsumer(conCode, tenantId, businessService);
  /* const val = [
    {
      key: 'consumerCode',
      value: getQueryArg(window.location.href, "connectionNumber")
    },
    { key: 'tenantId', value: tenantId },
    {
      key: "businessService", value: businessService
    }
  ]
  downloadBill(val, mode); */
}


export const viewBillFooter = getCommonApplyFooter("BOTTOM", {
  downloadButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadButton: getLabel({
        labelKey: "WS_COMMON_DOWNLOAD_BILL"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        callDownloadBill("download");
      }
    },
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      payButtonLabel: getLabel({
        labelKey: "WS_COMMON_PAY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: getRedirectionForPayment
    }
  }
});