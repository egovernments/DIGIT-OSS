import get from "lodash/get";
import filter from "lodash/filter";
import { CITY } from "egov-ui-kit/utils/endPoints";
import { pincode, mohalla, street, colony, houseNumber, dummy } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import { prepareFormData, fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import sortBy from "lodash/sortBy";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

var constructiontype =[{value : "road1" , label :"rd1" }]

const formConfig = {
  name: "propertyAddress",
  fields: {
    city: {
      id: "city",
      jsonPath: "PropertiesTemp[0].address.city",
      required: true,
      localePrefix: { moduleName: "tenant", masterName: "tenants" },
      type: "singleValueList",
      floatingLabelText: "CORE_COMMON_CITY",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
      dataFetchConfig: {
        dependants: [
          {
            fieldKey: "mohalla",
          },
        ],
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        dispatch(prepareFormData("Properties[0].tenantId", field.value));
        dispatch(
          prepareFormData(
            "Properties[0].address.city",
            filter(get(state, "common.cities"), (city) => {
              return city.code === field.value;
            })[0].name
          )
        );
        dispatch(setFieldProperty("propertyAddress", "mohalla", "value", ""));
        const moduleValue = field.value;
        dispatch(fetchLocalizationLabel(getLocale(), moduleValue, moduleValue));
        let requestBody = {
          MdmsCriteria: {
            tenantId: field.value,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  {
                    name: "Floor",
                  },
                  {
                    name: "OccupancyType",
                  },
                  {
                    name: "OwnerShipCategory",
                  },
                  {
                    name: "OwnerType",
                  },
                  {
                    name: "PropertySubType",
                  },
                  {
                    name: "PropertyType",
                  },
                  {
                    name: "SubOwnerShipCategory",
                  },
                  {
                    name: "UsageCategoryDetail",
                  },
                  {
                    name: "UsageCategoryMajor",
                  },
                  {
                    name: "UsageCategoryMinor",
                  },
                  {
                    name: "UsageCategorySubMinor",
                  },
                  {
                    name: "ConstructionType",
                  },
                  {
                    name: "Rebate",
                  },
                  {
                    name: "Interest",
                  },
                  {
                    name: "FireCess",
                  },
                  {
                    name: "RoadType",
                  },
                  {
                    name: "Thana",
                  }
                ],
              },
            ],
          },
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
            "UsageCategorySubMinor",
            "ConstructionType",
            "Rebate",
            "Penalty",
            "Interest",
            "FireCess",
            "RoadType",
            "Thana"
          ])
        );

        dispatch(fetchGeneralMDMSData(
          null,
          "BillingService",
          ["TaxPeriod", "TaxHeadMaster"],
          "",
          field.value
        ));
      },
    },
    dummy: {
      numcols: 6,
      type: "dummy",
    },
    houseNumber: {
      id: "house-number",
      jsonPath: "Properties[0].address.doorNo",    
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_DETAILS_DOOR_NUMBER",
      hintText: "PT_PROPERTY_DETAILS_DOOR_NUMBER_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_DOOR_NUMBER_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
    },
    colony: {
      id: "property-colony",
      jsonPath: "Properties[0].address.buildingName",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_DETAILS_BUILDING_COLONY_NAME",
      hintText: "PT_PROPERTY_DETAILS_BUILDING_COLONY_NAME_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_COLONY_NAME_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
    },
    street: {
      id: "property-street",
      jsonPath: "Properties[0].address.street",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_DETAILS_STREET_NAME",
      hintText: "PT_PROPERTY_DETAILS_STREET_NAME_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_STREET_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
    },
    ...mohalla,
    pincode: {
      id: "pincode",
      type: "number",
      jsonPath: "Properties[0].address.pincode",
      floatingLabelText: "PT_PROPERTY_DETAILS_PINCODE",
      hintText: "PT_PROPERTY_DETAILS_PINCODE_PLACEHOLDER",
      numcols: 6,
      //errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
      errorMessage: "PT_PINCODE_ERROR_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: "^([0-9]){6}$",
    },
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
      pattern: /^[^\$\"'<>?\\\\~`!@$%^+={}*,.:;“”‘’]{1,64}$/i,
      toolTipMessage: "PT_OLDPID_TOOLTIP_MESSAGE",
      maxLength: 64,
    },
    roadType: {
      id: "roadType",
      jsonPath: "Properties[0].propertyDetails[0].additionalDetails.roadType",
      localePrefix: { moduleName: "PropertyTax", masterName: "RoadType" },
      type: "singleValueList",
      floatingLabelText: "PT_PROPERTY_ADDRESS_ROAD_TYPE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
    },
    thanaType: {
      id: "Thana",
      jsonPath: "Properties[0].propertyDetails[0].additionalDetails.thana",
      localePrefix: { moduleName: "PropertyTax", masterName: "Thana" },
      type: "singleValueList",
      floatingLabelText: "PT_PROPERTY_ADDRESS_THANA",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
    },
  },
  afterInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      const { localizationLabels } = state.app;
      const { cities, citiesByModule, loadMdmsData } = state.common;
      const roadTypeData =
        get(loadMdmsData, "PropertyTax.RoadType") &&
        Object.values(get(loadMdmsData, "PropertyTax.RoadType")).map((item, index) => {
          return { value: item.code, label: item.name };
        });

      dispatch(setFieldProperty("propertyAddress", "roadType", "dropDownData", roadTypeData));

     const thanaData =
      get(loadMdmsData, "PropertyTax.Thana") &&
      Object.values(get(loadMdmsData, "PropertyTax.Thana")).map((item, index) => {
      return { value: item.code, label: item.name };
      });
      console.log("thanaData------->>>",thanaData)
      dispatch(setFieldProperty("propertyAddress", "thanaType", "dropDownData", thanaData));

      const PT = citiesByModule && citiesByModule.PT;
      if (PT) {
        const tenants = PT.tenants;
        const dd = tenants.reduce((dd, tenant) => {
          let selected = cities.find((city) => {
            return city.code === tenant.code;
          });
          const label = `TENANT_TENANTS_${selected.code.toUpperCase().replace(/[.]/g, "_")}`;
          dd.push({ label: getTranslatedLabel(label, localizationLabels), value: selected.code });
          return dd;
        }, []);
        dispatch(setFieldProperty("propertyAddress", "city", "dropDownData", sortBy(dd, ["label"])));
      }
      return action;
    } catch (e) {
      console.log(e);
      return action;
    }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
