import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, getBpaTextToLocalMapping,setProposedBuildingData, generateBillForBPA, residentialType } from "../../utils";
import "./index.css";
import { getQueryArg, getFileUrlFromAPI, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateBpaApplication,
  prepareDocumentsUploadData,
  prepareNOCUploadData,
  submitBpaApplication,
  updateBpaApplication,
  getNocSearchResults  
} from "../../../../../ui-utils/commons";
import { prepareNocFinalCards, compare } from "../../../specs/utils/index";
import { toggleSnackbar, prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";

const getMdmsData = async (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId.value"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
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
  }
};

const getFloorDetail = (index) => {
  let floorNo = ['Ground', 'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
  if(index) {
    return `${floorNo[index]} floor`;
  }
};

export const showApplyLicencePicker = (state, dispatch) => {
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
        let obj = {};
        obj.title = getTransformedLocale(doc.documentCode);
        obj.name = docDetail.fileName;
        obj.fileStoreId = docDetail.fileStoreId;
        obj.linkText = "View";
        obj.link = docDetail.fileUrl && docDetail.fileUrl.split(",")[0];
        if (docDetail.wfState === "SEND_TO_CITIZEN") {
          obj.createdBy = "BPA_ARCHITECT"
        }
        else if(docDetail.wfState === "DOC_VERIFICATION_PENDING") {
          obj.createdBy = "BPA_DOC_VERIFIER"
        }
        else if (docDetail.wfState === "FIELDINSPECTION_PENDING") {
          obj.createdBy = "BPA_FIELD_INSPECTOR"   
        }
        else if (docDetail.wfState === "NOC_VERIFICATION_PENDING") {
          obj.createdBy = "BPA_NOC_VERIFIER"    
        } else {
          obj.createdBy = "BPA_ARCHITECT"
        }
        
        documentsPreview.push(obj);
      });
    }
  });
  dispatch(prepareFinalObject("documentDetailsPreview", documentsPreview));
};

