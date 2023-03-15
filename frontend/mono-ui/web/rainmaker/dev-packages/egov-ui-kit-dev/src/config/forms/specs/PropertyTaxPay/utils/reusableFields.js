import { sortDropdown } from "egov-ui-kit/utils/PTCommon";
import { prepareFormData, fetchGeneralMDMSData, toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { setDependentFields } from "./enableDependentFields";
import { removeFormKey } from "./removeFloors";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import { getTranslatedLabel, generalMDMSDataRequestObj, getGeneralMDMSDataDropdownName } from "egov-ui-kit/utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import { localStorageSet, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";

let floorDropDownData = [];

for (var i = 1; i <= 25; i++) {
  floorDropDownData.push({ label: i.toString(), value: i });
}

export const plotSize = {
  plotSize: {
    id: "assessment-plot-size",
    jsonPath: "Properties[0].propertyDetails[0].buildUpArea",
    type: "number",
    floatingLabelText: "PT_FORM2_PLOT_SIZE",
    hintText: "PT_FORM2_PLOT_SIZE_PLACEHOLDER",
    errorMessage: "PT_PLOT_SIZE_ERROR_MESSAGE",
    required: true,
    fullWidth: true,
    pattern: /^([1-9]\d{0,7})(\.\d+)?$/,
    numcols: 6,
    formName: "plotDetails",
    updateDependentFields: ({ formKey, field, dispatch, state }) => {
      let propertyType = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].propertyType");
      let propertySubType = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].propertySubType");
      if (propertyType === "VACANT" || propertySubType === "INDEPENDENTPROPERTY") {
        dispatch(prepareFormData("Properties[0].propertyDetails[0].landArea", field.value));
        dispatch(prepareFormData("Properties[0].propertyDetails[0].buildUpArea", null));
      }
    },
  },
};

export const floorCount = {
  floorCount: {
    id: "assessment-number-of-floors",
    jsonPath: "Properties[0].propertyDetails[0].noOfFloors",
    type: "AutocompleteDropdown",
    floatingLabelText: "PT_FORM2_NUMBER_OF_FLOORS",
    hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    toolTip: true,
    defaultSort:false,
    fullWidth: true,
    toolTipMessage: "PT_NUMBER_OF_FLOORS_TOOLTIP_MESSAGE",
    required: true,
    numcols: 6,
    gridDefination: {
      xs: 12,
      sm: 6
    },
    dropDownData: floorDropDownData,
    formName: "plotDetails",
    updateDependentFields: ({ formKey, field, dispatch, state }) => {
      // removeFormKey(formKey, field, dispatch, state);
      var previousFloorNo = localStorageGet("previousFloorNo") || -1;
      localStorageSet("previousFloorNo", field.value);
      // dispatch(toggleSpinner());
      if (previousFloorNo > field.value) {
        for (var i = field.value; i < previousFloorNo; i++) {
          if (state.form.hasOwnProperty(`customSelect_${i}`)) {
            dispatch(removeForm(`customSelect_${i}`));
          }
          for (var variable in state.form) {
            if (state.form.hasOwnProperty(variable) && variable.startsWith(`floorDetails_${i}`)) {
              dispatch(removeForm(variable));
            }
          }
          let units=get(state,'form.prepareFormData.Properties[0].propertyDetails[0].units',[])
          units=units&&units.filter(unit=>unit&&unit.floorNo&&unit.floorNo!="undefined"&&unit.floorNo!=i)
          dispatch(prepareFormData(`Properties[0].propertyDetails[0].units`, units));
        }
      }
    },
  },
};

export const subUsageType = {
  subUsageType: {
    id: "assessment-subUsageType",
    jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryDetail",
    type: "AutocompleteDropdown",
    localePrefix: "PROPERTYTAX_BILLING_SLAB",
    floatingLabelText: "PT_FORM2_SUB_USAGE_TYPE",
    hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    dropDownData: [],
    required: true,
    numcols: 4,
    gridDefination: {
      xs: 12,
      sm: 4
    },
    formName: "plotDetails",
    updateDependentFields: ({ formKey, field, dispatch, state }) => {
      let subUsageMinor = get(state, `common.generalMDMSDataById.UsageCategoryDetail[${field.value}]`);
      if (!isEmpty(subUsageMinor)) {
        dispatch(prepareFormData(`${field.jsonPath.split("usageCategoryDetail")[0]}usageCategorySubMinor`, subUsageMinor.usageCategorySubMinor));
      } else {
        dispatch(prepareFormData(`${field.jsonPath.split("usageCategoryDetail")[0]}usageCategorySubMinor`, field.value));
        dispatch(prepareFormData(field.jsonPath, null));
      }
    },
  },
};

