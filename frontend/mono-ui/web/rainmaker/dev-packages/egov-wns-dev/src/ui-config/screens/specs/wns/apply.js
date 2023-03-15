import commonConfig from "config/common.js";
import {
  getBreak, getCommonCard,
  getCommonContainer, getCommonHeader,



  getCommonParagraph, getCommonTitle, getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { set } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { togglePropertyFeilds, toggleSewerageFeilds, toggleWaterFeilds } from '../../../../ui-containers-local/CheckboxContainer/toggleFeilds';
import { httpRequest } from "../../../../ui-utils";
import {
  findAndReplace, getPropertyResults, getSearchResults, getSearchResultsForSewerage,
  handleApplicationNumberDisplay,
  isActiveProperty,
  isModifyMode,
  isModifyModeAction, prefillDocuments, prepareDocumentsUploadData,
  showHideFieldsFirstStep
} from "../../../../ui-utils/commons";
import { triggerModificationsDisplay } from "./../utils/index";
import { additionDetails } from "./applyResource/additionalDetails";
import { OwnerInfoCard } from "./applyResource/connectionDetails";
import { getHolderDetails, holderHeader, sameAsOwner } from "./applyResource/connectionHolder";
import { footer } from "./applyResource/footer";
import { getOwnerDetails, ownerDetailsHeader, ownershipType } from "./applyResource/ownerDetails";
import { getPropertyDetails } from "./applyResource/property-locationDetails";
import { getPropertyIDDetails, propertyHeader, propertyID } from "./applyResource/propertyDetails";
import { reviewConnectionDetails, snackbarWarningMessage } from "./applyResource/reviewConnectionDetails";
import { reviewDocuments } from "./applyResource/reviewDocuments";
import { reviewModificationsEffective } from "./applyResource/reviewModificationsEffective";
import { reviewOwner } from "./applyResource/reviewOwner";
import './index.css'

let isMode = isModifyMode();
export const stepperData = () => {
  if (process.env.REACT_APP_NAME === "Citizen") {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  }
  else if (isModifyMode()) {
    return [{ labelKey: "WS_COMMON_PROPERTY_DETAILS" }, { labelKey: "WS_COMMON_ADDN_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  } else {
    return [{ labelKey: "WS_COMMON_CONNECTION_DETAILS" }, { labelKey: "WS_COMMON_DOCS" }, { labelKey: "WS_COMMON_ADDN_DETAILS" }, { labelKey: "WS_COMMON_SUMMARY" }];
  }
}
export const stepper = getStepperObject({ props: { activeStep: 0, classes: { root: "wns-stepper" } } }, stepperData());

export const getHeaderLabel = () => {
  if (isModifyMode()) {
    return process.env.REACT_APP_NAME === "Citizen" ? "WS_MODIFY_NEW_CONNECTION_HEADER" : "WS_MODIFY_CONNECTION_HEADER"
  }
  return process.env.REACT_APP_NAME === "Citizen" ? "WS_APPLY_NEW_CONNECTION_HEADER" : "WS_APPLICATION_NEW_CONNECTION_HEADER"
}

export const header = getCommonContainer({
  headerDiv: getCommonContainer({
    header: getCommonHeader({
      labelKey: getHeaderLabel()
    })
  }),

  applicationNumberWater: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA", mode: isModifyMode() },
    visible: false
  },

  applicationNumberSewerage: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "NA", mode: isModifyMode() },
    visible: false
  }

});

export const reviewConnDetails = reviewConnectionDetails();

export const reviewOwnerDetails = reviewOwner(process.env.REACT_APP_NAME !== "Citizen");

export const reviewDocumentDetails = reviewDocuments();

export const reviewModificationsDetails = (isModifyMode()) ? reviewModificationsEffective(process.env.REACT_APP_NAME !== "Citizen") : {};

