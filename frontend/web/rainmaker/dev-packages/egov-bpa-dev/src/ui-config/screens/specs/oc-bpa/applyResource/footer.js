import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import {
  getRiskType, 
  getCommonApplyFooter, 
  validateFields, 
  generateBillForBPA,
  applicantNameAppliedByMaping,
  prepareNocFinalCards
} from "../../utils";
import "./index.css";
import {
  submitBpaApplication,
  updateOcBpaApplication,
  createUpdateOCBpaApplication,
  prepareDocumentsUploadData,
  prepareNOCUploadData,
  getNocSearchResults
} from "../../../../../ui-utils/commons";
import { 
  toggleSnackbar, 
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import _ from "lodash";
import jp from "jsonpath";
import { getQueryArg, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { compare } from "../../utils/index";

export const showRisktypeWarning = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("apply", "components.cityPickerDialog", "props.open", !toggle)
  );
  dispatch(
    handleField(
      "components.cityPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.div.children.selectButton",
      "visible",
      false
    )
  )
};

const kathaNoAndPlotNoValidation = (state, dispatch) => {
  let ocEdcrKathaNo = get(
    state.screenConfiguration.preparedFinalObject,
    "ocScrutinyDetails.planDetail.planInformation.khataNo"
  );
  let edcrKathaNo = get(
    state.screenConfiguration.preparedFinalObject,
    "scrutinyDetails.planDetail.planInformation.khataNo"
  );
  let ocEdcrPlotNo = get(
    state.screenConfiguration.preparedFinalObject,
    "ocScrutinyDetails.planDetail.planInformation.plotNo"
  );
  let edcrPlotNo = get(
    state.screenConfiguration.preparedFinalObject,
    "scrutinyDetails.planDetail.planInformation.plotNo"
  );
  if (ocEdcrKathaNo && edcrKathaNo && ocEdcrPlotNo && edcrPlotNo) {
    if (ocEdcrPlotNo == edcrPlotNo && ocEdcrKathaNo == edcrKathaNo) {
      return true;
    } else {
      let errorMessage = {};
      if (ocEdcrKathaNo != edcrKathaNo && ocEdcrPlotNo == edcrPlotNo) {
        errorMessage = {
          labelName: "Khata number from permit order XXXX(permit order number) is not matching with the khata number from occupancy certificate. You cannot proceed with the application",
          labelKey: "ERR_FILL_MANDATORY_FIELDS_PERMIT_SEARCH"
        };
      } else if (ocEdcrPlotNo != edcrPlotNo && ocEdcrKathaNo == edcrKathaNo) {
        errorMessage = {
          labelName: "Plot number from permit order XXXX(permit order number) is not matching with the Plot number from occupancy certificate. You cannot proceed with the application",
          labelKey: "ERR_FILL_MANDATORY_FIELDS_PERMIT_SEARCH"
        };
      } else if (ocEdcrPlotNo != edcrPlotNo && ocEdcrKathaNo != edcrKathaNo) {
        errorMessage = {
          labelName: "Khata No and plot No from permit order XXXX(permit order number) is not matching with the Khata No and plot No from occupancy certificate. You cannot proceed with the application",
          labelKey: "ERR_FILL_MANDATORY_FIELDS_PERMIT_SEARCH"
        };
      }
      dispatch(toggleSnackbar(true, errorMessage, "error"));
      return false;
    }
  }
}

const riskTypeValidation = (state, dispatch, activeStep) => {
  const riskTypes = { LOW: 0, MEDIUM: 1, HIGH: 2 };

  let ocEdcrRiskType = getRiskType(state, dispatch);
  // get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "BPA.riskType"
  // );
  let edcrRisktype = getRiskType(state, dispatch, true);
  // get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "bpaDetails.riskType"
  // );
  if (riskTypes[edcrRisktype] < riskTypes[ocEdcrRiskType]) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "The Risk type from permit order XXXX(permit order number) to occupancy certificate application is changed from Low to high .You cannot proceed with the application.",
          labelKey: "BPA_RISK_TYPE_VALIDATION_ERROR"
        },
        "error"
      )
    );
    return false;
  } else if (riskTypes[edcrRisktype] > riskTypes[ocEdcrRiskType]) {
    showRisktypeWarning(state, dispatch, activeStep);
    return false;
  } else {
    // const riskTypeValid = get(
    //   state,
    //   "screenConfiguration.preparedFinalObject.BPA.riskType",
    //   []
    // );
    // if (riskTypeValid.length === 0) {
    //   let errorMessage = {
    //     labelName: "Please search scrutiny details linked to the scrutiny number",
    //     labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_SEARCH_TITLE"
    //   };
    //   dispatch(toggleSnackbar(true, errorMessage, "warning"));
    //   return false;
    // }
    return true;
  }
}

const prepareDocumentsDetailsView = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0 && doc.dropDownValues) {
      doc.documents.forEach(docDetail =>{
        documentsPreview.push({
          title: getTransformedLocale(doc.documentCode),
          name: docDetail.fileName,
          fileStoreId: docDetail.fileStoreId,
          linkText: "View",
          link: docDetail.fileUrl && docDetail.fileUrl.split(",")[0]
        })
      });
    }
  });
  dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
};