export const occupancy = {
  occupancy: {
    id: "assessment-occupancy",
    jsonPath: "Properties[0].propertyDetails[0].units[0].occupancyType",
    type: "AutocompleteDropdown",
    localePrefix: { moduleName: "PropertyTax", masterName: "OccupancyType" },
    floatingLabelText: "PT_FORM2_OCCUPANCY",
    hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    required: true,
    numcols: 4,
    gridDefination: {
      xs: 12,
      sm: 4
    },
    dropDownData: [],
    formName: "plotDetails",
    updateDependentFields: ({ formKey, field: sourceField, dispatch }) => {
      const { value } = sourceField;
      const dependentFields1 = ["annualRent"];
      switch (value) {
        case "RENTED":
          setDependentFields(dependentFields1, dispatch, formKey, false);
          break;
        default:
          setDependentFields(dependentFields1, dispatch, formKey, true);
          break;
      }
    },
  },
};

export const builtArea = {
  builtArea: {
    id: "assessment-built-area",
    jsonPath: "Properties[0].propertyDetails[0].units[0].unitArea",
    type: "number",
    floatingLabelText: "PT_FORM2_BUILT_AREA",
    hintText: "PT_FORM2_BUILT_UP_AREA_PLACEHOLDER",
    errorMessage: "PT_BUILT_AREA_ERROR_MESSAGE",
    toolTip: true,
    toolTipMessage: "PT_BUILT_UP_AREA_TOOLTIP_MESSAGE",
    required: true,
    hideField: false,
    numcols: 4,
    pattern: /^([1-9]\d{0,7})(\.\d+)?$/,
    formName: "plotDetails",
  },
};

export const superArea = {
  superArea: {
    id: "assessment-super-area",
    jsonPath: "Properties[0].propertyDetails[0].buildUpArea",
    type: "number",
    floatingLabelText: "PT_FORM2_TOTAL_BUILT_AREA",
    hintText: "PT_FORM2_TOTAL_BUILT_AREA_PLACEHOLDER",
    ErrorText: "Enter a valid super area size",
    errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    toolTip: true,
    toolTipMessage: "Total Carpet Area + Total balcony area + Total thickness of outer walls + Total common area (lift, stairs, lobby etc.)",
    required: true,
    numcols: 4,
    hideField: false,
    updateDependentFields: ({ formKey, field, dispatch, state }) => {
      dispatch(prepareFormData("Properties[0].propertyDetails[0].units[0].unitArea", field.value));
    },
    pattern: /^([1-9]\d{0,7})(\.\d+)?$/,
    errorMessage: "PT_SUPER_AREA_ERROR_MESSAGE",
    formName: "plotDetails",
  },
};

export const annualRent = {
  annualRent: {
    id: "assessment-annual-rent",
    jsonPath: "Properties[0].propertyDetails[0].units[0].arv",
    type: "number",
    floatingLabelText: "PT_FORM2_TOTAL_ANNUAL_RENT",
    hintText: "PT_FORM2_TOTAL_ANNUAL_RENT_PLACEHOLDER",
    ErrorText: "Enter a valid amount",
    errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    toolTip: true,
    toolTipMessage: "PT_TOTAL_ANNUAL_RENT_TOOLTIP_MESSAGE",
    required: true,
    pattern: /^([1-9]\d{0,7})(\.\d+)?$/,
    hideField: true,
    numcols: 4,
    formName: "plotDetails",
  },
};

export const measuringUnit = {
  // measuringUnit: {
  //   id: "assessment-plot-unit",
  //   jsonPath: "",
  //   type: "singleValueList",
  //   floatingLabelText: "Measuring unit",
  //   dropDownData: [{ label: "sq ft", value: "sq ft" }, { label: "sq yards", value: "sq yards" }],
  //   required: true,
  //   numcols: 4,
  //   value: "sq yards",
  // },
};