const summaryScreenCitizen = getCommonCard({
  reviewConnDetails,
  reviewDocumentDetails,
});
const summaryScreenEMP = getCommonCard({
  reviewConnDetails,
  reviewModificationsDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
})
let summaryScreen = process.env.REACT_APP_NAME === "Citizen" ? summaryScreenCitizen : summaryScreenEMP;
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
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "WS_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 5000
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
        {
          moduleName: "ws-services-masters", masterDetails: [
            { name: "Documents" },
            { name: "ModifyConnectionDocuments" },
            { name: "waterSource" },
            { name: "connectionType" },
            { name: "PropertySearch" }
          ]
        },
        { moduleName: "PropertyTax", masterDetails: [{ name: "PTWorkflow" }]}
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
      let waterSource = [], GROUND = [], SURFACE = [], BULKSUPPLY = [];
      payload.MdmsRes['ws-services-masters'].waterSource.forEach(obj => {
        waterSource.push({
          code: obj.code.split(".")[0],
          name: obj.name,
          isActive: obj.active
        });
        if (obj.code.split(".")[0] === "GROUND") {
          GROUND.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "SURFACE") {
          SURFACE.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "BULKSUPPLY") {
          BULKSUPPLY.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          })
        }
      })
      let filtered = waterSource.reduce((filtered, item) => {
        if (!filtered.some(filteredItem => JSON.stringify(filteredItem.code) == JSON.stringify(item.code)))
          filtered.push(item)
        return filtered
      }, [])
      payload.MdmsRes['ws-services-masters'].waterSource = filtered;
      payload.MdmsRes['ws-services-masters'].GROUND = GROUND;
      payload.MdmsRes['ws-services-masters'].SURFACE = SURFACE;
      payload.MdmsRes['ws-services-masters'].BULKSUPPLY = BULKSUPPLY;
    }

    //related to ownershipcategory
    let OwnerShipCategory = get(
      payload,
      "MdmsRes.common-masters.OwnerShipCategory"
    )
    let institutions = []
    OwnerShipCategory = OwnerShipCategory.map(category => {
      if (category.code.includes("INDIVIDUAL")) {
        return category.code;
      }
      else {
        let code = category.code.split(".");
        institutions.push({ code: code[1], parent: code[0], active: true });
        return code[0];
      }
    });
    OwnerShipCategory = OwnerShipCategory.filter((v, i, a) => a.indexOf(v) === i)
    OwnerShipCategory = OwnerShipCategory.map(val => { return { code: val, active: true } });

    payload.MdmsRes['common-masters'].Institutions = institutions;
    payload.MdmsRes['common-masters'].OwnerShipCategory = OwnerShipCategory;
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) { 
    
   }
};

const showHideFieldModifyConnection = (action) => {
  let fieldsChanges = [
    ["components.div.children.formwizardFirstStep.children.OwnerInfoCard", false],
    ["components.div.children.formwizardFourthStep.children.snackbarWarningMessage.children.clickHereLink", true],
    ["components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSeven", false],
    ["components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewEight", false],
    ["components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewNine", false],
    ["components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTen", false],
  ]
  for (var i = 0; i < fieldsChanges.length; i++) {
    set(
      action.screenConfig,
      fieldsChanges[i][0] + ".visible",
      fieldsChanges[i][1]
    );
  }
}

const showHideFiedsPendingForConnectionActivation = (action, state, dispatch) => {
  let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationStatus", "");
  if(applicationStatus === "PENDING_FOR_CONNECTION_ACTIVATION") {

      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfTaps.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize.props.isDisabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.hasAddItem", false);
      set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType.props.isDisabled", true);

  } else {
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfTaps.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.hasAddItem", true);
    set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea.props.disabled", false);
    set(action, "screenConfig.components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType.props.disabled", false);
  }
  if(getQueryArg(window.location.href, "action")=='edit'){
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.props.disabled", true);
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.disabled", true);
  }
}      

