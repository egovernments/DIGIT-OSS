import RenderScreen from "egov-ui-framework/ui-molecules/RenderScreen";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getMdmsJson, getObjectKeys, getObjectValues, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { getSelectField } from "../../ui-config/screens/specs/utils";
import { getLocale, getLocalization} from "egov-ui-kit/utils/localStorageUtils";

class DynamicMdmsContainer extends Component {
  componentDidMount = () => {
    let { state, moduleName, rootBlockSub } = this.props;
    const isMdmsApiTrigger = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.apiTriggered`);
    const isMdmsData = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`);
    (!isMdmsData && !isMdmsApiTrigger) && this.triggerInitilaApi();
  }
  triggerInitilaApi = async () => {
    let { rootBlockSub, state, moduleName, masterName, filter, dispatch, callBackEdit, isDependency, dropdownFields, index = 0 } = this.props;
    const isDependencyCheck = isDependency ? get(state.screenConfiguration.preparedFinalObject, isDependency, false) : true;
    if (isDependencyCheck) {
      let reqObj = {
        setPath: `DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`,
        setTransformPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}Transformed`,
        dispatchPath: `DynamicMdms.${moduleName}.${rootBlockSub}`,
        moduleName,
        name: masterName,
        rootBlockSub,
        filter
      }
      dispatch(prepareFinalObject(`DynamicMdms.apiTriggered`, true));
      await getMdmsJson(state, dispatch, reqObj);
      this.triggerCallback(null, null, null);
      if (getQueryArg(window.location.href, "action") == "edit" || getQueryArg(window.location.href, "action") == "EDITRENEWAL" || getQueryArg(window.location.href, "applicationNumber") != null || get(state, `screenConfiguration.preparedFinalObject.DYNAMIC_MDMS_Trigger`,false)) {
        callBackEdit(state, dispatch);
      } else {
        dropdownFields && dropdownFields.forEach((entry, i) => {
          if (entry.defaultValue) {
            let componentJSONPath = `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${entry.key}`;
            this.onFieldChange('', componentJSONPath, '', entry.defaultValue);
          }
        });
      }
    }
  }
  componentWillUpdate() {
    let { state, moduleName, rootBlockSub } = this.props;
    const isMdmsApiTrigger = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.apiTriggered`);
    const isMdmsData = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`);
    (!isMdmsData && !isMdmsApiTrigger) && this.triggerInitilaApi();
  }
  onFieldChange = (screenKey, componentJsonpath, property, value) => {
    let { dispatch, dropdownFields, moduleName, rootBlockSub, index = 0 } = this.props;
    value = value === null ? "none" : value;
    dispatch(prepareFinalObject(componentJsonpath, value));
    let isIndex = null;
    if (componentJsonpath) {
      let last = componentJsonpath.substring(componentJsonpath.lastIndexOf(".") + 1, componentJsonpath.length);
      isIndex = dropdownFields && dropdownFields.findIndex((row) => {
        return row.key == last;
      });
      dropdownFields && dropdownFields.forEach((entry, i) => {
        let { key } = entry;
        if (isIndex < i) {
          let removeValuePath = `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`;
          dispatch(prepareFinalObject(removeValuePath, 'none'));
        }
      });
      this.triggerCallback(componentJsonpath, value, isIndex);
    }
  }
  getLocalTextFromCode = (localCode) => {
    return JSON.parse(getLocalization(`localization_${getLocale()}`)).find(
      item => item.code === localCode
    );
  } 
  getValueByKey = (key) => {
    let { state, rootBlockSub, moduleName } = this.props;
    if (key) {
      return get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}${key}`);
    } else {
      return get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}Transformed`, []);
    }

  }
  setValueByKey = (key, dropdownData) => {
    let { rootBlockSub, moduleName, dispatch, index = 0 } = this.props;
    dispatch(prepareFinalObject(`DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed.allDropdown[${index}]`, dropdownData));
  }
  triggerValueByKey = (keyValue, index) => {
    let { dropdownFields } = this.props;
    let dropdownData = [];
    let transformedData = this.getValueByKey(keyValue);
    if (keyValue && keyValue.match(/\./g).length == index - 1) {
      transformedData = undefined;
    }
    dropdownData = (dropdownFields.length - 1 == index) ? getObjectValues(transformedData) : getObjectKeys(transformedData);
    if (transformedData == undefined) {
      for (let j = index; j < dropdownFields.length; j++) {
        this.setValueByKey(dropdownFields[j].key, transformedData);
      }
    } else {
      this.setValueByKey(dropdownFields[index].key, dropdownData);
    }

  }
  getSelectedPathValues = () => {
    let { dropdownFields, rootBlockSub, moduleName, state, dispatch, index = 0 } = this.props;
    let allValues = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}]`);
    let pathValues = [];
    allValues && dropdownFields && dropdownFields.forEach((entry, i) => {
      allValues[entry.key] && allValues[entry.key] != 'none' && pathValues.push(allValues[entry.key]);
    });
    return pathValues.join(".");
  }
  triggerCallback = (componentJsonpath, value, isIndex) => {
    let { dropdownFields, rootBlockSub, moduleName, state, dispatch, index = 0 } = this.props;
    let keyValue = null;
    let transformedValue = this.getSelectedPathValues();
    if (isIndex == 0 || isIndex) {
      keyValue = `Transformed.${transformedValue}`;
    } else {
      this.triggerValueByKey(null, 0);
    }
    if (componentJsonpath) {
      (dropdownFields.length > isIndex + 1) && this.triggerValueByKey(keyValue, isIndex + 1);
      let reqObj = {
        moduleName, rootBlockSub, keyValue, value, state, dispatch, index
      }
      typeof dropdownFields[isIndex].callBack == "function" && dropdownFields[isIndex].callBack(reqObj);
    }
  }
  checkValueExists = (path) => {
    let { state } = this.props;
    let isValid = get(state, `screenConfiguration.preparedFinalObject.${path}`, '');
    if (isValid == '' || isValid == 'none') {
      return true;
    }
    return false;
  }
  formDropDown = () => {
    let { dropdownFields, moduleName, masterName, rootBlockSub, index = 0, state } = this.props;
    let allObj = {};
    let moduleNameCaps = moduleName.toUpperCase();
    let masterNameCaps = masterName.toUpperCase();
    let gridSm = (12 / dropdownFields.length) <= 4 ? 4 : 6;
    dropdownFields && dropdownFields.forEach((entry, i) => {
      let { key, fieldType, isDisabled, className, isRequired = false, requiredValue = false } = entry;
      isRequired = isRequired ? this.checkValueExists(`DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`) : false;
      requiredValue = requiredValue == false ? isRequired : requiredValue;
      let helperMsg ="Required";
      if(getLocale()=="hi_IN"){
        helperMsg="आवश्यक प्रविष्टि";
      }
        
    
      allObj[key] = (fieldType == "autosuggest") ?
        {
          uiFramework: "custom-containers",
          componentPath: "AutosuggestContainer",
          jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`,
          componentJsonpath: `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`,
          required: isRequired,
          helperText: isRequired ? helperMsg : '',
          gridDefination: {
            xs: 12,
            sm: gridSm
          },
          props: {
            style: {
              width: "100%",
              cursor: "pointer"
            },
            className: className,
            label: {
              labelKey: moduleNameCaps + '_' + key.toUpperCase() + '_LABEL'
            },

            placeholder: {
              labelKey: moduleNameCaps + '_' + key.toUpperCase() + "_PLACEHOLDER"
            },
            jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`,
            sourceJsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed.allDropdown[${index}]`,
            setDataInField: true,
            labelsFromLocalisation: true,
            localePrefix: {
              moduleName: moduleNameCaps,
              masterName: masterNameCaps
            },
            fullwidth: true,
            isClearable: true,
            required: isRequired,
            required: requiredValue,
            disabled: isDisabled ? isDisabled : false,
            helperText: isRequired ? helperMsg : '',
            inputLabelProps: {
              shrink: true
            }
          }
        } :
        {
          ...getSelectField({
            label: {
              labelKey: moduleNameCaps + '_' + key.toUpperCase() + '_LABEL'
            },
            placeholder: {
              labelKey: moduleNameCaps + '_' + key.toUpperCase() + "_PLACEHOLDER"
            },
            required: requiredValue,
            jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`,
            componentJsonpath: `DynamicMdms.${moduleName}.${rootBlockSub}.selectedValues[${index}].${key}`,
            localePrefix: {
              moduleName: moduleNameCaps,
              masterName: masterNameCaps
            },
            moduleName: moduleNameCaps,
            props: {
              setDataInField: true,
              className: "applicant-details-error",
              disabled: isDisabled ? isDisabled : false
            },
            sourceJsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed.allDropdown[${index}]`,
            gridDefination: {
              xs: 12,
              sm: gridSm
            }
          })
        };
      //Populate first drop down data if not available 
      if (i == 0) {
        let isCheckData = get(state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed.allDropdown[${index}]`);
        !isCheckData && this.triggerValueByKey(null, 0);
      }
    });
    return allObj;
  }
  render() {
    return (
      <RenderScreen
        components={this.formDropDown()}
        onFieldChange={this.onFieldChange}
      />
    );
  }
}


const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { DynamicMdms ={}} = preparedFinalObject;

  let { dropdownFields, moduleName,  rootBlockSub, index = 0 } = ownprops;
  const newFields=dropdownFields && dropdownFields.map((entry, i) => {
    let { key } = entry;
   const moduleName1 = DynamicMdms[moduleName]||{};
   const rootBlockSub1 = moduleName1[rootBlockSub]||{};
   const key1 = rootBlockSub1[`${key}Transformed`]||{};

   const allDropdown1 = key1['allDropdown']||[];
   return {moduleName1,rootBlockSub1,key1,allDropdown1}
 })
  return { state, DynamicMdms ,newFields};
};

export default connect(
  mapStateToProps,
  null
)(DynamicMdmsContainer);
