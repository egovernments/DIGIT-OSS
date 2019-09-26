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
        labelName: "Applicant Information",
        labelKey: "NOC_APPLICANT_INFORMATION_SUBHEADER"
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
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "NOC_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        pattern: getPattern("MobileNo"),
        jsonPath: "noc.applicantDetails.applicant[0].mobileNo",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51"
          // onClickDefination: {
          //   action: "condition",
          //   callBack: (state, dispatch, fieldInfo) => {
          //     getDetailsForOwner(state, dispatch, fieldInfo);
          //   }
          // }
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantName",
        // props: {
        //   style: {
        //     maxWidth: "400px"
        //   }
        // },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      genderRadioGroup: {
        uiFramework: "custom-containers",
        moduleName: "egov-noc",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "noc.applicantDetails.applicant[0].applicantGender",
        props: {
          label: "Gender",
          buttons: ["Male", "Female", "Transgender"],
          jsonPath: "noc.applicantDetails.applicant[0].applicantGender",
          required: true
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantDob",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantEmail",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantFatherHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      relationshipRadioGroup: {
        uiFramework: "custom-containers",
        moduleName: "egov-noc",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "noc.applicantDetails.applicant[0].applicantRelationship",
        props: {
          label: "Relationship",
          buttons: ["Father", "Husband"],
          jsonPath: "noc.applicantDetails.applicant[0].applicantRelationship",
          required: true
        },
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantPan",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
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
        jsonPath: "noc.applicantDetails.applicant[0].applicantCategory",
        data: [
          {
            code: "A"
          },
          {
            code: "B"
          }
        ],
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      })
    })
  });
};

const institutionInformation = () => {
  return getCommonGrayCard({
    header: getCommonSubHeader(
      {
        labelName: "Applicant Information",
        labelKey: "NOC_APPLICANT_INFORMATION_SUBHEADER"
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
        required: true,
        jsonPath: "noc.applicantDetails.applicant[0].institutionName",
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
        jsonPath: "noc.applicantDetails.applicant[0].telephoneNumber",
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
        jsonPath: "noc.applicantDetails.applicant[0].authorizedPerson",
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
          labelName: "Enter Name of Institution",
          labelKey: "NOC_ENTER_INSTITUTION_DESIGNATION_PLACEHOLDER"
        },
        required: true,
        jsonPath: "noc.applicantDetails.applicant[0].institutionDesignation",
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
        jsonPath: "noc.applicantDetails.applicant[0].authorizedPersonMobile",
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
        required: true,
        jsonPath: "noc.applicantDetails.applicant[0].authorizedPersonEmail",
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
          labelName: "Enter Name of Institution",
          labelKey: "NOC_ENTER_OFFICIAL_CORRESPONDENCE_ADDRESS_PLACEHOLDER"
        },
        required: true,
        jsonPath: "noc.applicantDetails.applicant[0].officialCorrespondenceAddress",
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
      labelName: "Applicant Details",
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
    applicantType: {
      ...getSelectField({
        label: {
          labelName: "Applicant Type",
          labelKey: "NOC_APPLICANT_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Applicant Type",
          labelKey: "NOC_APPLICANT_TYPE_PLACEHOLDER"
        },
        jsonPath: "noc.applicantDetails.applicantType",
        data: [
          {
            code: "Individual"
          },
          {
            code: "Multiple"
          },
          {
            code: "Institutional-Private"
          }
        ],
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      afterFieldChange: (action, state, dispatch) => {
        let singleApplicantContainerJsonPath =
          "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
        let multipleApplicantContainerJsonPath =
          "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer";
        let institutionContainerJsonPath =
          "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
        let applicantSubtypeJsonPath =
          "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantSubType";
        if (action.value === "Individual") {
          showComponent(dispatch, singleApplicantContainerJsonPath, true);
          showComponent(dispatch, multipleApplicantContainerJsonPath, false);
          showComponent(dispatch, institutionContainerJsonPath, false);
          showComponent(dispatch, applicantSubtypeJsonPath, false);
        } else if (action.value === "Multiple") {
          showComponent(dispatch, singleApplicantContainerJsonPath, false);
          showComponent(dispatch, multipleApplicantContainerJsonPath, true);
          showComponent(dispatch, institutionContainerJsonPath, false);
          showComponent(dispatch, applicantSubtypeJsonPath, false);
        } else if (action.value === "Institutional-Private") {
          showComponent(dispatch, singleApplicantContainerJsonPath, false);
          showComponent(dispatch, multipleApplicantContainerJsonPath, false);
          showComponent(dispatch, institutionContainerJsonPath, true);
          showComponent(dispatch, applicantSubtypeJsonPath, true);
        }
      }
    },
    applicantSubType: {
      ...getSelectField({
        label: {
          labelName: "Type of Applicant - Subtype",
          labelKey: "NOC_APPLICANT_SUBTYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Applicant Subtype",
          labelKey: "NOC_APPLICANT_TYPE_PLACEHOLDER"
        },
        jsonPath: "noc.applicantDetails.applicantSubType",
        data: [
          {
            code: "Private Company"
          }
        ],
        props: {
          style: {
            display: "none"
          }
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      })
    },
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
              labelKey: "NOC_ADD_APPLICANT_LABEL"
            },
            sourceJsonPath: "noc.applicantDetails.applicant",
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
