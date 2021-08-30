import _ from 'lodash';
import { translate } from '../components/common/common';

const defaultState = {
  form: {},
  files: [],
  msg: '',
  toastMsg: '',
  dialogOpen: false,
  snackbarOpen: false,
  fieldErrors: {},
  requiredFields: [],
  isFormValid: true,
  showTable: false,
  buttonText: 'Search',
  editIndex: -1,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        form: action.data,
        isFormValid: checkIfHasAllReqFields(state.requiredFields, action.data),
      };

    case 'SET_REQUIRED_FIELDS':
      return {
        ...state,
        requiredFields: action.requiredFields,
        fieldErrors: {},
        isFormValid: action.requiredFields.length == 0 ? true : false,
      };

    case 'DEL_REQUIRED_FIELDS':
      var _rFields = [...state.requiredFields];
      var newRFields = [];
      _rFields.map(function(val, i) {
        if (action.requiredFields.indexOf(val) == -1) {
          newRFields.push(val);
        }
      });
      var _isFormValid = reValidate(state.form, state.fieldErrors, newRFields);
      return {
        ...state,
        requiredFields: newRFields,
        isFormValid: _isFormValid,
      };

    case 'ADD_REQUIRED_FIELDS':
      var _rFields = [...state.requiredFields];
      for (var i = 0; i < action.requiredFields.length; i++) {
        if (_rFields.indexOf(action.requiredFields[i]) == -1) {
          _rFields.push(action.requiredFields[i]);
        }
      }
      var _isFormValid = reValidate(state.form, state.fieldErrors, _rFields);
      return {
        ...state,
        requiredFields: _rFields,
        isFormValid: _isFormValid,
      };

    case 'REMOVE_FROM_FIELD_ERRORS':
      var _fieldErrors = { ...state.fieldErrors };
      delete _fieldErrors[action.key];
      var _isFormValid = reValidate(state.form, _fieldErrors, state.requiredFields);
      return {
        ...state,
        fieldErrors: _fieldErrors,
        isFormValid: _isFormValid,
      };
    case 'ADD_TO_FIELD_ERRORS':
      var _fieldErrors = { ...state.fieldErrors };
      _fieldErrors[action.key] = action.value;
      return {
        ...state,
        fieldErrors: _fieldErrors,
      };

    case 'DISPLAY_ERROR' :
     return {
      ...state,
      fieldErrors : {...state.fieldErrors, [action.property] :  action.errorMessage },
    };

    return;
    case 'HANDLE_CHANGE_FRAMEWORK':
      var currentState = { ...state };
      action.value = typeof action.value == 'undefined' || action.value == null ? '' : action.value;
      _.set(currentState.form, action.property, action.value);
      var validationDat = validate(
        currentState.fieldErrors,
        action.property,
        action.value,
        action.isRequired,
        currentState.form,
        currentState.requiredFields,
        action.pattern,
        action.patternErrMsg
      );
      //Set field errors
      currentState.fieldErrors = {
        ...state.fieldErrors,
        [action.property]: validationDat.errorText,
      };
      //Set form valid or not

      currentState.isFormValid = validationDat.isFormValid;
      return currentState;

    case 'CHANGE_FORM_STATUS':
      return {
        ...state,
        isFormValid: action.status,
      };

    case 'RESET_STATE':
      return {
        ...defaultState,
      };
    case 'FIELD_ERRORS':
      return {
        ...state,
        fieldErrors: action.errors,
      };

    case 'SHOW_TABLE':
      return {
        ...state,
        showTable: action.state,
      };
    case 'BUTTON_TEXT':
      return {
        ...state,
        buttonText: action.text,
      };
    case 'TOGGLE_DAILOG_AND_SET_TEXT':
      return {
        ...state,
        msg: action.msg,
        dialogOpen: action.dailogState,
      };
    case 'TOGGLE_SNACKBAR_AND_SET_TEXT':
      return {
        ...state,
        toastMsg: action.toastMsg,
        snackbarOpen: action.snackbarState,
      };
    case 'SET_LOADING_STATUS':
      return {
        ...state,
        loadingStatus: action.loadingStatus,
      };
    default:
      return state;
  }
};

function validate(fieldErrors, property, value, isRequired, form, requiredFields, pattern, patErrMsg) {
  let errorText = isRequired && (typeof value == 'undefined' || value === '') ? translate('ui.framework.required') : '';
  let isFormValid = true;
  // console.log(requiredFields);
  for (var i = 0; i < requiredFields.length; i++) {

    if (typeof _.get(form, requiredFields[i]) == 'undefined' || _.get(form, requiredFields[i]) === '' || _.get(form, requiredFields[i]) === 0 || _.get(form, requiredFields[i]) == null || (_.isArray(_.get(form, requiredFields[i])) && _.get(form, requiredFields[i]).length === 0)  ) {
      isFormValid = false;
      break;
    }
  }

  if (pattern && _.get(form, property) && !new RegExp(pattern).test(_.get(form, property))) {
    // console.log(property, _.get(form, property));
    errorText = patErrMsg ? translate(patErrMsg) : translate('ui.framework.patternMessage');
    isFormValid = false;
  }

  // console.log(fieldErrors);
  for (let key in fieldErrors) {
    if (fieldErrors[key] && key != property) {
      // console.log(key, property, fieldErrors, fieldErrors[key]);
      isFormValid = false;
      break;
    }
  }

  return {
    isFormValid,
    errorText,
  };
}

function checkIfHasAllReqFields(reqFields, form) {
  for (var i = 0; i < reqFields.length; i++) {
    if( typeof (_.get(form, reqFields[i]))=='boolean'){
       if(reqFields[i]==null||reqFields[i]==undefined){
        return false;
       }
    }else{
    if (!_.get(form, reqFields[i])) {
      return false;
    }
   }
  }

  return true;
}

function reValidate(form, fieldErrors, requiredFields) {
  for (var key in fieldErrors) {
    if (fieldErrors[key]) {
      // console.log(fieldErrors[key]);
      return false;
    }
  }

  for (var i = 0; i < requiredFields.length; i++) {
    if (typeof _.get(form, requiredFields[i]) == 'undefined' || _.get(form, requiredFields[i]) === '' || _.get(form, requiredFields[i]) === 0) {
      // console.log(requiredFields[i], _.get(form, requiredFields[i]));
      return false;
    }
  }

  return true;
}
