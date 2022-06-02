import { sortDropdown } from "egov-ui-kit/utils/PTCommon";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import { removeFormKey } from "./utils/removeFloors";
import { prepareDropDownData } from "./utils/reusableFields";
import set from "lodash/set";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";


const options = [
  
  { value: true, label: getLocaleLabels("Yes", "PT_COMMON_YES") },
  { value: false, label: getLocaleLabels("No", "PT_COMMON_NO") },
];

const propertyOptions = [
  { value: "CREATE", label: getLocaleLabels("New Property (Default)", "PT_NEW_PROPERTY_DEFAULT") },
  { value: "LEGACY_ENTRY", label: getLocaleLabels("Legacy Data Entry", "PT_LEGACY_DATA_ENTRY") },
];

const formConfig = {
  name: "basicInformation",
  fields: {
    typeOfUsage: {
      id: "typeOfUsage",
      jsonPath: "Properties[0].propertyDetails[0].usageCategoryMinor",
      type: "singleValueList",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      floatingLabelText: "PT_COMMONS_PROPERTY_USAGE_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      required: true,
      formName: "basicInformation",
      fullWidth: true,
      numcols: 6,
      labelsFromLocalisation:false,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        removeFormKey(formKey, field, dispatch, state);
        dispatch(prepareFormData(`Properties[0].propertyDetails[0].units`, []));
        let minorObject = get(state, `common.generalMDMSDataById.UsageCategoryMinor[${field.value}]`);
        if (!isEmpty(minorObject)) {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].usageCategoryMajor", minorObject.usageCategoryMajor));
        } else {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].usageCategoryMajor", field.value));
          dispatch(prepareFormData("Properties[0].propertyDetails[0].usageCategoryMinor", null));
        }
      },
      dropDownData: [],
    },
    typeOfBuilding: {
      id: "typeOfBuilding",
      jsonPath: "Properties[0].propertyDetails[0].propertySubType",
      type: "singleValueList",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      floatingLabelText: "PT_COMMONS_PROPERTY_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      required: true,
      formName: "basicInformation",
      fullWidth: true,
      numcols: 6,
      labelsFromLocalisation:false,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        dispatch(prepareFormData(`Properties[0].propertyDetails[0].units`, []));
        dispatch(prepareFormData(`Properties[0].propertyDetails[0].landArea`, null));
        dispatch(prepareFormData(`Properties[0].propertyDetails[0].buildUpArea`, null));
        dispatch(removeForm("plotDetails"));
        removeFormKey(formKey, field, dispatch, state);
        let subTypeObject = get(state, `common.generalMDMSDataById.PropertySubType[${field.value}]`);
        if (!isEmpty(subTypeObject)) {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].propertyType", subTypeObject.propertyType));
        } else {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].propertyType", field.value));
          dispatch(prepareFormData("Properties[0].propertyDetails[0].propertySubType", null));
        }
      },
      dropDownData: [],
    },
    rainwaterHarvesting: {
      id: "rainwaterHarvesting",
      jsonPath: "Properties[0].additionalDetails.isRainwaterHarvesting",
      type: "radioButton",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      floatingLabelText: "PT_COMMONS_IS_RAINWATER_HARVESTING",
      hintText: "PT_COMMONS_IS_RAINWATER_HARVESTING",
      required: false,
      fullWidth: true,
      showFloatingLabelText:true,
      labelsFromLocalisation:false,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      dropDownData: [],
    },
    propertyEntryType: {
      id: "propertyEntryType",
      jsonPath: "Properties[0].creationReason",
      type: "radioButton",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      floatingLabelText: "PT_PROPERTY_ADDRESS_ENTRY_TYPE",
      hintText: "PT_PROPERTY_ADDRESS_ENTRY_TYPE",
      required: false,
      fullWidth: true,
      showFloatingLabelText:true,
      labelsFromLocalisation:false,
      gridDefination: {
        xs: 0,
        sm: 0
      },
      dropDownData: [],
    }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
  beforeInitForm: (action, store) => {
    try {
      let state = store.getState();
      // localStorageSet("previousFloorNo", -1);
      var masterOne = get(state, "common.generalMDMSDataById.UsageCategoryMajor");
      var masterTwo = get(state, "common.generalMDMSDataById.UsageCategoryMinor");
      const mergedMaster = mergeMaster(masterOne, masterTwo, "usageCategoryMajor");
      const typeOfUsageSorted = sortDropdown(mergedMaster, "label", true);
      set(action, "form.fields.typeOfUsage.dropDownData", typeOfUsageSorted);
      masterOne = Object.values(get(state, "common.generalMDMSDataById.PropertyType")).filter(item=> item.propertyType !== "BUILTUP");
      masterTwo = get(state, "common.generalMDMSDataById.PropertySubType");
      set(action, "form.fields.typeOfBuilding.dropDownData", mergeMaster(masterOne, masterTwo, "propertyType"));
      set(action, "form.fields.rainwaterHarvesting.options",options);
      set(action, "form.fields.rainwaterHarvesting.value", get(state.common.prepareFormData,'Properties[0].additionalDetails.isRainwaterHarvesting',false));
      set(action, "form.fields.propertyEntryType.options",propertyOptions);
      set(action, "form.fields.propertyEntryType.value", get(state.common.prepareFormData,'Properties[0].creationReason',"CREATE"));
      process.env.REACT_APP_NAME == "Citizen" ? set(action, "form.fields.propertyEntryType.visible", false) : set(action, "form.fields.propertyEntryType.visible", true)
      return action;
    } catch (e) {
    }
  },
};

export default formConfig;

const mergeMaster = (masterOne, masterTwo, parentName = "") => {
  let dropDownData = [];
  let parentList = [];
  for (var variable in masterTwo) {
    if (masterTwo.hasOwnProperty(variable)) {
      dropDownData.push({ label: masterTwo[variable].name, value: masterTwo[variable].code });
    }
  }
  let masterOneData = getAbsentMasterObj(prepareDropDownData(masterOne, true), prepareDropDownData(masterTwo, true), parentName);
  for (var i = 0; i < masterOneData.length; i++) {
    // masterOneData[i][parentName]=masterOneData[i].code;
    dropDownData.push({ label: masterOneData[i].name, value: masterOneData[i].code });
  }
  return dropDownData;
};

const getAbsentMasterObj = (master1Arr, master2Arr, propToCompare) => {
  const propArray = master2Arr.reduce((result, item) => {
    if (item[propToCompare] && result.indexOf(item[propToCompare]) === -1) {
      result.push(item[propToCompare]);
    }
    return result;
  }, []);
  return master1Arr.filter((item) => propArray.indexOf(item.code) === -1);
};
