import { prepareDropDownData } from "./utils/reusableFields";
import { setFieldProperty, handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import set from "lodash/set";
import get from "lodash/get";

const formConfig = {
  name: "customSelect",
  fields: {
    floorName: {
      id: "floorName",
      type: "singleValueList",
      localePrefix: { moduleName: "PropertyTax", masterName: "Floor" },
      floatingLabelText: "PT_FORM2_SELECT_FLOOR",
      hintText: "PT_FORM2_SELECT_FLOOR",
      numcols: 12,
      defaultSort:false,
      errorMessage: "",
      required: true,
      className: "pt-floor-name",
      beforeFieldChange: ({ action, dispatch, state }) => {
        const { value } = action;
        const floorValues = Object.keys(state.form).reduce((floorValues, key) => {
          if (key.startsWith("customSelect_")) {
            const form = state.form[key];
            if (form && form.fields.floorName.value) {
              floorValues.push(form.fields.floorName.value);
            }
          }
          return floorValues;
        }, []);
        const valueExists = floorValues.find((floorvalue) => {
          return floorvalue === value;
        });
        if (valueExists && get(state, `form[${action.formKey}].fields[${action.fieldKey}].value`) !== action.value) {
          alert("This floor is already selected, please select another floor");
          action.value = "";
        }
        return action;
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        var arr = formKey.split("_");
        var floorIndex = parseInt(arr[1]);
        const floorNo = get(state, `form.${formKey}.fields.floorName.value`);
        for (var variable in state.form) {
          if (state.form.hasOwnProperty(variable) && variable.startsWith(`floorDetails_${floorIndex}`)) {
            dispatch(prepareFormData(`Properties[0].propertyDetails[0].units[${state.form[variable].unitsIndex}].floorNo`, floorNo));
          }
        }
      },
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
  beforeInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      if (
        get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor") !== "RESIDENTIAL" &&
        get(state, "common.prepareFormData.Properties[0].propertyDetails[0].propertySubType") === "SHAREDPROPERTY"
      ) {
        dispatch(setFieldProperty(action.form.name, "floorName", "hideField", true));
      } else {
        dispatch(setFieldProperty(action.form.name, "floorName", "hideField", false));
        const { Floor } = state.common && state.common.generalMDMSDataById;
        set(action, "form.fields.floorName.dropDownData", prepareDropDownData(Floor));
      }
      return action;
    } catch (e) {
    }
  },
  afterInitForm: (action, store, dispatch) => {
    try {
      let state = store.getState();
      if (action.form.name === "customSelect_0") {
        if (
          get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor") !== "RESIDENTIAL" &&
          get(state, "common.prepareFormData.Properties[0].propertyDetails[0].propertySubType") === "SHAREDPROPERTY"
        ) {
          //Do nothing
        } else {
          dispatch(handleFieldChange("customSelect_0", "floorName", "0"));
          dispatch(setFieldProperty("customSelect_0", "floorName", "disabled", true));
        }
      }
      return action;
    } catch (e) {
    }
  },
};

export default formConfig;
