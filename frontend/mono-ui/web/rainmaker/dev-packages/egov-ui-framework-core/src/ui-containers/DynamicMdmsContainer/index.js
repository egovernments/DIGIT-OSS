import React, { Component } from "react";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSelectField } from "../../ui-config/screens/specs/utils";
import RenderScreen from "egov-ui-framework/ui-molecules/RenderScreen";
import { getMdmsJson, getObjectKeys, getObjectValues, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
class DynamicMdmsContainer extends Component {
  state = {
    selectedValues : []
  }
  componentDidMount = () => {
    let { state, moduleName, rootBlockSub } = this.props;
    const isMdmsApiTrigger = get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.apiTriggered`);
    const isMdmsData = get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`);
    (!isMdmsData && !isMdmsApiTrigger) && this.triggerInitilaApi();
  }
  triggerInitilaApi = async () => {
    let { rootBlockSub, state, moduleName, masterName, type, dispatch, callBackEdit, isDependency, dropdownFields } = this.props;
    const isDependencyCheck = isDependency ? get( state.screenConfiguration.preparedFinalObject , isDependency, false ) : true;
    if(isDependencyCheck){
      let reqObj = {
        setPath : `DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`  , 
        setTransformPath : `DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}Transformed`, 
        dispatchPath : `DynamicMdms.${moduleName}.${rootBlockSub}`,
        moduleName,
        name : masterName,
        rootBlockSub,
        type
      }
      dispatch(prepareFinalObject( `DynamicMdms.apiTriggered`, true ));
      await getMdmsJson(state, dispatch, reqObj);
      this.triggerCallback(null, null, null);
      dropdownFields && dropdownFields.forEach((entry, i) => {
        if(entry.defaultValue){
          let componentJSONPath = `DynamicMdms.${moduleName}.${rootBlockSub}.${entry.key}`;
          this.onFieldChange('', componentJSONPath, '', entry.defaultValue);
        }
      });
      if(getQueryArg(window.location.href, "action") == "edit" || getQueryArg(window.location.href, "action") == "EDITRENEWAL") {
        callBackEdit(state, dispatch);
        let selectedValues = []
        dropdownFields.map((row) => {
          selectedValues.push(this.getValueByKey(`.${row.key}`));
        })
        this.setState({ selectedValues });
      } else {
        dropdownFields && dropdownFields.forEach((entry, i) => {
          if(entry.defaultValue){
            let componentJSONPath = `DynamicMdms.${moduleName}.${rootBlockSub}.${entry.key}`;
            this.onFieldChange('', componentJSONPath, '', entry.defaultValue);
          }
        });
      }
    }
  }
  componentWillUpdate () {
    let { state, moduleName, rootBlockSub } = this.props;
    const isMdmsApiTrigger = get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.apiTriggered`);
    const isMdmsData = get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.MdmsJson`);
    (!isMdmsData && !isMdmsApiTrigger) && this.triggerInitilaApi();
  }
  onFieldChange = ( screenKey, componentJsonpath, property, value ) => {
    let { dispatch, dropdownFields, moduleName, rootBlockSub } = this.props;
    let { selectedValues } = this.state;
    dispatch(prepareFinalObject( componentJsonpath , value ));
    let index = null;
    if(componentJsonpath){
      let last = componentJsonpath.substring(componentJsonpath.lastIndexOf(".") + 1, componentJsonpath.length);
      index = dropdownFields && dropdownFields.findIndex((row) => {
        return row.key == last;
      });
      selectedValues.length > 0 && selectedValues.splice( index + 1 , selectedValues.length); 
      selectedValues[index] = value;
      dropdownFields && dropdownFields.forEach((entry, i) => { 
        let { key } = entry;
        if(index < i){
          let removeValuePath = `DynamicMdms.${moduleName}.${rootBlockSub}.${key}`;
          dispatch(prepareFinalObject( removeValuePath , 'none' ));
        }
      });
      this.setState({ selectedValues });
      this.triggerCallback(componentJsonpath, value, index);
    }
  }
  getValueByKey = (key) => {
    let { state, rootBlockSub, moduleName } = this.props;
    if(key){
      return get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}${key}`);
    } else {
      return get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}Transformed`, []);
    }
   
  }
  setValueByKey = (key, dropdownData) => {
    let { rootBlockSub, moduleName, dispatch } = this.props;
    dispatch(prepareFinalObject( `DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed`, dropdownData ));
  }
  triggerValueByKey = (keyValue, index) => {
    let { dropdownFields } = this.props;
    let dropdownData = [];
    let transformedData = this.getValueByKey(keyValue);
    dropdownData = (dropdownFields.length - 1 ==  index ) ? getObjectValues(transformedData) : getObjectKeys(transformedData);
    this.setValueByKey(dropdownFields[index].key, dropdownData);
  }
  triggerCallback = (componentJsonpath, value, index) => {
    let { dropdownFields, rootBlockSub, moduleName, state, dispatch } = this.props;
    let keyValue = null;
    let { selectedValues } = this.state;
    let transformedValue = selectedValues.join('.')
    if(index == 0 || index) {
      keyValue = `Transformed.${transformedValue}`;
    } else{ 
      this.triggerValueByKey(null, 0);
    }
    if(componentJsonpath) {
      (dropdownFields.length > index + 1 ) && this.triggerValueByKey(keyValue, index + 1);
      let reqObj = {
        moduleName, rootBlockSub, keyValue, value, state, dispatch
      }
      typeof dropdownFields[index].callBack == "function" && dropdownFields[index].callBack(reqObj);
    }  
  }
  formDropDown = () => {
    let { dropdownFields, moduleName, masterName, rootBlockSub } = this.props;
    let allObj = {} ;
    let moduleNameCaps = moduleName.toUpperCase();
    let masterNameCaps = masterName.toUpperCase();
    let gridSm = ( 12 / dropdownFields.length ) <= 4 ? 4 : 6;
    dropdownFields && dropdownFields.forEach((entry, i) => {  
      let { key, fieldType, isDisabled, className } = entry;
      
      allObj[key] = (fieldType == "autosuggest") ? 
      {
          uiFramework: "custom-containers",
          componentPath: "AutosuggestContainer",
          jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}` ,
          componentJsonpath : `DynamicMdms.${moduleName}.${rootBlockSub}.${key}`,
          required: true,
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
            jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}`,
            sourceJsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed`,
            setDataInField: true,
            labelsFromLocalisation: true,
            localePrefix: {
              moduleName: moduleNameCaps,
              masterName: masterNameCaps
            },
            fullwidth: true,
            required: true,
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
          required: true,
          jsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}` ,
          componentJsonpath : `DynamicMdms.${moduleName}.${rootBlockSub}.${key}`,
          localePrefix: {
            moduleName: moduleNameCaps,
            masterName: masterNameCaps
          },
          moduleName : moduleNameCaps ,
          props: {
            setDataInField: true,
            className:"applicant-details-error",
            disabled: isDisabled ? isDisabled : false
          },
          sourceJsonPath: `DynamicMdms.${moduleName}.${rootBlockSub}.${key}Transformed`,
          gridDefination: {
            xs: 12,
            sm: gridSm
          }
        })
      };
    });
    return allObj; 
  }
  render() {
    return (
      <RenderScreen
        components={this.formDropDown()}
        onFieldChange = {this.onFieldChange}
      />
    );
  }
}


const mapStateToProps = (state, ownprops) => {
  
  return { state };
};

export default connect(
  mapStateToProps,
  null
)(DynamicMdmsContainer);
