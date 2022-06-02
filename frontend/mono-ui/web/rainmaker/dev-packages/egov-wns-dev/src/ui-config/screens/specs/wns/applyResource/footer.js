import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, validateFields } from "egov-ui-framework/ui-utils/commons";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from 'lodash/set';
import { httpRequest } from "../../../../../ui-utils";
import {
  applyForSewerage,
  applyForWater, applyForWaterOrSewerage,

  findAndReplace,
  isActiveProperty,
  isModifyMode,
  isModifyModeAction, prepareDocumentsUploadData,
  pushTheDocsUploadedToRedux,
  serviceConst,
  showHideFieldsFirstStep, validateConnHolderDetails, validateFeildsForBothWaterAndSewerage,
  validateFeildsForSewerage, validateFeildsForWater, isEditAction
} from "../../../../../ui-utils/commons";
import { getCommonApplyFooter, validateFieldOfWNS } from "../../utils";
import "./index.css";
import commonConfig from "config/common.js";

const isMode = isModifyMode();
const isModeAction = isModifyModeAction();
const setReviewPageRoute = (state, dispatch) => {
  let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
  if(roadCuttingInfo && roadCuttingInfo.length > 0) {
    let formatedRoadCuttingInfo = roadCuttingInfo.filter(value => value.isEmpty !== true);
    dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", formatedRoadCuttingInfo));
  }
  let tenantId = getTenantIdCommon();
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.applicationNo");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  let reviewUrl = `${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited=true&history=true&isValidEdit=true`;
  if (isModifyMode() && isModifyModeAction()) {
    reviewUrl += "&mode=MODIFY"
  }
  if (get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.locality", null) === null) {
    dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.locality", get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.address.locality.code")));
  }
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");

    if (isDocumentRequired) {
      let documents = get(documentsFormat[i], "documents");
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          let dropdownData = get(documentsFormat[i], "dropdown.value");
          if (dropdownData) {
            // if (get(documentsFormat[i], "dropdown.value") !== null && get(documentsFormat[i]).dropdown !==undefined ){
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else if (!isModifyMode()) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      } else {
        validateDocumentField = true;
      }
    } else {
      validateDocumentField = true;
    }
  }

  return validateDocumentField;
};

const showHideFeilds = (dispatch, value) => {
  let mStep = (getQueryArg(window.location.href, "mode") && getQueryArg(window.location.href, "mode").toUpperCase() == 'MODIFY' ) ? 'formwizardSecondStep' : 'formwizardThirdStep'; 
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId",
      "visible",
      value
    )
  );
}