export const floorName = {
  floorName: {
    id: "floorName",
    type: "AutocompleteDropdown",
    floatingLabelText: "PT_FORM2_SELECT_FLOOR",
    localePrefix: { moduleName: "PropertyTax", masterName: "Floor" },
    hintText: "PT_FORM2_SELECT_FLOOR",
    numcols: 4,
    gridDefination: {
      xs: 12,
      sm: 4
    },
    defaultSort:false,
    errorMessage: "",
    required: true,
    jsonPath: "Properties[0].propertyDetails[0].units[0].floorNo",
    hideField: true,
    formName: "plotDetails",
  },
};

export const beforeInitForm = {
  beforeInitForm: (action, store) => {
    let state = store.getState();
    let { dispatch } = store;
    const { form } = action;
    const { name: formKey, fields } = form;
    const propertyType = get(state, "form.basicInformation.fields.typeOfBuilding.value");
    const { Floor } = state.common && state.common.generalMDMSDataById;
    if (get(action, "form.fields.floorName")) {
      if (propertyType === "SHAREDPROPERTY") {
        let floorData = prepareDropDownData(Floor);
        floorData && floorData.length > 0 && floorData.forEach(data => { data.label = getLocaleLabels(`PROPERTYTAX_FLOOR_${data.value}`, `PROPERTYTAX_FLOOR_${data.value}`) });
        set(action, "form.fields.floorName.hideField", false);
        set(action, "form.fields.floorName.dropDownData", floorData);
      } else {
        set(action, "form.fields.floorName.hideField", true);
      }
    }

    //For adding multiple units to prepareFormData
    if (formKey.startsWith(`floorDetails_`)) {
      const arr = formKey.split("_");
      const floorIndex = parseInt(arr[1]);
      const unitIndex = parseInt(arr[3]);
      const property = get(state, `common.prepareFormData.Properties[0].propertyDetails[0]`);
      let unitsCount = null;
      const { localizationLabels } = state.app;
      if (state.form[formKey]) {
        unitsCount = state.form[formKey].unitsIndex;
      } else {
        unitsCount = property && property.units && property.units.length;
        form.unitsIndex = unitsCount;
      }
      // Adding formName prop to each field item to display required Error message.
      let fieldsArray = Object.keys(form.fields);
      if(fieldsArray && fieldsArray.length > 0){
        fieldsArray.map(key=>{
          form.fields[key].formName = form.name;
        });
      }
      if (floorIndex === 0 && unitIndex === 0) {
        form.unitsIndex = 0;
        propertyType !== "SHAREDPROPERTY" && dispatch(prepareFormData(`Properties[0].propertyDetails[0].units[0].floorNo`, "0"));
      } else {
        const updatedFields = Object.keys(fields).reduce((updatedFields, fieldKey) => {
          const jsonPath = fields[fieldKey].jsonPath;
          updatedFields[fieldKey] = { ...fields[fieldKey], unitsIndex: unitsCount };
          if (jsonPath.indexOf("units[") > -1) {
            const first = jsonPath.split("units[")[0];
            const last = jsonPath.split("units[")[1].split("]")[1];
            updatedFields[fieldKey].jsonPath = `${first}units[${unitsCount}]${last}`;
          }
          return updatedFields;
        }, {});
        set(action, "form.fields", { ...updatedFields });
        if (!state.form[formKey]) {
          const customSelectObj = state.form[`customSelect_${floorIndex}`];
          const floorNo = customSelectObj.fields && customSelectObj.fields.floorName && customSelectObj.fields.floorName.value;
          dispatch(prepareFormData(`Properties[0].propertyDetails[0].units[${unitsCount}].floorNo`, `${floorNo}`));
        }
      }
      let usageCategoryMajor = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor");
      if (usageCategoryMajor !== "MIXED") {
        const usageTypeValue = get(form, "fields.usageType.value");
        set(action, "form.fields.usageType.value", getTranslatedLabel(usageTypeValue, localizationLabels));
        dispatch(setFieldProperty(formKey, "usageType", "value", getTranslatedLabel(usageTypeValue, localizationLabels)));
      }
    }

    var occupancy = get(state, "common.generalMDMSDataById.OccupancyType");
    var usageCategoryMinor = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor");
    var usageCategoryMajor = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor");
    set(action, "form.fields.subUsageType.hideField", false);

    const unitFormUpdate = (usageCategoryMinor, skipMajorUpdate = true) => {
      var filteredSubUsageMinor = filter(
        prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategorySubMinor"), true),
        (subUsageMinor) => {
          return subUsageMinor.usageCategoryMinor === get(state, usageCategoryMinor);
        }
      );
      if (filteredSubUsageMinor.length > 0) {
        var filteredUsageCategoryDetails = getPresentMasterObj(
          prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategoryDetail"), true),
          filteredSubUsageMinor,
          "usageCategorySubMinor"
        );
        const mergedMaster = mergeMaster(filteredSubUsageMinor, filteredUsageCategoryDetails, "usageCategorySubMinor");
        let subUsageData = sortDropdown(mergedMaster, "label", true);
        subUsageData.forEach(data => { data.label = getLocaleLabels(`PT_${data.value}`, `PROPERTYTAX_BILLING_SLAB_${data.value}`) });
        set(action, "form.fields.subUsageType.dropDownData", subUsageData);
        if (get(action, "form.fields.subUsageType.jsonPath") && skipMajorUpdate) {
          dispatch(
            prepareFormData(
              `${action.form.fields.subUsageType.jsonPath.split("usageCategoryDetail")[0]}usageCategoryMinor`,
              get(state, `common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor`)
            )
          );
        }
        set(action, "form.fields.subUsageType.hideField", false);
      } else {
        set(action, "form.fields.subUsageType.hideField", true);
      }
    };

    if (usageCategoryMinor && usageCategoryMajor !== "MIXED") {
      unitFormUpdate("common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor");
    } else {
      if (usageCategoryMajor === "MIXED") {
        var masterOne = get(state, "common.generalMDMSDataById.UsageCategoryMajor");
        var masterTwo = get(state, "common.generalMDMSDataById.UsageCategoryMinor");
        var usageTypes = mergeMaster(masterOne, masterTwo, "usageCategoryMajor");
        var filterArrayWithoutMixed = filter(usageTypes, (item) => item.value !== "MIXED");
        set(action, "form.fields.usageType.disabled", false);
        let usageTypeData = sortDropdown(filterArrayWithoutMixed, "label", true);
        usageTypeData.forEach(data => { data.label = getLocaleLabels(`PT_${data.value}`, `PROPERTYTAX_BILLING_SLAB_${data.value}`) });
        set(action, "form.fields.usageType.dropDownData", usageTypeData);
        unitFormUpdate(`common.prepareFormData.${action.form.fields.subUsageType.jsonPath.split("usageCategoryDetail")[0]}usageCategoryMinor`, false);
      } else {
        set(action, "form.fields.subUsageType.hideField", true);
      }
    }
    let occupancyPrepareData = prepareDropDownData(occupancy);
    occupancyPrepareData && occupancyPrepareData.length > 0 && occupancyPrepareData.forEach(data => { data.label = getLocaleLabels(`PROPERTYTAX_OCCUPANCYTYPE_${data.value}`, `PROPERTYTAX_OCCUPANCYTYPE_${data.value}`) });
    set(action, "form.fields.occupancy.dropDownData", occupancyPrepareData);
    if (get(action, "form.fields.subUsageType.jsonPath") && usageCategoryMajor !== "MIXED") {
      dispatch(
        prepareFormData(
          `${action.form.fields.subUsageType.jsonPath.split("usageCategoryDetail")[0]}usageCategoryMajor`,
          get(state, `common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor`)
        )
      );
    }
    if (get(state, `common.prepareFormData.${get(action, "form.fields.occupancy.jsonPath")}`) === "RENTED") {
      set(action, "form.fields.annualRent.hideField", false);
    } else {
      set(action, "form.fields.annualRent.hideField", true);
    }
    return action;
  },
};

