import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData,
  setDocsForEditFlow
} from "../../../../../ui-utils/commons";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";

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
  const reviewUrl = `${appendUrl}/fire-noc/summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    // let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");
    let isDocumentTypeRequired = false;


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
    setReviewPageRoute(state, dispatch);
  }
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
  let isMultiownerSelected = false;

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
    setDocsForEditFlow(state, dispatch)

  }

  if (activeStep === 2) {
    let isApplicantTypeCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantTypeSelection.children",
      state,
      dispatch
    );
    let isSingleApplicantCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.children.individualApplicantInfo.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );
    let isInstitutionCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionInfo.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );

    // Multiple applicants cards validations
    let multipleApplicantCardPath =
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items";
    // "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[0].item0.children.cardContent.children.applicantCard"
    let multipleApplicantCardItems = get(
      state.screenConfiguration.screenConfig.apply,
      multipleApplicantCardPath,
      []
    );
    let isMultipleApplicantCardValid = true;
    for (var j = 0; j < multipleApplicantCardItems.length; j++) {
      if (
        (multipleApplicantCardItems[j].isDeleted === undefined ||
          multipleApplicantCardItems[j].isDeleted !== false) &&
        !validateFields(
          `${multipleApplicantCardPath}[${j}].item${j}.children.cardContent.children.applicantCard.children`,
          state,
          dispatch,
          "apply"
        )
      )
        isMultipleApplicantCardValid = false;
    }

    let selectedApplicantType = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
      "SINGLE"
    );
    if (selectedApplicantType.includes("INSTITUTIONAL")) {
      isSingleApplicantCardValid = true;
      isMultipleApplicantCardValid = true;
    } else if (selectedApplicantType.includes("MULTIPLEOWNERS")) {
      isSingleApplicantCardValid = true;
      isInstitutionCardValid = true;
      let ownersArray = get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicantDetails.owners",
        []
      );
      let ownersArraylength = ownersArray && ownersArray.length;
      if (ownersArraylength < 2) {
        isMultiownerSelected = true;
        isFormValid = false;
      }
    } else {
      isMultipleApplicantCardValid = true;
      isInstitutionCardValid = true;
    }

    if (
      !isApplicantTypeCardValid ||
      !isSingleApplicantCardValid ||
      !isInstitutionCardValid ||
      !isMultipleApplicantCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
  }

  if (activeStep === 3) {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    if (getQueryArg(window.location.href, "action") === "edit") {



      let ownerDocs = [];
      let buildDocs = [];
      let docs = [];
      let docsForEdit = {}
      const documentsUploadRedux = get(state,
        "screenConfiguration.preparedFinalObject.documentsUploadRedux",
        {}
      );
      Object.keys(documentsUploadRedux).map((key, index) => {
        if (documentsUploadRedux[key].documents && Array.isArray(documentsUploadRedux[key].documents) && documentsUploadRedux[key].documents.length > 0) {
          let documentObj = {
            fileName: documentsUploadRedux[key].documents[0].fileName || `Document - ${index + 1}`,

            fileUrl: documentsUploadRedux[key].documents[0].fileUrl,
            documentType: documentsUploadRedux[key].documents[0].documentType,
            fileStoreId: documentsUploadRedux[key].documents[0].fileStoreId,
            tenantId: tenantId
          };
          if (documentsUploadRedux[key].documentType == "OWNER") {

            ownerDocs.push({ ...documentObj })
            docsForEdit[documentsUploadRedux[key].documentCode] = { ...documentObj };
          } else if (documentsUploadRedux[key].documentType == "BUILDING") {
            let key1 = documentsUploadRedux[key].documentSubCode ? documentsUploadRedux[key].documentSubCode : documentsUploadRedux[key].documentCode
            buildDocs.push({ ...documentObj, documentType: key1 })
            docsForEdit[key1] = { ...documentObj };
          }
          docs.push({ ...documentObj })

        }
      })
      dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.documents", [...ownerDocs]));
      dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.buildings[0].applicationDocuments", [...buildDocs]));
      dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.additionalDetail.ownerAuditionalDetail", [...ownerDocs]));
      dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.additionalDetail.documents", [...docs]));




      //EDIT FLOW
      const businessId = getQueryArg(
        window.location.href,
        "applicationNumber"
      );

      dispatch(
        setRoute(
          `/fire-noc/search-preview?applicationNumber=${businessId}&tenantId=${tenantId}&edited=true`
        )
      );
      const updateMessage = {
        labelName: "Rates will be updated on submission",
        labelKey: "TL_COMMON_EDIT_UPDATE_MESSAGE"
      };
      dispatch(toggleSnackbar(true, updateMessage, "info"));
    }
    else {
      moveToReview(state, dispatch);
    }
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
    }
    else if (isMultiownerSelected) {
      let errorMessage = {
        labelName: "Please add all the owner details!",
        labelKey: "ERR_FILL_MULTIPLE_OWNER"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
    else if (hasFieldToaster) {
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
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
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
        // minWidth: "200px",
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
        //minWidth: "200px",
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
