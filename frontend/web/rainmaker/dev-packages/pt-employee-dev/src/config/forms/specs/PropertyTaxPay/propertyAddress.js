import {
  pincode,
  mohalla,
  street,
  colony,
  roadType,
  houseNumber,
  constructionType,
  thana,
  dummy
} from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import {
  handleFieldChange,
  setFieldProperty
} from "egov-ui-kit/redux/form/actions";
import { CITY } from "egov-ui-kit/utils/endPoints";
import {
  prepareFormData,
  fetchGeneralMDMSData
} from "egov-ui-kit/redux/common/actions";
import set from "lodash/set";
import commonConfig from "config/common.js";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
// const Search = <Icon action="action" name="home" color="#30588c" />;

const formConfig = {
  name: "propertyAddress",
  fields: {
    city: {
      id: "city",
      jsonPath: "PropertiesTemp[0].address.city",
      required: true,
      type: "singleValueList",
      floatingLabelText: "CORE_COMMON_CITY",
      className: "pt-emp-property-address-city",
      disabled: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
      dataFetchConfig: {
        url: CITY.GET.URL,
        action: CITY.GET.ACTION,
        queryParams: [],
        requestBody: {
          MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
              {
                moduleName: "tenant",
                masterDetails: [
                  {
                    name: "tenants"
                  }
                ]
              }
            ]
          }
        },
        dataPath: ["MdmsRes.tenant.tenants"],
        dependants: [
          {
            fieldKey: "mohalla"
          }
        ]
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        dispatch(prepareFormData("Properties[0].tenantId", field.value));
        // dispatch(setFieldProperty("propertyAddress", "mohalla", "value", ""));
        let requestBody = {
          MdmsCriteria: {
            tenantId: field.value,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  {
                    name: "Floor"
                  },
                  {
                    name: "OccupancyType"
                  },
                  {
                    name: "OwnerShipCategory"
                  },
                  {
                    name: "OwnerType"
                  },
                  {
                    name: "PropertySubType"
                  },
                  {
                    name: "PropertyType"
                  },
                  {
                    name: "SubOwnerShipCategory"
                  },
                  {
                    name: "UsageCategoryDetail"
                  },
                  {
                    name: "UsageCategoryMajor"
                  },
                  {
                    name: "UsageCategoryMinor"
                  },
                  {
                    name: "UsageCategorySubMinor"
                  }
                ]
              }
            ]
          }
        };

        dispatch(
          fetchGeneralMDMSData(requestBody, "PropertyTax", [
            "Floor",
            "OccupancyType",
            "OwnerShipCategory",
            "OwnerType",
            "PropertySubType",
            "PropertyType",
            "SubOwnerShipCategory",
            "UsageCategoryDetail",
            "UsageCategoryMajor",
            "UsageCategoryMinor",
            "UsageCategorySubMinor"
          ])
        );
      }
    },
    ...dummy,
    ...roadType,
    ...houseNumber,
    ...colony,
    ...street,
    ...mohalla,
    ...pincode,
    ...constructionType,
    ...thana,
    oldPID: {
      id: "oldpid",
      type: "textFieldIcon",
      className: "pt-old-pid-text-field",
      text: "PT_SEARCH_BUTTON",
      iconRedirectionURL: "https://pmidc.punjab.gov.in/propertymis/search.php",
      jsonPath: "Properties[0].oldPropertyId",
      floatingLabelText: "PT_PROPERTY_ADDRESS_EXISTING_PID",
      hintText: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      toolTip: true,
      pattern: /^[a-zA-Z0-9\:\#\/\-\s]{1,64}$/i,
      toolTipMessage: "PT_OLDPID_TOOLTIP_MESSAGE",
      maxLength: 64
    }
  },
  afterInitForm: (action, store, dispatch) => {
    let tenantId = JSON.parse(getUserInfo()).tenantId;
    let city = JSON.parse(getUserInfo()).permanentAddress;
    let state = store.getState();
    const { citiesByModule } = state.common;
    const { PT } = citiesByModule || {};
    if (PT) {
      const tenants = PT.tenants;
      let found = tenants.find(city => {
        return city.code === tenantId;
      });
      if (found) {
        dispatch(handleFieldChange("propertyAddress", "city", tenantId));
        dispatch(prepareFormData("Properties[0].address.city", city));
      }
    }
    set(action, "form.fields.city.required", true);
    set(action, "form.fields.pincode.disabled", false);
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false
};

export default formConfig;
