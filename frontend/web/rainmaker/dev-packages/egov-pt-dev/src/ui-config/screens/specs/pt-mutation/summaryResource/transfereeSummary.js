import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const transfereeSummary = getCommonGrayCard({
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
          labelName: "Transferee Details",
          labelKey: "PT_MUTATION_TRANSFEREE_DETAILS"
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
            labelKey: "PT_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "owner-summary",
      scheama: getCommonGrayCard({
        ownerContainer: getCommonContainer({
          ownerName: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "PT_OWNERSHIP_INFO_NAME"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].name"
            }
          ), ownerFatherHusbandName: getLabelWithValue(
            {
              labelName: "Guardian's Name",
              labelKey: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].fatherOrHusbandName"
            }
          ),  ownerGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "PT_OWNERSHIP_INFO_GENDER"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].gender"
            }
          ), ownerType: getLabelWithValue(
            {
              labelName: "Type of Ownership",
              labelKey: "PT_FORM3_OWNERSHIP_TYPE"
            },
            {
              jsonPath:
                "Property.ownershipCategoryTemp"
            }
          ),
          mobileNo: getLabelWithValue(
            {
              labelName: "Mobile No.",
              labelKey: "PT_OWNERSHIP_INFO_MOBILE_NO"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].mobileNumber"
            }
          ),  ownerEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].emailId"
            }
          ),       
          ownerDob: getLabelWithValue(
            {
              labelName: "Special Category",
              labelKey: "PT_OWNERSHIP_INFO_USER_CATEGORY"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].ownerType",
              // callBack: value => {
              //   return convertEpochToDate(value);
              // }
            }
          ),
          ownerAddress: getLabelWithValue(
            {
              labelName: "Correspondence Address",
              labelKey: "PT_OWNERSHIP_INFO_CORR_ADDR"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].permanentAddress"
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.ownersTemp",
      prefixSourceJsonPath:
        "children.cardContent.children.ownerContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

export const transfereeInstitutionSummary = getCommonGrayCard({
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
          labelKey: "PT_INSTITUTION_DETAILS_HEADER"
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
            labelKey: "PT_EDIT"
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
        labelKey: "PT_OWNERSHIP_INFO_NAME_INSTI"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
        callBack: value => {
          return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
        }
      }
    ),
    institutionName: getLabelWithValue(
      {
        labelName: "Name of Institution",
        labelKey: "PT_OWNERSHIP_INFO_TYPE_INSTI"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionName"
      }
    ),
    telephoneNumber: getLabelWithValue(
      {
        labelName: "Official Telephone No.",
        labelKey: "PT_OWNERSHIP_INFO_TEL_NO"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.telephoneNumber"
      }
    ),
    authorizedPersonName: getLabelWithValue(
      {
        labelName: "Name of Authorized Person",
        labelKey: "PT_OWNERSHIP_INFO_NAME_OF_AUTH"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].name"
      }
    ),
    designation: getLabelWithValue(
      {
        labelName: "Designation in Institution",
        labelKey: "PT_OWNERSHIP_INFO_DESIGNATION"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionDesignation"
      }
    ),
    mobileNumber: getLabelWithValue(
      {
        labelName: "Mobile No. of Authorized Person",
        labelKey: "PT_OWNERSHIP_INFO_MOBILE_NO"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].mobileNumber"
      }
    ),
    authorizedEmail: getLabelWithValue(
      {
        labelName: "Email of Authorized Person",
        labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId"
      }
    ),
    officialAddress: getLabelWithValue(
      {
        labelName: "Official Correspondence Address",
        labelKey: "PT_OWNERSHIP_INFO_CORR_ADDR"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].correspondenceAddress"
      }
    )
  })
});
