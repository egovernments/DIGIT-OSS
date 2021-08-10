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
import { getBpaDetailsForOwner, getTodaysDateInYMD } from "../../utils";
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
        labelKey: "BPA_OWNER_INFORMATION"
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
          labelKey: "BPA_APPLICANT_MOBILE_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Mobile No.",
          labelKey: "BPA_ENTER_APPLICANT_MOBILE_NO_PLACEHOLDER"
        },
        required: true,
        props: {
          className: "applicant-details-error"
        },
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "NOC_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "BPA.landInfo.owners[0].mobileNumber",
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
          labelKey: "BPA_APPLICANT_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Name",
          labelKey: "BPA_ENTER_APPLICANT_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath: "BPA.landInfo.owners[0].name",
        props: {
          className: "applicant-details-error"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      genderRadioGroup: getSelectField({
        label: {
          labelName: "Gender",
          labelKey: "BPA_APPLICANT_GENDER_LABEL"
        },
        placeholder: {
          labelName: "Select Gender",
          labelKey: "BPA_APPLICANT_GENDER_PLACEHOLDER"
        },
        required: true,
        optionValue: "code",
        optionLabel: "label",
        jsonPath: "BPA.landInfo.owners[0].gender",
        data: [
          {
            code: "MALE",
            label: "COMMON_GENDER_MALE"
          },
          {
            code: "FEMALE",
            label: "COMMON_GENDER_FEMALE"
          },
          {
            code: "TRANSGENDER",
            label: "COMMON_GENDER_TRANSGENDER"
          }
        ],
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      applicantDob: {
        ...getDateField({
          label: {
            labelName: "Date Of Birth",
            labelKey: "BPA_APPLICANT_DOB_LABEL"
          },
          placeholder: {
            labelName: "DD/MM/YYYY",
            labelKey: "BPA_ENTER_APPLICANT_DOB_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "BPA_DOB_ERROR_MESSAGE",
          jsonPath: "BPA.landInfo.owners[0].dob",
          props: {
            className: "applicant-details-error",
            inputProps: {
              max: getTodaysDateInYMD()
            }
          },
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
        })
      },
      applicantEmail: getTextField({
        label: {
          labelName: "Email",
          labelKey: "BPA_APPLICANT_EMAIL_LABEL"
        },
        placeholder: {
          labelName: "Enter Email",
          labelKey: "BPA_ENTER_APPLICANT_EMAIL_PLACEHOLDER"
        },
        pattern: getPattern("Email"),
        errorMessage: "BPA_INVALID_EMIAL",
        jsonPath: "BPA.landInfo.owners[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      fatherHusbandName: getTextField({
        label: {
          labelName: "Guardian Name",
          labelKey: "BPA_APPLICANT_GUARDIAN_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Guardian Name",
          labelKey: "BPA_APPLICANT_GUARDIAN_NAME_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        jsonPath:
          "BPA.landInfo.owners[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
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
        jsonPath: "BPA.landInfo.owners[0].relationship",
        props: {
          label: {
            name: "Relationship",
            key: "BPA_APPLICANT_RELATIONSHIP_LABEL",
            className: "applicant-details-error"
          },
          buttons: [
            {
              labelName: "Father",
              labelKey: "BPA_APPLICANT_RELATIONSHIP_FATHER_RADIOBUTTON",
              value: "FATHER"
            },
            {
              label: "Husband",
              labelKey: "BPA_APPLICANT_RELATIONSHIP_HUSBAND_RADIOBUTTON",
              value: "HUSBAND"
            }
          ],
          jsonPath:
            "BPA.landInfo.owners[0].relationship",
          required: true
        },
        required: true,
        type: "array"
      },
      applicantPan: getTextField({
        label: {
          labelName: "PAN No.",
          labelKey: "BPA_APPLICANT_PAN_LABEL"
        },
        placeholder: {
          labelName: "Enter Applicant's PAN No.",
          labelKey: "BPA_ENTER_APPLICANT_PAN_PLACEHOLDER"
        },
        pattern: getPattern("PAN"),
        errorMessage: "Invalid PAN",
        jsonPath: "BPA.landInfo.owners[0].pan",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      applicantAddress: getTextField({
        label: {
          labelName: "Correspondence Address",
          labelKey: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
        },
        placeholder: {
          labelName: "Enter Correspondence Address",
          labelKey: "BPA_ENTER_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address"),
        errorMessage: "BPA_INVALID_ADDRESS",
        jsonPath:
          "BPA.landInfo.owners[0].correspondenceAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          className: "applicant-details-error"
        }
      }),
      primaryOwner: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "BPA.landInfo.owners[0].isPrimaryOwner",
        props: {
          label: {
            labelName: "Is Primary Owner ?",
            labelKey: "BPA_IS_PRIMARY_OWNER_LABEL"
          },
          jsonPath: "BPA.landInfo.owners[0].isPrimaryOwner"
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
          "BPA.landInfo.additionalDetail.institutionName",
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
          "BPA.landInfo.additionalDetail.telephoneNumber",
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
        jsonPath: "BPA.landInfo.owners[0].name",
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
          "BPA.landInfo.additionalDetail.institutionDesignation",
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

        jsonPath: "BPA.landInfo.owners[0].mobileNumber",
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
        jsonPath: "BPA.landInfo.owners[0].emailId",
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
          "BPA.landInfo.owners[0].correspondenceAddress",
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
      labelKey: "BPA_APPLICANT_DETAILS_HEADER"
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
          jsonPath: "BPA.landInfo.ownerShipMajorType",
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
            className: "applicant-details-error"
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
          jsonPath: "BPA.landInfo.ownershipCategory",
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
            className: "applicant-details-error"
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
            dispatch(prepareFinalObject("BPA.landInfo.owners[0].isPrimaryOwner", true));
          } else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, true);
            showComponent(dispatch, institutionContainerJsonPath, false);
            dispatch(prepareFinalObject("BPA.landInfo.owners[0].isPrimaryOwner", false));
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
            sourceJsonPath: "BPA.landInfo.owners",
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
