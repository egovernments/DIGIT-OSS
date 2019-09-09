import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Api from '../../../api/api';
import jp from 'jsonpath';
import _ from 'lodash';

class UiMultiSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownData: [],
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!_.isEqual(nextProps, this.props)) {
      this.initDat(nextProps);
    }
  }

  initDat(props) {
    let { item, setDropDownData, useTimestamp } = props;
    if (item.hasOwnProperty('url') && item.url.search('\\|') > -1) {
      let splitArray = item.url.split('?');
      let context = '';
      let id = {};
      for (var j = 0; j < splitArray[0].split('/').length; j++) {
        context += splitArray[0].split('/')[j] + '/';
      }

      let queryStringObject = splitArray[1].split('|')[0].split('&');
      for (var i = 0; i < queryStringObject.length; i++) {
        if (i) {
          id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
        }
      }

      Api.commonApiPost(context, id, {}, '', useTimestamp || false, false, '', '', item.isStateLevel).then(
        function(response) {
          if (response) {
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let values = jp.query(response, splitArray[1].split('|')[2]);
            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = item.convertToString ? keys[k].toString() : item.convertToNumber ? Number(keys[k]) : keys[k];
              obj['value'] = values[k];
              dropDownData.push(obj);
            }

            dropDownData.sort(function(s1, s2) {
              return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
            });
            // dropDownData.unshift({ key: null, value: '-- Please Select --' });
            setDropDownData(item.jsonPath, dropDownData);
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }
  }

  componentDidMount() {
    this.initDat(this.props);
  }

  renderMultiSelect = item => {
    let { dropDownData } = this.props;
    switch (this.props.ui) {
      case 'google':
        return (
          <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <SelectField
              className="custom-form-control-for-select"
              id={item.jsonPath.split('.').join('-')}
              floatingLabelStyle={{
                color: item.isDisabled ? '#A9A9A9' : '#696969',
                fontSize: '20px',
              }}
              inputStyle={{ color: '#5F5C57' }}
              floatingLabelFixed={true}
              dropDownMenuProps={{
                targetOrigin: { horizontal: 'left', vertical: 'bottom' },
              }}
              style={{ display: item.hide ? 'none' : 'block' }}
              errorStyle={{ float: 'left' }}
              fullWidth={true}
              hintText="Please Select"
              multiple={true}
              floatingLabelText={
                <span>
                  {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
                </span>
              }
              value={this.props.getVal(item.jsonPath)}
              disabled={item.isDisabled}
              onChange={(ev, key, val) => {
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
              errorText={this.props.fieldErrors[item.jsonPath]}
              maxHeight={200}
            >
              {dropDownData.hasOwnProperty(item.jsonPath) &&
                dropDownData[item.jsonPath].map((dd, index) => (
                  <MenuItem
                    value={dd.key}
                    key={index}
                    primaryText={dd.value}
                    checked={this.props.getVal(item.jsonPath) && this.props.getVal(item.jsonPath).indexOf(dd.key) > -1}
                  />
                ))}
            </SelectField>
          </div>
        );
    }
  };

  render() {
    return <div>{this.renderMultiSelect(this.props.item)}</div>;
  }
}

const mapStateToProps = state => ({
  dropDownData: state.framework.dropDownData,
  formData: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiMultiSelectField);
