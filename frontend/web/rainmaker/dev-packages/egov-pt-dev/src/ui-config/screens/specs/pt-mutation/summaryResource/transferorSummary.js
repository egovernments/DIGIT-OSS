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

export const transferorSummary = getCommonGrayCard({
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
          labelName: "Transferor Details",
          labelKey: "PT_MUTATION_TRANSFEROR_DETAILS"
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
              "Property.owners[0].name",
              callBack: checkValueForNA
            }
          ), ownerFatherHusbandName: getLabelWithValue(
            {
              labelName: "Guardian's Name",
              labelKey: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"
            },
            {
              jsonPath:
              "Property.owners[0].fatherOrHusbandName",
              callBack: checkValueForNA
            }
          ),  ownerGender: getLabelWithValue(
            {
              labelName: "Gender",
              labelKey: "PT_OWNERSHIP_INFO_GENDER"
            },
            {
              jsonPath:
              "Property.owners[0].gender",
              callBack: checkValueForNA
            }
          ), ownerType: getLabelWithValue(
            {
              labelName: "Type of Ownership",
              labelKey: "PT_FORM3_OWNERSHIP_TYPE"
            },
            {
              jsonPath:
              "Property.ownershipCategory",
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
              "Property.owners[0].mobileNumber" ,
              callBack: checkValueForNA
            }
          ),  ownerEmail: getLabelWithValue(
            {
              labelName: "Email",
              labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
            },
            {
              jsonPath:
              "Property.owners[0].emailId",
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
              "Property.owners[0].ownerType" ,
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
              "Property.owners[0].permanentAddress" ,
              callBack: checkValueForNA
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.owners",
      prefixSourceJsonPath:
        "children.cardContent.children.ownerContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

export const transferorInstitutionSummary = getCommonGrayCard({
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
          labelName: "Transferor Details",
          labelKey: "PT_INSTITUTION_TRANSFEROR_DETAILS_HEADER"
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
    institutionName: getLabelWithValue(
      {
        labelName: "Name of Institution",
        labelKey: "PT_OWNERSHIP_INSTI_NAME"
      },
      {
        jsonPath:
        "Property.institution.name",
        callBack: checkValueForNA
      }
    ),


    designation: getLabelWithValue(
      {
        labelName: "Designation in Institution",
        labelKey: "PT_OWNERSHIP_INFO_DESIGNATION"
      },
      {
        jsonPath:
          "Property.institution.designation",
          callBack: checkValueForNA
      }
    ),

    institutionType: getLabelWithValue(
      {
        labelName: "Institution Type",
        labelKey: "PT_OWNERSHIP_INSTI_TYPE"
      },
      {
        jsonPath: "Property.institution.type",

        callBack: value => {
          return `COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
        }
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
        jsonPath: "Property.institution.nameOfAuthorizedPerson",
        callBack: checkValueForNA
      }
    ),


    telephoneNumber: getLabelWithValue(
      {
        labelName: "Official Telephone No.",
        labelKey: "PT_OWNERSHIP_INFO_TEL_NO"
      },
      {
        jsonPath:
          "Property.owners[0].altContactNumber",
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
          "Property.owners[0].mobileNumber",
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
          "Property.owners[0].correspondenceAddress",
          callBack: checkValueForNA
      }
    )
    // authorizedEmail: getLabelWithValue(
    //   {
    //     labelName: "Email of Authorized Person",
    //     labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
    //   },
    //   {
    //     jsonPath:
    //       "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId"
    //   }
    // )

  })
});
