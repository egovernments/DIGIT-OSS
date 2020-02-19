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

const showComponent = (dispatch, componentJsonPath, display) => {
  let displayProps = display ? {} : { display: "none" };
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
        jsonPath: "Properties[0].ownersTemp[0].name",
        props:{
          className:"applicant-details-error"
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
          "Properties[0].ownersTemp[0].gender",
        props: {
          label: { name: "Gender", key: "PT_MUTATION_TRANSFEREE_GENDER_LABEL" },
          className:"applicant-details-error",
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
          
          required: true
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
        props:{
          className:"applicant-details-error"
        },
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "PT_MUTATION_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath:
          "Properties[0].ownersTemp[0].mobileNumber",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              getDetailsForOwner(state, dispatch, fieldInfo);
            }
          }
        },
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
          "Properties[0].ownersTemp[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      }),
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
          "Properties[0].ownersTemp[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
        required:true,
        jsonPath:
          "Properties[0].ownersTemp[0].relationship",
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
      specialApplicantCategory: getSelectField({
        label: {
          labelName: "Special Applicant Category",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_LABEL"
        },
        placeholder: {
          labelName: "Select Special Applicant Category",
          labelKey: "PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER"
        },
        jsonPath:
          "Properties[0].ownersTemp[0].ownerType",
        // data: [
        //   {
        //     code: "A"
        //   },
        //   {
        //     code: "B"
        //   }
        // ],
        localePrefix: {
          moduleName: "common-masters",
          masterName: "OwnerType"
        },
        required:true,
        sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
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
        errorMessage: "Invalid Address",
        jsonPath:
          "Properties[0].ownersTemp[0].permanentAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      }),
    })
  });
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
      institutionTypeDetailsContainer: getCommonContainer({ 
        
        privateInstitutionNameDetails: getTextField({
          label: {
            labelName: "Name",
            labelKey: "PT_MUTATION_INSTITUTION_NAME"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Name",
            labelKey: "PT_MUTATION_INSTITUTION_NAME_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Name"),
          jsonPath: "Properties[0].institutionTemp.institutionName"
        }),
      }),

      institutionDetailsContainer: getCommonContainer({ 
        
        authorisedPersonName: getTextField({
          label: {
            labelName: "Name",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_NAME"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Name",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_NAME_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Name"),
        jsonPath: "Properties[0].institutionTemp.name"
        }),
          
        authorisedDesignationValue: getTextField({
          label: {
            labelName: "Designation",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_DESIGNATION"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Designation",
            labelKey: "PT_MUTATION_AUTHORISED_PERSON_DESIGNATION_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Name"),
         jsonPath: "Properties[0].institutionTemp.designation"
        }),
        authorisedMobile: getTextField({
          label: {
            labelName: "Mobile",
            labelKey: "PT_MUTATION_AUTHORISED_MOBILE"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Mobile",
            labelKey: "PT_MUTATION_AUTHORISED_MOBILE_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Number"),
          jsonPath: "Properties[0].institutionTemp.mobileNumber"
        }),
        authorisedLandline: getTextField({
            label: {
              labelName: "Landline",
              labelKey: "PT_MUTATION_AUTHORISED_LANDLINE"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Landline",
              labelKey: "PT_MUTATION_AUTHORISED_LANDLINE_PLACEHOLDER"
            },
            pattern: getPattern("MobileNo"),
            jsonPath: "Properties[0].institutionTemp.landlineNumber"
          }),
          authorisedEmail: getTextField({
            label: {
              labelName: "Email",
              labelKey: "PT_MUTATION_AUTHORISED_EMAIL"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Email",
              labelKey: "PT_MUTATION_AUTHORISED_EMAIL_PLACEHOLDER"
            },
            pattern: getPattern("Email"),
            jsonPath: "Properties[0].institutionTemp.email"
          }),
          authorisedAddress: getTextField({
            label: {
              labelName: "Correspondence Address",
              labelKey: "PT_MUTATION_AUTHORISED_CORRESPONDENCE_ADDRESS"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Correspondence Address",
              labelKey: "PT_MUTATION_AUTHORISED_ADDRESS_PLACEHOLDER"
            },
            required:true,
            pattern: getPattern("Address"),
            jsonPath: "Properties[0].institutionTemp.correspondenceAddress"
          }),
      })
    }) }; 




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
            "Properties[0].ownershipCategoryTemp",
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
          props:{
            className:"applicant-details-error"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let path = action.componentJsonpath.replace();
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
         
          if (action.value.includes("SINGLEOWNER")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, true);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, false);
            // showComponent(dispatch, applicantSubtypeJsonPath, false);
          } else if (action.value.includes("INSTITUTIONAL")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, true);
            // showComponent(dispatch, applicantSubtypeJsonPath, true);
          }
          else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, true);
            showComponent(dispatch, institutionContainerJsonPath, false);
            // showComponent(dispatch, applicantSubtypeJsonPath, true);
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
              "Properties[0].ownersTemp",
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
        institutionInfo: institutionInformation()
      }
    }
  })
});
