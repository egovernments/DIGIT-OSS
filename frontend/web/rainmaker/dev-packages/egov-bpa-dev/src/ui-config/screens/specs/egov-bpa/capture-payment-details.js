import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { cash, demandDraft, cheque } from "./payment-methods";

const capturePaymentDetails = getCommonGrayCard({
  header: getCommonSubHeader(
    { labelName: "Capture Payment" },
    {
      style: {
        marginBottom: "8px"
      }
    }
  ),
  tabSection: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      // horizontal: {
      //   tabsGrid: { xs: 4, sm: 2, md: 2 },
      //   contentGrid: { xs: 8, sm: 10, md: 10 }
      // },
      tabs: [
        {
          tabButton: "CASH",
          tabIcon: "APPLICATION DETAILS",
          tabContent: { cash }
        },
        {
          tabButton: "CHEQUE",
          tabIcon: "DOCUMENT DETAIL",
          tabContent: { cheque }
        },
        {
          tabButton: "DD",
          tabIcon: "UPDATE NOC DETAILS",
          tabContent: { demandDraft }
        }
      ]
    },
    type: "array"
  }
});

export default capturePaymentDetails;
