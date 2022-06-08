import React, { Component } from 'react'
import SuperSelectField from 'material-ui-superselectfield'
import FlatButton from 'material-ui/FlatButton/FlatButton'
import { connect } from 'react-redux';
import Api from '../../../api/api';
import jp from 'jsonpath';
import _ from 'lodash';
import { teal500, pink500, teal200, pink200, yellow500, yellow200, deepPurple500 } from 'material-ui/styles/colors'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';


const containerStyle = {
  padding: 40,
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
border: '0.5px solid #cccccc',
}

// const displayState = (state) =>
//   state && state.length ? [...state].map(({ value, label }) => label || value).join(', ') : 'empty state'

// const dataSource = [
//   { key: 0, value: 'Raphaël' },
//   { key: 1, value: 'Jessica' },

// ]

class UiAutocompleteMultiselect extends Component {
  constructor(props) {
    super(props);
    this.state = {
    multiselect: [],
    dataSource : []
  };
this.initData = this.initData.bind(this);
  }
 

componentDidMount() {
    this.initData(this.props);
  }

initData(props) {
  let _this = this;
    let { item, setDropDownData, useTimestamp } = this.props;
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
              if (item.hasOwnProperty('isKeyValuePair') && item.isKeyValuePair) {
                obj['value'] = keys[k] + obj['value'];
              }
              dropDownData.push(obj);
              
            }
             _this.setState({
                dataSource: dropDownData
              })
           // dropDownData.unshift({ key: null, value: '-- Please Select --' });
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


  handleSelection = (values, name) =>{ 
        let item = this.props.item;
                this.setState({ [name]: values })
        let itemvalue=[];        
            
            {values.map((value)=>{
                return  itemvalue.push(value.value)
                  })}
        itemvalue = (itemvalue).toString()

        {
            this.props.handler(
              { target: { value: itemvalue } },
              item.jsonPath,
              item.isRequired ? true : false,
              '',
              item.requiredErrMsg,
              item.patternErrMsg,
              item.expression,
              item.expressionMsg
            );
          }}


  handleAutoCompleteTyping = (searchText) => console.debug('You typed in AutoComplete :', searchText) // eslint-disable-line no-console

getVal = (path, dateBool) => {
    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == 'string' && _val && _val.indexOf('-') > -1) {
      var _date = _val.split('-');
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != 'undefined' ? _val : '';
  };

  renderAutomultiselect = (item) => {
    const { multiselect,dataSource } = this.state;
    const {dropDownData} =this.props;
    let value =this.getVal(item.jsonPath);
    value = value && value.split(',');
  let displayVal =[]
{value && value.map((value)=>{
                     let obj={};
                     obj['label']=value
                     obj['value'] =value
                return  displayVal.push(obj)
                  })}
    const dataSourceNodes = dataSource.map(({ key, value }) => (
      <div key={key} value={key} label={value}>
        {value}
      </div>
    ))
    switch (this.props.ui) {
      case 'google':
    return (

    <div> 
        <span>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
        </span>

      <div style={{ display: 'flex', 'flex-direction': 'column-reverse' }}>
         
          <SuperSelectField
           className="custom-form-control-for-select"
            id={item.jsonPath.split('.').join('-')}
            name='multiselect'
            multiple
            //floatingLabel={CustomFloatingLabel}
            //floatingLabelStyle={{ color: pink200}}
            //floatingLabelFocusStyle={{ color: pink500 }}
            underlineStyle={{ display:'none' ,borderColor: teal200 }}
            //underlineFocusStyle={{ borderColor: teal500 }}
            //autocompleteStyle={{ color: 'red', fontSize: 25}}
            autocompleteUnderlineStyle={{ borderColor: '#5f5c62'}}
            autocompleteUnderlineFocusStyle={{ borderColor: '#5f5c62' }}
            hintText='-- Please Select --'
            onChange={this.handleSelection}
            //onAutoCompleteTyping={this.handleAutoCompleteTyping}
            value={displayVal}
            hoverColor='rgba(3, 169, 244, 0.15)'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            menuStyle ={{overflow: 'hidden' }}
            style={{ marginTop:10, border: '1px solid #cccccc',
                      padding: '5px',
                      'border-radius': '7px',
                      'background-color': '#fbfbfb' }}
            menuCloseButton={<FlatButton label='close' hoverColor={'lightSalmon'} />}
            dropDownIcon={<ArrowDown />}
            selectedMenuItemStyle ={{color :'darkgray' }}
            showAutocompleteThreshold='always'
            
          >
            {dataSourceNodes}
          </SuperSelectField>
        </div>
      </div>  

    
    )
   }
  }
  render() {
    return <div>{this.renderAutomultiselect(this.props.item)}</div>;
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
export default connect(mapStateToProps, mapDispatchToProps)(UiAutocompleteMultiselect);