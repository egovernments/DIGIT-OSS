import { payeeDetails } from "egov-common/ui-containers-local/CustomTabContainer/payment-methods";
import {
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";


const capturePayerDetails = getCommonGrayCard({
  header: getCommonSubHeader({
    labelName: "Payer Information",
    labelKey: "PAY_PAYER_DETAILS"
  }),
  payerDetailsCardContainer: payeeDetails
});

export default capturePayerDetails;
