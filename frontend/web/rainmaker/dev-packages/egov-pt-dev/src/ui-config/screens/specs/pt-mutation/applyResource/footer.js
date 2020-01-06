import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const setReviewPageRoute = (state, dispatch) => {
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  const applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicationNumber"
  );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/pt-mutation/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
 
    setReviewPageRoute(state, dispatch);
};

const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { moduleName: "FireNoc", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.FireNoc.Documents",
        payload.MdmsRes.FireNoc.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  // console.log(activeStep);
  let isFormValid = true;
  let hasFieldToaster = false;

  if (activeStep === 1) {
    let isPropertyLocationCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.propertyLocationDetails.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );
    let isSinglePropertyCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children",
      state,
      dispatch
    );

    // Multiple buildings cards validations
    let multiplePropertyCardPath =
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer.children.multipleBuilding.props.items";
    let multiplePropertyCardItems = get(
      state.screenConfiguration.screenConfig.apply,
      multiplePropertyCardPath,
      []
    );
    let isMultiplePropertyCardValid = true;
    for (var j = 0; j < multiplePropertyCardItems.length; j++) {
      if (
        (multiplePropertyCardItems[j].isDeleted === undefined ||
          multiplePropertyCardItems[j].isDeleted !== false) &&
        !validateFields(
          `${multiplePropertyCardPath}[${j}].item${j}.children.cardContent.children.multipleBuildingCard.children`,
          state,
          dispatch,
          "apply"
        )
      )
        isMultiplePropertyCardValid = false;
    }

    let noOfBuildings = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings"
    );
    if (noOfBuildings === "SINGLE") {
      isMultiplePropertyCardValid = true;
    } else {
      isSinglePropertyCardValid = true;
    }

    if (
      !isSinglePropertyCardValid ||
      !isPropertyLocationCardValid ||
      !isMultiplePropertyCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
  }

  if (activeStep === 2) {
    moveToReview(state, dispatch);
  }

  if (activeStep !== 3) {
    if (isFormValid) {
      let responseStatus = "success";
      if (activeStep === 1) {
        prepareDocumentsUploadData(state, dispatch);
      }
      if (activeStep === 2) {
        getMdmsData(state, dispatch);
        let response = await createUpdateNocApplication(
          state,
          dispatch,
          "INITIATE"
        );
        responseStatus = get(response, "status", "");
      }
      responseStatus === "success" && changeStep(state, dispatch);
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
    // if (activeStep === 2 && mode === "next") {
    //   const isDocsUploaded = get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "LicensesTemp[0].reviewDocData",
    //     null
    //   );
    //   activeStep = isDocsUploaded ? 3 : 2;
    // } else {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    // }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 3 ? true : false;
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
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
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
    },
    {
      path: "components.div.children.formwizardFourthStep",
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
        labelKey: "NOC_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "NOC_COMMON_BUTTON_NXT_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "NOC_COMMON_BUTTON_SUBMIT"
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
