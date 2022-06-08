import React from 'react';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';

const styles = {
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: orange500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
};

const UiTextField = props => {
  const renderTextBox = () => {
    const item = props.item;
    var disabledValue = false;
    if (item.isDisablePath && typeof props.getVal(item.isDisablePath) == 'boolean') {
      disabledValue = !props.getVal(item.isDisablePath);
    } else {
      disabledValue = item.isDisabled;
    }
    switch (props.ui) {
      case 'google':
        if (item.hasOwnProperty('isLabel') && !item.isLabel) {
          return (
            <TextField
              className="custom-form-control-for-textfield"
              id={item.jsonPath.split('.').join('-')}
              inputStyle={{
                color: '#5F5C57',
                textAlign: item.hasOwnProperty('textAlign') ? item.textAlign : 'left',
              }}
              style={{ display: item.hide ? 'none' : 'inline-block' }}
              errorStyle={{ float: 'left' }}
              fullWidth={false}
              maxLength={item.maxLength || ''}
              value={props.getVal(item.jsonPath) ? props.getVal(item.jsonPath) : item.defaultValue}
              disabled={disabledValue}
              errorText={props.fieldErrors[item.jsonPath]}
              onChange={e => {
                if (e.target.value) {
                  e.target.value = e.target.value.replace(/^\s*/, '');
                  if (e.target.value[e.target.value.length - 1] == ' ' && e.target.value[e.target.value.length - 2] == ' ') return;
                }
                props.handler(e, item.jsonPath, item.isRequired ? true : false, item.pattern, item.requiredErrMsg, item.patternErrMsg);
              }}
            />
          );
        } else {
          let labelProperty = !item.isHideLabel && {
            floatingLabelFixed: true,
            floatingLabelStyle: {
              color: item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            },
            floatingLabelText: (
              <span>
                {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
              </span>
            ),
          };

          return (
            <TextField
              className="custom-form-control-for-textfield"
              id={item.jsonPath.split('.').join('-')}
              inputStyle={{
                color: '#5F5C57',
                textAlign: item.hasOwnProperty('textAlign') ? item.textAlign : 'left',
              }}
              maxLength={item.maxLength || ''}
              style={{ display: item.hide ? 'none' : 'inline-block' }}
              errorStyle={{ float: 'left' }}
              fullWidth={true}
              value={props.getVal(item.jsonPath) ? props.getVal(item.jsonPath) : (item.defaultValue ? item.defaultValue : '')}
              // value={props.getVal(item.jsonPath)}
              disabled={disabledValue}
              errorText={props.fieldErrors[item.jsonPath]}
              {...labelProperty}
              onChange={e => {
                if (e.target.value) {
                  e.target.value = e.target.value.replace(/^\s*/, '');
                  if (e.target.value[e.target.value.length - 1] == ' ' && e.target.value[e.target.value.length - 2] == ' ') return;
                }
                props.handler(
                  e,
                  item.jsonPath,
                  item.isRequired ? true : false,
                  item.pattern,
                  item.requiredErrMsg,
                  item.patternErrMsg,
                  item.expression,
                  item.expressionMsg
                );
              }}
            />
          );
        }
    }
  };

  return renderTextBox();
};

export default UiTextField;
