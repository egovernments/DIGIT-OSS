import { convertDateToEpoch, dispatchMultipleFieldChangeAction, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { disableField, enableField, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import compact from "lodash/compact";
import get from "lodash/get";
import store from "ui-redux/store";
import { httpRequest } from "../../../../../ui-utils";
import { prepareDocumentsUploadData } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter, validateFields } from "../../utils";
import { onChangeTypeOfOwnership } from "../applyResourceMutation/transfereeDetails";
import "./index.css";


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
    get(state.screenConfiguration.preparedFinalObject, "ptmDocumentsUploadRedux")
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
            { labelName: "Please upload mandatory documents!", labelKey: "" },
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
        { moduleName: "PropertyTax", masterDetails: [{ name: "MutationDocuments" }] }
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
        payload.MdmsRes.PropertyTax.MutationDocuments
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
    consumerCode=consumerCode==null?propertyPayload.propertyId:consumerCode;

  if (process.env.REACT_APP_NAME === "Citizen" && propertyPayload && !propertyPayload.declaration) {
    const errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_CITIZEN_DECLARATION_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }


  let documentsUploadRedux = get(
    state, "screenConfiguration.preparedFinalObject.ptmDocumentsUploadRedux");

  let isDocumentValid = true;
  Object.keys(documentsUploadRedux).map((key) => {
    if (documentsUploadRedux[key].documents && documentsUploadRedux[key].documents.length > 0 && !(documentsUploadRedux[key].dropdown && documentsUploadRedux[key].dropdown.value)) {
      isDocumentValid = false;
    }
  });
  if (!isDocumentValid) {
    dispatch(toggleSnackbar(true, { labelName: "Please select document type for uploaded document", labelKey: "ERR_DOCUMENT_TYPE_MISSING" }, "error"));
    return;
  }
  disableField('apply', "components.div.children.footer.children.payButton", dispatch);


  propertyPayload.workflow = {
    "businessService": "PT.MUTATION",
    tenantId,
    "action": getQueryArg(window.location.href, "action") === "edit"?"REOPEN":"OPEN",
    "moduleName": "PT"
  },
    propertyPayload.owners.map(owner => {
      owner.status = "INACTIVE";

    })

  propertyPayload.ownersTemp.map(owner => {
    if (owner.documentUid && owner.documentType) {
      owner.documents = [{}]
      owner.documents[0].fileStoreId = owner.documentUid;
      owner.documents[0].documentType = owner.documentType;
      owner.documents[0].documentUid = owner.documentUid;
    }
  })
  propertyPayload.additionalDetails.documentDate = convertDateToEpoch(
    propertyPayload.additionalDetails.documentDate);

  if (propertyPayload.ownershipCategory.includes("INDIVIDUAL") && propertyPayload.ownershipCategoryTemp.includes("INDIVIDUAL")) {
    propertyPayload.ownersTemp.map(owner => {
      owner.status = "ACTIVE";
      // owner.ownerType = 'NONE';
    })
    propertyPayload.owners = [...propertyPayload.owners, ...propertyPayload.ownersTemp]
    delete propertyPayload.ownersTemp;
  } else if (propertyPayload.ownershipCategory.includes("INSTITUTIONAL") && propertyPayload.ownershipCategoryTemp.includes("INDIVIDUAL")) {
    propertyPayload.ownersTemp.map(owner => {
      owner.status = "ACTIVE";
      owner.ownerType = 'NONE';
    })
    propertyPayload.institution = null;
    propertyPayload.owners = [...propertyPayload.owners, ...propertyPayload.ownersTemp]
    delete propertyPayload.ownersTemp;
  } else if (propertyPayload.ownershipCategory.includes("INDIVIDUAL") && propertyPayload.ownershipCategoryTemp.includes("INSTITUTIONAL")) {
    propertyPayload.owners.map(owner => {
      owner.altContactNumber = propertyPayload.institutionTemp.landlineNumber;
    })
    propertyPayload.institution = {};
    propertyPayload.institution.nameOfAuthorizedPerson = propertyPayload.institutionTemp.name;
    propertyPayload.institution.name = propertyPayload.institutionTemp.institutionName;
    propertyPayload.institution.designation = propertyPayload.institutionTemp.designation;
    propertyPayload.institution.tenantId = tenantId;
    propertyPayload.institution.type = propertyPayload.institutionTemp.institutionType;

    propertyPayload.institutionTemp.altContactNumber = propertyPayload.institutionTemp.landlineNumber;
    propertyPayload.institutionTemp.ownerType = "NONE";
    propertyPayload.institutionTemp.status = "ACTIVE";
    // propertyPayload.institutionTemp.type = propertyPayload.ownershipCategoryTemp;
    propertyPayload.owners = [...propertyPayload.owners, propertyPayload.institutionTemp]
    delete propertyPayload.institutionTemp;
  } else if (propertyPayload.ownershipCategory.includes("INSTITUTIONAL") && propertyPayload.ownershipCategoryTemp.includes("INSTITUTIONAL")) {
    propertyPayload.institution = {};
    propertyPayload.institution.nameOfAuthorizedPerson = propertyPayload.institutionTemp.name;
    propertyPayload.institution.name = propertyPayload.institutionTemp.institutionName;
    propertyPayload.institution.designation = propertyPayload.institutionTemp.designation;
    propertyPayload.institution.tenantId = tenantId;
    propertyPayload.institution.type = propertyPayload.institutionTemp.institutionType;

    propertyPayload.institutionTemp.altContactNumber = propertyPayload.institutionTemp.landlineNumber;
    propertyPayload.institutionTemp.ownerType = "NONE";
    propertyPayload.institutionTemp.status = "ACTIVE";
    // propertyPayload.institutionTemp.type = propertyPayload.ownershipCategoryTemp;
    propertyPayload.owners = [...propertyPayload.owners, propertyPayload.institutionTemp]
    delete propertyPayload.institutionTemp;
  }
  propertyPayload.ownershipCategory = propertyPayload.ownershipCategoryTemp;
  delete propertyPayload.ownershipCategoryTemp;
  let newDocuments = Object.values(documentsUploadRedux).map(document => {
    if (document.dropdown && document.dropdown.value && document.documents && document.documents[0] && document.documents[0].fileStoreId) {
      let documentValue = document.dropdown.value.includes('TRANSFERREASONDOCUMENT') ? document.dropdown.value.split('.')[2] : document.dropdown.value;
      return {
        documentType: documentValue,
        fileStoreId: document.documents[0].fileStoreId,
        documentUid: document.documents[0].fileStoreId,
        auditDetails: null,
        status: "ACTIVE"
      }
    }
  });
  newDocuments = compact(newDocuments);
  let oldDocuments = [];
  oldDocuments = propertyPayload.documents && Array.isArray(propertyPayload.documents) && propertyPayload.documents.filter(document => {
    return (document.documentType.includes('USAGEPROOF') || document.documentType.includes('OCCUPANCYPROOF') || document.documentType.includes('CONSTRUCTIONPROOF'))
  })
  oldDocuments = oldDocuments || [];
  propertyPayload.documents = [...newDocuments, ...oldDocuments];

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
    propertyPayload.owners =propertyPayload.owners.filter(owner=>owner.isDeleted!==false);
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
      enableField('apply', "components.div.children.footer.children.payButton", dispatch);
      store.dispatch(
        setRoute(
          `acknowledgement?purpose=apply&status=success&applicationNumber=${payload.Properties[0].acknowldgementNumber}&moduleName=PT.MUTATION&tenantId=${tenantId}
          `
        )
      );
    }
    else {
      enableField('apply', "components.div.children.footer.children.payButton", dispatch);
      store.dispatch(
        setRoute(
          `acknowledgement?purpose=apply&status=failure&applicationNumber=${consumerCode}&tenantId=${tenantId}
          `
        )
      );
    }
  } catch (e) {
    enableField('apply', "components.div.children.footer.children.payButton", dispatch);
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
  let ownershipCategoryTemp = get(state, 'screenConfiguration.preparedFinalObject.Property.ownershipCategoryTemp');


  if (ownershipCategoryTemp.includes('INSTITUTIONAL')) {
    const newOwners = [get(state, 'screenConfiguration.preparedFinalObject.Property.institutionTemp', {})];
    const owners = get(state, 'screenConfiguration.preparedFinalObject.Property.owners');
    const names = owners.map(owner => {
      return owner.name
    })
    // const mobileNumbers = owners.map(owner => {
    //   if (owner.status == "ACTIVE") {
    //     return owner.mobileNumber;
    //   }
    // })
    // newOwners.map(owner => {
    //   if (mobileNumbers.includes(owner.mobileNumber)) {
    //     err = "OWNER_NUMBER_SAME";
    //   }
    // })
  } else {

    let newOwners = get(state, 'screenConfiguration.preparedFinalObject.Property.ownersTemp');
    if (newOwners && newOwners.length && newOwners.length > 1) {
      newOwners = newOwners.filter(object => {
        return !(object.isDeleted === false)
      })
    }
    const owners = get(state, 'screenConfiguration.preparedFinalObject.Property.owners');
    // const names = owners.map(owner => {
    //   return owner.name
    // })
    // const mobileNumbers = owners.map(owner => {
    //   if (owner.status == "ACTIVE") {
    //     return owner.mobileNumber;
    //   }
    // })
    // newOwners.map(owner => {
    //   if (mobileNumbers.includes(owner.mobileNumber)) {
    //     err = "OWNER_NUMBER_SAME";
    //   }
    // })
    if (!err && ownershipCategoryTemp.includes('MULTIPLEOWNERS') && newOwners.length == 1) {
      err = "OWNERSHIPTYPE_CANNOT_BE_MULTIPLE";
    }
  }

  return err;
}

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const isMutationDetailsCard = get(state, "screenConfiguration.preparedFinalObject.PropertyConfiguration[0].Mutation.MutationDetails");
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

    let isInstitutionTypeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionType.children.cardContent.children.institutionTypeDetailsContainer.children",
      state,
      dispatch
    );


    let isTransfereeDetailsCardValid = isSingleOwnerValid || isMutilpleOwnerValid || (isInstitutionValid && isInstitutionTypeValid);

    let isApplicantTypeValid = validateFields(
      "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.applicantTypeSelection.children",
      state,
      dispatch
    );

    let ismutationCardValid = isMutationDetailsCard ? validateFields(
      "components.div.children.formwizardFirstStep.children.mutationDetails.children.cardContent.children.mutationDetailsContainer.children",
      state,
      dispatch
    ) : true;
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
    if (getQueryArg(window.location.href, "action") === "edit") {
      dispatch(handleField('apply', "components.div.children.footer.children.payButton.children.submitButtonLabel",'props.labelKey',"PT_COMMON_BUTTON_RESUBMIT"))
      onChangeTypeOfOwnership({ value: get(state.screenConfiguration.preparedFinalObject, 'Property.ownershipCategoryTemp', '') }, state, dispatch)
    }else{
      dispatch(handleField('apply', "components.div.children.footer.children.payButton.children.submitButtonLabel",'props.labelKey',"PT_COMMON_BUTTON_SUBMIT"))
    }
  }

  if (activeStep === 1) {
    isFormValid = moveToReview(state, dispatch);


    const ownershipCategory = get(
      state.screenConfiguration.preparedFinalObject,
      "Property.ownershipCategory",
      ''
    );
    const ownershipCategoryTemp = get(
      state.screenConfiguration.preparedFinalObject,
      "Property.ownershipCategoryTemp",
      ''
    );

    if (ownershipCategory.includes("INSTITUTIONAL")) {
      let owner = get(
        state.screenConfiguration.preparedFinalObject,
        "Property.owners",
        []
      );
      owner = owner.filter(own => own.status == "ACTIVE");

      dispatch(
        prepareFinalObject(
          "Property.ownersInit",
          owner
        )
      );
    }
    else {
      let owner = get(
        state.screenConfiguration.preparedFinalObject,
        "Property.owners",
        []
      );
      owner = owner.filter(own => own.status == "ACTIVE");

      dispatch(
        prepareFinalObject(
          "Property.ownersInit",
          owner
        )
      );
    }
    if (ownershipCategoryTemp.includes("INSTITUTIONAL")) {
      const institutionTemp = get(
        state.screenConfiguration.preparedFinalObject,
        "Property.institutionTemp",
        ''
      );
      let temp = {};
      temp = { ...institutionTemp }
      temp.name = institutionTemp.institutionName;
      temp.fatherOrHusbandName = institutionTemp.name;
      temp.permanentAddress = institutionTemp.correspondenceAddress;
      const ownerTemp = [temp];
      dispatch(
        prepareFinalObject(
          "Property.ownersTemp",
          ownerTemp
        )
      );


    }

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
        labelKey: "PT_COMMON_BUTTON_PREV_STEP"
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
