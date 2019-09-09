import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Api from '../../../api/api';
import jp from 'jsonpath';
import _ from 'lodash';

class UiSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownData: [],
    };
  }

  initData(props) {
    let { item, setDropDownData, useTimestamp } = props;
    let values = [];

    // console.log(this.props.item);
    if (item.hasOwnProperty('url') && item.url && item.url.search('\\|') > -1 && item.url.search('{') == -1) {
      let splitArray = item.url.split('?');
      let context = '';
      let id = {};

      // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
      for (var j = 0; j < splitArray[0].split('/').length; j++) {
        if (j == splitArray[0].split('/').length - 1) {
          context += splitArray[0].split('/')[j];
        } else {
          context += splitArray[0].split('/')[j] + '/';
        }
      }

      let queryStringObject = splitArray[1].split('|')[0].split('&');
      for (var i = 0; i < queryStringObject.length; i++) {
        if (i) {
          id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
        }
      }

      var response = Api.commonApiPost(context, id, {}, '', useTimestamp || false).then(
        function(response) {
          if (response) {
            let keys = jp.query(response, splitArray[1].split('|')[1]);
            let valueList = splitArray[1].split('|')[2].split(',');

            if (valueList.length > 1) {
              for (var l = 0; l < valueList.length; l++) values[l] = jp.query(response, splitArray[1].split('|')[2].split(',')[l]);
            } else {
              values[0] = jp.query(response, splitArray[1].split('|')[2].split(',')[0]);
            }

            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = item.convertToString ? keys[k].toString() : item.convertToNumber ? Number(keys[k]) : keys[k];
              for (var l = 0; l < values.length; l++) {
                if (l > 0) {
                  obj['value'] += '-';
                  obj['value'] += values[l][k];
                } else {
                  obj['value'] = values[l][k];
                }
              }
              //	console.log(obj["value"]);
              if (item.hasOwnProperty('isKeyValuePair') && item.isKeyValuePair) {
                obj['value'] = keys[k] + obj['value'];
              }
              dropDownData.push(obj);
            }

            /*	dropDownData.sort(function(s1, s2) {
						return (s1.value < s2.value) ? -1 : (s1.value > s2.value) ? 1 : 0;
					});
*/
            dropDownData.unshift({ key: null, value: '-- Please Select --' });
            setDropDownData(item.jsonPath, dropDownData);
          }
        },
        function(err) {
          console.log(err);
        }
      );
    } else if (item.hasOwnProperty('defaultValue') && typeof item.defaultValue == 'object') {
      setDropDownData(item.jsonPath, item.defaultValue);
    }
  }

  componentDidMount() {
    this.initData(this.props);
  }

  renderSelect = item => {
    let { dropDownData } = this.props;
    switch (this.props.ui) {
      case 'google':
        return (
          <SelectField
            className="custom-form-control-for-select"
            floatingLabelStyle={{
              color: item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            }}
            labelStyle={{ color: '#5F5C57' }}
            floatingLabelFixed={true}
            dropDownMenuProps={{
              targetOrigin: { horizontal: 'left', vertical: 'bottom' },
            }}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            floatingLabelText={
              <span>
                {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
              </span>
            }
            value={this.props.getVal(item.jsonPath)}
            onChange={(event, key, value) => {
              this.props.handler(
                { target: { value: value } },
                item.jsonPath,
                item.isRequired ? true : false,
                '',
                item.requiredErrMsg,
                item.patternErrMsg
              );
            }}
            disabled={item.isDisabled}
            errorText={this.props.fieldErrors[item.jsonPath]}
            maxHeight={200}
          >
            {dropDownData.hasOwnProperty(item.jsonPath) &&
              dropDownData[item.jsonPath].map((dd, index) => <MenuItem value={dd.key} key={index} primaryText={dd.value} />)}
          </SelectField>
        );
    }
  };

  render() {
    return <div>{this.renderSelect(this.props.item)}</div>;
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
export default connect(mapStateToProps, mapDispatchToProps)(UiSelectField);

// <div style={{"display": "flex", "flexDirection": "column-reverse"}}>
//</div>
