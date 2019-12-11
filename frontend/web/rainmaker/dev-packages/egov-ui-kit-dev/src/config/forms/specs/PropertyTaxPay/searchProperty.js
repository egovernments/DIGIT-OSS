
import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { CITY } from "egov-ui-kit/utils/endPoints";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import sortBy from "lodash/sortBy";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import _ from "lodash";

const formConfig = {
  name: "searchProperty",
  idJsonPath: "services[0].serviceRequestId",
  fields: {
    city: {
      id: "city",
      numcols: 4,
      localePrefix: { moduleName: "tenant", masterName: "tenants" },
      dontReset: (process.env.REACT_APP_NAME !== "Citizen" ? true : false),
      fullWidth: true,
      className: "search-property-form-pt",
      jsonPath: "",
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "ES_CREATECOMPLAINT_SELECT_PLACEHOLDER",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      required: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      type: "autoSuggestDropdown",
      labelsFromLocalisation:true,
      dataFetchConfig: {
        dependants: [
          {
            fieldKey: "mohalla",
          },
        ],
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        //  dispatch(setFieldProperty("searchProperty", "mohalla", "value", ""));
        const moduleValue = field.value;
        //  dispatch(fetchLocalizationLabel(getLocale(), moduleValue, moduleValue));
      },
      beforeFieldChange: ({ action, dispatch, state }) => {
        if (_.get(state, "form.searchProperty.fields.city.value") !== action.value) {
          const moduleValue = action.value;
          dispatch(fetchLocalizationLabel(getLocale(), moduleValue, moduleValue));
        }
        return action;
      },
    },
    mobileNumber: {
      id: "complainant-mobile-no",
      type: "textfield",
      jsonPath: "",
      floatingLabelText: "PT_OWNER_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "PT_OWNER_MOBILE_NUMBER_PLACEHOLDER",
      inputStyle: { width: "calc(100% - 35px)" },
      numcols: 4,
      pattern: "^([0-9]){10}$",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^(\+\d{1,2}\s)?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      value: "",
    },
    ids: {
      id: "property-tax-assessment-id",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_UNIQUE_ID",
      errorMessage: "",
      hintText: "PT_UNIQUE_ID_PLACEHOLDER",
      numcols: 4,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
    },
    oldpropertyids: {
      id: "old-property-id",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_ADDRESS_EXISTING_PID",
      errorMessage: "",
      hintText: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER",
      numcols: 4,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      value: "",
      pattern: /^[^\$\"'<>?\\\\~`!@$%^+={}*,.:;“”‘’]{1,64}$/i
    },
    mohalla: {
      id: "mohalla",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_PROPERTY_DETAILS_MOHALLA",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      fullWidth: true,
      toolTip: true,
      toolTipMessage: "PT_MOHALLA_TOOLTIP_MESSAGE",
      labelsFromLocalisation: true,
      boundary: true,
      numcols: 4,
      errorMessage: "PT_PROPERTY_DETAILS_MOHALLA_ERRORMSG",
      dataFetchConfig: {
        url: "egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        action: "",
        queryParams: [],
        requestBody: {},
        isDependent: true,
        hierarchyType: "REVENUE",
      },
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      value: "",
      updateDependentFields: ({ formKey, field: sourceField, dispatch }) => {
        const { value } = sourceField;

        if (value) {
          dispatch(setFieldProperty("searchProperty", "houseNumber", "disabled", false));
        }
      }
    },
    houseNumber: {
      id: "house-number",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_DETAILS_DOOR_NUMBER",
      hintText: "PT_PROPERTY_DETAILS_DOOR_NUMBER_PLACEHOLDER",
      numcols: 4,
      errorMessage: "PT_PROPERTY_DETAILS_DOOR_NUMBER_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      value: "",
    },
  },
  submit: {
    type: "submit",
    label: "SEARCH",
    id: "search-property",
  },
  afterInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      const { cities, citiesByModule } = state.common;
      const { mohalla, city } = state.form.searchProperty.fields;
      let tenantId = JSON.parse(getUserInfo()).tenantId;
      const { PT } = citiesByModule;
      if (!mohalla.value) {
        dispatch(setFieldProperty("searchProperty", "houseNumber", "disabled", true));
      }

      if (PT) {
        const tenants = PT.tenants;
        const dd = tenants.reduce((dd, tenant) => {
          let selected = cities.find((city) => {
            return city.code === tenant.code;
          });
          dd.push({ label: selected.name, value: selected.code });
          return dd;
        }, []);
        if (tenantId !== city.value)
          dispatch(setFieldProperty("searchProperty", "city", "dropDownData", sortBy(dd, ["label"])));

        if (process.env.REACT_APP_NAME !== "Citizen") {
          let found = tenants.find((city) => {
            return city.code === tenantId;
          });
          if (found) {
            dispatch(handleFieldChange("searchProperty", "city", tenantId));
            dispatch(setFieldProperty("searchProperty", "city", "disabled", true));
          }
        }
        else {
          var user = _.find(dd, { value: city.value });
          //    if (user && user.value !== city.value)
          if (city.value)
            dispatch(handleFieldChange("searchProperty", "city", city.value));
        }

      }
      return action;
    } catch (e) {
      console.log(e);
    }
  },
  action: "_search",
  saveUrl: "/pt-services-v2/property",
  redirectionRoute: "",
  isFormValid: false,
};

export default formConfig;
