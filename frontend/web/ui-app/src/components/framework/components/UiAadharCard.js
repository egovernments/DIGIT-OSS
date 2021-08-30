import React from 'react';
import TextField from 'material-ui/TextField';

const UiAadharCard = props => {
  const renderAadharCard = (props) => {
 
    switch (props.ui) {
      case 'google':
        return (
          <TextField
            id={props.item.jsonPath.split('.').join('-')}
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{
              color: props.item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            }}
            inputStyle={{ color: '#5F5C57' }}
            floatingLabelFixed={true}
            style={{ display: props.item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            maxLength="12"
            type="text"
            floatingLabelText={
              <span>
                {props.item.label} <span style={{ color: '#FF0000' }}>{props.item.isRequired ? ' *' : ''}</span>
              </span>
            }
            value={props.getVal(props.item.jsonPath)}
            disabled={props.item.isDisabled}
            errorText={props.fieldErrors[props.item.jsonPath]}
            onChange={e => {
              if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
              props.handler(e, props.item.jsonPath, props.item.isRequired ? true : false, '^\\d{12}$', props.item.requiredErrMsg, props.item.patternErrMsg);
            }}
          />
        );
    }
  };

  return renderAadharCard(props);
};

export default UiAadharCard;
