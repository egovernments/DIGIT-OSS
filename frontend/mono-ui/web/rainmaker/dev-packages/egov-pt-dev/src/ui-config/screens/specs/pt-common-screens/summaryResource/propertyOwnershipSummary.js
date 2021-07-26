import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-bpa",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const reviewownershipType = getLabelWithValue(
  {
    labelName: "Ownership Type",
    labelKey: "PT_COMMON_OWNERSHIP_TYPE"
  },
  {
    jsonPath: "Property.ownershipCategory",
    localePrefix: {
      moduleName: "common-masters",
      masterName: "OwnerShipCategory"
    },
    callBack: value => {
      return value ? value.split(".")[0] : "";
    }
  }
);

export const reviewOwnerPhoneNo = getLabelWithValue(
  {
    labelName: "Mobile No.",
    labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_LABEL"
  },
  {
    jsonPath: "Property.owners[0].mobileNumber",
    callBack: checkValueForNA
  }
);

export const reviewOwnerGender = getLabelWithValue(
  {
    labelName: "Gender",
    labelKey: "PT_COMMON_GENDER_LABEL"
  },
  {
    jsonPath: "Property.owners[0].gender",
    callBack: checkValueForNA
  }
);

export const reviewGuardianName = getLabelWithValue(
  {
    labelName: "Father/Husband's Name",
    labelKey: "PT_COMMON_FATHER_OR_HUSBAND_NAME"
  },
  {
    jsonPath: "Property.owners[0].fatherOrHusbandName",
    callBack: checkValueForNA
  }
);

export const reviewRelationship = getLabelWithValue(
  {
    labelName: "Relationship with Guardian",
    labelKey: "PT_COMMON_APPLICANT_RELATIONSHIP_LABEL"
  },
  {
    jsonPath: "Property.owners[0].relationship",
    localePrefix: {
      moduleName: "common-masters",
      masterName: "OwnerType"
    },
    callBack: checkValueForNA
  }
);


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
          labelName: "Transferee Details",
          labelKey: "PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER"
        })
      }
    }
  },
  ownerDetailsHeader: getHeader({
    labelName: "Owner Information",
    labelKey: "PT_COMMON_OWNER_INFORMATION"
  }),
  break: getBreak(),
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonContainer({
        reviewownershipType,
        reviewOwnerPhoneNo,
        reviewOwnerName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "PT_COMMON_APPLICANT_NAME_LABEL"
          },
          {
            jsonPath: "Property.owners[0].name",
            callBack: checkValueForNA
          }
        ),
        reviewOwnerGender,
        reviewGuardianName,
        reviewRelationship,
        reviewOwnerAddr: getLabelWithValue(
          {
            labelName: "Correspondence Address",
            labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_LABEL"
          },
          {
            jsonPath: "Property.owners[0].correspondenceAddress",
            callBack: checkValueForNA
          }
        ),
        reviewOwnerSpecialCat: getLabelWithValue(
          {
            labelName: "Special Applicant Category",
            labelKey: "PT_COMMON_SPECIAL_APPLICANT_CATEGORY_LABEL"
          },
          {
            jsonPath: "Property.owners[0].ownerType",
            localePrefix: {
              moduleName: "common-masters",
              masterName: "OwnerType"
            },
            callBack: checkValueForNA
          }
        ),
        reviewSameAsPropertyAddress: getLabelWithValue(
          {
            labelName: "Same as property address",
            labelKey: "PT_COMMON_SAME_AS_PROPERTY_ADDRESS"
          },
          {
            jsonPath: "Property.owners[0].sameAsPropertyAddress",
            localePrefix: {
              moduleName: "common-masters",
              masterName: "OwnerType"
            },
            callBack: checkValueForNA
          }
        ),
        break: getBreak()
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.owners",
      prefixSourceJsonPath: "children",
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
          labelName: "Property Ownership Details",
          labelKey: "PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER"
        })
      }
    }
  },
  breaks: getBreak(),
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonContainer({
        reviewownershipType,
  reviewInstituteName: getLabelWithValue(
    {
      labelName: "Institution Name",
      labelKey: "PT_COMMON_INSTITUTION_NAME"
    },
    {
      jsonPath: "Property.institution.name",
      callBack: checkValueForNA
    }
  ),
  reviewinstituteType: getLabelWithValue(
    {
      labelName: "Institution Type",
      labelKey: "PT_COMMON_INSTITUTION_TYPE"
    },
    {
      jsonPath: "Property.institution.type",
      localePrefix: {
        moduleName: "common-masters",
        masterName: "OwnerShipCategory"
      },
      callBack: checkValueForNA
    }
  ),
        break: getBreak()
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.owners",
      prefixSourceJsonPath: "children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
  ownerDetailsHeaders: getHeader({
    labelName: "Details of Authorised Person",
    labelKey: "PT_COMMON_AUTHORISED_PERSON_DETAILS"
  }),
  breaks1: getBreak(),
  cardTwo: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonContainer({
        authorisedPersonName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_NAME"
          },
          {
            jsonPath: "Property.owners[0].name",
            callBack: checkValueForNA
          }
        ),
        authorisedDesignationValue: getLabelWithValue(
          {
            labelName: "Designation",
            labelKey: "PT_COMMON_AUTHORISED_PERSON_DESIGNATION"
          },
          {
            jsonPath: "Property.institution.designation",
            callBack: checkValueForNA
          }
        ),
        authorisedMobile: getLabelWithValue(
          {
            labelName: "Mobile",
            labelKey: "PT_COMMON_AUTHORISED_MOBILE"
          },
          {
            jsonPath: "Property.owners[0].mobileNumber",
            callBack: checkValueForNA
          }
        ),
        authorisedLandline: getLabelWithValue(
          {
            labelName: "Landline",
            labelKey: "PT_COMMON_AUTHORISED_LANDLINE"
          },
          {
            jsonPath: "Property.owners[0].altContactNumber",
            callBack: checkValueForNA
          }
        ),
        authorisedAddress: getLabelWithValue(
          {
            labelName: "Correspondence Address",
            labelKey: "PT_COMMON_AUTHORISED_CORRESPONDENCE_ADDRESS"
          },
          {
            jsonPath: "Property.owners[0].correspondenceAddress",
            callBack: checkValueForNA
          }
        ),
        sameAsPropertyAddress: getLabelWithValue(
          {
            labelName: "Same as property address",
            labelKey: "PT_COMMON_SAME_AS_PROPERTY_ADDRESS"
          },
          {
            jsonPath: "Property.owners[0].sameAsPropertyAddress",
            callBack: checkValueForNA
          }
        ),
        break: getBreak()
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.owners",
      prefixSourceJsonPath: "children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
});