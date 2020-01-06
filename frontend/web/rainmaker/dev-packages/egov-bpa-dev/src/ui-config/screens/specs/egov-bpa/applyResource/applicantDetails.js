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
import { getBpaDetailsForOwner } from "../../utils";
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";

const showComponent = (dispatch, componentJsonPath, display) => {
  let displayProps = display ? {} : { display: "none" };
  dispatch(
    handleField("apply", componentJsonPath, "props.style", displayProps)
  );
};

const commonApplicantInformation = () => {
  return getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "Owner Information",
        labelKey: "NOC_OWNER_INFORMATION"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantCard: getCommonContainer({
      mobileNumber: getTextField({
        label: {
          labelName: "Mobile No.",
          labelKey: "NOC_APPLICANT_MOBILE_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "NOC_ENTER_APPLICANT_MOBILE_NO_PLACEHOLDER"
        },
        required: true,
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        },
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "NOC_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "BPA.owners[0].mobileNumber",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              getBpaDetailsForOwner(state, dispatch, fieldInfo);
            }
          }
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      dummyDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true
        }
      },
      applicantName: getTextField({
        label: {
          labelName: "Name",
          labelKey: "NOC_APPLICANT_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "NOC_ENTER_APPLICANT_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "BPA.owners[0].name",
        props: {
          className: "applicant-details-error textfield-enterable-selection"
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
        style : {
          color: "black"
        },
        jsonPath: "BPA.owners[0].gender",
        props: {
          label: { name: "Gender", key: "NOC_GENDER_LABEL" },
          className: "applicant-details-error textfield-enterable-selection radio-button-label formLabel, root",
          buttons: [
            {
              labelName: "Male",
              labelKey: "NOC_GENDER_MALE_RADIOBUTTON",
              value: "MALE"
            },
            {
              labelName: "FEMALE",
              labelKey: "NOC_GENDER_FEMALE_RADIOBUTTON",
              value: "FEMALE"
            },
            {
              labelName: "Transgender",
              labelKey: "NOC_GENDER_TRANSGENDER_RADIOBUTTON",
              value: "TRANSGENDER"
            }
          ],
          jsonPath: "BPA.owners[0].gender"
        },
        type: "array"
      },
      applicantDob: getDateField({
        label: {
          labelName: "Date Of Birth",
          labelKey: "NOC_APPLICANT_DOB_LABEL"
        },
        placeholder: {
          labelName: "DD/MM/YYYY",
          labelKey: "NOC_ENTER_APPLICANT_DOB_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        errorMessage: "Invalid Date",
        jsonPath: "BPA.owners[0].dob",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        }
      }),
      applicantEmail: getTextField({
        label: {
          labelName: "Email",
          labelKey: "NOC_APPLICANT_EMAIL_LABEL"
        },
        placeholder: {
          labelName: "Enter Email",
          labelKey: "NOC_ENTER_APPLICANT_EMAIL_PLACEHOLDER"
        },
        pattern: getPattern("Email"),
        errorMessage: "Invalid Email",
        jsonPath: "BPA.owners[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        }
      }),
      fatherHusbandName: getTextField({
        label: {
          labelName: "Father/Husband's Name",
          labelKey: "NOC_APPLICANT_FATHER_HUSBAND_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Father/Husband's Name",
          labelKey: "NOC_APPLICANT_FATHER_HUSBAND_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath:
          "BPA.owners[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        }
      }),
      relationshipRadioGroup: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "BPA.owners[0].relationship",
        props: {
          label: {
            name: "Relationship",
            key: "NOC_APPLICANT_RELATIONSHIP_LABEL",
            className: "applicant-details-error textfield-enterable-selection"
          },
          buttons: [
            {
              labelName: "Father",
              labelKey: "NOC_APPLICANT_RELATIONSHIP_FATHER_RADIOBUTTON",
              value: "FATHER"
            },
            {
              label: "Husband",
              labelKey: "NOC_APPLICANT_RELATIONSHIP_HUSBAND_RADIOBUTTON",
              value: "HUSBAND"
            }
          ],
          jsonPath:
            "BPA.owners[0].relationship",
          required: true
        },
        required: true,
        type: "array"
      },
      applicantPan: getTextField({
        label: {
          labelName: "PAN No.",
          labelKey: "NOC_APPLICANT_PAN_LABEL"
        },
        placeholder: {
          labelName: "Enter Applicant's PAN No.",
          labelKey: "NOC_ENTER_APPLICANT_PAN_PLACEHOLDER"
        },
        pattern: getPattern("PAN"),
        errorMessage: "Invalid PAN",
        jsonPath: "BPA.owners[0].pan",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        }
      }),
      applicantAddress: getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "NOC_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Correspondence Address",
          labelKey: "NOC_ENTER_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address"),
        errorMessage: "Invalid Address",
        jsonPath:
          "BPA.owners[0].correspondenceAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        }
      }),
      specialApplicantCategory: getSelectField({
        label: {
          labelName: "Special Applicant Category",
          labelKey: "NOC_SPECIAL_APPLICANT_CATEGORY_LABEL"
        },
        placeholder: {
          labelName: "Select Special Applicant Category",
          labelKey: "NOC_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER"
        },
        props: {
          className: "textfield-enterable-selection"
        },
        required: true,
        jsonPath: "BPA.owners[0].ownerType",
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
      primaryOwner: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "CheckboxContainer",
        jsonPath: "BPA.owners[0].primaryOwner",
        props: {
          label : {
            name : "Is Primary Owner ?",
            key : "Is Primary Owner ?",
          },
          jsonPath: "BPA.owners[0].primaryOwner"
        },
        type: "array"
      }
    })
  });
};

