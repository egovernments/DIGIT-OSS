import {
  dispatchMultipleFieldChangeAction,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import {
  getCommonApplyFooter,
  prepareDocumentsUploadData,
  validateFields,
  onDemandRevisionBasis,
  submitApplication
} from "../utils";
import {
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { 
  getQueryArg, 
  getFileUrlFromAPI, 
  getTransformedLocale 
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.css";


const preparingDocumentsReview = async (state, dispatch) => {
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0 && doc.dropdown) {
      doc.documents.forEach(docDetail =>{
        let obj = {};
        obj.title = getTransformedLocale(doc.documentCode);
        obj.name = docDetail.fileName;
        obj.fileStoreId = docDetail.fileStoreId;
        obj.linkText = "View";
        obj.link = docDetail.fileUrl && docDetail.fileUrl.split(",")[0];
        documentsPreview.push(obj);
      });
    }
  });
  dispatch(prepareFinalObject("bill-amend-review-document-data", documentsPreview));
};

export const summaryAdjustmentAmountDetails = async(state, dispatch) => {
  const fetchBillDetails = get (state.screenConfiguration.preparedFinalObject, "fetchBillDetails", []);
  const amountType = get (state.screenConfiguration.preparedFinalObject, "BILL.AMOUNTTYPE", "");
  let billDetails = [];
  fetchBillDetails.map(bill => {
    if (bill.reducedAmountValue || bill.additionalAmountValue) {
      billDetails.push({
        taxHeadMasterCode: bill.taxHeadCode,
        taxAmount: amountType == "reducedAmount" ? parseFloat(bill.reducedAmountValue) : parseFloat(bill.additionalAmountValue),
        amountType: amountType
      });
    }
  });
  dispatch(prepareFinalObject("AmendmentTemp[0].estimateCardData", billDetails, []));
}

export const getSummaryRequiredDetails = async (state, dispatch) => {
  const effectiveFrom = get (state.screenConfiguration.preparedFinalObject, "Amendment.effectiveFrom", "");
  const effectiveTill = get (state.screenConfiguration.preparedFinalObject, "Amendment.effectiveTill", "");
  if(effectiveFrom && effectiveFrom.length > 0) {
    const formatedeffectiveFrom = effectiveFrom.split('-')[2]+ "-" +effectiveFrom.split('-')[1] + "-" + effectiveFrom.split('-')[0];
    dispatch(prepareFinalObject("AmendmentTemp.effectiveFrom", formatedeffectiveFrom, ""));
  }
  if(effectiveTill && effectiveTill.length > 0) {
    const formatedeffectiveTill = effectiveTill.split('-')[2]+ "-" + effectiveTill.split('-')[1] + "-" + effectiveTill.split('-')[0];
    dispatch(prepareFinalObject("AmendmentTemp.effectiveTill", formatedeffectiveTill, ""));
  }
  await onDemandRevisionBasis(state, dispatch);
  await preparingDocumentsReview(state, dispatch);
  await summaryAdjustmentAmountDetails(state, dispatch);

}

const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  let isFormValid = true;
  let hasFieldToaster = false;

  if (activeStep === 0) {
    const isAddDemandRevisionBasisCard = validateFields(
      "components.div.children.formwizardFirstStep.children.AddDemandRevisionBasis.children.cardContent.children.demandRevisionContainer.children",
      state,
      dispatch
    );

    const demandRevisionBasisValue = get(state.screenConfiguration.preparedFinalObject, "Amendment.amendmentReason", "");

    if (!isAddDemandRevisionBasisCard) {
      isFormValid = false;
      hasFieldToaster = true;
    } else {
      let amountType = get(state.screenConfiguration.preparedFinalObject, "BILL.AMOUNTTYPE", "");
      let fetchBillDetails = get(state.screenConfiguration.preparedFinalObject, "fetchBillDetails", []);
      let amountValue = false;
      if (amountType && amountType == "reducedAmount") {
        for (let i = 0; i < fetchBillDetails.length; i++) {
          if(fetchBillDetails[i].reducedAmountValue > 0) {
            amountValue = true;
            break;
          }
        }
      } else {
        for (let i = 0; i < fetchBillDetails.length; i++) {
          if(fetchBillDetails[i].additionalAmountValue > 0) {
            amountValue = true;
            break;
          }
        }
      }

      if(!amountValue) {
        isFormValid = false;
        let errorMessage = {
          labelName: "All Tax Heads Amount cant't be 0",
          labelKey: "ERR_NON_ZERO_AMOUNT_TOAST",
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return;
      }

      if (demandRevisionBasisValue !== "COURT_CASE_SETTLEMENT") {
        const fromDate = get(state.screenConfiguration.preparedFinalObject, "Amendment.effectiveFrom");
        const toDate = get(state.screenConfiguration.preparedFinalObject, "Amendment.effectiveTill");
        if (new Date(fromDate) >= new Date(toDate)) {
          isFormValid = false;
          let errorMessage = {
            labelName: "From Date should be less than To Date",
            labelKey: "ERR_FROM_TO_DATE_TOAST",
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        } else {
          await prepareDocumentsUploadData(state, dispatch);
          dispatch(prepareFinalObject("AmendmentTemp.amendmentReason", demandRevisionBasisValue));
        }
      } else {
        await prepareDocumentsUploadData(state, dispatch);
        dispatch(prepareFinalObject("AmendmentTemp.amendmentReason", demandRevisionBasisValue));
      }
    }
  }

  if (activeStep === 1) {

    const documentsFormat = Object.values(
      get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
    );

    let validateDocumentField = false;

    if (documentsFormat && documentsFormat.length) {
      for (let i = 0; i < documentsFormat.length; i++) {
        let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
        let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");
        let documents = get(documentsFormat[i], "documents");
        if (isDocumentRequired) {
          if (documents && documents.length > 0) {
            if (isDocumentTypeRequired) {
              if (get(documentsFormat[i], "dropdown.value")) {
                validateDocumentField = true;
              } else {
                dispatch(toggleSnackbar(
                  true,
                  {
                    labelName: "Please select type of Document!",
                    labelKey: "BILL_FOOTER_SELECT_DOC_TYPE"
                  },
                  "warning"
                ));
                validateDocumentField = false;
                break;
              }
            } else {
              validateDocumentField = true;
            }
          } else {
            dispatch(toggleSnackbar(
              true,
              {
                labelName: "Please uplaod mandatory documents!",
                labelKey: "BILL_FOOTER_UPLOAD_MANDATORY_DOC"
              },
              "warning"
            ));
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
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents!",
        labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST",
      };
      switch (activeStep) {
        case 0:
          errorMessage = {
            labelName: "Please, provide required details",
            labelKey: "BILL_ERR_PROVIDE_REQ_DETAILS_TOAST",
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
  const isSubmitButtonVisible = activeStep === 2 ? true : false;

  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep,
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible,
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible,
    },
    {
      path: "components.div.children.footer.children.submitButton",
      property: "visible",
      value: isSubmitButtonVisible,
    },
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

export const getActionDefinationForStepper = (path) => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true,
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false,
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false,
    },
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false,
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true,
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
        marginRight: "16px",
      },
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left",
        },
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "BILL_COMMON_BUTTON_PREV_STEP",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious,
    },
    visible: false,
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px",
      },
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "BILL_COMMON_BUTTON_NXT_STEP",
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right",
        },
      },
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext,
    },
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px",
      },
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "BILL_COMMON_BUTTON_SUBMIT",
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right",
        },
      },
    },
    onClickDefination: {
      action: "condition",
      callBack: submitApplication,
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action: "APPLY"
    // },
    visible: false,
  },
});
