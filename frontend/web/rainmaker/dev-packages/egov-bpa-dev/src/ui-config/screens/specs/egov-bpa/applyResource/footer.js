import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, getBpaTextToLocalMapping } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateBpaApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
const setReviewPageRoute = (state, dispatch) => {
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.address.city"
  ) || getQueryArg(window.location.href, "tenantId") || getTenantId();
  const applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.applicationNo"
  );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-bpa/summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "nocDocumentsUploadRedux")
  );

  let validateDocumentField = false;

  if (documentsFormat && documentsFormat.length > 0) {
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
            if (get(documentsFormat[i], "natureOfNoc.value")) {
              validateDocumentField = true;
            }else if (get(documentsFormat[i], "remarks.value")) {
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
  } else {
    setReviewPageRoute(state, dispatch);
  }


};

const getMdmsData = async (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId.value"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: 'pb',
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            },
            {
              name: "OwnerType"
            },
            {
              name: "OwnerShipCategory"
            }
          ]
        },
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping"
            },
            {
              name: "ApplicationType"
            },
            {
              name: "ServiceType"
            }
          ],
          RiskTypeComputation: [
            {
              fromPlotArea: 500,
              toPlotArea: "Infinity",
              fromBuildingHeight: 15,
              toBuildingHeight:"Infinity",
              RiskType: "HIGH"
            },{
              fromPlotArea: 300,
              toPlotArea: 500,
              fromBuildingHeight: 10,
              toBuildingHeight:15,
              RiskType: "MEDIUM"
            },{
              fromPlotArea: 0,
              toPlotArea: 300,
              fromBuildingHeight: 0,
              toBuildingHeight:10,
              RiskType: "LOW"
            }
          ]
        }
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
        "applyScreenMdmsData",
        payload.MdmsRes
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const getFloorDetail = (index) => {
  let floorNo = ['Ground', 'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
  if(index) {
    return `${floorNo[index]} floor`;
  }
};

const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0,0);
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  let hasFieldToaster = false;

  if (activeStep === 0) {
    let isBasicDetailsCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.basicDetails.children.cardContent.children.basicDetailsContainer.children",
      state,
      dispatch
    );
    let isLocationDetailsCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.bpaDetailsConatiner.children",
      state,
      dispatch
    );

    if (
      !isBasicDetailsCardValid ||
      !isLocationDetailsCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
    const response = get(
      state,
      "screenConfiguration.preparedFinalObject.scrutinyDetails.planDetail.blocks[0].building.floors",
      []
  );
    let tableData = response.map((item, index) => (
      {
      [getBpaTextToLocalMapping("Floor Description")]: getFloorDetail((item.number).toString()) || '-',
      [getBpaTextToLocalMapping("Level")]:item.number,     
      [getBpaTextToLocalMapping("Occupancy/Sub Occupancy")]: item.occupancies[0].type || "-",
      [getBpaTextToLocalMapping("Buildup Area")]: item.occupancies[0].builtUpArea || "0",
      [getBpaTextToLocalMapping("Floor Area")]: item.occupancies[0].floorArea || "0",
      [getBpaTextToLocalMapping("Carpet Area")]: item.occupancies[0].carpetArea || "0"
    }));
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.proposedBuildingDetails.children.cardContent.children.proposedContainer.children.proposedBuildingDetailsContainer",
        "props.data",
        tableData
      )
    );
  }

  if (activeStep === 1) {
    let isBuildingPlanScrutinyDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.buildingPlanScrutinyDetails.children.cardContent.children.buildingPlanScrutinyDetailsContainer.children",
      state,
      dispatch
    );
    let isBlockWiseOccupancyAndUsageDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.blockWiseOccupancyAndUsageDetails.children.cardContent.children.blockWiseOccupancyAndUsageDetailscontainer.children.cardContent.children.blockWiseContainer.children",
      state, 
      dispatch
    )
    let isDemolitiondetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.demolitiondetails.children.cardContent.children.demolitionDetailsContainer.children",
      state,
      dispatch
    );
    let isProposedBuildingDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.proposedBuildingDetails.children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
      state,
      dispatch
    );

    if (
      // !isBuildingPlanScrutinyDetailsCardValid 
      !isBlockWiseOccupancyAndUsageDetailsCardValid ||
      !isDemolitiondetailsCardValid ||
      !isProposedBuildingDetailsCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
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
      "screenConfiguration.preparedFinalObject.BPA.ownershipCategory",
      "SINGLE"
    );
    if (selectedApplicantType.includes("INSTITUTIONAL")) {
      isSingleApplicantCardValid = true;
      isMultipleApplicantCardValid = true;
    } else if (selectedApplicantType.includes("MULTIPLEOWNERS")) {
      isSingleApplicantCardValid = true;
      isInstitutionCardValid = true;
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
   
    let isDetailsofplotCardValid = validateFields(
      "components.div.children.formwizardFourthStep.children.detailsofplot.children.cardContent.children.detailsOfPlotContainer.children",
      state,
      dispatch
    );

    if (
      !isDetailsofplotCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
  }

  if (activeStep === 4) {
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
      }
    }
  }

  if (activeStep === 5) {
    moveToReview(state, dispatch);
  }

  if (activeStep !== 5) {
    if (isFormValid) {
      let responseStatus = "success";
      if(activeStep === 1){
        // dispatch(prepareFinalObject("BPA.owners[0].primaryOwner", true));
        // dispatch(prepareFinalObject("BPA.owners[0].ownerType", "NONE"));
      }
      if (activeStep === 3) {
        // getMdmsData(state, dispatch);
        // prepareDocumentsUploadData(state, dispatch);
      }
      if (activeStep === 2) {
        let checkingOwner = get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.ownershipCategory"
        );
        let ownerDetails = get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.owners"
        );

        if (checkingOwner && checkingOwner === "INDIVIDUAL.SINGLEOWNER") {
          let primaryOwner = get(
            state.screenConfiguration.preparedFinalObject,
            "BPA.owners[0].isPrimaryOwner"
          );
          if (primaryOwner && primaryOwner === true) {
            let response = await createUpdateBpaApplication(
              state,
              dispatch,
              "INITIATE"
            );
            prepareDocumentsUploadData(state, dispatch);  
            responseStatus = get(response, "status", "");
            responseStatus === "success" && changeStep(state, dispatch);
          } else {
            let errorMessage = {
              labelName: "Please check is primary owner",
              labelKey: "ERR_PRIMARY_OWNER_TOAST"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
        } else if (checkingOwner && checkingOwner === "INDIVIDUAL.MULTIPLEOWNERS") {
          let count = 0, ownerPrimaryArray = [];
          ownerDetails.forEach((owner, index) => {
            let primaryOwner = get(
              state.screenConfiguration.preparedFinalObject,
              `BPA.owners[${index}].isPrimaryOwner`
            );
            if (primaryOwner && primaryOwner === true) {
              ownerPrimaryArray.push(primaryOwner)
            }
          });
          if (ownerPrimaryArray && ownerPrimaryArray.length > 0) {
            if (ownerPrimaryArray.length > 1) {
              let errorMessage = {
                labelName: "Please check only one primary owner",
                labelKey: "ERR_PRIMARY_ONE_OWNER_TOAST"
              };
              dispatch(toggleSnackbar(true, errorMessage, "warning"));
            } else {                         
              let response = await createUpdateBpaApplication(
                state,
                dispatch,
                "INITIATE"
              );
              prepareDocumentsUploadData(state, dispatch);  
              responseStatus = get(response, "status", "");
              responseStatus === "success" && changeStep(state, dispatch);
            }
          } else {
            let errorMessage = {
              labelName: "Please check is primary owner",
              labelKey: "ERR_PRIMARY_OWNER_TOAST"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
        }
      } else {
        if(activeStep === 0){
          const occupancytypeValid = get(
            state,
            "screenConfiguration.preparedFinalObject.scrutinyDetails.planDetail.planInformation.occupancy",
            []
          );
          if(occupancytypeValid.length === 0){
            let errorMessage = {
              labelName: "Please search scrutiny details linked to the scrutiny number",
              labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_SEARCH_TITLE"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning")); 
          }else{
            responseStatus === "success" && changeStep(state, dispatch);
          }
        }else{
          responseStatus === "success" && changeStep(state, dispatch);
        }
      }
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and upload the documents!",
        labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
      };
      switch (activeStep) {
        case 0:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Basic Details, then proceed!",
            labelKey: "Please fill all mandatory fields for Basic Details, then proceed!"
          };
          break;
        case 1:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Scrutiny Details, then proceed!",
            labelKey: "Please fill all mandatory fields for Scrutiny Details, then proceed!"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
        case 3:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Plot & Boundary Details, then proceed!",
            labelKey: "Please fill all mandatory fields for Plot & Boundary Details, then proceed!"
          };
          break;
        case 4:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Plot & Boundary Info Details, then proceed!",
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
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 6 ? true : false;
  const isPayButtonVisible = activeStep === 6 ? true : false;
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
    case 3:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    case 4:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSixthStep"
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
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardSixthStep",
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
        labelKey: "TL_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "TL_COMMON_BUTTON_NXT_STEP"
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
      callBack: callBackForNext
    },
    visible: false
  }
});