import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class UiNumberField extends Component {
  constructor(props) {
    super(props);
  }

  renderNumberBox = item => {
    switch (this.props.ui) {
      case 'google':
        let top = item.checkCustom ? '0px' : '38px';
        let fitws = item.checkCustom ? 'initial' : 'nowrap';
        let labelProperty = !item.isHideLabel && {
          floatingLabelFixed: true,
          floatingLabelStyle: { color: item.isDisabled ? '#A9A9A9' : '#696969', top: top, fontSize: '20px', whiteSpace: fitws },
          floatingLabelText: (
            <span>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
            </span>
          ),
        };

        return (
          <TextField
            id={item.jsonPath.split('.').join('-')}
            className="custom-form-control-for-textfield"
            inputStyle={{ color: '#5F5C57' }}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            type="number"
            value={this.props.getVal(item.jsonPath)}
            disabled={item.isDisabled}
            errorText={this.props.fieldErrors[item.jsonPath]}
            {...labelProperty}
            onChange={e => {
              if (e.target.value && !/^\d.*$/.test(e.target.value)) return;
              let val = e.target.value;
              if (val && item.isNumber) {
                val = Number(val);
              }
              this.props.handler(
                { target: { value: val } },
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
  };

  render() {
    return this.renderNumberBox(this.props.item);
  }
}
