import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { translate } from '../../common/common';

export default class UiAadharCard extends Component {
  constructor(props) {
    super(props);
  }

  renderRadioButtons = item => {
    return item.values.map((v, i) => {
      return <RadioButton disabled={item.isDisabled} value={v.value} label={translate(v.label)} />;
    });
  };

  renderRadioButtonGroup = item => {
    //console.log(item.name + "-" + );
    var styleObj = item.styleObj || {};
    switch (this.props.ui) {
      case 'google':
        return (
          <div style={{ display: item.hide ? 'none' : 'inline-block' }}>
            <label style={{ fontSize: '13px' }}>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
            </label>
            <RadioButtonGroup
              id={item.jsonPath.split('.').join('-')}
              name="shipSpeed"
              valueSelected={this.props.getVal(item.jsonPath)}
              defaultSelected={item.defaultSelected}
              onChange={(e, val) => {
                this.props.handler(
                  { target: { value: val } },
                  item.jsonPath,
                  item.isRequired ? true : false,
                  '',
                  item.requiredErrMsg,
                  item.patternErrMsg,
                  item.expression,
                  item.expressionMsg
                );
              }}
              style={styleObj}
            >
              {this.renderRadioButtons(item)}
            </RadioButtonGroup>
          </div>
        );
    }
  };

  render() {
    return <div>{this.renderRadioButtonGroup(this.props.item)}</div>;
  }
}
