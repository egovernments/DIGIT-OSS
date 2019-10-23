import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate,
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";



const propertyDetails = getCommonGrayCard({
  propertyContainer: getCommonContainer({
    usageType: getLabelWithValue(
      {
        labelName: "Property Usage Type",
        labelKey: "PT_ASSESMENT_INFO_USAGE_TYPE"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    propertyType: getLabelWithValue(
      {
        labelName: "Property Type",
        labelKey: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    landArea: getLabelWithValue(
      {
        labelName: "Plot Size (sq yards)",
        labelKey: "PT_ASSESMENT_INFO_PLOT_SIZE"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    noOfFloors: getLabelWithValue(
      {
        labelName: "No. of Floors",
        labelKey: "PT_ASSESMENT_INFO_NO_OF_FLOOR"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
 
  })
});
export const assessmentSummary = getCommonGrayCard({
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
          labelName: "Assessment Details",
          labelKey: "PT_ASSESMENT_INFO_SUB_HEADER"
        })
      }
    }
  },
  cardOne: propertyDetails,
  floorDetailHeader:{
    uiFramework: "custom-molecules-local",
    moduleName: "egov-pt",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label:"Ground Floor",
      style: { marginBottom: "1px" }
    },children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Ground Floor",
          labelKey: "PROPERTYTAX_FLOOR_0"
        })
      }
    },
    type: "array"
  },
  cardTwo:{
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonCard({
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
                labelName: "Unit-1",
                labelKey: "Unit-1"
              })
            },
            
          }
        },
          body: getCommonContainer({
          usageCategoryMajor: getLabelWithValue(
            {
              labelName: "Unit Usage Type",
              labelKey: "PT_ASSESSMENT_UNIT_USAGE_TYPE"
            },
            {
              jsonPath:
                "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].gender"
            }
          ),
          occupancyType: getLabelWithValue(
            {
              labelName: "Occupancy",
              labelKey: "PT_ASSESMENT_INFO_OCCUPLANCY"
            },
            {
              jsonPath:
                "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].fatherOrHusbandName"
            }
          ),
          unitArea: getLabelWithValue(
            {
              labelName: "Built-up area (sq ft)",
              labelKey: "PT_FORM2_BUILT_AREA"
            },
            {
              jsonPath:
                "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].dob",
              callBack: value => {
                return convertEpochToDate(value);
              }
            }
          ),
          annualRent: getLabelWithValue(
            {
              labelName: "Total Annual Rent (INR)",
              labelKey: "PT_FORM2_TOTAL_ANNUAL_RENT"
            },
            {
              jsonPath:
                "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId"
            }
          ),

        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
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
          labelName: "Owner Details",
          labelKey: "PT_OWNERSHIP_INFO_SUB_HEADER"
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
        labelKey: "PT_INSTITUTION_Type"
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
        labelKey: "NOC_NAME_OF_INSTITUTION_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionName"
      }
    ),
    telephoneNumber: getLabelWithValue(
      {
        labelName: "Official Telephone No.",
        labelKey: "NOC_OFFICIAL_TELEPHONE_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.telephoneNumber"
      }
    ),
    authorizedPersonName: getLabelWithValue(
      {
        labelName: "Name of Authorized Person",
        labelKey: "NOC_AUTHORIZED_PERSON_NAME_LABEL"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].name"
      }
    ),
    designation: getLabelWithValue(
      {
        labelName: "Designation in Institution",
        labelKey: "NOC_DESIGNATION_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.additionalDetail.institutionDesignation"
      }
    ),
    mobileNumber: getLabelWithValue(
      {
        labelName: "Mobile No. of Authorized Person",
        labelKey: "NOC_AUTHORIZED_PERSON_MOBILE_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].mobileNumber"
      }
    ),
    authorizedEmail: getLabelWithValue(
      {
        labelName: "Email of Authorized Person",
        labelKey: "NOC_AUTHORIZED_PERSON_EMAIL_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].emailId"
      }
    ),
    officialAddress: getLabelWithValue(
      {
        labelName: "Official Correspondence Address",
        labelKey: "NOC_OFFICIAL_CORRESPONDENCE_ADDRESS_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].correspondenceAddress"
      }
    )
  })
});
