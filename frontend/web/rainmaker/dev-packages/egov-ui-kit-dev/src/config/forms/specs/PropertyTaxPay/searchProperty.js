import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import sortBy from "lodash/sortBy";

const formConfig = {
  name: "searchProperty",
  idJsonPath: "services[0].serviceRequestId",
  fields: {
    city: {
      id: "city",
      numcols: 6,
      fullWidth: true,
      className: "search-property-form-pt",
      jsonPath: "",
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "ES_CREATECOMPLAINT_SELECT_PLACEHOLDER",
      errorMessage: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      required: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      type: "singleValueList",
    },
    mobileNumber: {
      id: "complainant-mobile-no",
      type: "mobilenumber",
      jsonPath: "",
      floatingLabelText: "PT_OWNER_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "PT_OWNER_MOBILE_NUMBER_PLACEHOLDER",
      inputStyle: { width: "calc(100% - 35px)" },
      numcols: 6,
      pattern: "^([0-9]){10}$",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      pattern: /^(\+\d{1,2}\s)?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      value: "",
    },
    oldpropertyids: {
      id: "old-property-id",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_ADDRESS_EXISTING_PID",
      errorMessage: "",
      hintText: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER",
      numcols: 6,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      value: "",
    },
    ids: {
      id: "property-tax-assessment-id",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_UNIQUE_ID",
      errorMessage: "",
      hintText: "PT_UNIQUE_ID_PLACEHOLDER",
      numcols: 6,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
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
      let tenantId = getTenantId();
      const { PT } = citiesByModule;
      if (PT) {
        const tenants = PT.tenants;
        const dd = tenants.reduce((dd, tenant) => {
          let selected = cities.find((city) => {
            return city.code === tenant.code;
          });
          dd.push({ label: selected.name, value: selected.code });
          return dd;
        }, []);
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
