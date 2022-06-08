import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { translate } from '../../common/common';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import UiTextField from './UiTextField';
import UiSelectField from './UiSelectField';
import UiSelectFieldMultiple from './UiSelectFieldMultiple';
import UiCheckBox from './UiCheckBox';
import UiEmailField from './UiEmailField';
import UiMobileNumber from './UiMobileNumber';
import UiTextArea from './UiTextArea';
import UiMultiSelectField from './UiMultiSelectField';
import UiNumberField from './UiNumberField';
import UiDatePicker from './UiDatePicker';
import UiMultiFileUpload from './UiMultiFileUpload';
import UiSingleFileUpload from './UiSingleFileUpload';
import UiAadharCard from './UiAadharCard';
import UiPanCard from './UiPanCard';
import UiLabel from './UiLabel';
import UiRadioButton from './UiRadioButton';
import UiTextSearch from './UiTextSearch';
import UiDocumentList from './UiDocumentList';
import UiAutoComplete from './UiAutoComplete';
import UiDate from './UiDate';
import UiPinCode from './UiPinCode';
import UiArrayField from './UiArrayField';
import UiFileTable from './UiFileTable';
import UiBoundary from './UiBoundary';
import jp from 'jsonpath';
import _ from 'lodash';

function getSum(total, num) {
  return total + num;
}

class UiMultiFieldTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      list: [],
      index: 0,
      jsonPath: '',
      isintialLoad: false,
    };
  }

  componentDidMount() {
    let values = [this.props.item.tableList.values];
    // console.log('came to did mount:',this.props.item.jsonPath);
    // console.log(_.get(this.props.formData,this.props.item.jsonPath));
    // console.log(values);
    if (_.get(this.props.formData, this.props.item.jsonPath)) {
      // console.log('did mount load if loop:',this.props.item.jsonPath);
      this.renderOnLoad(this.props);
    } else {
      // console.log('did mount load else loop:',this.props.item.jsonPath);
      this.addMandatoryOnLoad(this.props.item.tableList.values, 1);
      this.setState({
        values,
        list: Object.assign([], this.props.item.tableList.values),
        jsonPath: this.props.item.jsonPath,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('will next props:', nextProps.item.tableList.values);
    // console.log(this.props, nextProps, !_.isEqual(this.props, nextProps));
    // && _.get(this.props.formData,this.props.item.jsonPath)
    // && this.props.formData && nextProps.formData && !_.isEqual(_.get(this.props.formData,this.props.item.jsonPath),
    if ((nextProps.item.type=="tableListTemp" && _.get(nextProps.formData,nextProps.item.jsonPath))) {
      // console.log('receive props condition succeeded', nextProps.item.jsonPath);
      this.renderOnLoad(nextProps);
    }
  }

  renderOnLoad = (props) => {
    var valuesArray = [];
    let { isintialLoad, index, values } = this.state;
    var numberOfRowsArray = _.get(props.formData, props.item.jsonPath);
    // console.log(numberOfRowsArray, props.item.jsonPath, isintialLoad);
    // console.log(this.state.values, numberOfRowsArray, props.item.tableList.values);
    var listValues = _.cloneDeep(props.item.tableList.values);
    // console.log(listValues);
    // console.log('render load:',_.get(props.formData,props.item.jsonPath), numberOfRowsArray && numberOfRowsArray.length);
    let formData = { ...props.formData };
    // console.log(formData, JSON.stringify(formData));
    // console.log(numberOfRowsArray, numberOfRowsArray ? numberOfRowsArray.length - 1 : 0,  props.item.jsonPath, isintialLoad);
    // console.log('render load', props.item.jsonPath, _.get(formData,props.item.jsonPath), props.item.tableList.values);
    if (numberOfRowsArray && numberOfRowsArray.length > 0) {
      // console.log('render load true succeeded');
      var regexp = new RegExp(`${this.escapeRegExp(props.item.jsonPath)}\\[\\d+\\]`);
      for (var i = 0; i < numberOfRowsArray.length; i++) {
        var listValuesArray = _.cloneDeep(listValues);
        for (var j = 0; j < listValuesArray.length; j++) {
          //  console.log(listValuesArray[j].jsonPath);
          listValuesArray[j].jsonPath = listValuesArray[j].jsonPath.replace(regexp, `${props.item.jsonPath}[${i}]`);
        }
        valuesArray.push(listValuesArray);
      }
      // console.log(valuesArray);
      this.setState({
        values: valuesArray,
        index: numberOfRowsArray ? numberOfRowsArray.length - 1 : 0,
        isintialLoad: true,
      });
    } else if (numberOfRowsArray && numberOfRowsArray.length == 0) {
      this.setState({
        isintialLoad: false,
      });
    } else if (numberOfRowsArray == undefined) {
      let values = [props.item.tableList.values];
      this.setState({
        values,
        // isintialLoad: true,
        list: Object.assign([], props.item.tableList.values),
      });
      this.addMandatoryOnLoad(props.item.tableList.values, 1);
    }
    // this.addMandatoryOnLoad(props.item.tableList.values, numberOfRowsArray ? numberOfRowsArray.length : 1);
  };

  addMandatoryOnLoad = (values, length) => {
    // console.log(values, '<--->', length, this.props.item.jsonPath);
    let { addRequiredFields, delRequiredFields, formData } = this.props;
    let addReq = [];
    let delReq = [];
    var regexp = new RegExp(`${this.escapeRegExp(this.props.item.jsonPath)}\\[\\d+\\]`);

    for (let i = 0; i < length; i++) {
      values &&
        values.map((row, rowIdx) => {
          if (row.isRequired && !row.isHidden) {
            row.jsonPath = row.jsonPath.replace(regexp, `${this.props.item.jsonPath}[${i}]`);
            addReq.push(row.jsonPath);
          } else if (row.isHidden) {
            //isHidden -true
            // let check_val = _.get(formData, row.checkjPath);
            // // console.log(check_val);
            // if(row.checkjPath && check_val){
            //   row.jsonPath = row.jsonPath.replace(regexp, `${this.props.item.jsonPath}[${i}]`);
            //   // console.log('add as required');
            //   addReq.push(row.jsonPath)
            // }else{
            //   row.jsonPath = row.jsonPath.replace(regexp, `${this.props.item.jsonPath}[${i}]`);
            //   // console.log('remove as required');
            //   delReq.push(row.jsonPath)
            // }
          }
        });
      // console.log(addReq, delReq);
      addRequiredFields(addReq);
      // delRequiredFields(delReq);
    }
  };

  addMandatoryforAdd = values => {
    // console.log('add mandatory');
    let { addRequiredFields } = this.props;
    let req = [];
    values &&
      values.map((val, idx) => {
        if (val.isRequired && !val.isHidden) req.push(val.jsonPath);
      });
    addRequiredFields(req);
  };

  addNewRow() {
    var val = JSON.parse(JSON.stringify(this.state.list));
    var regexp = new RegExp(`${this.escapeRegExp(this.props.item.jsonPath)}\\[\\d+\\]`);
    var idx= this.state.index + 1;
    this.setState(
      {
        index: idx,//this.state.index + 1,
      },
      () => {
        for (var i = 0; i < val.length; i++) {
          val[i].jsonPath = val[i].jsonPath.replace(regexp, `${this.props.item.jsonPath}[${idx}]`); //this.state.index}]`);
        }
        this.addMandatoryforAdd(val);
        let values = [...this.state.values];
        values.push(val);
        this.setState({
          values,
        });
      }
    );
  }

  escapeRegExp = str => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  deleteRow = ind => {
    //Changes to handle dependency sum
    let dependencyFlag = 0;
    let depField = '';
    let sumField = '';

    let values = Object.assign([], this.state.values);
    this.removeMandatoryForDelete(values.length - 1);
    values.splice(ind, 1);
    var regexp = new RegExp(`${this.escapeRegExp(this.props.item.jsonPath)}\\[\\d+\\]`);
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < values[i].length; j++) {
        values[i][j].jsonPath = values[i][j].jsonPath.replace(regexp, `${this.props.item.jsonPath}[${i}]`);
        if (values[i][j].dependency) {
          //Changes to handle dependency sum
          dependencyFlag = 1;
          depField = values[i][j].dependency;
          sumField = values[i][j].jsonPath;
        }
      }
    }
    this.setState(
      {
        values,
        index: this.state.index - 1,
        // isintialLoad:false
      },
      () => {
        let formData = { ...this.props.formData };
        let formDataArray = _.get(formData, this.props.item.jsonPath) ? [..._.get(formData, this.props.item.jsonPath)] : [];
        if (formDataArray && formDataArray.length) {
          formDataArray.splice(ind, 1);
          var newFormData = _.set(formData, this.props.item.jsonPath, formDataArray);
          this.props.setFormData(newFormData);
          this.renderOnLoad(this.props);
          for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
              if (values[i][j].isHidden) {
              } else {
                this.props.handleChange(
                  _.get(this.props.formData, values[i][j].jsonPath) || '',
                  values[i][j].jsonPath,
                  values[i][j].isRequired,
                  values[i][j].pattern,
                  values[i][j].requiredErrMsg,
                  values[i][j].patternErrMsg
                );
              }
            }
          }
        }
      }
    );

    if (dependencyFlag == 1) {
      //Changes to handle dependency sum
      let _formData = JSON.parse(JSON.stringify(this.props.formData));
      if (_formData) {
        let field = sumField.substr(0, sumField.lastIndexOf('['));
        let last = sumField.substr(sumField.lastIndexOf(']') + 2);

        let arrval = _.get(_formData, field);
        if (arrval) {
          let len = _.get(_formData, field).length;

          let amtsum = 0;
          let svalue = '';
          for (var i = 0; i < len; i++) {
            let ifield = field + '[' + i + ']' + '.' + last;
            if (i == ind) {
              svalue = '';
            } else {
              svalue = _.get(_formData, ifield);
              amtsum += parseInt(svalue);
            }
          }
          this.props.handler({ target: { value: amtsum } }, depField, false, '', '');
        }
      }
    }
  };

  removeMandatoryForDelete = idx => {
    // console.log('remove mandatory');
    let { delRequiredFields, removeFieldErrors } = this.props;
    let req = [];
    var regexp = new RegExp(`${this.escapeRegExp(this.props.item.jsonPath)}\\[\\d+\\]`);
    this.props.item.tableList.values.map(item => {
      item.jsonPath = item.jsonPath.replace(regexp, `${this.props.item.jsonPath}[${idx}]`);
      req.push(item.jsonPath);
      removeFieldErrors(item.jsonPath);
    });
    delRequiredFields(req);
  };

  renderFields = (item, screen) => {
    if (screen == 'view' && ['documentList', 'fileTable', 'arrayText', 'arrayNumber'].indexOf(item.type) == -1) {
      if (item.type == 'datePicker') {
        item.isDate = true;
      }
      item.type != 'boundary' && (item.type = 'label');
    }
    switch (item.type) {
      case 'text':
        return (
          <UiTextField ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'textarea':
        return (
          <UiTextArea ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'singleValueListMultiple':
        return (
          <UiSelectFieldMultiple
            ui={this.props.ui}
            useTimestamp={this.props.useTimestamp}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'singleValueList':
         item.fromProps = true;
        return (
          <UiSelectField
            ui={this.props.ui}
            useTimestamp={this.props.useTimestamp}
            getVal={this.props.getVal}
            setVal={this.props.setVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'multiValueList':
        return (
          <UiMultiSelectField
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'autoCompelete':
        return (
          <UiAutoComplete
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
            autoComHandler={this.props.autoComHandler || ''}
          />
        );
      case 'number':
        return (
          <UiNumberField
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'mobileNumber':
        return (
          <UiMobileNumber
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'checkbox':
        return (
          <UiCheckBox ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'email':
        return (
          <UiEmailField ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'datePicker':
        return (
          <UiDatePicker ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'singleFileUpload':
        return (
          <UiSingleFileUpload
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'multiFileUpload':
        return (
          <UiMultiFileUpload
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'pan':
        return (
          <UiPanCard ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'aadhar':
        return (
          <UiAadharCard ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'pinCode':
        return (
          <UiPinCode ui={this.props.ui} getVal={this.props.getVal} item={item} fieldErrors={this.props.fieldErrors} handler={this.props.handler} />
        );
      case 'label':
        return <UiLabel getVal={this.props.getVal} item={item} />;
      case 'radio':
        return (
          <UiRadioButton
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
          />
        );
      case 'textSearch':
        return (
          <UiTextSearch
            ui={this.props.ui}
            getVal={this.props.getVal}
            item={item}
            fieldErrors={this.props.fieldErrors}
            handler={this.props.handler}
            autoComHandler={this.props.autoComHandler}
          />
        );
        case 'boundary':
          return (
            <UiBoundary
              ui={this.props.ui}
              getVal={this.props.getVal}
              item={item}
              fieldErrors={this.props.fieldErrors}
              handler={this.props.handler}
            />
          );
    }
  };

  renderTable = item => {
    // console.log(this.props.item.jsonPath, this.state.values, this.state.values && this.state.values.length);
    let { formData } = this.props;
    let footerArray = [];

    item.tableList.values.map(val => {
      if (val.isHidden) {
        if (val.checkjPath && _.get(formData, val.checkjPath)) footerArray.push(undefined);
      } else {
        footerArray.push(undefined);
      }
    });

    // console.log(footerArray);

    if (item.tableList.hasFooter) {
      for (var i = 0; i < item.tableList.footer.length; i++) {
        // console.log(JSON.stringify(formData));
        for (var key in item.tableList.footer[i]) {
          let array = jp.query(formData, `$..${item.tableList.footer[i][key]}`);
          // console.log(key, array.reduce( (previousValue, currentValue) => Number(previousValue) + Number(currentValue), 0));
          footerArray[key] = array.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue), 0);
          // footerArray.splice(key+1,0,array.reduce( (previousValue, currentValue) => Number(previousValue) + Number(currentValue), 0))
        }
      }
    }



    // console.log(footerArray);

    return (
      <div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
            {!item.tableList.serialNoNotRequired ?   <th>Sr. No.</th>  : ''}
            {item.tableList.selectedfilter ?   <th>{"Is Checked"}</th>  : ''}
              {item.tableList.header.map((v, i) => {
                var style = {};
                if (v.style) {
                  style = v.style;
                }
                if (v.hide) {
                  let jp =
                    this.state.values &&
                    this.state.values[0] &&
                    this.state.values[0].find((x, index) => {
                      return index == i;
                    });
                  if (jp && jp.checkjPath && _.get(formData, jp.checkjPath)) {
                    return (
                      <th style={style} key={i}>
                        {translate(v.label)}
                      </th>
                    );
                  } else return null;
                } else {
                  return (
                    <th style={style} key={i}>
                      {translate(v.label)}
                    </th>
                  );
                }
              })}
              {!item.tableList.actionsNotRequired ? <th>{translate('reports.common.action')}</th> : ''}
            </tr>
          </thead>
          <tbody>
            {(!item.tableList.actionsNotRequired || _.get(formData,item.jsonPath)) && this.state.values.map((v, i) => {
              let startIndex = item.startIndex || 0;
              if (i >= startIndex)
              var customItem = {
                "type":"checkbox",
                "jsonPath": item.jsonPath+"["+ i +"]"+".isselected"
                };
                return (
                  <tr key={i}>
                    {!item.tableList.serialNoNotRequired ? <td>{i - startIndex + 1}</td> : ''}
                    {item.tableList.selectedfilter ? <td>{this.renderFields(customItem, this.props.screen)}</td>  : ''}
                    {v.map((v2, i2) => {
                      if (v2.isHidden) {
                        if (v2.checkjPath && _.get(formData, v2.checkjPath)) {
                          return <td key={i2}>{this.renderFields(v2, this.props.screen)}</td>;
                        } else {
                          return null;
                        }
                      } else {
                        return <td key={i2}>{this.renderFields(v2, this.props.screen)}</td>;
                      }
                    })}
                    {!item.tableList.actionsNotRequired ? (
                      <td>
                        <div
                          className="material-icons"
                          onClick={() => {
                            this.deleteRow(i);
                          }}
                        >
                          delete
                        </div>
                      </td>
                    ) : (
                      ''
                    )}
                  </tr>
                );
            })}
          </tbody>
          {item.tableList.hasFooter ? (
            <tfoot>
              <tr>
                <td />
                {footerArray.map((val, index) => {
                  let value = val !== undefined ? val.toFixed(2) : '';
                  return (
                    <td key={index} className="text-right" style={{ fontWeight: 'bold' }}>
                      {value ? `Total: ${value}` : ''}
                    </td>
                  );
                })}
                {!item.tableList.actionsNotRequired ? <td /> : ''}
              </tr>
            </tfoot>
          ) : (
            ''
          )}
        </table>
        {!item.tableList.actionsNotRequired ? (
          <div style={{ textAlign: 'right' }}>
            <RaisedButton
              label={translate('pgr.lbl.add')}
              primary={true}
              onClick={() => {
                this.addNewRow();
              }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  render() {
    // console.log(this.props.item.jsonPath, this.state.values, this.state.index);
    return <div style={{margin:"15px"}}>{this.renderTable(this.props.item)}</div>;
  }
}

const mapStateToProps = state => {
  // console.log(state.frameworkForm.requiredFields);
  return {
    formData: state.frameworkForm.form,
    requiredFields: state.frameworkForm.requiredFields,
  };
};

const mapDispatchToProps = dispatch => ({
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    dispatch({ type: 'HANDLE_CHANGE_FRAMEWORK', property, value: e.target ? e.target.value : e, isRequired, pattern, requiredErrMsg, patternErrMsg });
  },
  delRequiredFields: requiredFields => {
    dispatch({ type: 'DEL_REQUIRED_FIELDS', requiredFields });
  },
  addRequiredFields: requiredFields => {
    dispatch({ type: 'ADD_REQUIRED_FIELDS', requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: 'REMOVE_FROM_FIELD_ERRORS', key });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiMultiFieldTable);
