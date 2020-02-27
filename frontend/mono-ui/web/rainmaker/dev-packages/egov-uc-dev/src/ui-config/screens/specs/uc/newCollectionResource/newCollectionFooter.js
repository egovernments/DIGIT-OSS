import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { convertDateToEpoch } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { ifUserRoleExists } from "../../utils";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonPayUrl } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";

const tenantId = getTenantId();
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("EMPLOYEE") ? "/uc/pay" : "/inbox";
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const newCollectionFooter = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "NEXT",
        labelKey: "UC_BUTTON_NEXT"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        processDemand(state, dispatch);
      }
    }
  }
});

const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(get(finalObj, jsonPath));
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

const processDemand = async (state, dispatch) => {
  const isFormValid = validateFields(
    "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "newCollection"
  );
  if (isFormValid) {
    try {
      const mobileNumber = get(
        state.screenConfiguration.preparedFinalObject,
        "Demands[0].mobileNumber"
      );
      let payload = await httpRequest(
        "post",
        `/user/_search?tenantId=${commonConfig.tenantId}`,
        "_search",
        [],
        {
          tenantId: commonConfig.tenantId,
          userName: mobileNumber
        }
      );
      if (payload ) {
        const uuid = get(payload , "user[0].uuid");
        dispatch(prepareFinalObject("Demands[0].payer.uuid" , uuid));
        await createDemand(state, dispatch);
        allDateToEpoch(state.screenConfiguration.preparedFinalObject, [
          "Demands[0].taxPeriodFrom",
          "Demands[0].taxPeriodTo"
        ]);
        const applicationNumber = get(
          state.screenConfiguration.preparedFinalObject,
          "Demands[0].consumerCode"
        );
        const tenantId = get(
          state.screenConfiguration.preparedFinalObject,
          "Demands[0].tenantId"
        );
        getCommonPayUrl(dispatch, applicationNumber, tenantId);
      }
    } catch (error) {}
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields.",
          labelKey: "UC_REQUIRED_FIELDS_ERROR_MSG"
        },
        "info"
      )
    );
  }
};

const createDemand = async (state, dispatch) => {
  let demands = JSON.parse(
    JSON.stringify(
      get(state.screenConfiguration.preparedFinalObject, "Demands")
    )
  );
// Making payer object as null if it is empty object, later will changge in component.
if(Object.keys(demands[0].payer).length === 0) {
  demands[0].payer = null;
}
  set(demands[0], "consumerType", demands[0].businessService);
  demands[0].demandDetails &&
    demands[0].demandDetails.forEach(item => {
      if (!item.taxAmount) {
        item.taxAmount = 0;
      }
    });
  demands[0].serviceType &&
    set(demands[0], "businessService", demands[0].serviceType);
  set(
    demands[0],
    "taxPeriodFrom",
    convertDateToEpoch(demands[0].taxPeriodFrom)
  );
  set(demands[0], "taxPeriodTo", convertDateToEpoch(demands[0].taxPeriodTo));
  const mobileNumber = demands[0].mobileNumber;
  const consumerName = demands[0].consumerName;
  //Check if tax period fall between the tax periods coming from MDMS -- Not required as of now
  const taxPeriodValid = isTaxPeriodValid(dispatch, demands[0], state);

  if (taxPeriodValid) {
    const url = get(
      state.screenConfiguration.preparedFinalObject,
      "Demands[0].id",
      null
    )
      ? "/billing-service/demand/_update"
      : "/billing-service/demand/_create";
    try {
      const payload = await httpRequest("post", url, "", [], {
        Demands: demands
      });
      if (payload.Demands.length > 0) {
        //const consumerCode = get(payload, "Demands[0].consumerCode");
        const businessService = get(payload, "Demands[0].businessService");
        set(payload, "Demands[0].mobileNumber", mobileNumber);
        set(payload, "Demands[0].consumerName", consumerName);
        set(payload, "Demands[0].serviceType", businessService);
        set(
          payload,
          "Demands[0].businessService",
          businessService.split(".")[0]
        );
        dispatch(prepareFinalObject("Demands", payload.Demands));
        //await generateBill(consumerCode, tenantId, businessService, dispatch);
      } else {
        alert("Empty response!!");
      }
    } catch (e) {
      console.log(e.message);
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: e.message,
            labelKey: e.message
          },
          "error"
        )
      );
    }
  }
};

const generateBill = async (
  consumerCode,
  tenantId,
  businessService,
  dispatch
) => {
  try {
    const payload = await httpRequest(
      "post",
      `/billing-service/bill/_generate?consumerCode=${consumerCode}&businessService=${businessService}&tenantId=${tenantId}`,
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
      dispatch(
        prepareFinalObject("applyScreenMdmsData.consumerCode", consumerCode)
      );
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.businessService",
          businessService
        )
      );
      dispatch(setRoute(`/uc/pay?tenantId=${tenantId}`));
    }
  } catch (e) {
    console.log(e);
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

const isTaxPeriodValid = (dispatch, demand, state) => {
  const taxPeriods = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.BillingService.TaxPeriod",
    []
  );
  const selectedFrom = new Date(demand.taxPeriodFrom);
  const selectedTo = new Date(demand.taxPeriodTo);
  if (selectedFrom <= selectedTo) {
    return true;
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select the right tax period",
          labelKey: "UC_NEW_COLLECTION_WRONG_TAX_PERIOD_MSG"
        },
        "warning"
      )
    );
    return false;
  }

  //Validation against MDMS Tax periods not required as of now.
  let found =
    taxPeriods.length > 0 &&
    taxPeriods.find(item => {
      const fromDate = new Date(item.fromDate);
      const toDate = new Date(item.toDate);
      return (
        item.service === demand.businessService &&
        fromDate <= selectedFrom &&
        toDate >= selectedTo
      );
    });
  if (found) return true;
  else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select the right tax period",
          labelKey: "UC_NEW_COLLECTION_WRONG_TAX_PERIOD_MSG"
        },
        "warning"
      )
    );
    return false;
  }
};
