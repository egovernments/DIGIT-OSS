import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { cash, demandDraft, cheque, card } from "./payment-methods";
import get from "lodash/get";

const tabs= [
  {
    code : "CASH",
    tabButton: "COMMON_CASH",    
    tabIcon: "Dashboard",
    tabContent: { cash }
  },
  {
    code : "CHEQUE",
    tabButton: "COMMON_CHEQUE",
    tabIcon: "Schedule",
    tabContent: { cheque }
  },
  {
    code : "DD",
    tabButton: "COMMON_DD",
    tabIcon: "Schedule",
    tabContent: { demandDraft }
  },
  {
    code : "CARD",
    tabButton: "COMMON_CREDIT_DEBIT_CARD",
    tabIcon: "Schedule",
    tabContent: { card }
  }
]


export const capturePaymentDetails = (state) =>{
  const businessServiceDetails = get(state.screenConfiguration.preparedFinalObject , "businessServiceInfo");
  console.log("======>",businessServiceDetails)
  const instrumentsAllowed = tabs.filter(item => item.code !== get(businessServiceDetails , "collectionModesNotAllowed[0]"))
  console.log("========>",instrumentsAllowed)
  return getCommonGrayCard({
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
        tabs : [...instrumentsAllowed]
      },
      type: "array"
    }
  });
}

// export default capturePaymentDetails;
