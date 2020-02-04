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
import { commonTransform, objectToDropdown, getCurrentFinancialYear, getAllDataFromBillingSlab, getCheckbox } from "../utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { footer } from "./applyResource/footer";
import { connectionDetails } from "./applyResource/tradeReviewDetails";
// import { tradeDetails } from "./applyResource/tradeDetails";
// import { tradeLocationDetails } from "./applyResource/tradeLocationDetails";
// import { connectionDetails } from "./applyResource/connectionDetails";
import { getPropertyIDDetails, propertyID, propertyHeader } from "./applyResource/propertyDetails";
import { getPropertyDetails } from "./applyResource/property-locationDetails";
import { ownerDetailsHeader, getOwnerDetails, ownershipType } from "./applyResource/ownerDetails";
import { additionDetails } from "./applyResource/additionalDetails";
import { tradeOwnerDetails } from "./applyResource/tradeOwnerDetails";
import { OwnerInfoCard } from "./applyResource/connectionDetails";
import { documentList } from "./applyResource/documentList";
import { summaryScreen } from "./search-preview";
import { httpRequest } from "../../../../ui-utils";
import { updatePFOforSearchResults, getBoundaryData } from "../../../../ui-utils/commons";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common.js";

export const stepsData = [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_ADDN_DETAILS" }, { labelKey: "WS_COMMON_SUMMARY" }];
export const stepper = getStepperObject({ props: { activeStep: 0 } }, stepsData);

export const header = getCommonContainer({
  header:
    getQueryArg(window.location.href, "action") !== "edit"
      ? getCommonHeader({
        // labelKey: `WS_APPLY_NEW_CONNECTION_HEADER ${process.env.REACT_APP_NAME === "Citizen" ? "(" + getCurrentFinancialYear() + ")" : ""}`,
        // dynamicArray: [getCurrentFinancialYear()],
        labelKey: process.env.REACT_APP_NAME === "Citizen" ? "WS_APPLY_NEW_CONNECTION_HEADER" : "WS_APPLICATION_NEW_CONNECTION_HEADER"
      })
      :
      {},
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA" },
    visible: false
  }
});

export const tradeDocumentDetails = getCommonCard({
  header: getCommonTitle(
    { labelName: "Required Documents", labelKey: "TL_NEW-UPLOAD-DOCS_HEADER" },
    { style: { marginBottom: 18 } }
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
        { moduleName: "egov-wns", masterDetails: [{ name: "TradeType" }, { name: "AccessoriesCategory" }, { name: "ApplicationType" }] },
        { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }, { name: "DocumentType" }, { name: "UOM" }] },
        { moduleName: "tenant", masterDetails: [{ name: "tenants" }] },
        { moduleName: "egf-master", masterDetails: [{ name: "FinancialYear" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    set(payload, "MdmsRes.TradeLicense.MdmsTradeType", get(payload, "MdmsRes.TradeLicense.TradeType", []));
    payload = commonTransform(payload, "MdmsRes.TradeLicense.TradeType");
    payload = commonTransform(payload, "MdmsRes.common-masters.OwnerShipCategory");
    set(payload, "MdmsRes.common-masters.OwnerShipCategoryTransformed", objectToDropdown(get(payload, "MdmsRes.common-masters.OwnerShipCategory", [])));
    const localities = get(state.screenConfiguration, "preparedFinalObject.applyScreenMdmsData.tenant.localities", []);
    if (localities && localities.length > 0) { payload.MdmsRes.tenant.localities = localities; }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    let financialYearData = get(payload, "MdmsRes.egf-master.FinancialYear", []).filter(item => item.module === "TL" && item.active === true);
    set(payload, "MdmsRes.egf-master.FinancialYear", financialYearData);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  const queryValue = getQueryArg(window.location.href, "applicationNumber");
  const applicationNo = queryValue
    ? queryValue
    : get(state.screenConfiguration.preparedFinalObject, "Licenses[0].oldLicenseNumber", null);
  await getMdmsData(action, state, dispatch);
  await getAllDataFromBillingSlab(getTenantId(), dispatch);

  if (applicationNo) {
    //Edit/Update Flow ----
    const applicationType = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType", null);
    getQueryArg(window.location.href, "action") !== "edit" && dispatch(prepareFinalObject("Licenses",
      [{
        licenseType: "PERMANENT",
        oldLicenseNumber: queryValue ? "" : applicationNo,
        tradeLicenseDetail: { additionalDetail: { applicationType: applicationType ? applicationType : "NEW" } }
      }])
    );
    await updatePFOforSearchResults(action, state, dispatch, applicationNo);
    if (!queryValue) {
      const oldApplicationNo = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].applicationNumber", null);
      dispatch(prepareFinalObject("Licenses[0].oldLicenseNumber", oldApplicationNo));
      if (oldApplicationNo !== null) {
        dispatch(prepareFinalObject("Licenses[0].financialYear", ""));
        dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.additionalDetail.applicationType", "APPLICATIONTYPE.RENEWAL"));
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.financialYear",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.applicationType",
            "props.value",
            "APPLICATIONTYPE.RENEWAL"
          )
        );
      }

      dispatch(prepareFinalObject("Licenses[0].applicationNumber", ""));
      dispatch(
        handleField(
          "apply",
          "components.div.children.headerDiv.children.header.children.applicationNumber",
          "visible",
          false
        )
      );
    }
  }
};
const propertyDetail = getPropertyDetails();
const propertyIDDetails = getPropertyIDDetails();
const ownerDetail = getOwnerDetails();
export const ownerDetails = getCommonCard({ ownerDetailsHeader, ownershipType, ownerDetail });
export const IDDetails = getCommonCard({ propertyHeader, propertyID, propertyIDDetails });
export const Details = getCommonCard({ propertyDetail });

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form1" },
  children: {
    IDDetails,
    Details,
    ownerDetails,
    OwnerInfoCard,
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form2" },
  children: { tradeDocumentDetails },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form3" },
  children: { additionDetails },
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form4" },
  children: { summaryScreen },
  visible: false
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    const tenantId = getTenantId();
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    getData(action, state, dispatch).then(responseAction => {
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
      dispatch(prepareFinalObject("Licenses[0].tradeLicenseDetail.address.city", tenantId));
      const mohallaLocalePrefix = { moduleName: tenantId, masterName: "REVENUE" };
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla.props.localePrefix",
        mohallaLocalePrefix
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
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: { header: { gridDefination: { xs: 12, sm: 10 }, ...header } }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: { open: false, maxWidth: "md", screenKey: "apply" }
    }
  }
};

export default screenConfig;