const institutionInformation = () => {
  return getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "Owner Information",
        labelKey: "NOC_OWNER_INFO_TITLE"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantCard: getCommonContainer({
      institutionName: getTextField({
        label: {
          labelName: "Name of Institution",
          labelKey: "NOC_INSTITUTION_LABEL"
        },
        placeholder: {
          labelName: "Enter Name of Institution",
          labelKey: "NOC_ENTER_INSTITUTION_PLACEHOLDER"
        },
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        required: true,
        jsonPath:
          "BPA.additionalDetail.institutionName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      telephoneNumber: getTextField({
        label: {
          labelName: "Official Telephone No.",
          labelKey: "NOC_TELEPHONE_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Enter Official Telephone No.",
          labelKey: "NOC_ENTER_TELEPHONE_NUMBER_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "Invalid Number",
        jsonPath:
          "BPA.additionalDetail.telephoneNumber",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      authorisedPerson: getTextField({
        label: {
          labelName: "Name of Authorized Person",
          labelKey: "NOC_AUTHORIZED_PERSON_LABEL"
        },
        placeholder: {
          labelName: "Enter Name of Authorized Person",
          labelKey: "NOC_ENTER_AUTHORIZED_PERSON_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "BPA.owners[0].name",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      designation: getTextField({
        label: {
          labelName: "Designation in Institution",
          labelKey: "NOC_INSTITUTION_DESIGNATION_LABEL"
        },
        placeholder: {
          labelName: "Enter designation of Institution",
          labelKey: "NOC_ENTER_INSTITUTION_DESIGNATION_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Designation Name",
        jsonPath:
          "BPA.additionalDetail.institutionDesignation",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      authorizedPersonMobile: getTextField({
        label: {
          labelName: "Mobile No. of Authorized Person",
          labelKey: "NOC_AUTHORIZED_PERSON_MOBILE_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No. of Authorized Person",
          labelKey: "NOC_AUTHORIZED_PERSON_MOBILE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "Invalid MobileNo.",

        jsonPath: "BPA.owners[0].mobileNumber",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      authorizedPersonEmail: getTextField({
        label: {
          labelName: "Email of Authorized Person",
          labelKey: "NOC_AUTHORIZED_PERSON_EMAIL_LABEL"
        },
        placeholder: {
          labelName: "Enter Email of Authorized Person",
          labelKey: "NOC_AUTHORIZED_PERSON_EMAIL_PLACEHOLDER"
        },
        pattern: getPattern("Email"),
        errorMessage: "Invalid Email",
        required: true,
        jsonPath: "BPA.owners[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      officialCorrespondenceAddress: getTextField({
        label: {
          labelName: "Official Correspondence Address",
          labelKey: "NOC_OFFICIAL_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Official Correspondence Address ",
          labelKey: "NOC_ENTER_OFFICIAL_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address"),
        errorMessage: "Invalid Address",
        jsonPath:
          "BPA.owners[0].correspondenceAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      })
    })
  });
};

export const applicantDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Owner Details",
      labelKey: "NOC_APPLICANT_DETAILS_HEADER"
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
            labelName: "Owner Type",
            labelKey: "BPA_OWNER_TYPE"
          },
          placeholder: {
            labelName: "Select Owner Type",
            labelKey: "BPA_OWNER_TYPE_PLACEHOLDER"
          },
          jsonPath: "BPA.ownerShipMajorType",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          required: true,
          sourceJsonPath: "applyScreenMdmsData.DropdownsData.OwnershipCategory",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            className: "applicant-details-error textfield-enterable-selection"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let path = action.componentJsonpath.replace(
            /.applicantType$/,
            ".applicantSubType"
          );
          let applicantType = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
            []
          );
          let applicantSubType = applicantType.filter(item => {
            return item.active && item.code.startsWith(action.value);
          });
          dispatch(handleField("apply", path, "props.data", applicantSubType));
        }
      },
      applicantSubType: {
        ...getSelectField({
          label: {
            labelName: "Type of Owner - Subtype",
            labelKey: "BPA_OWNER_SUB_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Owner Subtype",
            labelKey: "BPA_OWNER_SUB_TYPE_PLACEHOLDER"
          },
          jsonPath: "BPA.ownershipCategory",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          required: true,
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            className: "applicant-details-error textfield-enterable-selection"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let singleApplicantContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
          let multipleApplicantContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer";
          let institutionContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
          let primaryOwnerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.children.individualApplicantInfo.children.cardContent.children.applicantCard.children.primaryOwner";
          if (action.value.includes("SINGLEOWNER")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, true);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, false);
            showComponent(dispatch, primaryOwnerJsonPath, false);
            dispatch(prepareFinalObject("BPA.owners[0].primaryOwner", true));
          } else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, true);
            showComponent(dispatch, institutionContainerJsonPath, false);
            showComponent(dispatch, primaryOwnerJsonPath, true);
            dispatch(prepareFinalObject("BPA.owners[0].primaryOwner", false));
          } else if (action.value.includes("INSTITUTIONAL")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, true);
          }
        }
      }
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
              labelName: "Add Owner",
              labelKey: "BPA_ADD_OWNER"
            },
            sourceJsonPath: "BPA.owners",
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
