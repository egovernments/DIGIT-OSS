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
import { checkValueForNA } from "../../utils";


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
        // children: {
        //   editIcon: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Icon",
        //     props: {
        //       iconName: "edit"
        //     }
        //   },
          // buttonLabel: getLabel({
          //   labelName: "Edit",
          //   labelKey: "PT_EDIT"
          // })
        // },
        // onClickDefination: {
        //   action: "condition",
        //   callBack: (state, dispatch) => {
        //     gotoApplyWithStep(state, dispatch, 0);
        //   }
        // }
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
                "Property.ownersTemp[0].name",
                callBack: checkValueForNA
            }
          ), ownerFatherHusbandName: getLabelWithValue(
            {
              labelName: "Guardian's Name",
              labelKey: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].fatherOrHusbandName",
                callBack: checkValueForNA
            }
          ),  ownerGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "PT_OWNERSHIP_INFO_GENDER"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].gender",
                callBack: checkValueForNA
            }
          ), ownerType: getLabelWithValue(
            {
              labelName: "Type of Ownership",
              labelKey: "PT_FORM3_OWNERSHIP_TYPE"
            },
            {
              jsonPath:
                "Property.ownershipCategoryTemp",
                callBack: checkValueForNA
            }
          ),
          mobileNo: getLabelWithValue(
            {
              labelName: "Mobile No.",
              labelKey: "PT_OWNERSHIP_INFO_MOBILE_NO"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].mobileNumber",
                callBack: checkValueForNA
            }
          ),  ownerEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
            },
            {
              jsonPath:
                "Property.ownersTemp[0].emailId",
                callBack: checkValueForNA
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
                callBack: checkValueForNA
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
                "Property.ownersTemp[0].permanentAddress",
                callBack: checkValueForNA
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
          labelName: "Transferee Details",
          labelKey: "PT_INSTITUTION_TRANSFEREE_DETAILS_HEADER"
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
        // onClickDefination: {
        //   action: "condition",
        //   callBack: (state, dispatch) => {
        //     gotoApplyWithStep(state, dispatch, 0);
        //   }
        // }
      }
    }
  },
  body: getCommonContainer({
    institutionName: getLabelWithValue(
      {
        labelName: "Name of Institution",
        labelKey: "PT_OWNERSHIP_INSTI_NAME"
      },
      {
        jsonPath:
          "Property.institutionTemp.institutionName",
          callBack: checkValueForNA
      }
    ),
    designation: getLabelWithValue(
      {
        labelName: "Designation",
        labelKey: "PT_OWNERSHIP_INFO_DESIGNATION"
      },
      {
        jsonPath:
          "Property.institutionTemp.designation",
          callBack: checkValueForNA
      }
    ),

    institutionType: getLabelWithValue(
      {
        labelName: "Type Of Institution",
        labelKey: "PT_OWNERSHIP_INSTI_TYPE"
      },
      {
        jsonPath: "Property.institutionTemp.institutionName",
        callBack: checkValueForNA
        // callBack: value => {
        //   return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
        // }
      }
    ),
    institutionOwnershipType: getLabelWithValue(
      {
        labelName: "Type Of Ownership",
        labelKey: "PT_INSTI_OWNERSHIP_TYPE"
      },
      {
        jsonPath: "Property.ownershipCategory",
        callBack: checkValueForNA
        // callBack: value => {
        //   return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
        // }
      }
    ),

    authorizedPersonName: getLabelWithValue(
      {
        labelName: "Name of Authorized Person",
        labelKey: "PT_OWNERSHIP_INFO_NAME_OF_AUTH"
      },
      {
        jsonPath: "Property.institutionTemp.name",
        callBack: checkValueForNA
      }
    ),
    landlineNumber: getLabelWithValue(
      {
        labelName: "Telephone No.",
        labelKey: "PT_OWNERSHIP_INFO_TEL_NO"
      },
      {
        jsonPath:
          "Property.institutionTemp.landlineNumber",
          callBack: checkValueForNA
      }
    ),

    mobileNumber: getLabelWithValue(
      {
        labelName: "Mobile No. of Authorized Person",
        labelKey: "PT_OWNERSHIP_INFO_MOBILE_NO"
      },
      {
        jsonPath:
          "Property.institutionTemp.mobileNumber",
          callBack: checkValueForNA
      }
    ),

    officialAddress: getLabelWithValue(
      {
        labelName: "Official Correspondence Address",
        labelKey: "PT_OWNERSHIP_INFO_CORR_ADDR"
      },
      {
        jsonPath:
          "Property.institutionTemp.correspondenceAddress",
          callBack: checkValueForNA
      }
    )
  })
});
