import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Api from '../../../api/api';
import jp from 'jsonpath';
import _ from 'lodash';
import { withRouter } from 'react-router';

let tracker = [];
//let currentUrl = '';

class UiSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: true,
      getDisplayValue: '',
    };
    
  }

  componentWillMount() {
    // add event listener for clicks
    document.addEventListener('click', this.handleClick, false);
  }

  initData(props) {
    let currentURL = window.location.hash.split("#")[1];
    if(this.props.location.pathname != currentURL){
      tracker = [];
    }
    let { item, setDropDownData, setDropDownOriginalData, useTimestamp, dropDownOringalData } = props;
    const currentUrl = window.location.hash.split('#')[1];  

    if(props.location.pathname != currentUrl)   {
      tracker = [];
    } 
    if (
      item.hasOwnProperty('url') &&
      item.url &&
      item.url.search('\\|') > -1 &&
      item.url.search('{') == -1 && (this.props.location.pathname === currentURL) && 
      !_.some(tracker, { jsonPath: item.jsonPath })
    ) {
      tracker.push({ jsonPath: item.jsonPath });
      let splitArray = item.url.split('?');
      let context = '';
      let id = {};

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

      var response = Api.commonApiPost(context, id, {}, '', useTimestamp || false, false, '', '', item.isStateLevel).then(
        function(response) {
          if (response) {
            let queries = splitArray[1].split('|');
            let keys = jp.query(response, queries[1]);
            let values = jp.query(response, queries[2]);
            let otherPair = [];
            if (item.hasOwnProperty('isKeyOtherPair') && item.isKeyOtherPair) {
              otherPair = jp.query(response, `$..${item.isKeyOtherPair}`);
            }
            if (item.hasOwnProperty('isCurrentYear') && item.isCurrentYear) {
              var date = new Date();
              var currentYear = date.getFullYear();
              keys = _.filter(keys, function(key) {
                return key <= currentYear;
              });
              values = _.filter(values, function(value) {
                return value <= currentYear;
              });
            }

            let others = [];
            if (queries.length > 3) {
              for (let i = 3; i < queries.length; i++) {
                others.push(jp.query(response, queries[i]) || undefined);
              }
            }

            let dropDownData = [];
            for (var k = 0; k < keys.length; k++) {
              let obj = {};
              obj['key'] = item.convertToString ? keys[k].toString() : item.convertToNumber ? Number(keys[k]) : keys[k];
              obj['value'] = values[k];
              if (item.hasOwnProperty('isKeyOtherPair') && item.isKeyOtherPair) {
                otherPair[k] = otherPair[k] ? '-' + otherPair[k] : '';

                obj['value'] = values[k] + '' + otherPair[k];
              }
              if (others && others.length > 0) {
                let otherItemDatas = [];
                for (let i = 0; i < others.length; i++) {
                  otherItemDatas.push(others[i][k] || undefined);
                }
                obj['others'] = otherItemDatas;
              }

              if (item.hasOwnProperty('isKeyValuePair') && item.isKeyValuePair) {
                obj['value'] = keys[k] + '-' + values[k];
              }
              dropDownData.push(obj);
            }

            dropDownData.sort(function(s1, s2) {
              return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
            });

            dropDownData.unshift({ key: null, value: '-- Please Select --' });
            setDropDownData(item.jsonPath, dropDownData);
            setDropDownOriginalData(item.jsonPath, response);
          }
            },
        function(err) {
          console.log(err);
        }
      );
    } else if (item.hasOwnProperty('defaultValue') && typeof item.defaultValue == 'object') {
      setDropDownData(item.jsonPath, item.defaultValue);
    } else {
      
    }
  }

  componentDidMount() {
    
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { dropDownData, dropDownOringalData, value ,item, handler} = this.props;

    // on change of dropdown value reseting the 3rd level  dependant dropdown values

    if(value && (nextProps.value||nextProps.value=="") && value != nextProps.value && item.depedants){
       item.depedants.map((depedants)=>{if (handler)
       handler(
         { target: { value: "" } },
         depedants.jsonPath,
         item.isRequired ? true : false,
         '',
         item.requiredErrMsg,
         item.patternErrMsg,
         item.expression,
         item.expressionMsg
       );
     })

    }

    //load dependant field values on update/view screen
    if (dropDownData == undefined && value && nextProps.dropDownData) {

      let { item, handler } = this.props;
      if (handler)
        handler(
          { target: { value: value } },
          item.jsonPath,
          item.isRequired ? true : false,
          '',
          item.requiredErrMsg,
          item.patternErrMsg,
          item.expression,
          item.expressionMsg
        );
    }

    if (this.props.location.pathname != nextProps.history.location.pathname || dropDownData === undefined){
      this.initData(nextProps);
      if (this.props.location.pathname != nextProps.location.pathname) {
        tracker = [];
      }
    }
  }

  renderSelect = item => {
    let { getDisplayValue, filter } = this.state;
    let { dropDownData, value, name } = this.props;
    // if(item.jsonPath == 'abstractEstimates[0].natureOfWork.code' || item.jsonPath == 'abstractEstimates[0].pmcName' || item.jsonPath == 'abstractEstimates[0].department.code')
    // console.log(item.jsonPath, '<--->', value, typeof(value) );
    let dropDownDataArray = dropDownData;
    if(value && !name && dropDownData ){
      dropDownData.map((item)=>{if(item.key==value){return name=item.value}})

    }

    if (item.filterMenu && filter) {
      dropDownDataArray = [
        {
          key: value,
          value: name,
        },
      ];
    }

    switch (this.props.ui) {
      case 'google':
        let labelProperty = !item.isHideLabel && {
          floatingLabelFixed: true,
          floatingLabelText: (
            <span>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
            </span>
          ),
          hintText: '-- Please Select --',
        };
        return (
          <SelectField
            className="custom-form-control-for-select"
            id={item.jsonPath.split('.').join('-')}
            floatingLabelStyle={{
              color: item.isDisabled ? '#A9A9A9' : '#696969',
              fontSize: '20px',
              whiteSpace: 'nowrap',
            }}
            labelStyle={{ color: '#5F5C57' }}
            dropDownMenuProps={{
              targetOrigin: { horizontal: 'left', vertical: 'bottom' },
            }}
            style={{ display: item.hide ? 'none' : 'inline-block' }}
            errorStyle={{ float: 'left' }}
            fullWidth={true}
            value={
              item.fromProps
                ? typeof this.props.getVal(this.props.item.jsonPath) == 'object'
                  ? this.props.getVal(this.props.item.jsonPath).value
                  : this.props.getVal(this.props.item.jsonPath)
                : item.hasOwnProperty('hasIdConverion') ? (item.hasIdConverion && value ? value.toString() : value) : value
            }
            underlineDisabledStyle={{ backgroundColor: '#eee!important' }}
            {...labelProperty}
            onChange={(event, key, value) => {
              this.setState({
                getDisplayValue: value,
              });
              this.props.handler(
                { target: { value: value } },
                item.jsonPath,
                item.isRequired ? true : false,
                '',
                item.requiredErrMsg,
                item.patternErrMsg,
                item.expression,
                item.expressionMsg
              );

              if (this.props.autoComHandler && item.autoCompleteDependancy) {
                this.props.autoComHandler(item.autoCompleteDependancy, item.jsonPath);
              }
            }}
            onClick={event => {
              event.stopPropagation();
              this.state.filter
                ? this.setState({
                    filter: false,
                  })
                : '';
            }}
            disabled={item.isDisabled}
            errorText={this.props.fieldErrors[item.jsonPath]}
            maxHeight={200}
          >
            {dropDownDataArray && dropDownDataArray.map((dd, index) => <MenuItem value={dd.key} key={index} primaryText={dd.value} />)}
          </SelectField>
        );
    }
  };

  render() {
    return this.renderSelect(this.props.item);
  }

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    if (this.state.getDisplayValue == '') {
      if (!ReactDOM.findDOMNode(this).contains(e.target)) {
        // the click was outside your component, so handle closing here
        this.setState({
          filter: true,
        });
      }
    }
  };
}

const mapStateToProps = (state, props) => {
  let { item } = props;
  let value = _.get(state.frameworkForm.form, item.jsonPath);

  let name = item.filterMenu ? _.get(state.frameworkForm.form, _.replace(item.jsonPath, 'code', 'name')) : '';

  if(item.isKeyOtherPair&&value&&name){
  let otherPairValue=_.get(state.frameworkForm.form, _.replace(item.jsonPath, 'code', item.isKeyOtherPair));
   if(otherPairValue){
  name=name+"-"+otherPairValue;
   }
}

  if (item.convertToString && value) value = value.toString();
  else if (item.convertToNumber && value) {
    value = parseInt(value);
  }

  return {
    dropDownData: state.framework.dropDownData[item.jsonPath],
    dropDownOringalData: state.framework.dropDownOringalData,
    value: value,
    name: name,
  };
};

const mapDispatchToProps = dispatch => ({
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_DROPDWON_DATA', fieldName, dropDownData });
  },
  setDropDownOriginalData: (fieldName, dropDownData) => {
    dispatch({ type: 'SET_ORIGINAL_DROPDWON_DATA', fieldName, dropDownData });
  },
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UiSelectField));