export const beforeInitFormForPlot = {
  beforeInitForm: (action, store) => {
    let state = store.getState();
    let { dispatch } = store;
    const propertyType = get(state, "form.basicInformation.fields.typeOfBuilding.value");
    const { Floor } = state.common && state.common.generalMDMSDataById;
    if (get(action, "form.fields.floorName")) {
      if (propertyType === "SHAREDPROPERTY") {
        let floorData = prepareDropDownData(Floor);
        floorData && floorData.length > 0 && floorData.forEach(data => { data.label = getLocaleLabels(`PROPERTYTAX_FLOOR_${data.value}`, `PROPERTYTAX_FLOOR_${data.value}`) });
        set(action, "form.fields.floorName.hideField", false);
        set(action, "form.fields.floorName.dropDownData", floorData);
      } else {
        set(action, "form.fields.floorName.hideField", true);
      }
    }
    if (propertyType != "VACANT") {
      var occupancy = get(state, "common.generalMDMSDataById.OccupancyType");
      var usageCategoryMinor = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor");
      var usageCategoryMajor = get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor");
      set(action, "form.fields.subUsageType.hideField", false);

      if (usageCategoryMinor && usageCategoryMajor !== "MIXED") {
        var filteredSubUsageMinor = filter(
          prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategorySubMinor"), true),
          (subUsageMinor) => {
            return subUsageMinor.usageCategoryMinor === get(state, "common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor");
          }
        );
        if (filteredSubUsageMinor.length > 0) {
          var filteredUsageCategoryDetails = getPresentMasterObj(
            prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategoryDetail"), true),
            filteredSubUsageMinor,
            "usageCategorySubMinor"
          );
          const mergedMaster = mergeMaster(filteredSubUsageMinor, filteredUsageCategoryDetails, "usageCategorySubMinor");
          let subUsageData = sortDropdown(mergedMaster, "label", true);
          subUsageData.forEach(data => { data.label = getLocaleLabels(`PT_${data.value}`, `PROPERTYTAX_BILLING_SLAB_${data.value}`) });
          set(action, "form.fields.subUsageType.dropDownData", subUsageData);
          // set(
          //   action,
          //   "form.fields.subUsageType.value",
          //   null)
          // );
          if (get(action, "form.fields.subUsageType.jsonPath")) {
            dispatch(
              prepareFormData(
                `${action.form.fields.subUsageType.jsonPath.split("usageCategoryDetail")[0]}usageCategoryMinor`,
                get(state, `common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMinor`)
              )
            );
          }
        } else {
          set(action, "form.fields.subUsageType.hideField", true);
        }
      } else {
        if (usageCategoryMajor === "MIXED") {
          var masterOne = get(state, "common.generalMDMSDataById.UsageCategoryMajor");
          var masterTwo = get(state, "common.generalMDMSDataById.UsageCategoryMinor");
          var usageTypes = mergeMaster(masterOne, masterTwo, "usageCategoryMajor");
          var filterArrayWithoutMixed = filter(usageTypes, (item) => item.value !== "MIXED");
          set(action, "form.fields.usageType.disabled", false);
          let usageTypeData = sortDropdown(filterArrayWithoutMixed, "label", true);
          usageTypeData.forEach(data => { data.label = getLocaleLabels(`PT_${data.value}`, `PROPERTYTAX_BILLING_SLAB_${data.value}`) });
          set(action, "form.fields.usageType.dropDownData", usageTypeData);
        }
        set(action, "form.fields.subUsageType.hideField", true);
      }
      let occupancyPrepareData = prepareDropDownData(occupancy);
      occupancyPrepareData && occupancyPrepareData.length > 0 && occupancyPrepareData.forEach(data => { data.label = getLocaleLabels(`PROPERTYTAX_OCCUPANCYTYPE_${data.value}`, `PROPERTYTAX_OCCUPANCYTYPE_${data.value}`) })
      set(action, "form.fields.occupancy.dropDownData", occupancyPrepareData);
      if (get(action, "form.fields.subUsageType.jsonPath") && usageCategoryMajor !== "MIXED") {
        dispatch(
          prepareFormData(
            `${action.form.fields.subUsageType.jsonPath.split("usageCategoryDetail")[0]}usageCategoryMajor`,
            get(state, `common.prepareFormData.Properties[0].propertyDetails[0].usageCategoryMajor`)
          )
        );
      }
    }
    if (propertyType == "VACANT") {
      dispatch(prepareFormData(`Properties[0].propertyDetails[0].noOfFloors`, 1));
    }
    if (propertyType == "SHAREDPROPERTY") {
      dispatch(prepareFormData(`Properties[0].propertyDetails[0].noOfFloors`, 1));
      // dispatch(prepareFormData(`Properties[0].propertyDetails[0].units[0].floorNo`, -1));
    }
    if (get(state, `common.prepareFormData.${get(action, "form.fields.occupancy.jsonPath")}`) === "RENTED") {
      set(action, "form.fields.annualRent.hideField", false);
    } else {
      set(action, "form.fields.annualRent.hideField", true);
    }
    return action;
  },
};

