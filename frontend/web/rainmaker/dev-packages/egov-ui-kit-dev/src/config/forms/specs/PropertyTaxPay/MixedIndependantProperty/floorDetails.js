import { sortDropdown } from "egov-ui-kit/utils/PTCommon";
import { setDependentFields } from "../utils/enableDependentFields";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import {
  subUsageType,
  occupancy,
  builtArea,
  beforeInitForm,
  mergeMaster,
  prepareDropDownData,
  getPresentMasterObj,
  getAbsentMasterObj,
  floorName,
  annualRent,
  innerDimensions,
  constructionType,
  roomArea,
  balconyArea,
  garageArea,
  bathroomArea,
  innnerDimentionUtilFucntion
} from "../utils/reusableFields";
import filter from "lodash/filter";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

const formConfig = {
  name: "floorDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMinor",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      type: "singleValueList",
      floatingLabelText: "PT_FORM2_USAGE_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      required: true,
      numcols: 4,
      dropDownData: [],
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        let minorObject={};
        if(window.location.href.includes('dataentry') && field.value !="RESIDENTIAL" || !window.location.href.includes('dataentry')){
         minorObject = get(state, `common.generalMDMSDataById.UsageCategoryMinor[${field.value}]`);
       }
       let propertyType = state.common.prepareFormData.Properties[0].propertyDetails[0].propertyType
       if( propertyType == "BUILTUP.SHAREDPROPERTY"){
          if(field.value === "RESIDENTIAL"){
            setDependentFields(["innerDimensions"],dispatch, formKey, false)
          }else  if(field.value === "NONRESIDENTIAL"){
          dispatch(setFieldProperty(formKey, "innerDimensions", "value", "false"));
          setDependentFields(["innerDimensions"],dispatch, formKey, true)
          setDependentFields(["builtArea"],dispatch,formKey,false)
          setDependentFields(["roomArea"],dispatch,formKey,true)
          setDependentFields(["garageArea"],dispatch,formKey,true)
          setDependentFields(["bathroomArea"],dispatch,formKey,true)
          setDependentFields(["balconyArea"],dispatch,formKey,true)
          }
        }
        if(propertyType == "BUILTUP.INDEPENDENTPROPERTY")
        {
          if(field.value === "RESIDENTIAL"){
            setDependentFields(["innerDimensions"],dispatch, formKey, false)
          }else  if(field.value === "NONRESIDENTIAL"){
          dispatch(setFieldProperty(formKey, "innerDimensions", "value", "false"));
          setDependentFields(["innerDimensions"],dispatch, formKey, true)
          setDependentFields(["builtArea"],dispatch,formKey,false)
          setDependentFields(["roomArea"],dispatch,formKey,true)
          setDependentFields(["garageArea"],dispatch,formKey,true)
          setDependentFields(["bathroomArea"],dispatch,formKey,true)
          setDependentFields(["balconyArea"],dispatch,formKey,true)
          }

        }
        if (!isEmpty(minorObject)) {
          dispatch(prepareFormData(`${field.jsonPath.split("usageCategoryMinor")[0]}usageCategoryMajor`, minorObject.usageCategoryMajor));
          var filteredSubUsageMinor = filter(
            prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategoryMinor"), true),
            (subUsageMinor) => {
              return subUsageMinor.usageCategoryMajor === field.value;
            }
          );
          if (filteredSubUsageMinor.length > 0) {
            var filteredUsageCategoryDetails = getPresentMasterObj(
              prepareDropDownData(get(state, "common.generalMDMSDataById.UsageCategoryDetail"), true),
              filteredSubUsageMinor,
              "usageCategoryMinor"
            );
            if(field.value === "NONRESIDENTIAL")
                {
                  setDependentFields(["subUsageType"], dispatch, formKey, false);
                }
            else 
                {
                  setDependentFields(["subUsageType"], dispatch, formKey, true);
                }
               const mergedMaster = mergeMaster(filteredSubUsageMinor, filteredUsageCategoryDetails, "usageCategoryMinor");
               const subUsageData = sortDropdown(mergedMaster, "label", true);
               setDependentFields(["subUsageType"], dispatch, formKey, subUsageData, "dropDownData");
          }
        } else {
          setDependentFields(["subUsageType"], dispatch, formKey, true);
          dispatch(prepareFormData(`${field.jsonPath.split("usageCategoryMinor")[0]}usageCategoryMajor`, field.value));
          dispatch(prepareFormData(`${field.jsonPath.split("usageCategoryMinor")[0]}usageCategoryMinor`, null));
        }
      },
    },
    ...subUsageType,
    ...occupancy,
    ...constructionType,
    ...innerDimensions,
    ...builtArea,
    ...roomArea,
    ...balconyArea,
    ...garageArea,
    ...bathroomArea,
    ...floorName,
    ...annualRent
  },
  isFormValid: false,
  ...beforeInitForm,
};

export default formConfig;