const getSummaryRequiredDetails = async (state, dispatch) => {
  const applicationNumber = get(state.screenConfiguration.preparedFinalObject, "BPA.applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const ocDetails = get(state.screenConfiguration.preparedFinalObject, "ocScrutinyDetails");
  const bpaDetails = get(state.screenConfiguration.preparedFinalObject, "BPA")
  generateBillForBPA(dispatch, applicationNumber, tenantId, "BPA.NC_OC_APP_FEE");
  prepareDocumentsDetailsView(state, dispatch);
  applicantNameAppliedByMaping(state, dispatch, bpaDetails, ocDetails);
}

const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0, 0);
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = false;

  if(activeStep === 0) {
    let isBasicDetailsCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.basicDetails.children.cardContent.children.basicDetailsContainer.children",
      state,
      dispatch
    );
    /**
     * @TODO There is a bug in validation after fixing that the below statement will be removed 
     */
    isBasicDetailsCardValid= true;
    if (
      !isBasicDetailsCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    } else {
      let bpaStatus = get(
        state.screenConfiguration.preparedFinalObject,
        "BPA.status", ""
      );
      if (!bpaStatus) {
        let isKathaNoAndPlotNoValidation = await kathaNoAndPlotNoValidation(state, dispatch);
        let isRiskTypeValidation = await riskTypeValidation(state, dispatch, activeStep);
        if (!isKathaNoAndPlotNoValidation || !isRiskTypeValidation) {
          return false;
        }

        isFormValid = await createUpdateOCBpaApplication(state, dispatch, "INITIATE");
        if (!isFormValid) {
          hasFieldToaster = false;
        }
        prepareDocumentsUploadData(state, dispatch);
      }
      let applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        "BPA.applicationNo"
      );
      let tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        "BPA.tenantId"
      );
      const payload = await getNocSearchResults([
        {
          key: "tenantId",
          value: tenantId
        },
        { key: "sourceRefId", value: applicationNumber }
      ], state);
      payload.Noc.sort(compare);      
      dispatch(prepareFinalObject("Noc", payload.Noc)); 
      await prepareNOCUploadData(state, dispatch);
      prepareNocFinalCards(state, dispatch);
    }
  } else if (activeStep === 1) {
    const documentsFormat = Object.values(
      get(state.screenConfiguration.preparedFinalObject, "documentDetailsUploadRedux")
    );

    let validateDocumentField = false;

    if (documentsFormat && documentsFormat.length) {
      for (let i = 0; i < documentsFormat.length; i++) {
        let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
        let isDocumentTypeRequired = get(
          documentsFormat[i],
          "isDocumentTypeRequired"
        );
  
        let documents = get(documentsFormat[i], "documents");
        if (isDocumentRequired) {
          if (documents && documents.length > 0) {
            if (isDocumentTypeRequired) {
              if (get(documentsFormat[i], "dropDownValues.value")) {
                validateDocumentField = true;
              } else {
                dispatch(
                  toggleSnackbar(
                    true,
                    { labelName: "Please select type of Document!", labelKey: "BPA_FOOTER_SELECT_DOC_TYPE" },
                    "warning"
                  )
                );
                validateDocumentField = false;
                break;
              }
            } else {
              validateDocumentField = true;
            }
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please uplaod mandatory documents!", labelKey: "BPA_FOOTER_UPLOAD_MANDATORY_DOC" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      }
      if (!validateDocumentField) {
      isFormValid = false;
      hasFieldToaster = true;
      } else {
        getSummaryRequiredDetails(state, dispatch);
      }
    } else {
      getSummaryRequiredDetails(state, dispatch);
    }
  }

  if (activeStep !== 4) {
    if (isFormValid) {
      if (activeStep === 1) {
        let nocData = get(state.screenConfiguration.preparedFinalObject, "nocForPreview", []);
        if(nocData && nocData.length > 0) { 
          nocData.map(items => {
            if(!items.readOnly) items.readOnly = items.readOnly ? false : true;
          })
          dispatch(prepareFinalObject("nocForPreview", nocData));
        }
      }
      // createUpdateOCBpaApplication(state, dispatch, "INITIATE")
     changeStep(state, dispatch);
    } else if (hasFieldToaster) { 
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
      };
      switch (activeStep) {
        case 0:
          errorMessage = {
            labelName: "Please fill all mandatory fields for Scrutiny Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_SCRUTINY_DETAILS_TOAST"
          };
          break;
        case 1:
          errorMessage = {
            labelName: "Please upload all the required documents!",
            labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isSendToCitizenButtonVisible = activeStep === 2 ? true : false;
  const isSubmitButtonVisible = activeStep === 2 ? true : false;

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
      path: "components.div.children.footer.children.submitButton",
      property: "visible",
      value: isSubmitButtonVisible
    },
    {
      path: "components.div.children.footer.children.sendToCitizen",
      property: "visible",
      value: isSendToCitizenButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

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
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
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
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (activeStep === 2) {
    let nocData = get(state.screenConfiguration.preparedFinalObject, "nocForPreview", []);
    if(nocData && nocData.length > 0) { 
      nocData.map(items => {
        if(items.readOnly) items.readOnly = items.readOnly ? false : true;
      })
      dispatch(prepareFinalObject("nocForPreview", nocData));
    }
  }
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
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
        labelKey: "BPA_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "BPA_COMMON_BUTTON_NXT_STEP"
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
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "BPA_COMMON_BUTTON_SUBMIT"
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
      callBack: submitBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "APPLY"
    },
    visible: false
  },
  sendToCitizen: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      sendToCitizenLabel: getLabel({
        labelName: "SEND TO CITIZEN",
        labelKey: "BPA_SEND_TO_CITIZEN_BUTTON"
      }),
      sendToCitizenIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: updateOcBpaApplication
    },
    visible: false
  }
});