export const city = {
  city: {
    id: "city",
    jsonPath: "Properties[0].address.city",
    required: true,
    localePrefix: { moduleName: "tenant", masterName: "tenants" },
    type: "AutocompleteDropdown",
    floatingLabelText: "CORE_COMMON_CITY",
    errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    fullWidth: true,
    hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    numcols: 6,
    gridDefination: {
      xs: 12,
      sm: 6
    },
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
      let requestBody = generalMDMSDataRequestObj(field.value);

      dispatch(
        fetchGeneralMDMSData(requestBody, "PropertyTax", getGeneralMDMSDataDropdownName())
      );
    },
  }
};

export const dummy = {
  dummy: {
    numcols: 6,
    type: "dummy",
  },
};

export const houseNumber = {
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
};

export const colony = {
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
};

export const street = {
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
};

export const mohalla = {
  mohalla: {
    id: "mohalla",
    jsonPath: "Properties[0].address.locality.code",
    type: "AutocompleteDropdown",
    floatingLabelText: "PT_PROPERTY_DETAILS_MOHALLA",
    hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    fullWidth: true,
    toolTip: true,
    localePrefix: true,
    toolTipMessage: "PT_MOHALLA_TOOLTIP_MESSAGE",
    labelsFromLocalisation: true,
    //toolTipMessage: "Name of the area in which your property is located",
    boundary: true,
    numcols: 6,
    gridDefination: {
      xs: 12,
      sm: 6
    },
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
    required: true,
    formName: "propertyAddress",
    updateDependentFields: ({ formKey, field, dispatch }) => {
      if (field.value && field.value.length > 0) {
        const mohalla = field.dropDownData.find((option) => {
          return option.value === field.value;
        });
        dispatch(prepareFormData("Properties[0].address.locality.area", mohalla.area));
      }
    },
  },
};

