import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { generateCitizenReciept } from "../utils/recieptPdf";
import {download} from "egov-common/ui-utils/commons"
import { getSearchResults } from "../../../../ui-utils/commons";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const fetchAndGenerate = async (dispatch, receiptNo, tenantId) => {
  const queryObj = [
    {
      key: "receiptNumbers",
      value: receiptNo
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  const response = await getSearchResults(queryObj);
  if (response && response.Payments && response.Payments.length) {
    dispatch(prepareFinalObject("receiptSearchResponse", response));
    const receiptQueryString = [
      { key: "receiptNumbers", value:  receiptNo},
      { key: "tenantId", value: tenantId }
    ]
    download(receiptQueryString);
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "No receipt found !",
          labelKey: "UC_CITIZEN_NO_RECEIPT_FOUND"
        },
        "error"
      )
    );
  }
};

const ucViewReceipt = {
  uiFramework: "material-ui",
  name: "viewReceiptFromSMS",
  beforeInitScreen: (action, state, dispatch) => {
    // const mobileNo = getQueryArg(window.location.href, "mobileNo");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const receiptNo = getQueryArg(window.location.href, "receiptNo");
    fetchAndGenerate(dispatch, receiptNo, tenantId);

    return action;
  },
  components: {
    div: {}
  }
};

export default ucViewReceipt;