const getSummaryRequiredDetails = async (state, dispatch) => {
  const applicationNumber = get(state.screenConfiguration.preparedFinalObject, "BPA.applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const riskType = get(state.screenConfiguration.preparedFinalObject, "BPA.businessService");
  let businessService = "BPA.NC_APP_FEE"
  if(riskType === "BPA_LOW") {
    businessService = "BPA.LOW_RISK_PERMIT_FEE"
  }
  generateBillForBPA(dispatch, applicationNumber, tenantId, businessService);
  prepareDocumentsDetailsView(state, dispatch);
  await residentialType(state, dispatch);
  // dispatch(
  //   handleField(
  //     "apply",
  //     "components.div.children.formwizardFifthStep.children.bpaSummaryDetails.children.cardContent.children.applyDocSummary.children.cardContent.children.uploadedDocumentDetailsCard",            
  //     "visible",
  //     false
  //   )
  // )
}

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
    let isDetailsofplotCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.detailsofplot.children.cardContent.children.detailsOfPlotContainer.children",
      state,
      dispatch
    );

    if (
      !isBasicDetailsCardValid ||
      !isLocationDetailsCardValid ||
      !isDetailsofplotCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
    setProposedBuildingData(state,dispatch);
    await residentialType(state, dispatch);
  }

  if (activeStep === 1) {
    
    let isBuildingPlanScrutinyDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.buildingPlanScrutinyDetails.children.cardContent.children.buildingPlanScrutinyDetailsContainer.children",
      state,
      dispatch
    );
   /*  let isBlockWiseOccupancyAndUsageDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.blockWiseOccupancyAndUsageDetails.children.cardContent.children.blockWiseOccupancyAndUsageDetailscontainer.children.cardContent.children.applicantTypeSelection.children",
      state, 
      dispatch
    ); */
   
    let isProposedBuildingDetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.proposedBuildingDetails.children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
      state,
      dispatch
    );

    let isDemolitiondetailsCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.demolitiondetails.children.cardContent.children.demolitionDetailsContainer.children",
      state,
      dispatch
    );

    // let isabstractProposedBuildingDetailsCardValid = validateFields(
    //   "components.div.children.formwizardSecondStep.children.abstractProposedBuildingDetails.children.cardContent.children.proposedContainer.children.totalBuildUpAreaDetailsContainer.children",
    //   state,
    //   dispatch
    // );

    // if (
    //   !isBuildingPlanScrutinyDetailsCardValid || 
    //   //!isBlockWiseOccupancyAndUsageDetailsCardValid ||
    //   !isProposedBuildingDetailsCardValid ||
    //   !isDemolitiondetailsCardValid  
    //   // !isabstractProposedBuildingDetailsCardValid
    // ) {
    //   isFormValid = false;
    //   hasFieldToaster = true;
    // }


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
      "screenConfiguration.preparedFinalObject.BPA.landInfo.ownershipCategory",
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
      let responseStatus = "success";
      if(activeStep === 1){
        // dispatch(prepareFinalObject("BPA.owners[0].primaryOwner", true));
        // dispatch(prepareFinalObject("BPA.owners[0].ownerType", "NONE"));
      }
      if (activeStep === 3) {
        let nocData = get(state.screenConfiguration.preparedFinalObject, "nocForPreview", []);
        if(nocData && nocData.length > 0) { 
          nocData.map(items => {
            if(!items.readOnly) items.readOnly = items.readOnly ? false : true;
          })
          dispatch(prepareFinalObject("nocForPreview", nocData));
        }
      }
      if (activeStep === 2) {
        let checkingOwner = get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.landInfo.ownershipCategory"
        );
        let ownerDetails = get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.landInfo.owners"
        );
        let bpaStatus = get(
          state.screenConfiguration.preparedFinalObject,
          "BPA.status", ""
        )

        if (checkingOwner && checkingOwner === "INDIVIDUAL.SINGLEOWNER") {
          let primaryOwner = get(
            state.screenConfiguration.preparedFinalObject,
            "BPA.landInfo.owners[0].isPrimaryOwner"
          );
          if (primaryOwner && primaryOwner === true) {
            if (bpaStatus) {
              changeStep(state, dispatch);
            } else {
              let response = await createUpdateBpaApplication(
                state,
                dispatch,
                "INITIATE"
              );
              responseStatus = get(response, "status", "");
              responseStatus === "success" && changeStep(state, dispatch);
            }
            prepareDocumentsUploadData(state, dispatch);
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
              `BPA.landInfo.owners[${index}].isPrimaryOwner`
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
              if (bpaStatus) {
                changeStep(state, dispatch);
              } else {
                let response = await createUpdateBpaApplication(
                  state,
                  dispatch,
                  "INITIATE"
                );
                responseStatus = get(response, "status", "");
                responseStatus === "success" && changeStep(state, dispatch);
              }
              prepareDocumentsUploadData(state, dispatch);
            }
          } else {
            let errorMessage = {
              labelName: "Please check is primary owner",
              labelKey: "ERR_PRIMARY_OWNER_TOAST"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
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
      } else {
        if(activeStep === 0){
          const occupancytypeValid = get(
            state,
            "screenConfiguration.preparedFinalObject.scrutinyDetails.planDetail.occupancies[0].typeHelper.type.code",
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
            /*let licenceType = get(
              state.screenConfiguration.preparedFinalObject , 
              "applyScreenMdmsData.licenceTypes", []
              );
            let bpaStatus = get(
              state.screenConfiguration.preparedFinalObject,
              "BPA.status", ""
            )
            if(licenceType && licenceType.length > 1 && !bpaStatus) {
              showApplyLicencePicker(state, dispatch, activeStep);
            } else {
              responseStatus === "success" && changeStep(state, dispatch);
            }*/
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
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isSendToCitizenButtonVisible = activeStep === 4 ? true : false;
  const isSubmitButtonVisible = activeStep === 4 ? true : false;

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
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
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
  if (activeStep === 4) {
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
      action : "APPLY"
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
      callBack: updateBpaApplication
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action : "SEND_TO_CITIZEN"
    // },
    visible: false
  }
});