const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  let mdmsBody = {
    MdmsCriteria: {
       tenantId: commonConfig.tenantId, moduleDetails: [
        { moduleName: "ws-services-masters", masterDetails: [{ name: "Documents" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData.applyScreen.Documents", payload.MdmsRes['ws-services-masters'].Documents));
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
  }
};

const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  let isFormValid = true;
  let hasFieldToaster = false;
  /* validations for property details screen */
  if (activeStep === 0) {
    // if (validatePropertyLocationDetails && validatePropertyDetails && validateForm) {
    //   isFormValid = await appl;
    // }

    validateFields("components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children", state, dispatch)
    validateFields("components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children", state, dispatch)

    validateFields("components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children", state, dispatch)

    if (getQueryArg(window.location.href, "action") === "edit" && !isModifyMode()) {
      let application = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      const uploadedDocData = application.documents;
      const reviewDocData = uploadedDocData && uploadedDocData.map(item => {
        return {
          title: `WS_${item.documentType}`,
          link: item.fileUrl && item.fileUrl.split(",")[0],
          linkText: "View",
          name: item.fileName
        };
      });
      dispatch(prepareFinalObject("applyScreen.reviewDocData", reviewDocData));
      let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
      //connectionholdercode
      let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
      let holderData = connectionHolderObj[0];
      if (holderData !== null && holderData !== undefined) {
        if (holderData.sameAsPropertyAddress === true) {
          holderData = null
        }
      }
      if (holderData == null) {
        applyScreenObject.connectionHolders = holderData;
      } else {
        let arrayHolderData = [];
        arrayHolderData.push(holderData);
        applyScreenObj.connectionHolders = arrayHolderData;
      }

      if (!isActiveProperty(applyScreenObj.property)) {
        dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObj.property.status}`, labelName: `Property Status is ${applyScreenObj.property.status}` }, "warning"));
        showHideFieldsFirstStep(dispatch, "", false);
        dispatch(prepareFinalObject("applyScreen", applyScreenObj));
        return false;
      }
      let roadCuttingInfoDetails = get(state.screenConfiguration.preparedFinalObject, "applyScreen.roadCuttingInfo")
      if(roadCuttingInfoDetails === null) {
        dispatch(prepareFinalObject("applyScreen.roadCuttingInfo", []));
      }

      let waterSourceType = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", "");
      let waterSubSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", "");
      if(waterSourceType == null || waterSourceType == "null") {
        dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceTypewaterSource.selectedValues[0].waterSourceType", ""));
      }
      if(waterSubSource.includes("null")) {
        dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceTypewaterSource.selectedValues[0].waterSourceType", ""));
      }
    } else {
      const water = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.water"
      );
      const sewerage = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.sewerage"
      );
      const searchPropertyId = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen.propertyIds"
      )
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");

      //connectionholdercode

      let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
      let holderData = connectionHolderObj[0];
      if (holderData !== null && holderData !== undefined) {
        if (holderData.sameAsPropertyAddress === true) {
          holderData = null
        }
      }
      if (holderData == null) {
        applyScreenObject.connectionHolders = holderData;
      } else {
        let arrayHolderData = [];
        arrayHolderData.push(holderData);
        applyScreenObject.connectionHolders = arrayHolderData;
      }
      if (searchPropertyId !== undefined && searchPropertyId !== "") {

        if (!isActiveProperty(applyScreenObject.property)) {
          dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObject.property.status}`, labelName: `Property Status is ${applyScreenObject.property.status}` }, "warning"));
          showHideFieldsFirstStep(dispatch, "", false);
          return false;
        }
        // TODO else part update propertyId.

        if (validateConnHolderDetails(applyScreenObject)) {
          isFormValid = true;
          hasFieldToaster = false;
          if (applyScreenObject.water || applyScreenObject.sewerage) {
            if (
              applyScreenObject.hasOwnProperty("property") &&
              !_.isUndefined(applyScreenObject["property"]) &&
              !_.isNull(applyScreenObject["property"]) &&
              !_.isEmpty(applyScreenObject["property"])
            ) {
              if (water && sewerage) {
                if (validateFeildsForBothWaterAndSewerage(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              } else if (water) {
                if (validateFeildsForWater(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              } else if (sewerage) {
                if (validateFeildsForSewerage(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              }
            } else {
              isFormValid = false;
              dispatch(
                toggleSnackbar(
                  true, {
                  labelKey: "ERR_WS_PROP_NOT_FOUND",
                  labelName: "No Property records found, please search or create a new property"
                },
                  "warning"
                )
              );
            }
            let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
            let sewerData = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection")
            let waterChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.water");
            let sewerChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage")
            let modifyAppCreated = get(state, "screenConfiguration.preparedFinalObject.modifyAppCreated")
            if (isFormValid) {
              if ((waterData && waterData.length > 0) || (sewerData && sewerData.length > 0)) {
                if (waterChecked && sewerChecked) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      "Water And Sewerage"
                    )
                  );
                  if (sewerData && sewerData.length > 0 && waterData.length === 0) { await applyForWater(state, dispatch); }
                  else if (waterData && waterData.length > 0 && sewerData.length === 0) { await applyForSewerage(state, dispatch); }
                } else if ((sewerChecked && sewerData.length === 0) || (isModifyMode() && sewerData.length === 1 && !modifyAppCreated)) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      _.capitalize(serviceConst.SEWERAGE)
                    )
                  );
                  if (!window.location.href.includes("mode=MODIFY&action=edit")) await applyForSewerage(state, dispatch);
                } else if ((waterChecked && waterData.length === 0) || (isModifyMode() && waterData.length === 1 && !modifyAppCreated)) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      _.capitalize(serviceConst.WATER)
                    )
                  );
                  if (!window.location.href.includes("mode=MODIFY&action=edit")) await applyForWater(state, dispatch);
                }
              } else if (waterChecked && sewerChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water And Sewerage"
                  )
                );
                if (waterData.length === 0 && sewerData.length === 0) { if (!window.location.href.includes("mode=MODIFY&action=edit")) isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              } else if (waterChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    _.capitalize(serviceConst.WATER)
                  )
                );
                if (waterData.length === 0) { if (!window.location.href.includes("mode=MODIFY&action=edit")) isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              } else if (sewerChecked) {
                dispatch(prepareFinalObject("applyScreen.service", _.capitalize(serviceConst.SEWERAGE)))
                if (sewerData.length === 0) { if (!window.location.href.includes("mode=MODIFY&action=edit")) isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              }
            }
          } else {
            isFormValid = false;
            hasFieldToaster = true;
          }
        } else {
          isFormValid = false;
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "WS_FILL_REQUIRED_HOLDER_FIELDS",
              labelName: "Please fill Required details"
            },
              "warning"
            )
          )
        }
      } else {
        isFormValid = false;
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "WS_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
      }
    }
    prepareDocumentsUploadData(state, dispatch);











  }

  /* validations for Additional /Docuemnts details screen */
  if (activeStep === 1) {
    if (isModifyMode()) {
      let validate = validateFields("components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.modificationsEffectiveFrom.children.cardContent.children.modificationEffectiveDate.children", state, dispatch)
      if(validate) {
        isFormValid = true;
        hasFieldToaster = false;
      } else {
        let errorMessage = {
          labelName: "Please fill all mandatory fields!",
          labelKey: "WS_FILL_REQUIRED_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }
    } else {
      if (moveToReview(state, dispatch)) {
        await pushTheDocsUploadedToRedux(state, dispatch);
        let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationStatus", "");
        let connType = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionType", "");
        let applicationNumber = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationNo", "");
        if(applicationStatus === "PENDING_FOR_CONNECTION_ACTIVATION" && window.location.href.includes("action=edit")) {
          if (applicationNumber.includes("WS")) {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "isRequired", false) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "requiredValue", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "isRequired", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "requiredValue", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", true ) );
            
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "props.required", false ) );
          } else {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "props.required", true ) );

            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "isRequired", false) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "requiredValue", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "isRequired", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "requiredValue", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", false ) );
          }
          
          if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "props.required", false ) );
          } else {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "props.required", true ) );
          }
        } else if(applicationStatus === "PENDING_FOR_FIELD_INSPECTION") {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "props.required", true ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "required", true ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "props.required", true ) );
        } else {
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets", "props.required", false ) );

            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "isRequired", false) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[0]", "requiredValue", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "isRequired", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.props.dropdownFields[1]", "requiredValue", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", false ) );

            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.enterArea", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.scheama.children.cardContent.children.roadDetails.children.roadType", "props.required", false ) );

            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.connectionExecutionDate", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID", "props.required", false ) );
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "required", false ) ); 
            dispatch( handleField( "apply", "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate", "props.required", false ) );
        }
        if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
          showHideFeilds(dispatch, false);
        }
        else {
          showHideFeilds(dispatch, true);
        }
        isFormValid = true; hasFieldToaster = false;
        if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit") {
          setReviewPageRoute(state, dispatch);
        }
        let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
        let raodCuttingInfos = get(state, "screenConfiguration.preparedFinalObject.applyScreen.raodCuttingInfos", []);
  
        if (roadCuttingInfo && roadCuttingInfo.length > 0) {
          dispatch(prepareFinalObject("applyScreen.tempRoadCuttingInfo", roadCuttingInfo));
          let formatedRoadCuttingInfo = roadCuttingInfo.filter(value => value.emptyObj !== true); 
          dispatch(prepareFinalObject("applyScreen.roadCuttingInfo", formatedRoadCuttingInfo));
        }
      }
      else {
        isFormValid = false;
        hasFieldToaster = true;
      }
    }
  }
  /* validations for Additional /Docuemnts details screen */
  if (activeStep === 2 && process.env.REACT_APP_NAME !== "Citizen") {
    if (isModifyMode()) {
      let connType = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionType", "");
      if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
        showHideFeilds(dispatch, false);
      }
      else {
        showHideFeilds(dispatch, true);
      }
      if (moveToReview(state, dispatch)) {
        await pushTheDocsUploadedToRedux(state, dispatch);
        isFormValid = true; hasFieldToaster = false;
        // if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit") {
        //   setReviewPageRoute(state, dispatch);
        // }
      }
      else {
        isFormValid = true;
        hasFieldToaster = false;
      }
    } else {
      let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
      let roadCuttingInfos = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfos", []);

      let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "applyScreen.applicationStatus", "");
      if(applicationStatus === "PENDING_FOR_CONNECTION_ACTIVATION") {
        let waterSourceType = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", "");
        let waterSubSource = get(state.screenConfiguration.preparedFinalObject, "DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", "");
        if(waterSourceType == null || waterSourceType == "null" || waterSourceType == "NA") {
          dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", ""));
        }
        if(waterSubSource.includes("null") || waterSubSource == "NA") {
          dispatch(prepareFinalObject("DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", ""));
        }
      }

      // Multiple roadtype cards validations
      let multipleRoadTypeCardPath = "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.roadCuttingChargeContainer.children.cardContent.children.applicantTypeContainer.children.roadCuttingChargeInfoCard.children.multipleApplicantInfo.props.items";
      let multipleRoadTypeCardItems = get(
        state.screenConfiguration.screenConfig.apply,
        multipleRoadTypeCardPath,
        []
      );
      let isMultipleRoadTypeCardValid = true;
      for (var j = 0; j < multipleRoadTypeCardItems.length; j++) {
        if (
          (multipleRoadTypeCardItems[j].isDeleted === undefined ||
            multipleRoadTypeCardItems[j].isDeleted !== false) &&
          !validateFields(
            `${multipleRoadTypeCardPath}[${j}].item${j}.children.cardContent.children.roadDetails.children`,
            state,
            dispatch,
            "apply"
          )
        )
        isMultipleRoadTypeCardValid = false;
      }

      if(!isMultipleRoadTypeCardValid) {
        let errorMessage = {
          labelName: "Please fill all mandatory fields!",
          labelKey: "WS_FILL_REQUIRED_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }

      if(applicationStatus === "PENDING_FOR_CONNECTION_ACTIVATION") {
        let connectionDetailsCard = validateFieldOfWNS("components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children", state, dispatch, "apply");
        let activeDetailsCard = validateFields("components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children", state, dispatch, "apply");
        if(!activeDetailsCard || !connectionDetailsCard) {
          let errorMessage = {
            labelName: "Please fill all mandatory fields!",
            labelKey: "WS_FILL_REQUIRED_FIELDS"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
          return
        }
      }
      if(roadCuttingInfos && roadCuttingInfos.length > 0) {
        for(let b =0; b < roadCuttingInfo.length ; b++) {
          if(get(roadCuttingInfos[b], "status") == "INACTIVE") {
            roadCuttingInfo.push(roadCuttingInfos[b]);
          }
        }
      }
      if(roadCuttingInfo && roadCuttingInfo.length > 0) {
        for (let i = 0; i < roadCuttingInfo.length; i++) {
          if (roadCuttingInfo[i] == undefined) {
            roadCuttingInfo[i] = {};
            roadCuttingInfo[i].isEmpty = true;
          }
        }
        let filteredInfo = [];
        roadCuttingInfo.forEach(info => {
          if(info.isDeleted ==false) {
            info.status = "INACTIVE"
          }
        });
        dispatch(prepareFinalObject( "applyScreen.roadCuttingInfos", roadCuttingInfo));
        for(let j = 0; j < roadCuttingInfo.length; j ++) {
          if(roadCuttingInfo[j].isDeleted !=false) {
            filteredInfo.push(roadCuttingInfo[j]);
          } else {
            filteredInfo.push({emptyObj: true})
          }
        }
        // roadCuttingInfo.forEach(info => {
        //   if(info.isDeleted !=false) filteredInfo.push(info);
        //   else filteredInfo.push({isEmpty: true})
        // });
        // roadCuttingInfo.map(info => {
        //   if(info.isDeleted !=false) filteredInfo.push(info);
        // });
        dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", filteredInfo));
      }
      
      if (getQueryArg(window.location.href, "action") === "edit" && (!isModifyMode() || (isModifyMode() && isModifyModeAction()))) {
        setReviewPageRoute(state, dispatch);
      }
      isFormValid = true;
    }
    let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
    let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
    dispatch(handleField("apply", "components.div.children.formwizardFourthStep.children.snackbarWarningMessage", "props.propertyId", get(applyScreenObj, "property.propertyId", '')));
    if (isActiveProperty(applyScreenObj.property)) {
      dispatch(handleField("apply", "components.div.children.formwizardFourthStep.children.snackbarWarningMessage", "visible", false));
    }


  }
  if (activeStep === 3) {
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
    if(roadCuttingInfo && roadCuttingInfo.length > 0) {
      let formatedRoadCuttingInfo = roadCuttingInfo.filter(value => value.isEmpty !== true);
      dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", formatedRoadCuttingInfo));
    }
    if (waterId && sewerId) {
      isFormValid = await acknoledgementForBothWaterAndSewerage(state, activeStep, isFormValid, dispatch);
    } else if (waterId) {
      isFormValid = await acknoledgementForWater(state, activeStep, isFormValid, dispatch);
    } else {
      isFormValid = await acknoledgementForSewerage(state, activeStep, isFormValid, dispatch);
    }
    // responseStatus === "success" && changeStep(activeStep, state, dispatch);
  }
  if (activeStep !== 3) {
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields!",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
            labelName:
              "Please upload all Mandatory Document!",
            labelKey: "WS_UPLOAD_MANDATORY_DOCUMENTS"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

const moveToSuccess = (combinedArray, dispatch) => {
  const tenantId = get(combinedArray[0].property, "tenantId") || get(combinedArray[0], "tenantId");
  const purpose = "apply";
  const status = "success";
  let applicationNoWater = get(combinedArray[0], "applicationNo");
  let applicationNoSewerage = get(combinedArray[1], "applicationNo");
  let mode = (isModifyMode()) ? "&mode=MODIFY" : "";
  if(isModifyMode()) {
    if (get(combinedArray[0], "applicationNo").includes("WS")) {
      applicationNoWater = get(combinedArray[0], "applicationNo");
      applicationNoSewerage = "";
    } else {
      applicationNoSewerage = get(combinedArray[0], "applicationNo");
      applicationNoWater  = "";
    }
  }
  if (applicationNoWater && applicationNoSewerage) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNoWater}&applicationNumberSewerage=${applicationNoSewerage}&tenantId=${tenantId}${mode}`
      )
    );
  } else if (applicationNoWater) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}${mode}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoSewerage}&tenantId=${tenantId}${mode}`
      )
    );
  }
};

const acknoledgementForBothWaterAndSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      let combinedArray = WaterConnection.concat(SewerageConnection)
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return isFormValid;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 0:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return !isFormValid;
}

const acknoledgementForWater = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

const acknoledgementForSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  if (defaultActiveStep === -1) {
    if (activeStep === 1 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.documents",
        null
      );
      if (isDocsUploaded) {
        activeStep = process.env.REACT_APP_NAME === "Citizen" ? 3 : 2;
      } else if (isModifyMode()) {
        activeStep = 2;
      }
    } else if (process.env.REACT_APP_NAME === "Citizen" && activeStep === 3) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }
  if (activeStep === 0) {
    let conHolders = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionHolders");
    let isCheckedSameAsProperty = (conHolders && conHolders.length > 0 && !conHolders[0].sameAsPropertyAddress) ? false : true;
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
        "props.isChecked",
        isCheckedSameAsProperty
      )
    )
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = isNextButton(activeStep);
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  if (process.env.REACT_APP_NAME === "Citizen") { renderStepsCitizen(activeStep, dispatch); }
  else { renderSteps(activeStep, dispatch); }
}

export const isNextButton = (activeStep) => {
  if (process.env.REACT_APP_NAME === "Citizen" && activeStep < 2) { return true; }
  else if (process.env.REACT_APP_NAME !== "Citizen" && activeStep < 3) { return true; }
  else return false
}

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      let mStepSecond = (isModifyMode()) ? 'formwizardThirdStep' : 'formwizardSecondStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStepSecond}`
        ),
        dispatch
      );
      break;
    case 2:
      let mStep = (isModifyMode()) ? 'formwizardSecondStep' : 'formwizardThirdStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStep}`
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );

  }
};

export const renderStepsCitizen = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      let mStepSecond = (isModifyMode()) ? 'formwizardThirdStep' : 'formwizardSecondStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStepSecond}`
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  let actionDefination = [];
  if (process.env.REACT_APP_NAME === "Citizen") {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  } else {
    let mStep1 = "formwizardThirdStep";
    let mStep2 = "formwizardSecondStep";

    if (isModifyMode()) {
      mStep1 = "formwizardSecondStep";
      mStep2 = "formwizardThirdStep";
    }

    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: `components.div.children.${mStep2}`,
        property: "visible",
        value: false
      },
      {
        path: `components.div.children.${mStep1}`,
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  }
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = { ...actionDefination[i], value: false };
    if (path === actionDefination[i].path) {
      actionDefination[i] = { ...actionDefination[i], value: true };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  window.scrollTo(0, 0);
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter("BOTTOM", {
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "WS_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
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
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "WS_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const footerReview = (
  action,
  state,
  dispatch,
  status) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, "print");
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses, 'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      break;
    case "pending_approval":
      break;
    case "CANCELLED":
      break;
    case "REJECTED":
      break;
    default:
      break;
  }
}