export const pincode = {
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
};

export const prepareDropDownData = (master, withOriginal = false) => {
  let dropDownData = [];
  for (var variable in master) {
    if (master.hasOwnProperty(variable)) {
      if (withOriginal) {
        dropDownData.push(master[variable]);
      } else {
        dropDownData.push({ label: master[variable].name, value: master[variable].code });
      }
    }
  }
  return dropDownData;
};

export const getPresentMasterObj = (master1Arr, master2Arr, propToCompare) => {
  const propArray = master2Arr.reduce((result, item) => {
    if (item["code"] && result.indexOf(item["code"]) === -1) {
      result.push(item["code"]);
    }
    return result;
  }, []);
  return master1Arr.filter((item) => propArray.indexOf(item[propToCompare]) !== -1);
};

export const getAbsentMasterObj = (master1Arr, master2Arr, propToCompare) => {
  const propArray = master2Arr.reduce((result, item) => {
    if (item[propToCompare] && result.indexOf(item[propToCompare]) === -1) {
      result.push(item[propToCompare]);
    }
    return result;
  }, []);
  return master1Arr.filter((item) => propArray.indexOf(item.code) === -1);
};

export const mergeMaster = (masterOne, masterTwo, parentName = "") => {
  let dropDownData = [];
  let parentList = [];
  for (var variable in masterTwo) {
    if (masterTwo.hasOwnProperty(variable)) {
      dropDownData.push({ label: masterTwo[variable].name, value: masterTwo[variable].code });
    }
  }
  let masterOneData = getAbsentMasterObj(prepareDropDownData(masterOne, true), prepareDropDownData(masterTwo, true), parentName);
  for (var i = 0; i < masterOneData.length; i++) {
    dropDownData.push({ label: masterOneData[i].name, value: masterOneData[i].code });
  }
  return dropDownData;
};
