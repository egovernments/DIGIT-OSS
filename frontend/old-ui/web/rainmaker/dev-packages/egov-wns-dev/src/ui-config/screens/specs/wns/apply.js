import {
  getStepperObject,
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getCommonParagraph,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { footer } from "./applyResource/footer";
import { getPropertyIDDetails, propertyID, propertyHeader } from "./applyResource/propertyDetails";
import { getPropertyDetails } from "./applyResource/property-locationDetails";
import { ownerDetailsHeader, getOwnerDetails, ownershipType } from "./applyResource/ownerDetails";
import { additionDetails } from "./applyResource/additionalDetails";
import { OwnerInfoCard } from "./applyResource/connectionDetails";
import { httpRequest } from "../../../../ui-utils";
import { prepareDocumentsUploadData, getSearchResultsForSewerage, getSearchResults, handleApplicationNumberDisplay, findAndReplace } from "../../../../ui-utils/commons";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common.js";
import { reviewDocuments } from "./applyResource/reviewDocuments";
import { reviewOwner } from "./applyResource/reviewOwner";
import { reviewConnectionDetails } from "./applyResource/reviewConnectionDetails";
import { togglePropertyFeilds, toggleSewerageFeilds, toggleWaterFeilds } from '../../../../ui-containers-local/CheckboxContainer/toggleFeilds';

export const stepperData = () => {
  if (process.env.REACT_APP_NAME === "Citizen") {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  } else {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_ADDN_DETAILS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  }
}
export const stepper = getStepperObject({ props: { activeStep: 0 } }, stepperData());

export const header = getCommonContainer({
  header: getCommonHeader({
    labelKey: process.env.REACT_APP_NAME === "Citizen" ? "WS_APPLY_NEW_CONNECTION_HEADER" : "WS_APPLICATION_NEW_CONNECTION_HEADER"
  }),
  applicationNumberWater: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA" },
    visible: false
  },
  applicationNumberSewerage: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA" },
    visible: false
  }
});

export const reviewConnDetails = reviewConnectionDetails();

export const reviewOwnerDetails = reviewOwner();

export const reviewDocumentDetails = reviewDocuments();


const summaryScreen = getCommonCard({
  reviewConnDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
})

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    { labelName: "Required Documents", labelKey: "WS_DOCUMENT_DETAILS_HEADER" },
    { style: { marginBottom: 18 } }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "WS_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "DocumentListContainer",
    props: {
      documents: [
        {
          name: "Identity Proof ",
          required: true,
          jsonPath: "applyScreen.documents.identityProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [{ value: "AADHAAR", label: "Aadhaar Card" }, { value: "VOTERID", label: "Voter ID Card" }, { value: "DRIVING", label: "Driving License" }]
          }
        },
        {
          name: "Address Proof",
          required: true,
          jsonPath: "applyScreen.documents.addressProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [{ value: "ELECTRICITYBILL", label: "Electricity Bill" }, { value: "DL", label: "Driving License" }, { value: "VOTERID", label: "Voter ID Card" }]
          }
        },
        {
          name: "Building Plan/ Completion Certificate",
          required: false,
          jsonPath: "applyScreen.documents.completionCertificate"
        },
        {
          name: "Electicity Bill",
          required: true,
          jsonPath: "applyScreen.documents.electricityBill"
        },
        {
          name: "Property Tax Reciept",
          required: false,
          jsonPath: "applyScreen.documents.ptReciept"
        },
        {
          name: "Plumber Report/ Drawing",
          required: true,
          jsonPath: "applyScreen.documents.plumberReport"
        }
      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "WS_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 6000
    },
    type: "array"
  }
});

export const getMdmsData = async dispatch => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
        { moduleName: "tenant", masterDetails: [{ name: "tenants" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }, { name: "RoadType" }] },
        { moduleName: "ws-services-calculation", masterDetails: [{ name: "PipeSize" }] },
        { moduleName: "ws-services-masters", masterDetails: [{ name: "Documents" }, { name: "waterSubSource" }, { name: "waterSource" }, { name: "connectionType" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    if (payload.MdmsRes['ws-services-calculation'].PipeSize !== undefined && payload.MdmsRes['ws-services-calculation'].PipeSize.length > 0) {
      let pipeSize = [];
      payload.MdmsRes['ws-services-calculation'].PipeSize.forEach(obj => pipeSize.push({ code: obj.size, name: obj.id, isActive: obj.isActive }));
      payload.MdmsRes['ws-services-calculation'].pipeSize = pipeSize;
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) { console.log(e); }
};

export const getData = async (action, state, dispatch) => {
  const applicationNo = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  await getMdmsData(dispatch);
  if (applicationNo) {
    //Edit/Update Flow ----
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNo }];
    if (getQueryArg(window.location.href, "action") === "edit") {
      handleApplicationNumberDisplay(dispatch, applicationNo)
      let payloadWater, payloadSewerage;
      if (applicationNo.includes("SW")) {
        try { payloadSewerage = await getSearchResultsForSewerage(queryObject, dispatch) } catch (error) { console.error(error); }
        dispatch(prepareFinalObject("SewerageConnection", payloadSewerage.SewerageConnections));
      } else {
        try { payloadWater = await getSearchResults(queryObject) } catch (error) { console.error(error); };
        dispatch(prepareFinalObject("WaterConnection", payloadWater.WaterConnection));
      }
      const waterConnections = payloadWater ? payloadWater.WaterConnection : []
      const sewerageConnections = payloadSewerage ? payloadSewerage.SewerageConnections : [];
      let combinedArray = waterConnections.concat(sewerageConnections);
      dispatch(prepareFinalObject("applyScreen", findAndReplace(combinedArray[0], "null", "NA")));
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
  children: { IDDetails, Details, ownerDetails, OwnerInfoCard }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form2" },
  children: { documentDetails },
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
    dispatch(prepareFinalObject("applyScreen.water", true));
    dispatch(prepareFinalObject("applyScreen.sewerage", false));
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    if (applicationNumber && getQueryArg(window.location.href, "action") === "edit") {
      togglePropertyFeilds(action, true);
      if (applicationNumber.includes("SW")) {
        dispatch(prepareFinalObject("applyScreen.water", false));
        dispatch(prepareFinalObject("applyScreen.sewerage", true));
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, true);
      } else {
        dispatch(prepareFinalObject("applyScreen.water", true));
        dispatch(prepareFinalObject("applyScreen.sewerage", false));
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, false);
      }
    } else {
      togglePropertyFeilds(action, false)
      if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.water") && get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, true);
      } else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        toggleWaterFeilds(action, false);
        toggleSewerageFeilds(action, true);
      } else {
        toggleWaterFeilds(action, true);
        toggleSewerageFeilds(action, false);
      }
    }

    const tenantId = getTenantId();
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    getData(action, state, dispatch).then(() => { });
    prepareDocumentsUploadData(state, dispatch);
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