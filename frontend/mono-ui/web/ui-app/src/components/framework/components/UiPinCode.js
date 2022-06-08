import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class UiPinCode extends Component {
  constructor(props) {
    super(props);
  }

  renderPinCode = item => {
    switch (this.props.ui) {
      case 'google':
        return (
          <TextField
            id={item.jsonPath.split('.').join('-')}
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{
              color: item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            }}
            inputStyle={{ color: '#5F5C57' }}
            floatingLabelFixed={true}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            maxLength="6"
            type="text"
            floatingLabelText={
              <span>
                {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
              </span>
            }
            value={this.props.getVal(item.jsonPath)}
            disabled={item.isDisabled}
            errorText={this.props.fieldErrors[item.jsonPath]}
            onChange={e => {
              if (e.target.value && !/^\d*$/g.test(e.target.value)) return;
              this.props.handler(e, item.jsonPath, item.isRequired ? true : false, '^\\d{6}$', item.requiredErrMsg, item.patternErrMsg);
            }}
          />
        );
    }
  };

  render() {
    return this.renderPinCode(this.props.item);
  }
}
