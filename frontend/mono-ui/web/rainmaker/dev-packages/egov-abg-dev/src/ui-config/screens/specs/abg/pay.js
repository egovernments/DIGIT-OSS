import {
  getCommonCard,
  getCommonHeader,
  getCommonContainer,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { billDetails } from "./payResource/billDetails";
import { amountToBePaid } from "./payResource/amount";
import { capturePayment } from "./payResource/capturePayment";
import { G8ReceiptDetails } from "./payResource/G8ReceiptDetails";
import { footer } from "./payResource/footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

const getAllData = async (state, dispatch, billId, tenantId) => {
  await searchBill(state, dispatch, billId, tenantId);
};

const searchBill = async (state, dispatch, billId, tenantId) => {
  try {
    const payload = await httpRequest(
      "post",
      `/billing-service/bill/_search?billId=${billId}&tenantId=${tenantId}`,
      "",
      [],
      {}
    );
    if (payload && payload.Bill[0]) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
      const estimateData = createEstimateData(payload.Bill[0]);
      estimateData &&
        estimateData.length &&
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.estimateCardData",
            estimateData
          )
        );

      const amount = get(
        state.screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].totalAmount",
        null
      );
      dispatch(
        prepareFinalObject("ReceiptTemp[0].instrument", {
          amount: amount,
          instrumentType: { name: "Cash" },
          tenantId: tenantId
        })
      );
      dispatch(
        prepareFinalObject(
          "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
          "COUNTER"
        )
      );
      dispatch(
        prepareFinalObject(
          "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
          amount
        )
      );
      dispatch(
        prepareFinalObject(
          "ReceiptTemp[0].Bill[0].billDetails[0].amountPaid",
          amount
        )
      );
      dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));
    }
  } catch (e) {
  }
};

const createEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  return fees;
};

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Universal Bill",
    labelKey: "ABG_UNIVERSAL_BILL_COMMON_HEADER"
  }),
  billNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-abg",
    componentPath: "BillNoContainer",
    props: {
      number: getQueryArg(window.location.href, "billNumber")
    }
  }
});

const generateBill = async (
  dispatch,
  consumerCode,
  tenantId,
  businessService
) => {
  try {
    const payload = await httpRequest(
      "post",
      `/billing-service/bill/_search?consumerCode=${consumerCode}&service=${businessService}&tenantId=${tenantId}`,
      "",
      [],
      {}
    );
    let billId = get(payload, "Bill", []).length - 1;
    if (payload && payload.Bill[billId]) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
      const estimateData = createEstimateData(payload.Bill[billId]);
      estimateData &&
        estimateData.length &&
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.estimateCardData",
            estimateData
          )
        );
      dispatch(
        prepareFinalObject("applyScreenMdmsData.consumerCode", consumerCode)
      );
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.businessService",
          businessService
        )
      );
      // dispatch(setRoute(`/uc/pay?tenantId=${tenantId}`));
    }
  } catch (e) {
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    const billId = getQueryArg(window.location.href, "billId");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    getAllData(state, dispatch, billId, tenantId);

    // if (applicationNumber)
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
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
        body: getCommonCard({
          billDetails: billDetails,
          amount: amountToBePaid,
          capturePayment: capturePayment,
          G8ReceiptDetails: G8ReceiptDetails
          // breakAfterCard: getBreak()
        }),
        footer: footer
      }
    }
  }
};

export default screenConfig;
