import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";


const capturePaymentDetails = getCommonGrayCard({
  header: getCommonSubHeader(
    { labelName: "Capture Payment", labelKey: "NOC_PAYMENT_CAP_PMT" },
    {
      style: {
        marginBottom: "8px"
      }
    }
  ),
  tabSection: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-common",
    componentPath: "CustomTabContainer",
    props: {
      // tabs,
      jsonPath : "businessServiceInfo"
    },
    type: "array"
  }
});

export default capturePaymentDetails;
