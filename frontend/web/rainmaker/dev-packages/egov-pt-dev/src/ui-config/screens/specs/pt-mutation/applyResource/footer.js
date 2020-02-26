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
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import store from "ui-redux/store";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const setReviewPageRoute = (state, dispatch) => {
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.Property.tenantId"
  );
  const applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Property.acknowldgementNumber"
  );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/pt-mutation/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
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

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
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
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
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

  if (validateDocumentField) {
    return true;
    // setReviewPageRoute(state, dispatch);
  }
  else {
    return false;
  }
};

const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "Property.tenantId"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { moduleName: "PropertyTax", masterDetails: [{ name: "Documents" }] }
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
        "applyScreenMdmsData.PropertyTax.Documents",
        payload.MdmsRes.PropertyTax.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForApply = async (state, dispatch) => {

  let tenantId = getQueryArg(window.location.href, "tenantId");
  let consumerCode = getQueryArg(window.location.href, "consumerCode");
  let propertyPayload = get(
    state, "screenConfiguration.preparedFinalObject.Property");
  propertyPayload.workflow = {
    "businessService": "PT.MUTATION",
    tenantId,
    "action": "OPEN",
    "moduleName": "PT"
  },
    propertyPayload.owners.map(owner => {
      owner.status = "INACTIVE";

    })
  propertyPayload.additionalDetails.documentDate = 1581490792377;

  if (propertyPayload.ownershipCategoryTemp.includes("INSTITUTIONAL")) {
    propertyPayload.institutionTemp.altContactNumber = propertyPayload.institutionTemp.landlineNumber;
    propertyPayload.institutionTemp.ownerType = "NONE";
    propertyPayload.institutionTemp.status = "ACTIVE";
    // propertyPayload.institutionTemp.type = propertyPayload.ownershipCategoryTemp;
    propertyPayload.owners = [...propertyPayload.owners, propertyPayload.institutionTemp]
    delete propertyPayload.institutionTemp;
  }
  else {
    // 
    propertyPayload.ownersTemp.map(owner => {
      owner.status = "ACTIVE";
      owner.ownerType = 'NONE';
    })

    propertyPayload.owners = [...propertyPayload.owners, ...propertyPayload.ownersTemp]
    delete propertyPayload.ownersTemp;
  }
  propertyPayload.ownershipCategory = ownershipCategoryTemp;
  delete propertyPayload.ownershipCategoryTemp;

  try {
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "propertyIds",
        value: consumerCode
      }
    ];
    propertyPayload.creationReason = 'MUTATION';
    let payload = null;
    payload = await httpRequest(
      "post",
      "/property-services/property/_update",
      "_update",
      queryObject,
      { Property: propertyPayload }

    );
    // dispatch(prepareFinalObject("Properties", payload.Properties));
    // dispatch(prepareFinalObject("PropertiesTemp",cloneDeep(payload.Properties)));
    if (payload) {
      store.dispatch(
        setRoute(
          `acknowledgement?purpose=apply&status=success&applicationNumber=${payload.Properties[0].acknowldgementNumber}&tenantId=${tenantId}
          `
        )
      );
    }
    else {
      store.dispatch(
        setRoute(
          `acknowledgement?purpose=apply&status=failure&applicationNumber=${consumerCode}&tenantId=${tenantId}
          `
        )
      );
    }
  } catch (e) {
    console.log(e);
    store.dispatch(
      setRoute(
        `acknowledgement?purpose=apply&status=failure&applicationNumber=${consumerCode}&tenantId=${tenantId}
        `
      )
    );
  }
}

const validateMobileNumber = (state) => {
  let err = false;
  const newOwners = get(state, 'screenConfiguration.preparedFinalObject.Property.ownersTemp');
  const owners = get(state, 'screenConfiguration.preparedFinalObject.Property.owners');
  const names = owners.map(owner => {
    return owner.name
  })
  const mobileNumbers = owners.map(owner => {
    return owner.mobileNumber
  })
  newOwners.map(owner => {
    if (names.includes(owner.name)) {
      err = "OWNER_NAME_SAME";
    }
  })
  newOwners.map(owner => {
    if (mobileNumbers.includes(owner.mobileNumber)) {
      err = "OWNER_NUMBER_SAME";
    }
  })

  return err;
}

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  // console.log(activeStep);
  let errorMsg = false;
  let isFormValid = true;
  let hasFieldToaster = false;

  if (activeStep === 0) {
    let isSingleOwnerValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.children.individualApplicantInfo.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );
    let isMutilpleOwnerValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[0].item0.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );
    let isInstitutionValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionInfo.children.cardContent.children.institutionDetailsContainer.children",
      state,
      dispatch
    );


    let isTransfereeDetailsCardValid = isSingleOwnerValid || isMutilpleOwnerValid || isInstitutionValid;

    let isApplicantTypeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.applicantTypeSelection.children",
      state,
      dispatch
    );

    let ismutationCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.mutationDetails.children.cardContent.children.mutationDetailsContainer.children",
      state,
      dispatch
    );
    let isregistrationCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.registrationDetails.children.cardContent.children.registrationDetailsContainer.children",
      state,
      dispatch
    );


    if (
      !isregistrationCardValid ||
      !ismutationCardValid ||
      !isTransfereeDetailsCardValid ||
      !isApplicantTypeValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }

    if (isFormValid) {
      errorMsg = validateMobileNumber(state);
      errorMsg ? isFormValid = false : {};
    }



  }

  if (activeStep === 1) {
    isFormValid = moveToReview(state, dispatch);
  }
  if (activeStep === 2) {

  }
  if (activeStep !== 2) {
    if (isFormValid) {

      if (activeStep === 0) {
        prepareDocumentsUploadData(state, dispatch);
      }
      if (activeStep === 1) {
        getMdmsData(state, dispatch);


        // let response = await createUpdateNocApplication(
        //   state,
        //   dispatch,
        //   "INITIATE"
        // );
        // responseStatus = get(response, "status", "");
      }
      !hasFieldToaster && changeStep(state, dispatch);
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
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else if (errorMsg) {
      let errorMes = {
        labelName:
          "Duplicate Applicant Details",
        labelKey: errorMsg
      };
      dispatch(toggleSnackbar(true, errorMes, "warning"));
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
  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
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
        labelKey: "PT_COMMON_BUTTON_NXT_STEP"
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
        labelKey: "PT_COMMON_BUTTON_SUBMIT"
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
      callBack: callBackForApply
    },
    visible: false
  }
});
