import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getDivider,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";

import { convertEpochToDate, checkValueForNA } from "../../utils";

const accessoriesCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-trade-search-preview",
    scheama: getCommonGrayCard({
      accessoriesCardContainer: getCommonContainer({
        reviewAccessoryType: getLabelWithValue(
          {
            labelName: "Accesory Type",
            labelKey: "TL_REVIEWACCESSORY_TYPE_LABEL"
          },
          {
            jsonPath:
              "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "ACCESSORIESCATEGORY"
            },
          }
        ),
        reviewAccessoryUOM: getLabelWithValue(
          {
            labelName: "UOM",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom", callBack: checkValueForNA }
        ),
        reviewAccessoryUOMValue: getLabelWithValue(
          {
            labelName: "UOM Value",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue", callBack: checkValueForNA }
        ),
        reviewAccessoryCount: getLabelWithValue(
          {
            labelName: "Accessory Count",
            labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count", callBack: checkValueForNA }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    prefixSourceJsonPath:
      "children.cardContent.children.accessoriesCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const tradeTypeCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-trade-search-preview",
    scheama: getCommonGrayCard({
      tradeTypeCardContainer: getCommonContainer({
        reviewTradeCategory: getLabelWithValue(
          {
            labelName: "Trade Category",
            labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "TRADETYPE"
            },
            callBack: value => {
              return value ? value.split(".")[0] : "NA";
            }
          }
        ),
        reviewTradeType: getLabelWithValue(
          {
            labelName: "Trade Type",
            labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "TRADETYPE"
            },
            callBack: value => {
              return value ?  value.split(".")[1] : "NA";
            }
          }
        ),
        reviewTradeSubtype: getLabelWithValue(
          {
            labelName: "Trade Sub-Type",
            labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "TRADETYPE"
            },
            callBack: checkValueForNA
          }
        ),

        reviewTradeUOM: getLabelWithValue(
          {
            labelName: "UOM (Unit of Measurement)",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom", callBack: checkValueForNA }
        ),
        reviewTradeUOMValue: getLabelWithValue(
          {
            labelName: "UOM Value",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue", callBack: checkValueForNA }
        )
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.tradeTypeCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
export const getReviewTrade = (isEditable = true) => {
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
            labelName: "Trade Details",
            labelKey: "TL_COMMON_TR_DETAILS"
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
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getCommonContainer({
      reviewApplicationType: getLabelWithValue(
        {
          labelName: "Application Type",
          labelKey: "TL_APPLICATION_TYPE"
        },
        {
          jsonPath:
            "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
          localePrefix: {
            moduleName: "TradeLicense",
            masterName: "ApplicationType"
          },
        }
      ),
      reviewOldLicenseNo: getLabelWithValue(
        {
          labelName: "Old License Number",
          labelKey: "TL_OLD_LICENSE_NO"
        },
        { jsonPath: "Licenses[0].oldLicenseNumber", callBack: checkValueForNA }
      ),
      reviewLicenceType: getLabelWithValue(
        {
          labelName: "Licence Type",
          labelKey: "TL_COMMON_TABLE_COL_LICENSE_TYPE"
        },
        {
          jsonPath: "Licenses[0].licenseType",
          localePrefix: {
            moduleName: "TRADELICENSE",
            masterName: "LICENSETYPE"
          },
        }
      ),
      reviewTradeName: getLabelWithValue(
        {
          labelName: "Trade Name",
          labelKey: "TL_COMMON_TABLE_COL_TRD_NAME"
        },
        { jsonPath: "Licenses[0].tradeName"}
      ),
      reviewFromDate: getLabelWithValue(
        { labelName: "From Date" },
        {
          jsonPath: "Licenses[0].validFrom",
          callBack: convertEpochToDate
        }
      ),
      reviewToDate: getLabelWithValue(
        { labelName: "To Date" },
        {
          jsonPath: "Licenses[0].validTo",
          callBack: convertEpochToDate
        }
      ),
      reviewStructureType: getLabelWithValue(
        { labelName: "Structure Type" },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.structureType",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "STRUCTURETYPE"
          },
          callBack: value => {
            return  value ? value.split(".")[0] : "NA";
          }
        }
      ),
      reviewSubStructureType: getLabelWithValue(
        { labelName: "Structure Sub Type" },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.structureType",
          localePrefix: {
            moduleName: "common-masters",
            masterName: "STRUCTURETYPE"
          },
        }
      ),
      reviewCommencementDate: getLabelWithValue(
        {
          labelName: "Commencement Date",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"
        },
        {
          jsonPath: "Licenses[0].commencementDate",
          callBack: convertEpochToDate
        }
      ),
      reviewGSTNo: getLabelWithValue(
        {
          labelName: "GST No.",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.gstNo",
          callBack: checkValueForNA
        }
      ),
      reviewOperationalArea: getLabelWithValue(
        {
          labelName: "Operational Area",
          labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_LABEL"
        },
        { 
          jsonPath: "Licenses[0].tradeLicenseDetail.operationalArea", 
          callBack: checkValueForNA 
        }
      ),
      reviewNoOfEmployee: getLabelWithValue(
        {
          labelName: "No of Employees",
          labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_LABEL"
        },
        { 
          jsonPath: "Licenses[0].tradeLicenseDetail.noOfEmployees",
          callBack: checkValueForNA 
        }
      )
    }),
    div1: getDivider(),
    viewTwo: tradeTypeCard,
    div2: getDivider(),
    viewThree: accessoriesCard,

    div3: getDivider(),
    viewFour: getCommonContainer({
      reviewPropertyID: getLabelWithValue(
        {
          labelName: "Property Assessment ID",
          labelKey: "TL_EMP_APPLICATION_PT_ASS_ID"
        },
        { jsonPath: "Licenses[0].propertyId", callBack: checkValueForNA }
      ),
      reviewCity: getLabelWithValue(
        {
          labelName: "City",
          labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
        },
        {
          jsonPath: "Licenses[0].tradeLicenseDetail.address.city",
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
        }
      ),
      reviewDoorNo: getLabelWithValue(
        {
          labelName: "Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo", callBack: checkValueForNA }
      ),
      reviewBuildingName: getLabelWithValue(
        {
          labelName: "Building/Company Name",
          labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName", callBack: checkValueForNA }
      ),
      reviewStreetName: getLabelWithValue(
        {
          labelName: "Street Name",
          labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.street", callBack: checkValueForNA }
      ),
      reviewMohalla: getLabelWithValue(
        {
          labelName: "Mohalla",
          labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.locality.name", callBack: checkValueForNA }
      ),
      reviewPincode: getLabelWithValue(
        {
          labelName: "Pincode",
          labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
        },
        { jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode", callBack: checkValueForNA }
      ),
      reviewElectricityNo: getLabelWithValue(
        {
          labelName: "Electricity Connection No.",
          labelKey: "TL_NEW_TRADE_DETAILS_ELEC_CON_NO_LABEL"
        },
        {
          jsonPath:
            "Licenses[0].tradeLicenseDetail.additionalDetail.electricityConnectionNo",
            callBack: checkValueForNA
        }
      )
    })
  });
};