export const getData = async (action, state, dispatch) => {
  let applicationNo = getQueryArg(window.location.href, "applicationNumber");
  const connectionNo = getQueryArg(window.location.href, "connectionNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const propertyID = getQueryArg(window.location.href, "propertyId");
  const actionType = getQueryArg(window.location.href, "action");
  let mStep = (isModifyMode()) ? 'formwizardSecondStep' : 'formwizardThirdStep';
  await getMdmsData(dispatch);
  if (applicationNo) {
    //Edit/Update Flow ----
    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNo }
    ];
    if (actionType && (actionType.toUpperCase() === "EDIT")) {
      if (connectionNo) {
        handleApplicationNumberDisplay(dispatch, connectionNo)
      } else {
        handleApplicationNumberDisplay(dispatch, applicationNo)
      }
      let payloadWater, payloadSewerage;
      if (applicationNo.includes("SW")) {
        try { payloadSewerage = await getSearchResultsForSewerage(queryObject, dispatch) } catch (error) { console.error(error); }
        payloadSewerage.SewerageConnections[0].water = false;
        payloadSewerage.SewerageConnections[0].sewerage = true;
        payloadSewerage.SewerageConnections[0].service = "Sewerage";
        dispatch(prepareFinalObject("SewerageConnection", payloadSewerage.SewerageConnections));
      } else {
        try { payloadWater = await getSearchResults(queryObject) } catch (error) { console.error(error); };
        payloadWater.WaterConnection[0].water = true;
        payloadWater.WaterConnection[0].sewerage = false;
        payloadWater.WaterConnection[0].service = "Water";
        dispatch(prepareFinalObject("WaterConnection", payloadWater.WaterConnection));
        if (get(payloadWater, "WaterConnection[0].waterSource", null) && get(payloadWater, "WaterConnection[0].waterSubSource", null)) {
          dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues", [{
            waterSourceType: get(payloadWater, "WaterConnection[0].waterSource", null),
            waterSubSource: get(payloadWater, "WaterConnection[0].waterSourceSubSource", null)
          }]))
        } else if (get(payloadWater, "WaterConnection[0].waterSource", null)) {
          dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues", [{
            waterSourceType: get(payloadWater, "WaterConnection[0].waterSource", null),
            waterSubSource: get(payloadWater, "WaterConnection[0].waterSourceSubSource", null)
          }]))
        }
      }
      const waterConnections = payloadWater ? payloadWater.WaterConnection : []
      if (waterConnections.length > 0) {
        waterConnections[0].additionalDetails.locality = get(waterConnections[0], "property.address.locality.code");
      }
      const sewerageConnections = payloadSewerage ? payloadSewerage.SewerageConnections : [];
      if (sewerageConnections.length > 0) {
        sewerageConnections[0].additionalDetails.locality = get(sewerageConnections[0], "property.address.locality.code");
      }
      let combinedArray = waterConnections.concat(sewerageConnections);

      if (!window.location.href.includes("propertyId")) {
        if (!isActiveProperty(combinedArray[0].property)) {
          dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${combinedArray[0].property.status}`, labelName: `Property Status is ${combinedArray[0].property.status}` }, "warning"));
          showHideFieldsFirstStep(dispatch, "", false);
        }
      }
      // For Modify connection details
      if (isModifyMode() && !isModifyModeAction()) {
        // this delete for initiate modify connection 
        if (!window.location.href.includes("mode=MODIFY&action=edit")) delete combinedArray[0].id; combinedArray[0].documents = [];
      }
      if (isModifyMode() && isModifyModeAction()) {
        // ModifyEdit should not call create.
        dispatch(prepareFinalObject("modifyAppCreated", true));
      }

      dispatch(prepareFinalObject("applyScreen", findAndReplace(combinedArray[0], "null", "NA")));
      // For oldvalue display
      let oldcombinedArray = cloneDeep(combinedArray[0]);
      dispatch(prepareFinalObject("applyScreenOld", findAndReplace(oldcombinedArray, "null", "NA")));
      if (combinedArray[0].connectionHolders && combinedArray[0].connectionHolders !== "NA") {
        combinedArray[0].connectionHolders[0].sameAsPropertyAddress = false;
        dispatch(prepareFinalObject("connectionHolders", combinedArray[0].connectionHolders));
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
            "props.isChecked",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails",
            "visible",
            true
          )
        );
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.connectionHolderDetails.visible",
          true
        );
      }
      let data = get(state.screenConfiguration.preparedFinalObject, "applyScreen")
      if (data.connectionType !== "Metered") {
        dispatch(
          handleField(
            "apply",
            `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "apply",
            `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
            "visible",
            false
          )
        );
      }
      if (data.additionalDetails !== undefined && data.additionalDetails.detailsProvidedBy !== undefined) {
        if (data.additionalDetails.detailsProvidedBy === "Self") {
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberLicenceNo`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberName`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberMobNo`,
              "visible",
              false
            )
          );
        } else if (data.additionalDetails.detailsProvidedBy === "ULB") {
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberLicenceNo`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberName`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberMobNo`,
              "visible",
              true
            )
          );
        }
      }
      if (propertyID) {
        let queryObject = [{ key: "tenantId", value: tenantId }, { key: "propertyIds", value: propertyID }];
        getApplyPropertyDetails(queryObject, dispatch, propertyID)
      } else {
        let propId = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.propertyId")
        dispatch(prepareFinalObject("searchScreen.propertyIds", propId));
      }
      //For Modify Connection hide the connection details card
      if (isModifyMode()) {
        showHideFieldModifyConnection(action);
      }
      let docs = get(state, "screenConfiguration.preparedFinalObject");
      await prefillDocuments(docs, "displayDocs", dispatch);
      showHideFiedsPendingForConnectionActivation(action, state, dispatch);
      let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationStatus", "");
      if(applicationStatus === "PENDING_FOR_FIELD_INSPECTION") {
        dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "required", true ) ); 
        dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "props.required", true ) );
        dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "required", true ) ); 
        dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "props.required", true ) );
      }
    }
  } else if (propertyID) {
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "propertyIds", value: propertyID }];
    getApplyPropertyDetails(queryObject, dispatch, propertyID)
  }
};
const  getApplicationNoLabel= () => {
  if (isModifyMode()&& !isModifyModeAction()) {
    return "WS_ACKNO_CONNECTION_NO_LABEL";
  }
  return  "WS_ACKNO_APP_NO_LABEL" ;
}

const getApplyPropertyDetails = async (queryObject, dispatch, propertyID) => {
  let payload = await getPropertyResults(queryObject, dispatch);
  let propertyObj = payload.Properties[0];
  if (!isActiveProperty(propertyObj)) {
    dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${propertyObj.status}`, labelName: `Property Status is ${propertyObj.status}` }, "warning"));
    showHideFieldsFirstStep(dispatch, propertyObj.propertyId, false);
  }
  if(propertyObj && propertyObj.owners && propertyObj.owners.length > 0) {
    propertyObj.owners = propertyObj.owners.filter(owner => owner.status == "ACTIVE");
  }
  if(propertyObj.units == "NA" && propertyObj.additionalDetails && propertyObj.additionalDetails.subUsageCategory) {
    propertyObj.units = [];
    propertyObj.units.push({usageCategory: propertyObj.additionalDetails.subUsageCategory})
  }
  dispatch(prepareFinalObject("applyScreen.property", findAndReplace(propertyObj, null, "NA")));
  dispatch(prepareFinalObject("searchScreen.propertyIds", propertyID));
}


