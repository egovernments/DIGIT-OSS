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
        props:{
          className:"applicant-details-error"
        },
        title: {
          value: "Please search profile linked to the mobile no.",
          key: "NOC_APPLICANT_MOBILE_NO_TOOLTIP_MESSAGE"
        },
        infoIcon: "info_circle",
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].mobileNumber",
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
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].name",
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].gender",
        props: {
          label: { name: "Gender", key: "NOC_GENDER_LABEL" },
          className:"applicant-details-error",
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
          jsonPath:
            "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].gender"
          // required: true
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
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].dob",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].fatherOrHusbandName",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].relationship",
        props: {
          label: {
            name: "Relationship",
            key: "NOC_APPLICANT_RELATIONSHIP_LABEL",
            className:"applicant-details-error"
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
            "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].relationship",
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
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].pan",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].correspondenceAddress",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
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
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].ownerType",
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
        sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
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
        pattern: getPattern("Name"),
        errorMessage: "Invalid Name",
        required: true,
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionName",
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.telephoneNumber",
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
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].name",
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionDesignation",
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

        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].mobileNumber",
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
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId",
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
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].correspondenceAddress",
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
    applicantTypeSelection: getCommonContainer({
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
          jsonPath:
            "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipMajorType",
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
            labelName: "Type of Applicant - Subtype",
            labelKey: "NOC_APPLICANT_SUBTYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Applicant Subtype",
            labelKey: "NOC_APPLICANT_SUBTYPE_PLACEHOLDER"
          },
          jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "OwnerShipCategory"
          },
          // data: [
          //   {
          //     code: "Private Company"
          //   }
          // ],
          // props: {
          //   style: {
          //     display: "none"
          //   }
          // },
          required: true,
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
          let singleApplicantContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer";
          let multipleApplicantContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer";
          let institutionContainerJsonPath =
            "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer";
          // let applicantSubtypeJsonPath =
          //   "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantSubType";
          if (action.value.includes("SINGLEOWNER")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, true);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, false);
            // showComponent(dispatch, applicantSubtypeJsonPath, false);
          } else if (action.value.includes("MULTIPLEOWNERS")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, true);
            showComponent(dispatch, institutionContainerJsonPath, false);
            // showComponent(dispatch, applicantSubtypeJsonPath, false);
          } else if (action.value.includes("INSTITUTIONAL")) {
            showComponent(dispatch, singleApplicantContainerJsonPath, false);
            showComponent(dispatch, multipleApplicantContainerJsonPath, false);
            showComponent(dispatch, institutionContainerJsonPath, true);
            // showComponent(dispatch, applicantSubtypeJsonPath, true);
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
              labelName: "Add Applicant",
              labelKey: "NOC_ADD_APPLICANT_LABEL"
            },
            sourceJsonPath:
              "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
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
