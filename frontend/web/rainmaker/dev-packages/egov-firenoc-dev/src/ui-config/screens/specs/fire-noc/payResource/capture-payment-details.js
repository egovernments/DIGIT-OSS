import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { cash, demandDraft, cheque, card } from "./payment-methods";

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
    moduleName: "egov-firenoc",
    componentPath: "CustomTabContainer",
    props: {
      // horizontal: {
      //   tabsGrid: { xs: 4, sm: 2, md: 2 },
      //   contentGrid: { xs: 8, sm: 10, md: 10 }
      // },
      tabs: [
        {
          tabButton: "CASH",
          tabIcon: "Dashboard",
          tabContent: { cash }
        },
        {
          tabButton: "CHEQUE",
          tabIcon: "Schedule",
          tabContent: { cheque }
        },
        {
          tabButton: "DD",
          tabIcon: "Schedule",
          tabContent: { demandDraft }
        },
        {
          tabButton: "Credit/Debit Card",
          tabIcon: "Schedule",
          tabContent: { card }
        }
      ]
    },
    type: "array"
  }
});

export default capturePaymentDetails;