let propertyDetail = getPropertyDetails();
let propertyIDDetails = getPropertyIDDetails();
let ownerDetail = getOwnerDetails();
let holderDetails = getHolderDetails();

export let ownerDetails = getCommonCard({ ownerDetailsHeader, ownershipType, ownerDetail });
export let IDDetails = getCommonCard({ propertyHeader, propertyID, propertyIDDetails });
export let Details = getCommonCard({ propertyDetail });
export let connectionHolderDetails = getCommonCard({ holderHeader, sameAsOwner, holderDetails })

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: { id: "apply_form1" },
  children: { IDDetails, Details, ownerDetails, connectionHolderDetails, OwnerInfoCard }
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
  children: { snackbarWarningMessage, summaryScreen },
  visible: false
};

const pageReset = (dispatch) => {
  dispatch(handleField("apply",
    "components",
    "div", {}));
  // dispatch(handleField("search",
  // "components",
  // "div", {}));
  // dispatch(handleField("search-preview",
  // "components",
  // "div", {}));
  dispatch(unMountScreen("search"));
  dispatch(unMountScreen("search-preview"));
  dispatch(prepareFinalObject("WaterConnection", []));
  dispatch(prepareFinalObject("SewerageConnection", []));
  dispatch(prepareFinalObject("applyScreen", {}));
  dispatch(prepareFinalObject("searchScreen", {}));
  dispatch(prepareFinalObject("connectionHolders", []));
  dispatch(prepareFinalObject("documentsUploadRedux", {}));
  dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues", []));
  propertyDetail = getPropertyDetails();
  propertyIDDetails = getPropertyIDDetails();
  ownerDetail = getOwnerDetails();
  holderDetails = getHolderDetails();
  ownerDetails = getCommonCard({ ownerDetailsHeader, ownershipType, ownerDetail });
  IDDetails = getCommonCard({ propertyHeader, propertyID, propertyIDDetails });
  Details = getCommonCard({ propertyDetail });
  connectionHolderDetails = getCommonCard({ holderHeader, sameAsOwner, holderDetails })
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    
    // dispatch(prepareFinalObject("applyScreen.water", true));
    // dispatch(prepareFinalObject("applyScreen.sewerage", false));
    const propertyId = getQueryArg(window.location.href, "propertyId");

    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

    if (getQueryArg(window.location.href, "edited") != "true") {
    pageReset(dispatch);
    getData(action, state, dispatch).then(() => {
      let ownershipCategory = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
        []
      );
      dispatch(
        prepareFinalObject(
          "OwnershipCategory",
          ownershipCategory
        )
      );
    });
    dispatch(prepareFinalObject("applyScreen.water", true));
    dispatch(prepareFinalObject("applyScreen.sewerage", false));
    if (propertyId) {
      togglePropertyFeilds(action, true);
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
    } else if (applicationNumber && getQueryArg(window.location.href, "action") === "edit") {
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
  } else {
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
      set(
        action,
        `screenConfig.components.div.children.headerDiv.children.header.children.applicationNumberWater.visible`,
        true
      );
      set(
        action,
        `screenConfig.components.div.children.headerDiv.children.header.children.applicationNumberWater.props.number`,
        applicationNumber
      );
      showHideFiedsPendingForConnectionActivation(action, state, dispatch);
  }
    if (isModifyMode()) {
      triggerModificationsDisplay(action, true);
    } else {
      triggerModificationsDisplay(action, false);
    }
    prepareDocumentsUploadData(state, dispatch);
    set(action, "screenConfig.components.div.children.stepper.props.steps", stepperData());
    set(action, 'screenConfig.components.div.children.headerDiv.children.header.children.headerDiv.children.header.children.key.props.labelKey', getHeaderLabel());
    dispatch(handleField("apply", "components", "div", get(action, "screenConfig.components.div", {})))
    isMode = getQueryArg(window.location.href, "mode");
    isMode = (isMode) ? isMode.toUpperCase() : "";
    let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let action1 = getQueryArg(window.location.href, "action");

let modeaction1 = getQueryArg(window.location.href, "modeaction");

let mode = getQueryArg(window.location.href, "mode");
    let modifyLink;
    if (isMode === "MODIFY") {
      modifyLink = `/wns/apply?`;
      modifyLink = applicationNumber ? modifyLink + `applicationNumber=${applicationNumber}` : modifyLink;
      modifyLink = connectionNumber ? modifyLink + `&connectionNumber=${connectionNumber}` : modifyLink;
      modifyLink = action1 ? modifyLink + `&action=${action1}` : modifyLink;
      modifyLink = modeaction1 ? modifyLink + `&modeaction=${modeaction1}` : modifyLink;
      modifyLink = isMode ? modifyLink + `&mode=${isMode}` : modifyLink;
      modifyLink = tenantId ? modifyLink + `&tenantId=${tenantId}` : modifyLink;
      
    } else {
      modifyLink = "/wns/apply"
    }
    set(action, "screenConfig.components.div.children.headerDiv.children.header.children.applicationNumberSewerage.props.mode",isModifyMode() && !isModifyModeAction());
    set(action, "screenConfig.components.div.children.headerDiv.children.header.children.applicationNumberWater.props.mode",isModifyMode() && !isModifyModeAction());
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children.clickHereLink.props.url", modifyLink)
    set(action, "screenConfig.components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children.clickHereLink.props.isMode", isMode)
    if(getQueryArg(window.location.href, "action")=='edit'){
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.props.disabled", true);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.disabled", true);
    }else{
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.props.disabled", false);
      set(action, "screenConfig.components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.getCheckboxContainer.disabled", false);
    }
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