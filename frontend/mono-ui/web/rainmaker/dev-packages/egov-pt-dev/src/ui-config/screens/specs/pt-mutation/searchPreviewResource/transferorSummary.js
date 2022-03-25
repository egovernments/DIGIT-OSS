import { getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { checkValueForNA } from "../../utils";

export const transferorSummaryDetails = {
  ownerName: getLabelWithValue(
    {
      labelName: "Name",
      labelKey: "PT_OWNERSHIP_INFO_NAME"
    },
    {
      jsonPath:
        "Property.ownersInit[0].name",
      callBack: checkValueForNA
    }
  ), ownerFatherHusbandName: getLabelWithValue(
    {
      labelName: "Guardian's Name",
      labelKey: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"
    },
    {
      jsonPath:
        "Property.ownersInit[0].fatherOrHusbandName",
      callBack: checkValueForNA
    }
  ), ownerGender: getLabelWithValue(
    {
      labelName: "Gender",
      labelKey: "PT_OWNERSHIP_INFO_GENDER"
    },
    {
      jsonPath:
        "Property.ownersInit[0].gender",
      callBack: checkValueForNA
    }
  ), ownerType: getLabelWithValue(
    {
      labelName: "Type of Ownership",
      labelKey: "PT_FORM3_OWNERSHIP_TYPE"
    },
    {
      jsonPath:
        "Property.ownershipCategoryInit",
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
        "Property.ownersInit[0].mobileNumber",
      callBack: checkValueForNA
    }
  ), ownerEmail: getLabelWithValue(
    {
      labelName: "Email",
      labelKey: "PT_OWNERSHIP_INFO_EMAIL_ID"
    },
    {
      jsonPath:
        "Property.ownersInit[0].emailId",
      callBack: checkValueForNA
    }
  ), alterMobile: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "PT_FORM3_ALT_MOBILE_NO"
        },
        {
          jsonPath: "Property.ownersInit[0].alternatemobilenumber",
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
        "Property.ownersInit[0].ownerType",
      callBack: checkValueForNA
    }
  ),
  ownerAddress: getLabelWithValue(
    {
      labelName: "Correspondence Address",
      labelKey: "PT_OWNERSHIP_INFO_CORR_ADDR"
    },
    {
      jsonPath:
        "Property.ownersInit[0].permanentAddress",
      callBack: checkValueForNA
    }
  ),
  ownerSpecialDocumentType: getLabelWithValue(
    {
      labelName: "Document Type",
      labelKey: "PT_CATEGORY_DOCUMENT_TYPE"
    },
    {
      jsonPath:
        "Property.ownersInit[0].documentType",
      callBack: checkValueForNA
    }
  ),
  ownerSpecialDocumentID: getLabelWithValue(
    {
      labelName: "Document Id",
      labelKey: "PT_CATEGORY_DOCUMENT_ID"
    },
    {
      jsonPath:
        "Property.ownersInit[0].documentUid",
      callBack: checkValueForNA
    }
  )
}
export const transferorInstitutionSummaryDetails = {
  institutionName: getLabelWithValue(
    {
      labelName: "Name of Institution",
      labelKey: "PT_OWNERSHIP_INSTI_NAME"
    },
    {
      jsonPath:
        "Property.institutionInit.name",
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
        "Property.institutionInit.designation",
      callBack: checkValueForNA
    }
  ),
  institutionType: getLabelWithValue(
    {
      labelName: "Institution Type",
      labelKey: "PT_OWNERSHIP_INSTI_TYPE"
    },
    {
      jsonPath: "Property.institutionInit.type",
      callBack: value => {
        if (!value) {
          return 'NA';
        }
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
      jsonPath: "Property.ownershipCategoryInit",
      callBack: checkValueForNA
    }
  ),
  authorizedPersonName: getLabelWithValue(
    {
      labelName: "Name of Authorized Person",
      labelKey: "PT_OWNERSHIP_INFO_NAME_OF_AUTH"
    },
    {
      jsonPath: "Property.institutionInit.nameOfAuthorizedPerson",
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
        "Property.ownersInit[0].altContactNumber",
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
        "Property.ownersInit[0].mobileNumber",
      callBack: checkValueForNA
    }
  ), alterMobile: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "PT_FORM3_ALT_MOBILE_NO"
        },
        {
          jsonPath: "Property.ownersInit[0].alternatemobilenumber",
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
        "Property.ownersInit[0].correspondenceAddress",
      callBack: checkValueForNA
    }
  )
}


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
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "owner-summary",
      scheama: getCommonGrayCard({
        ownerContainer: getCommonContainer(transferorSummaryDetails)
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.ownersInit",
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
      }
    }
  },
  body: getCommonContainer(transferorInstitutionSummaryDetails)
});
