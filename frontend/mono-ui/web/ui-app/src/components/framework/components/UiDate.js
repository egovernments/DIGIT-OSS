import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class UiNumberField extends Component {
  constructor(props) {
    super(props);
  }
  // .getFullYear()+"-"+(new Date(this.props.getVal(item.jsonPath)).getMonth())>9?(new Date(this.props.getVal(item.jsonPath)).getMonth()):"0"+(new Date(this.props.getVal(item.jsonPath)).getMonth())+"-"+(new Date(this.props.getVal(item.jsonPath)).getDate()>9)?(new Date(this.props.getVal(item.jsonPath)).getDate()):("0"+new Date(this.props.getVal(item.jsonPath)).getDate())
  renderNumberBox = item => {
    let y, m, d, date;
    if (this.props.getVal(item.jsonPath)) {
      y = new Date(this.props.getVal(item.jsonPath)).getFullYear();
      m =
        new Date(this.props.getVal(item.jsonPath)).getMonth() < 10
          ? '0' + new Date(this.props.getVal(item.jsonPath)).getMonth()
          : new Date(this.props.getVal(item.jsonPath)).getMonth();
      d =
        new Date(this.props.getVal(item.jsonPath)).getDate() < 10
          ? '0' + new Date(this.props.getVal(item.jsonPath)).getDate()
          : new Date(this.props.getVal(item.jsonPath)).getDate();
      // date=y+"-"+("0"+(m-1).toString())+"-"+d;
      date = y + '-' + (parseInt(m) + 1 > 10 ? parseInt(m) + 1 : '0' + (parseInt(m) + 1)) + '-' + d;
    }
    switch (this.props.ui) {
      case 'google':
        return (
          <TextField
            id={item.jsonPath.split('.').join('-')}
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{
              color: item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
            }}
            inputStyle={{ color: '#5F5C57' }}
            floatingLabelFixed={true}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            type="date"
            floatingLabelText={
              <span>
                {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
              </span>
            }
            floatingLabelFixed={true}
            value={date}
            disabled={item.isDisabled}
            errorText={this.props.fieldErrors[item.jsonPath]}
            onChange={e => {
              if (new Date(e.target.value.split('-')[0]) > 1903) {
                this.props.handler(
                  {
                    target: {
                      value: new Date(e.target.value.split('-')[0], e.target.value.split('-')[1] - 1, e.target.value.split('-')[2]).getTime(),
                    },
                  },
                  item.jsonPath,
                  item.isRequired ? true : false,
                  item.pattern,
                  item.requiredErrMsg,
                  item.patternErrMsg
                );
              }
            }}
          />
        );
    }
  };

  render() {
    return <div>{this.renderNumberBox(this.props.item)}</div>;
  }
}
