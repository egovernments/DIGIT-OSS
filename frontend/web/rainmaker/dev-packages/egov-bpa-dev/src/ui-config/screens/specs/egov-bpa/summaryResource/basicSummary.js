import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA, convertEpochToDate  } from "../../utils/index";
import { getTransformedLocale, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { changeStep } from "../applyResource/footer";


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

export const basicSummary = getCommonGrayCard({
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
          labelName: "Basic Details",
          labelKey: "BPA_BASIC_DETAILS_TITLE"
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
            changeStep(state, dispatch, "", 0);
          }
        }
      }
    }
  },
  bpaBasicDetailsContainer: getHeader({
    labelName: "Basic Details",
    labelKey: "BPA_BASIC_DETAILS_TITLE"
  }),
  break1: getBreak(),
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        basicDetailsContainer: getCommonContainer({
          scrutinynumber: getLabelWithValue(
            {
              labelName: "Building plan scrutiny number",
              labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_LABEL"
            },
            {
              jsonPath: "BPA.edcrNumber",
              callBack: checkValueForNA
              // callBack: value => {
              //   return value //`COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
              // }
            }
          ),
          occupancy: getLabelWithValue(
            {
              labelName: "occupancy",
              labelKey: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL"
            },
            {
              jsonPath:
                "scrutinyDetails.planDetail.planInformation.occupancy",
                callBack: checkValueForNA
              // callBack: value => {
              //   return value //`COMMON_MASTERS_OWNERSHIPCATEGORY_${getTransformedLocale(value)}`;
              // }
            }
          ),
          applicationtype: getLabelWithValue(
            {
              labelName: "Application Type",
              labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
            },
            {
              jsonPath:
                "BPA.applicationType",
                callBack: checkValueForNA
            }
          ),
          servicetype: getLabelWithValue(
            {
              labelName: "Service Type",
              labelKey: "Service Type"
            },
            {
              jsonPath: "BPA.serviceType",
              callBack: checkValueForNA
            }
          ),
          risktype: getLabelWithValue(
            {
              labelName: "Risk Type",
              labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
            },
            {
              jsonPath: "BPA.riskType",
              callBack: checkValueForNA
            }
          ),
          applicationdate: getLabelWithValue(
            {
              labelName: "Application Date",
              labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
            },
            {
              jsonPath:
                "scrutinyDetails.planDetail.applicationDate",
                callBack: value => {
                  return convertEpochToDate(value) || checkValueForNA;
                }
            }
          ),
          // applicationFee: getLabelWithValue(
          //   {
          //     labelName: "Application Fee",
          //     labelKey: "BPA_BASIC_DETAILS_APP_FEE_LABEL"
          //   },
          //   {
          //     jsonPath:
          //       "ReceiptTemp[0].Bill[0].totalAmount",
          //       callBack: checkValueForNA
          //   }
          // ),
          remarks: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
            },
            {
              jsonPath:
                "BPA.remarks",
                callBack: checkValueForNA
            }
          )
        }),
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "BPA",
      prefixSourceJsonPath:
        "children.cardContent.children.basicDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
  BlockWiseOccupancyAndUsageDetails: getHeader({
    labelName: "BPA Location Details",
    labelKey: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS"
  }),
  break1: getBreak(),
  cardTwo: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        viewFour: getCommonContainer({
          reviewCity: getLabelWithValue(
            {
              labelName: "City",
              labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            },
            {
              jsonPath: "BPA.address.city",
              callBack: value => {
                return getQueryArg(window.location.href, "tenantId");
              },
            }
          ),
          reviewBuildingName: getLabelWithValue(
            {
              labelName: "Building/Company Name",
              labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
            },
            { jsonPath: "BPA.address.buildingName", callBack: checkValueForNA }
          ),
          reviewStreetName: getLabelWithValue(
            {
              labelName: "Street Name",
              labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
            },
            { jsonPath: "BPA.address.street", callBack: checkValueForNA }
          ),
          reviewMohalla: getLabelWithValue(
            {
              labelName: "Mohalla",
              labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_LABEL"
            },
            {
              jsonPath:"BPA.address.locality.code",
              localePrefix: {
                moduleName: getQueryArg(window.location.href, "tenantId") ? getQueryArg(window.location.href, "tenantId").replace('.','_').toUpperCase():"",
                masterName: "REVENUE"
              }, callBack: checkValueForNA
            }
          ),
          reviewPincode: getLabelWithValue(
            {
              labelName: "Pincode",
              labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
            },
            { jsonPath: "BPA.address.pincode", callBack: checkValueForNA }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "BPA",
      prefixSourceJsonPath:
        "children.cardContent.children.basicDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },

  DetailsOfPlot: getHeader({
    labelName: "Details Of Plot",
    labelKey: "BPA_BOUNDARY_PLOT_DETAILS_TITLE"
  }),
  break2: getBreak(),
  detailsOfPlotCrad: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
        className: "applicant-summary",
        scheama: getCommonGrayCard({
            detailsOfPlotContainer: getCommonContainer({
                plotArea: getLabelWithValue(
                    {
                        labelName: "Plot Area",
                        labelKey: "BPA_BOUNDARY_PLOT_AREA_LABEL"
                    },
                    {
                        jsonPath: "scrutinyDetails.planDetail.plot.area",
                        callBack: checkValueForNA
                    }
                ),
                kathaNumber: getLabelWithValue(
                    {
                        labelName: "Khata No.",
                        labelKey: "BPA_BOUNDARY_KHATA_NO_LABEL"
                    },
                    {
                        jsonPath: "scrutinyDetails.planDetail.planInformation.khataNo",
                        callBack: checkValueForNA
                    }
                ),
                holdingNumber: getLabelWithValue(
                    {
                        labelName: "Holding No.",
                        labelKey: "BPA_BOUNDARY_HOLDING_NO_LABEL"
                    },
                    {
                        jsonPath: "BPA.holdingNo",
                        callBack: checkValueForNA
                    }
                ),
                plotNo: getLabelWithValue(
                    {
                        labelName: "Plot No(MSP)",
                        labelKey: "BPA_BOUNDARY_PLOT_NO_LABEL"
                    },
                    {
                        jsonPath: "scrutinyDetails.planDetail.planInformation.plotNo",
                        callBack: checkValueForNA
                    }
                ),
                landRegDetails: getLabelWithValue(
                    {
                        labelName: "Land Registration Details",
                        labelKey: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL"
                    },
                    {
                        jsonPath: "BPA.registrationDetails",
                        callBack: checkValueForNA
                    }
                )
            })
        }),
        items: [],
        hasAddItem: false,
        isReviewPage: true,
        sourceJsonPath: "BPA",
        prefixSourceJsonPath: "children.cardContent.children.detailsOfPlotContainer.children",
        afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});
