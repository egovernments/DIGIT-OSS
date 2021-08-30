import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class UiTextSearch extends Component {
  constructor(props) {
    super(props);
  }

  renderTextSearch = item => {
    switch (this.props.ui) {
      case 'google':
        return (
          <div style={{ position: 'relative', display: 'inline' }}>
            <TextField
              className="custom-form-control-for-textfield"
              id={item.jsonPath.split('.').join('-')}
              floatingLabelStyle={{
                color: item.isDisabled ? '#A9A9A9' : '#696969',
                fontSize: '20px',
              }}
              inputStyle={{ color: '#5F5C57' }}
              floatingLabelFixed={true}
              onBlur={ev => this.props.autoComHandler(item.autoCompleteDependancy, item.jsonPath)}
              style={{ display: item.hide ? 'none' : 'inline-block' }}
              errorStyle={{ float: 'left' }}
              fullWidth={true}
              maxLength={item.maxLength || ''}
              floatingLabelText={
                <span>
                  {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
                </span>
              }
              value={this.props.getVal(item.jsonPath)}
              disabled={item.isDisabled}
              errorText={this.props.fieldErrors[item.jsonPath]}
              onChange={e => {
                if (e.target.value) {
                  e.target.value = e.target.value.replace(/^\s*/, '');
                  if (e.target.value[e.target.value.length - 1] == ' ' && e.target.value[e.target.value.length - 2] == ' ') return;
                }
                this.props.handler(
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
            <span
              className="glyphicon glyphicon-search"
              style={{
                position: 'absolute',
                right: '10px',
                display: item.display ? 'none' : '',
              }}
              onClick={() => this.props.autoComHandler(item.autoCompleteDependancy, item.jsonPath)}
            />
          </div>
        );
    }
  };

  render() {
    return <div>{this.renderTextSearch(this.props.item)}</div>;
  }
}
