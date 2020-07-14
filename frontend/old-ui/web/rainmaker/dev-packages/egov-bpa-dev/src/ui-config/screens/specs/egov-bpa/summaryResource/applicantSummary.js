import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { changeStep } from "../applyResource/footer";

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
            changeStep(state, dispatch, "", 2);            
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
      scheama: getCommonContainer({
        // applicantContainer: getCommonContainer({
          mobileNo: getLabelWithValue(
            {
              labelName: "Mobile No.",
              labelKey: "BPA_APPLICANT_MOBILE_NO_LABEL"
            },
            {
              jsonPath:
                "BPA.landInfo.owners[0].mobileNumber",
                callBack: checkValueForNA
            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "BPA_OWNER_NAME_LABEL"
            },
            {
              jsonPath: "BPA.landInfo.owners[0].name",
              callBack: checkValueForNA
            }
          ),
          applicantGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "BPA_GENDER_LABEL"
            },
            {
              jsonPath: "BPA.landInfo.owners[0].gender",
              callBack: checkValueForNA
            }
          ),
          applicantFatherHusbandName: getLabelWithValue(
            {
              labelName: "Guardian Name",
              labelKey: "BPA_APPLICANT_GUARDIAN_NAME_LABEL"
            },
            {
              jsonPath:
                "BPA.landInfo.owners[0].fatherOrHusbandName",
                callBack: checkValueForNA
            }
          ),
          applicantRelation: getLabelWithValue(
            {
              labelName: "Relationship",
              labelKey: "BPA_APPLICANT_RELATIONSHIP_LABEL"
            },
            {
              jsonPath:
                "BPA.landInfo.owners[0].relationship",
                callBack: checkValueForNA
            }
          ),
          applicantDob: getLabelWithValue(
            {
              labelName: "Date of Birth",
              labelKey: "BPA_APPLICANT_DOB_LABEL"
            },
            {
              jsonPath: "BPA.landInfo.owners[0].dob",
              callBack: value => {
                return convertEpochToDate(value) || checkValueForNA;
              }
            }
          ),
          applicantEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "BPA_APPLICANT_EMAIL_LABEL"
            },
            {
              jsonPath: "BPA.landInfo.owners[0].emailId",
              callBack: checkValueForNA
            }
          ),
          applicantPan: getLabelWithValue(
            {
              labelName: "PAN No.",
              labelKey: "BPA_APPLICANT_PAN_LABEL"
            },
            {
              jsonPath: "BPA.landInfo.owners[0].pan",
              callBack: checkValueForNA
            }
          ),
          applicantAddress: getLabelWithValue(
            {
              labelName: "Correspondence Address",
              labelKey: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
            },
            {
              jsonPath:
                "BPA.landInfo.owners[0].correspondenceAddress",
                callBack: checkValueForNA
            }
          ),
          break: getBreak()
        // })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "BPA.landInfo.owners",
      prefixSourceJsonPath:
        "children",
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
        jsonPath: "BPA.landInfo.ownerShipType",
        callBack: value => {
          return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(
            value
          )}` || checkValueForNA;
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
          "BPA.landInfo.additionalDetail.institutionName",
          callBack: checkValueForNA
      }
    ),
    telephoneNumber: getLabelWithValue(
      {
        labelName: "Official Telephone No.",
        labelKey: "BPA_TELEPHONE_NUMBER_LABEL"
      },
      {
        jsonPath:
          "BPA.landInfo.additionalDetail.telephoneNumber",
          callBack: checkValueForNA
      }
    ),
    authorizedPersonName: getLabelWithValue(
      {
        labelName: "Name of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_LABEL"
      },
      {
        jsonPath: "BPA.landInfo.owners[0].name",
        callBack: checkValueForNA
      }
    ),
    designation: getLabelWithValue(
      {
        labelName: "Designation in Institution",
        labelKey: "BPA_INSTITUTION_DESIGNATION_LABEL"
      },
      {
        jsonPath:
          "BPA.landInfo.additionalDetail.institutionDesignation",
          callBack: checkValueForNA
      }
    ),
    mobileNumber: getLabelWithValue(
      {
        labelName: "Mobile No. of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_MOBILE_LABEL"
      },
      {
        jsonPath: "BPA.landInfo.owners[0].mobileNumber",
        callBack: checkValueForNA
      }
    ),
    authorizedEmail: getLabelWithValue(
      {
        labelName: "Email of Authorized Person",
        labelKey: "BPA_AUTHORIZED_PERSON_EMAIL_LABEL"
      },
      {
        jsonPath: "BPA.landInfo.owners[0].emailId",
        callBack: checkValueForNA
      }
    ),
    officialAddress: getLabelWithValue(
      {
        labelName: "Official Correspondence Address",
        labelKey: "BPA_OFFICIAL_CORRESPONDENCE_ADDRESS_LABEL"
      },
      {
        jsonPath:
          "BPA.landInfo.owners[0].correspondenceAddress",
          callBack: checkValueForNA
      }
    )
  })
});
