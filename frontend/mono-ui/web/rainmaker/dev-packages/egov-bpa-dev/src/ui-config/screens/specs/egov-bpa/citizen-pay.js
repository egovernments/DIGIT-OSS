import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getAppSearchResults } from "../../../../ui-utils/commons";
import { generateBill, getCurrentFinancialYear } from "../utils";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for BPA (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "BPA_COMMON_APPLY_BPA"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});

const fetchBill = async (state, dispatch, applicationNumber, tenantId) => {
  await generateBill(dispatch, applicationNumber, tenantId);

  let payload = get(
    state,
    "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0]"
  );

  //Collection Type Added in CS v1.1
  payload &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
        "COUNTER"
      )
    );

  if (get(payload, "totalAmount") != undefined) {
    //set amount paid as total amount from bill - destination changed in CS v1.1
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
        payload.totalAmount
      )
    );
    //set total amount in instrument
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].instrument.amount",
        payload.totalAmount
      )
    );
  }

  //Initially select instrument type as Cash
  dispatch(
    prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash")
  );

  //set tenantId
  dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

  //set tenantId in instrument
  dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));
};

const loadBpaData = async (dispatch, applicationNumber, tenantId) => {
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNos", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("BPA", get(response, "BPA", [])));
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    let applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    let tenantId = getQueryArg(window.location.href, "tenantId");
    loadBpaData(dispatch, applicationNumber, tenantId);
    fetchBill(state, dispatch, applicationNumber, tenantId);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "pay"
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
                labelName: "Payment Collection Details",
                labelKey: "BPA_PAYMENT_HEAD"
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
