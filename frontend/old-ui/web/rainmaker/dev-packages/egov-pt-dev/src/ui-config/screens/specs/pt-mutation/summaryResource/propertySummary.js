import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import {
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";

const tenantId = getQueryArg(window.location.href, "tenantId");

const propertyDetails =  getCommonGrayCard({
  propertyLocationContainer:getCommonContainer({
      city: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "PT_PROPERTY_ADDRESS_CITY"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        }
      }
    ),
    doorHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "PT_PROPERTY_ADDRESS_HOUSE_NO"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    buildingCompanyName: getLabelWithValue(
      {
        labelName: "Building/Company Name",
        labelKey: "PT_PROPERTY_ADDRESS_COLONY_NAME"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.buildingName"
      }
    ),
    streetName: getLabelWithValue(
      {
        labelName: "Street Name",
        labelKey: "PT_PROPERTY_ADDRESS_STREET_NAME"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.street" }
    ),
    mohalla: getLabelWithValue(
      {
        labelName: "Mohalla",
        labelKey: "PT_PROPERTY_ADDRESS_MOHALLA"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.locality.code",
        callBack: value => {
          return `${getTransformedLocale(tenantId)}_REVENUE_${value}`;
        }
      }
    ),
    pincode: getLabelWithValue(
      {
        labelName: "Pincode",
        labelKey: "PT_PROPERTY_ADDRESS_PINCODE"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.pincode" }
    ),
    existingPropertyId: getLabelWithValue(
      {
        labelName: "Existing Property ID",
        labelKey: "PT_PROPERTY_ADDRESS_EXISTING_PID"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.propertyId" }
    ),
  })
})


export const propertySummary = getCommonGrayCard({
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
          labelName: "Property Address",
          labelKey: "PT_PROPERTY_ADDRESS_SUB_HEADER"
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
            labelKey: "PT_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  cardOne: propertyDetails,
});
