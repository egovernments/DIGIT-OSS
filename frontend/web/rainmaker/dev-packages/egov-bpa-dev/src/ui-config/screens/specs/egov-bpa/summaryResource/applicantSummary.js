import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const applicantSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Owner Information",
          labelKey: "BPA_OWNER_INFO_TITLE"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "BPA_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 2);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        applicantContainer: getCommonContainer({
          mobileNo: getLabelWithValue(
            {
              labelName: "Mobile No.",
              labelKey: "BPA_APPLICANT_MOBILE_NO_LABEL"
            },
            {
              jsonPath:
                "BPA.owners[0].mobileNumber"
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "BPA_OWNER_NAME_LABEL"
            },
            {
              jsonPath: "BPA.owners[0].name"
            }
          ),
          applicantGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "BPA_GENDER_LABEL"
            },
            {
              jsonPath: "BPA.owners[0].gender"
            }
          ),
          applicantFatherHusbandName: getLabelWithValue(
            {
              labelName: "Father/Husband's Name",
              labelKey: "BPA_APPLICANT_FATHER_HUSBAND_NAME_LABEL"
            },
            {
              jsonPath:
                "BPA.owners[0].fatherOrHusbandName"
            }
          ),
          applicantRelation: getLabelWithValue(
            {
              labelName: "Relationship",
              labelKey: "BPA_APPLICANT_RELATIONSHIP_LABEL"
            },
            {
              jsonPath:
                "BPA.owners[0].relationship"
            }
          ),
          applicantDob: getLabelWithValue(
            {
              labelName: "Date of Birth",
              labelKey: "BPA_APPLICANT_DOB_LABEL"
            },
            {
              jsonPath: "BPA.owners[0].dob",
              callBack: value => {
                return convertEpochToDate(value);
              }
            }
          ),
          applicantEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "BPA_APPLICANT_EMAIL_LABEL"
            },
            {
              jsonPath: "BPA.owners[0].emailId"
            }
          ),
          applicantPan: getLabelWithValue(
            {
              labelName: "PAN No.",
              labelKey: "BPA_APPLICANT_PAN_LABEL"
            },
            {
              jsonPath: "BPA.owners[0].pan"
            }
          ),
          applicantAddress: getLabelWithValue(
            {
              labelName: "Correspondence Address",
              labelKey: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
            },
            {
              jsonPath:
                "BPA.owners[0].correspondenceAddress"
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "BPA.owners",
      prefixSourceJsonPath:
        "children.cardContent.children.applicantContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

export const institutionSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Institution Details",
          labelKey: "BPA_INSTITUTION_DETAILS_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "BPA_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 2);
          }
        }
      }
    }
  },
  body: getCommonContainer({
    institutionType: getLabelWithValue(
      {
        labelName: "Institution Type",
        labelKey: "BPA_INSTITUTION_TYPE_LABEL"
      },
      {
        jsonPath: "BPA.ownerShipType",
        callBack: value => {
          return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(
            value
          )}`;
        }
      }
    ),
    institutionName: getLabelWithValue(
      {
        labelName: "Name of Institution",
        labelKey: "BPA_NAME_OF_INSTITUTION_LABEL"
      },
      {
        jsonPath:
          "BPA.additionalDetail.institutionName"
      }
    ),
    telephoneNumber: getLabelWithValue(
      {
        labelName: "Official Telephone No.",
        labelKey: "BPA_TELEPHONE_NUMBER_LABEL"
      },
      {
        jsonPath:
          "BPA.additionalDetail.telephoneNumber"
      }
    ),
    authorizedPersonName: getLabelWithValue(
      {
        labelName: "Name of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_LABEL"
      },
      {
        jsonPath: "BPA.owners[0].name"
      }
    ),
    designation: getLabelWithValue(
      {
        labelName: "Designation in Institution",
        labelKey: "BPA_INSTITUTION_DESIGNATION_LABEL"
      },
      {
        jsonPath:
          "BPA.additionalDetail.institutionDesignation"
      }
    ),
    mobileNumber: getLabelWithValue(
      {
        labelName: "Mobile No. of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_MOBILE_LABEL"
      },
      {
        jsonPath: "BPA.owners[0].mobileNumber"
      }
    ),
    authorizedEmail: getLabelWithValue(
      {
        labelName: "Email of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_EMAIL_LABEL"
      },
      {
        jsonPath: "BPA.owners[0].emailId"
      }
    ),
    officialAddress: getLabelWithValue(
      {
        labelName: "Official Correspondence Address",
        labelKey: "BPA_OFFICIAL_CORRESPONDENCE_ADDRESS_LABEL"
      },
      {
        jsonPath:
          "BPA.owners[0].correspondenceAddress"
      }
    )
  })
});
