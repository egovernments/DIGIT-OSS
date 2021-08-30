import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { cash, demandDraft, cheque, card } from "./paymentMethod";

export const capturePayment = getCommonGrayCard({
  header: getCommonSubHeader(
    { labelName: "Capture Payment", labelKey: "TL_PAYMENT_CAP_PMT" },
    {
      style: {
        marginBottom: "8px"
      }
    }
  ),
  tabSection: {
    uiFramework: "custom-containers",
    moduleName: "egov-uc",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: { labelName: "CASH", labelKey: "TL_PAYMENT_CASH" },
          tabIcon: "Dashboard",
          tabContent: { cash }
        },
        {
          tabButton: { labelName: "CHEQUE", labelKey: "TL_PAYMENT_CHQ" },
          tabIcon: "Schedule",
          tabContent: { cheque }
        },
        {
          tabButton: { labelName: "DD", labelKey: "TL_PAYMENT_DD" },
          tabIcon: "Schedule",
          tabContent: { demandDraft }
        },
        {
          tabButton: {
            labelName: "Credit/Debit Card",
            labelKey: "TL_PAYMENT_DEBT_CARD"
          },
          tabIcon: "Schedule",
          tabContent: { card }
        }
      ]
    },
    type: "array"
  }
});

export default capturePayment;
