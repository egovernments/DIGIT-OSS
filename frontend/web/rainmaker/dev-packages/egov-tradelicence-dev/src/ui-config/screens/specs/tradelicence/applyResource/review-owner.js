import {
  getCommonContainer, getCommonGrayCard,
  getCommonSubHeader,


  getLabel, getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA, convertEpochToDate } from "../../utils";
import { changeStep } from "./footer";


export const reviewownershipType = getLabelWithValue(
  {
    labelName: "Type of ownership",
    labelKey: "TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
    localePrefix: {
      moduleName: "common-masters",
      masterName: "OwnerShipCategory"
    },
    callBack: value => {
      return value ? value.split(".")[0] : "";
    }
  }
);
export const reviewsubOwnership = getLabelWithValue(
  {
    labelName: "Type of sub-ownership",
    labelKey: "TL_NEW_OWNER_DETAILS_TYPE_OF_OWNERSHIP"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
    localePrefix: {
      moduleName: "common-masters",
      masterName: "OwnerShipCategory"
    },
  }
);
export const reviewOwnerFatherName = getLabelWithValue(
  {
    labelName: "Father/Husband's Name",
    labelKey: "TL_NEW_OWNER_DETAILS_FATHER_NAME_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].fatherOrHusbandName"
  }
);
export const reviewRelationship = getLabelWithValue(
  {
    labelName: "Relationship",
    labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
    localePrefix: {
      moduleName: "COMMON",
      masterName: "RELATION"
    },

  }
);
export const reviewOwnerGender = getLabelWithValue(
  {
    labelName: "Gender",
    labelKey: "TL_NEW_OWNER_DETAILS_GENDER_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    }
  }
);

export const reviewOwnerDOB = getLabelWithValue(
  {
    labelName: "Date of Birth",
    labelKey: "TL_EMP_APPLICATION_DOB"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    callBack: convertEpochToDate
  }
);

export const reviewOwnerPhoneNo = getLabelWithValue(
  {
    labelName: "Mobile No.",
    labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber",
  }
);
export const reviewOwnerEmail = getLabelWithValue(
  {
    labelName: "Email",
    labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId",
    callBack: checkValueForNA
  }
);
export const reviewOwnerPAN = getLabelWithValue(
  {
    labelName: "PAN No.",
    labelKey: "TL_NEW_OWNER_DETAILS_PAN_LABEL"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan", callBack: checkValueForNA }
);



export const tradeOwnerDetails = {
  reviewownershipType,
  reviewsubOwnership,
  reviewOwnerPhoneNo,
  reviewOwnerName: getLabelWithValue(
    {
      labelName: "Name",
      labelKey: "TL_NEW_OWNER_DETAILS_NAME_LABEL"
    },
    { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name" }
  ),
  reviewOwnerFatherName,
  reviewRelationship,
  reviewOwnerGender,
  reviewOwnerDOB,
  reviewOwnerEmail,
  reviewOwnerPAN,
  reviewOwnerAddr: getLabelWithValue(
    {
      labelName: "Corrospondence Address",
      labelKey: "TL_NEW_OWNER_DETAILS_ADDR_LABEL"
    },
    {
      jsonPath:
        "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress",
      callBack: checkValueForNA
    }
  ),
  reviewOwnerSpecialCat: getLabelWithValue(
    {
      labelName: "Special Owner Category",
      labelKey: "TL_NEW_OWNER_DETAILS_SPL_OWN_CAT_LABEL"
    },
    {
      jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].ownerType",
      localePrefix: {
        moduleName: "common-masters",
        masterName: "OwnerType"
      },
      callBack: checkValueForNA
    }
  )
}
export const tradeInstitutionDetails = {
  reviewownershipType,
  reviewsubOwnership,
  reviewOwnerPhoneNo,
  reviewoffTelephone: getLabelWithValue(
    {
      labelName: "Official Telephone No.",
      labelKey: "TL_NEW_OWNER_PHONE_LABEL"
    },
    {
      jsonPath:
        "Licenses[0].tradeLicenseDetail.owners[0].altContactNumber",
      callBack: checkValueForNA
    }
  ),
  reviewOwnerName: getLabelWithValue(
    {
      labelName: "Name of the Authorised Person",
      labelKey: "TL_NEW_OWNER_AUTH_PER_LABEL"
    },
    { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name" }
  ),
  reviewDesignation: getLabelWithValue(
    {
      labelName: "Designation",
      labelKey: "TL_NEW_OWNER_DESIG_LABEL"
    },
    {
      jsonPath:
        "Licenses[0].tradeLicenseDetail.institution.designation",
      callBack: checkValueForNA
    }
  ),
  reviewOwnerFatherName,
  reviewRelationship,
  reviewOwnerGender,
  reviewOwnerDOB,

  reviewOwnerEmail,
  reviewOwnerAddr: getLabelWithValue(
    {
      labelName: "Official Corrospondence Address",
      labelKey: "TL_NEW_OWNER_OFF_ADDR_LABEL"
    },
    {
      jsonPath:
        "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress",
      callBack: checkValueForNA
    }
  )
}
export const getReviewOwner = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Owner Details",
            labelKey: "TL_COMMON_OWN_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
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
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    multiOwner: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        scheama: getCommonGrayCard({
          viewFive: getCommonContainer(tradeOwnerDetails)
        }),
        items: [],
        hasAddItem: false,
        sourceJsonPath: "Licenses[0].tradeLicenseDetail.owners",
        prefixSourceJsonPath: "children.cardContent.children.viewFive.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
    },
    multiOwnerInstitutional: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        scheama: getCommonGrayCard({
          viewFive: getCommonContainer(tradeInstitutionDetails)
        }),

        items: [],
        hasAddItem: false,
        sourceJsonPath: "Licenses[0].tradeLicenseDetail.owners",
        prefixSourceJsonPath: "children.cardContent.children.viewFive.children"
      },
      type: "array"
    }
  });
};
