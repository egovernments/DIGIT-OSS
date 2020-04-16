import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getDetailsForOwner } from "../../utils";
import get from "lodash/get";
import "./index.css";

const showComponent = (dispatch, componentJsonPath, display, oldStyle = {}) => {
  let displayProps = display ? { ...oldStyle ,display:'block'} : { ...oldStyle, display: "none" };
  dispatch(
    handleField("apply", componentJsonPath, "props.style", displayProps)
  );
};

const commonApplicantInformation = () => {
  return getCommonGrayCard({

    applicantCard: getCommonContainer({

      applicantName: getTextField({
        label: {
          labelName: "Name",
          labelKey: "PT_MUTATION_APPLICANT_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "PT_MUTATION_APPLICANT_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "Property.ownersTemp[0].name",
        props: {
          className: "applicant-details-error"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      genderRadioGroup: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath:
          "Property.ownersTemp[0].gender",
        props: {
          label: { name: "Gender", key: "PT_MUTATION_TRANSFEREE_GENDER_LABEL" },
          className: "applicant-details-error",
          buttons: [
            {
              labelName: "Male",
              labelKey: "PT_MUTATION_TRANSFEREE_GENDER_MALE_RADIOBUTTON",
              value: "MALE"
            },
            {
              labelName: "FEMALE",
              labelKey: "PT_MUTATION_TRANSFEREE_GENDER_FEMALE_RADIOBUTTON",
              value: "FEMALE"
            },
            {
              labelName: "Transgender",
              labelKey: "PT_MUTATION_TRANSFEREE_GENDER_TRANSGENDER_RADIOBUTTON",
              value: "TRANSGENDER"
            }
          ],

          required: true,
          errorMessage: "Required",
        },
        required: true,
        type: "array"
      },
      mobileNumber: getTextField({
        label: {
          labelName: "Mobile No.",
          labelKey: "PT_MUTATION_APPLICANT_MOBILE_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "PT_MUTATION_APPLICANT_MOBILE_NO_PLACEHOLDER"
        },
        required: true,
        props: {
          className: "applicant-details-error"
        },
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "PT_MUTATION_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath:
          "Property.ownersTemp[0].mobileNumber",
        // props: {
        //   style: {
        //     maxWidth: "450px"
        //   }
        // },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      // dummyDiv: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Div",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 12,
      //     md: 6
      //   },
      //   props: {
      //     disabled: true
      //   }
      // },
      guardianName: getTextField({
        label: {
          labelName: "Guardian's Name",
          labelKey: "PT_MUTATION_TRANSFEREE_GUARDIAN_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Guardian's Name",
          labelKey: "PT_MUTATION_TRANSFEREE_GUARDIAN_NAME_LABEL_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath:
          "Property.ownersTemp[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      relationshipWithGuardian: getSelectField({
        label: {
          labelName: "Relationship with Guardian",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_RELATIONSHIP_LABEL"
        },
        placeholder: {
          labelName: "Select Relationship with Guardian",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_RELATIONSHIP_LABEL_PLACEHOLDER"
        },
        required: true,
        jsonPath:
          "Property.ownersTemp[0].relationship",
        data: [
          {
            code: "FATHER"
          },
          {
            code: "HUSBAND"
          }
        ],
        localePrefix: {
          moduleName: "common-masters",
          masterName: "OwnerType"
        },
        //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      applicantEmail: getTextField({
        label: {
          labelName: "Email",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_EMAIL_LABEL"
        },
        placeholder: {
          labelName: "Enter Email",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_EMAIL_PLACEHOLDER"
        },
        pattern: getPattern("Email"),
        errorMessage: "Invalid Email",
        jsonPath:
          "Property.ownersTemp[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),

      specialApplicantCategory: {
        ...getSelectField({
          label: {
            labelName: "Special Applicant Category",
            labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_LABEL"
          },
          placeholder: {
            labelName: "Select Special Applicant Category",
            labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER"
          },
          jsonPath:
            "Property.ownersTemp[0].ownerType",
          required: true,
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerType"
          },
          sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {

        
            let dynamicPath= `${action.componentJsonpath.split('.specialApplicantCategory')[0]}`;
            
          const categoryDocumentJsonPath = `${dynamicPath}.specialCategoryDocument`;
 const specialCategoryDocumentTypeJsonPath =`${dynamicPath}.specialCategoryDocumentType`;

//  componentJsonpath: "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.items[0].item0.children.cardContent.children.ownerContainer.children.ownerDocumentId"


//  const thirdStepPath="components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.items[0].item0.children.cardContent.children.ownerContainer.children";
const thirdStepPath= "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children";

 const categoryDocumentThirdStepJsonPath = `${thirdStepPath}.ownerDocumentId.props.style`;


 const categoryDocumentTypeThirdStepJsonPath =`${thirdStepPath}.ownerSpecialDocumentType.props.style`;


          if (action.value === "NONE" || action.value === " ") {
            showComponent(dispatch, categoryDocumentJsonPath, false);
            dispatch(handleField("apply", categoryDocumentJsonPath, "required", false));
            dispatch(handleField("apply", categoryDocumentJsonPath, "props.value", ""));
            showComponent(dispatch, specialCategoryDocumentTypeJsonPath, false);
            dispatch(handleField("apply", specialCategoryDocumentTypeJsonPath, "required", false));
            dispatch(handleField("apply", specialCategoryDocumentTypeJsonPath, "props.value", ""));
            //showComponent(dispatch, categoryDocumentThirdStepJsonPath, false);
      
            dispatch(handleField("apply", categoryDocumentThirdStepJsonPath, "display", "none"));
            dispatch(handleField("apply", categoryDocumentTypeThirdStepJsonPath, "display", "none"));


          } else {
            let documentType = get(
              state,
              "screenConfiguration.preparedFinalObject.applyScreenMdmsData.OwnerTypeDocument",
              []
            );
            documentType = documentType.filter(document => {
              return action.value === document.ownerTypeCode
            })
            if (documentType.length == 1) {
              dispatch(handleField("apply", specialCategoryDocumentTypeJsonPath, "props.value", documentType[0].code));
            }
            showComponent(dispatch, categoryDocumentJsonPath, true);
            showComponent(dispatch, specialCategoryDocumentTypeJsonPath, true);
        
            dispatch(handleField("apply", categoryDocumentThirdStepJsonPath, "display","block"));
            dispatch(handleField("apply", categoryDocumentTypeThirdStepJsonPath, "display", "block"));

          }
        },
      },

      applicantAddress: getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Correspondence Address",
          labelKey: "PT_MUTATION_TRANSFEREE_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        required: true,
        errorMessage: "Invalid Address",
        jsonPath:
          "Property.ownersTemp[0].permanentAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      specialCategoryDocumentType: getSelectField({
        label: {
          labelName: "Document Type",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Enter Document Type.",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_TYPE_PLACEHOLDER"
        },
        required: true,
        jsonPath:
          "Property.ownersTemp[0].documentType",
        localePrefix: {
          moduleName: "PropertyTax",
          masterName: "ReasonForTransfer"
        },
        sourceJsonPath: "applyScreenMdmsData.OwnerTypeDocument",
        props: {
          className: "applicant-details-error",
          style: {
            display: "none"
          },

        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      specialCategoryDocument: getTextField({
        label: {
          labelName: "Document Id No.",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Document Id No.",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        required: true,
        // errorMessage: "Invalid Address",
        jsonPath:
          "Property.ownersTemp[0].documentUid",
        // gridDefination: {
        //   xs: 12,
        //   sm: 12,
        //   md: 6
        // },
        props: {
          className: "applicant-details-error",
          style: {
            display: "none"
          },

        }
      }),


    })
  });
};

const institutionTypeInformation = () => {
  return getCommonCard(
    {
      institutionTypeDetailsContainer: getCommonContainer({

        privateInstitutionNameDetails: getTextField({
          label: {
            labelName: "Institution Name",
            labelKey: "PT_MUTATION_INSTITUTION_NAME"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Institution Name",
            labelKey: "PT_MUTATION_INSTITUTION_NAME_PLACEHOLDER"
          },
          required: true,
          // pattern: getPattern("Name"),
          jsonPath: "Property.institutionTemp.institutionName"
        }),

        privateInstitutionTypeDetails: getSelectField({
          label: {
            labelName: "Institution Type",
            labelKey: "PT_MUTATION_INSTITUTION_TYPE"
          },
          placeholder: {
            labelName: "Enter Institution Type",
            labelKey: "PT_MUTATION_INSTITUTION_TYPE_PLACEHOLDER"
          },
          required: true,
          jsonPath:
            "Property.institutionTemp.institutionType",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          required: true,
          sourceJsonPath: "applyScreenMdmsData.common-masters.Institutions",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          }
        }),

      }),
    })
};
const institutionInformation = () => {
  return getCommonCard(
    {
      header: getCommonTitle(
        {
          labelName: "Details of Authorised Person",
          labelKey: "PT_MUTATION_AUTHORISED_PERSON_DETAILS"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),


      institutionDetailsContainer: getCommonContainer({

        authorisedPersonName: getTextField({
          label: {
            labelName: "Name",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_NAME"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Name",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name"),
          jsonPath: "Property.institutionTemp.name"
        }),

        authorisedDesignationValue: getTextField({
          label: {
            labelName: "Designation",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_DESIGNATION"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Designation",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_DESIGNATION_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name"),
          jsonPath: "Property.institutionTemp.designation"
        }),
        authorisedMobile: getTextField({
          label: {
            labelName: "Mobile",
            labelKey: "PT_MUTATION_AUTHORISED_MOBILE"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Mobile",
            labelKey: "PT_MUTATION_AUTHORISED_MOBILE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Number"),
          jsonPath: "Property.institutionTemp.mobileNumber"
        }),
        authorisedLandline: getTextField({
          label: {
            labelName: "Landline",
            labelKey: "PT_MUTATION_AUTHORISED_LANDLINE"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Landline",
            labelKey: "PT_MUTATION_AUTHORISED_LANDLINE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Landline"),
          jsonPath: "Property.institutionTemp.landlineNumber"
        }),
        authorisedEmail: getTextField({
          label: {
            labelName: "Email",
            labelKey: "PT_MUTATION_AUTHORISED_EMAIL"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Email",
            labelKey: "PT_MUTATION_AUTHORISED_EMAIL_PLACEHOLDER"
          },
          pattern: getPattern("Email"),
          jsonPath: "Property.institutionTemp.email"
        }),
        authorisedAddress: getTextField({
          label: {
            labelName: "Correspondence Address",
            labelKey: "PT_MUTATION_AUTHORISED_CORRESPONDENCE_ADDRESS"
          },
          props: {
            className: "applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Correspondence Address",
            labelKey: "PT_MUTATION_AUTHORISED_ADDRESS_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Address"),
          jsonPath: "Property.institutionTemp.correspondenceAddress"
        }),
      })
    })
};




export const transfereeDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Transferee Details",
      labelKey: "PT_MUTATION_TRANSFEREE_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  applicantTypeContainer: getCommonContainer({
    applicantTypeSelection: getCommonContainer({
      applicantType: {
        ...getSelectField({
          label: {
            labelName: "Ownership Type",
            labelKey: "PT_MUTATION_APPLICANT_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Ownership Type",
            labelKey: "PT_MUTATION_APPLICANT_TYPE_LABEL_PLACEHOLDER"
          },
          jsonPath:
            "Property.ownershipCategoryTemp",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          // data: [
          //   {
          //     code: "Individual"
          //   },
          //   {
          //     code: "Multiple"
          //   },
          //   {
          //     code: "Institutional-Private"
          //   }
          // ],
          required: true,
          sourceJsonPath: "applyScreenMdmsData.DropdownsData.OwnershipCategory",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            className: "applicant-details-error"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
        
          let path = "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionType.children.cardContent.children.institutionTypeDetailsContainer.children.privateInstitutionTypeDetails";


          let applicantType = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.Institutions",
            []
          );
          let applicantSubType = applicantType.filter(item => {
            return item.active && item.parent.startsWith(action.value);
          });
          dispatch(handleField("apply", path, "props.data", applicantSubType));

          // let applicantType = get(
          //   state,
          //   "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
          //   []
          // );

          let singleApplicantContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
          let multipleApplicantContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer"
          let institutionContainerJsonPath =
            "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
          let institutionTypeContainerJsonPath = "components.div.children.formwizardFirstStep.children.transfereeDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
          let singleMultipleOwnerPath = "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transfereeSummary";
          let institutionPath = "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transfereeInstitutionSummary";

          if (action.value.includes("SINGLEOWNER")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, true, get(state, `screenConfiguration.screenConfig.apply.${singleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, multipleApplicantContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${multipleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionTypeContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionTypeContainerJsonPath}.props.style`));
            showComponent(dispatch, singleMultipleOwnerPath, true, get(state, `screenConfiguration.screenConfig.apply.${singleMultipleOwnerPath}.props.style`));
            showComponent(dispatch, institutionPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionPath}.props.style`));

          } else if (action.value.includes("INSTITUTIONAL")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${singleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, multipleApplicantContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${multipleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionContainerJsonPath, true, get(state, `screenConfiguration.screenConfig.apply.${institutionContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionTypeContainerJsonPath, true, get(state, `screenConfiguration.screenConfig.apply.${institutionTypeContainerJsonPath}.props.style`));
            showComponent(dispatch, singleMultipleOwnerPath, false, get(state, `screenConfiguration.screenConfig.apply.${singleMultipleOwnerPath}.props.style`));
            showComponent(dispatch, institutionPath, true, get(state, `screenConfiguration.screenConfig.apply.${institutionPath}.props.style`));


          }
          else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${singleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, multipleApplicantContainerJsonPath, true, get(state, `screenConfiguration.screenConfig.apply.${multipleApplicantContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionContainerJsonPath}.props.style`));
            showComponent(dispatch, institutionTypeContainerJsonPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionTypeContainerJsonPath}.props.style`));
            showComponent(dispatch, singleMultipleOwnerPath, true, get(state, `screenConfiguration.screenConfig.apply.${singleMultipleOwnerPath}.props.style`));
            showComponent(dispatch, institutionPath, false, get(state, `screenConfiguration.screenConfig.apply.${institutionPath}.props.style`));


          }
        },
      },
    }),
    singleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        individualApplicantInfo: commonApplicantInformation()
      }
    },
    multipleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          display: "none"
        }
      },
      children: {
        multipleApplicantInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonApplicantInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Applicant",
              labelKey: "PT_MUTATION_ADD_APPLICANT_LABEL"
            },
            sourceJsonPath:
              "Property.ownersTemp",
            prefixSourceJsonPath:
              "children.cardContent.children.applicantCard.children"
          },
          type: "array"
        }
      }
    },
    institutionContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          display: "none"
        }
      },
      children: {
        institutionType: institutionTypeInformation(),
        institutionInfo: institutionInformation()
      }
    }
  })
});
