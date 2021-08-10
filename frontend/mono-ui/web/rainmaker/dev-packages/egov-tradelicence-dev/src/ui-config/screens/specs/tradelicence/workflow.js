import {
  getStepperObject,
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getCommonParagraph
} from "egov-ui-framework/ui-config/screens/specs/utils";

import get from "lodash/get";
import set from "lodash/set";

import {
  commonTransform,
  objectToDropdown,
  getCurrentFinancialYear,
  getAllDataFromBillingSlab
} from "../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { footer } from "./applyResource/footer";
import { tradeReviewDetails } from "./applyResource/tradeReviewDetails";
import { tradeDetails } from "./applyResource/tradeDetails";
import { tradeLocationDetails } from "./applyResource/tradeLocationDetails";
import { tradeOwnerDetails } from "./applyResource/tradeOwnerDetails";
import { documentList } from "./applyResource/documentList";
import { httpRequest } from "../../../../ui-utils";
import {
  updatePFOforSearchResults,
  getBoundaryData
} from "../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";

export const stepsData = [
  { labelName: "Trade Details", labelKey: "TL_COMMON_TR_DETAILS" },
  { labelName: "Owner Details", labelKey: "TL_COMMON_OWN_DETAILS" },
  { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
  { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);
// export const queryValue = getQueryArg(
//   window.location.href,
//   "applicationNumber"
// );

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply for New Trade License (${getCurrentFinancialYear()})`,
    labelKey: "TL_COMMON_APPL_NEW_LICe"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const tradeDocumentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "TL_NEW-UPLOAD-DOCS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "TL_NEW-UPLOAD-DOCS_SUBHEADER"
  }),
  documentList
});

export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "TradeType", filter: `[?(@.type == "TL")]` },
            { name: "AccessoriesCategory" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "StructureType" },
            { name: "OwnerType" },
            { name: "OwnerShipCategory" },
            { name: "DocumentType" },
            { name: "UOM" }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    set(
      payload,
      "MdmsRes.TradeLicense.MdmsTradeType",
      get(payload, "MdmsRes.TradeLicense.TradeType", [])
    );
    payload = commonTransform(payload, "MdmsRes.TradeLicense.TradeType");
    payload = commonTransform(
      payload,
      "MdmsRes.common-masters.OwnerShipCategory"
    );
    set(
      payload,
      "MdmsRes.common-masters.OwnerShipCategoryTransformed",
      objectToDropdown(
        get(payload, "MdmsRes.common-masters.OwnerShipCategory", [])
      )
    );
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  const queryValue = getQueryArg(window.location.href, "applicationNumber");
  await getMdmsData(action, state, dispatch);
  await getAllDataFromBillingSlab(getTenantId(), dispatch);

  if (queryValue) {
    await updatePFOforSearchResults(action, state, dispatch, queryValue);
  } else {
    //hardcoding license type to permanent
    dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
    dispatch(prepareFinalObject("LicensesTemp", []));
  }
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    tradeReviewDetails
  },
  visible: false
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
    dispatch(prepareFinalObject("LicensesTemp", []));
    // getData(action, state, dispatch);
    getData(action, state, dispatch).then(responseAction => {
      const tenantId = getTenantId();
      const queryObj = [{ key: "tenantId", value: tenantId }];
      getBoundaryData(action, state, dispatch, queryObj);
      let props = get(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
        {}
      );
      props.value = tenantId;
      props.disabled = true;
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
        props
      );
      dispatch(
        prepareFinalObject(
          "Licenses[0].tradeLicenseDetail.address.city",
          tenantId
        )
      );
      //hardcoding license type to permanent
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicenseType.props.value",
        "PERMANENT"
      );
    });

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
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer"
        }
      }
    }
  }
};

export default screenConfig;
