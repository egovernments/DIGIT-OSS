import { getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";
import { getLabelIfNotNull } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const transfereeSummaryDetails={
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
  ), ownerGender: getLabelWithValue(
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
  ), AlterMobile: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "PT_FORM3_ALT_MOBILE_NO"
        },
        {
          jsonPath: "Property.ownersTemp[0].alternatemobilenumber",
          callBack: checkValueForNA
        }
      ), ownerEmail: getLabelWithValue(
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
  ),
  ownerSpecialDocumentType: getLabelIfNotNull(
    {
      labelName: "Special Category Document Type",
      labelKey: "PT_OWNERSHIP_SPECIAL_CATEGORY_DOCUMENT_TYPE"
    },
    {
      jsonPath: "Property.ownersTemp[0].documentType",
      callBack: checkValueForNA
    }
  ),
  ownerDocumentId: getLabelIfNotNull(
    {
      labelName: "Document ID",
      labelKey: "PT_OWNERSHIP_DOCUMENT_ID"
    },
    {
      jsonPath: "Property.ownersTemp[0].documentUid",
      callBack: checkValueForNA
    }
  ),
}
export const transfereeInstitutionSummaryDetails={
  institutionName: getLabelWithValue(
    {
      labelName: "Name of Institution",
      labelKey: "PT_OWNERSHIP_INSTI_NAME"
    },
    {
      jsonPath:
        "Property.institutionTemp.name",
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
      jsonPath: "Property.institutionTemp.type",       
      callBack: value => {
        if(!value){
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
      jsonPath: "Property.ownershipCategoryTemp",
      callBack: checkValueForNA
    }
  ),
  authorizedPersonName: getLabelWithValue(
    {
      labelName: "Name of Authorized Person",
      labelKey: "PT_OWNERSHIP_INFO_NAME_OF_AUTH"
    },
    {
      jsonPath: "Property.institutionTemp.nameOfAuthorizedPerson",
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
        "Property.ownersTemp[0].altContactNumber",
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
        "Property.ownersTemp[0].mobileNumber",
      callBack: checkValueForNA
    }
  ),
  AlterMobile: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "PT_FORM3_ALT_MOBILE_NO"
        },
        {
          jsonPath: "Property.ownersTemp[0].alternatemobilenumber",
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
        "Property.ownersTemp[0].correspondenceAddress",
      callBack: checkValueForNA
    }
  )
}
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
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "owner-summary",
      scheama: getCommonGrayCard({
        ownerContainer: getCommonContainer(transfereeSummaryDetails),
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.ownersTemp",
      prefixSourceJsonPath:
        "children.cardContent.children.ownerContainer.children",
      afterPrefixJsonPath: "children.value.children.key",
    },
    type: "array"
  },
  beforeInitScreen: (action, state, dispatch) => {
    const categoryDocumentIDJsonPath = "components.div.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerDocumentId.props.style";
    const categoryDocumentTypeJsonPath = "components.div.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType.props.style";
    if (categoryType === "NONE") {
      dispatch(handleField("search-preview", categoryDocumentIDJsonPath, "display", "none"));
      dispatch(handleField("search-preview", categoryDocumentTypeJsonPath, "display", "none"));
    }
  },
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
      }
    }
  },
  body: getCommonContainer(transfereeInstitutionSummaryDetails)
});
