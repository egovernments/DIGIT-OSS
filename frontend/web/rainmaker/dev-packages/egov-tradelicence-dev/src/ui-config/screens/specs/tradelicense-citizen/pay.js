import {
  getCommonContainer,
  getCommonHeader,
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer } from "../tradelicence/payResource/footer";
import estimateDetails from "../tradelicence/payResource/estimate-details";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchBill } from "../utils";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for New Trade License (2018-2019)",
    labelKey: "TL_COMMON_PAYMENT_NEW_LIC_CITIZEN"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "NewTL" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    fetchBill(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css citizen-payment-confirmation"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            paymentDetails: getCommonCard({
              header: getCommonTitle({
                labelName: "Please review your fee and proceed to payment",
                labelKey: "TL_CITIZEN_PAYMENT_HEAD"
              }),
              estimateDetails
            })
          }
        },
        footer
      }
    }
  }
};

export default screenConfig;
