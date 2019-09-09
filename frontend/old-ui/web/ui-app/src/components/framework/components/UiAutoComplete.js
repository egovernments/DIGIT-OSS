import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Api from '../../../api/api';
import jp from 'jsonpath';
import _ from 'lodash';
import { withRouter } from 'react-router';
let tracker = [];

let searchTextCom = '';
class UiAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  initData(props) {
    let { item, setDropDownData } = props;

    if (item.onLoad == false) {
      setDropDownData(item.jsonPath, []);
    } else {
      this.callAPI('', props);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    let { dropDownData, item } = this.props;
    if (
      this.props.location.pathname != nextProps.history.location.pathname ||
      dropDownData[item.jsonPath] === undefined ||
      item.url != nextProps.item.url
    ) {
      this.initData(nextProps);
      if (this.props.location.pathname != nextProps.history.location.pathname) {
        tracker = [];
      }
    }
  }

  getNameById = (id, jsonPath) => {
    let { dropDownData } = this.props;
    return dropDownData[jsonPath] &&
      _.filter(dropDownData[jsonPath], { key: id }).length > 0 &&
      _.filter(dropDownData[jsonPath], { key: id })[0].value
      ? _.filter(dropDownData[jsonPath], { key: id })[0].value
      : id;
  };

  componentDidMount() {
    this.initData(this.props);
  }

  networkCall = async (url, id, useTimestamp, isKeyValuePair, responseJsonPaths, resultsPerPage, offset, totalNumberOfResults, data) => {

    if(totalNumberOfResults > -1 && offset*resultsPerPage >= totalNumberOfResults){
      return data;    
    }

    const response = await Api.commonApiPost(url, id, {}, '', useTimestamp || false, resultsPerPage,'','',false,offset);
  
    if (response) {
      totalNumberOfResults = response.hasOwnProperty("page") && response.page.hasOwnProperty("totalResults") ? parseInt(response.page.totalResults) : 0;
      const queries = responseJsonPaths.split('|');
      const keys = jp.query(response, queries[1]);
      const values = jp.query(response, queries[2]);

      const others = [];
      if (queries.length > 3) {
        for (let i = 3; i < queries.length; i++) {
          others.push(jp.query(response, queries[i]) || undefined);
        }
      }

     const dropDownData = Object.keys(keys).reduce((dropDownData, index) => {
        const obj = {};
        obj['key'] = keys[index] && keys[index].toString();

        if (isKeyValuePair) {
          obj['value'] = keys[index] + '-' + values[index];
        } else {
          obj['value'] = values[index];
        }

        if (others && others.length > 0) {
          let otherItemDatas = [];

          for (let i = 0; i < others.length; i++) {
            otherItemDatas.push(others[i][index] || undefined);
          }

          obj['others'] = otherItemDatas;
        }

        dropDownData.push(obj);

        return dropDownData;
      }, []);
      
      data = data.concat(dropDownData);
     
   }

    return await this.networkCall(url, id, useTimestamp, isKeyValuePair, responseJsonPaths, resultsPerPage, offset+1, totalNumberOfResults, data)
   
  };

  callAPI = async (keyUpValue, props) => {
    let { item, setDropDownData, useTimestamp } = props;
    let dropDownData = [];

    if (
      item.type == 'autoCompelete' &&
      item.hasOwnProperty('url') &&
      item.url &&
      item.url.search('\\|') > -1 &&
      item.url.search('{') == -1 &&
      !_.some(tracker, { jsonPath: item.jsonPath })
    ) {
      tracker.push({ jsonPath: item.jsonPath });

      let splitArray = item.url.split('?');
      const url = splitArray[0];
      const responseJsonPaths = splitArray[1];

      let id = {};

      let queryStringObject = splitArray[1].split('|')[0].split('&');

      for (var i = 0; i < queryStringObject.length; i++) {
        if (keyUpValue) id[queryStringObject[i].split('=')[0]] = keyUpValue;
        else id[queryStringObject[i].split('=')[0]] = queryStringObject[i].split('=')[1];
      }

      const resultsPerPage = 500;
      const offset = 0;
      const isKeyValuePair = item.hasOwnProperty('isKeyValuePair') && item.isKeyValuePair ? true : false;
      dropDownData =  await this.networkCall(url, id, useTimestamp, item.isKeyValuePair, responseJsonPaths, resultsPerPage, offset,-1,dropDownData);
      dropDownData = dropDownData ? dropDownData : []; 
      setDropDownData(item.jsonPath, dropDownData);
   } else if (item.hasOwnProperty('defaultValue') && typeof item.defaultValue == 'object') {
      dropDownData = item.defaultValue;
      setDropDownData(item.jsonPath, dropDownData);
    }
    
  };

  renderAutoComplete = item => {
    let { dropDownData } = this.props;
    dropDownData = dropDownData.hasOwnProperty(item.jsonPath) ? dropDownData[item.jsonPath] : []
    dropDownData = dropDownData.filter((data) => data.key !== null);
    let { getNameById } = this;
    const dataSourceConfig = {
      text: 'value',
      value: 'key',
    };
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            <AutoComplete
              className="custom-form-control-for-textfield"
              id={item.jsonPath.split('.').join('-')}
              listStyle={{ maxHeight: 100, overflow: 'auto' }}
              filter={(searchText, key) => {
                return key
                  .toLowerCase()
                  .includes(
                    getNameById(this.props.getVal(item.jsonPath), item.jsonPath) &&
                      getNameById(this.props.getVal(item.jsonPath), item.jsonPath).toLowerCase()
                  );
              }}
              floatingLabelStyle={{ color: item.isDisabled ? '#A9A9A9' : '#696969', fontSize: '20px', whiteSpace: 'nowrap' }}
              inputStyle={{ color: '#5F5C57' }}
              floatingLabelFixed={true}
              style={{ display: item.hide ? 'none' : 'inline-block' }}
              errorStyle={{ float: 'left' }}
              dataSource={dropDownData}
              dataSourceConfig={dataSourceConfig}
              floatingLabelText={
                <span>
                  {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
                </span>
              }
              fullWidth={true}
              searchText={getNameById(this.props.getVal(item.jsonPath), item.jsonPath)}
              disabled={item.isDisabled}
              errorText={this.props.fieldErrors[item.jsonPath]}
              onKeyUp={e => {
                if (!e.target.value) {
                } else {
                  item.onLoad == false ? this.callAPI(e.target.value, this.props) : '';
                }
                this.props.handler(
                  { target: { value: e.target.value } },
                  item.jsonPath,
                  item.isRequired ? true : false,
                  '',
                  item.requiredErrMsg,
                  item.patternErrMsg
                );
              }}
              onNewRequest={(value, index) => {
                this.props.handler(
                  { target: { value: value.key } },
                  item.jsonPath,
                  item.isRequired ? true : false,
                  '',
                  item.requiredErrMsg,
                  item.patternErrMsg
                );

                if (this.props.autoComHandler && item.autoCompleteDependancy) {
                  this.props.autoComHandler(item.autoCompleteDependancy, item.jsonPath);
                }
              }}
            />
          </div>
        );
    }
  };

  render() {
    return <div>{this.renderAutoComplete(this.props.item)}</div>;
  }
}

const mapStateToProps = (state,props) => ({
  dropDownData: state.framework.dropDownData,
  form: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UiAutoComplete));
