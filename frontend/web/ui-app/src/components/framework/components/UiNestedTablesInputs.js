import React, { Component } from 'react';
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
import jp from 'jsonpath';
import _ from 'lodash';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';

export default class UiNestedTablesInputs extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    // if(this.state.list.length === 0)
    // {
    //   //  let list = [...this.state.list];
    //   //  list.push([...this.props.item.tableList.values]);
    //   //  this.setState({list});
    //   //  this.addMandatoryFields(list);
    // }

    let { setVal, getVal, item } = this.props;
    let tableDatas = getVal(item.jsonPath);
    //modifiedTbl.tableList.values = this.cloneRowObject(tableJsonPath, parentTblIdx, [...modifiedTbl.tableList.values]);

    if (!tableDatas || tableDatas.length === 0) {
      setVal(item.jsonPath, [undefined]);
      let list = [...this.state.list];
      list.push(this.cloneRowObject(item.jsonPath, 0, [...this.props.item.tableList.values]));
      this.setState({ list });
      this.addMandatoryFields(list);
    } else {
      this.addMultipleRow(item.jsonPath, tableDatas.length, item.tableList.values);
      //  for(let idx=0;idx<tableDatas.length;idx++)
      //    this.addRow(item.jsonPath);
    }
  }

  // generateListAsPerReduxData = (jsonPath)=>{
  //   let tableDatas = getVal(item.jsonPath);
  //   let list=[];
  //   for(let idx=0;idx<tableDatas.length;idx++)
  //      list.push(this.addRow(item.jsonPath));
  //   return list;
  // }

  addMandatoryFields = list => {
    let requiredFieldsObj = jp.query(list, '$..[?(@.isRequired)]');
    let requiredFields = requiredFieldsObj.map(field => field.jsonPath);
    this.props.addRequiredFields(requiredFields);
  };

  removeMandatoryFields = (tableJsonPath, rowIdx) => {
    let deletedRow = this.cloneRowObject(tableJsonPath, rowIdx);
    let deletedRequiredFields = deletedRow.filter(field => field.isRequired).map(field => field.jsonPath);
    this.props.delRequiredFields(deletedRequiredFields);
  };

  renderHeader = (headerArry, colsWeight, requiredCols) => {
    return headerArry.map((header, idx) => {
      let colStyle = (colsWeight[idx] && { flex: colsWeight[idx] }) || {};
      return (
        <div style={colStyle} className="flex-cell flex-table-header">
          {header.label} {requiredCols.indexOf(idx) != -1 && <span style={{ color: 'rgb(255, 0, 0)' }}> *</span>}
        </div>
      );
    });
  };

  escapeRegExp = str => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  replaceIdxWithTableJsonPath = (tableJsonPath, idxToReplace, valueToReplace) => {
    let regexp = new RegExp(`${this.escapeRegExp(tableJsonPath)}\\[\\d+\\]`);
    return valueToReplace.replace(regexp, `${tableJsonPath}[${idxToReplace}]`);
  };

  cloneRowObject = (tableJsonPath, idx, values) => {
    //console.log('cloning...', tableJsonPath, idx, values);
    let rowObj = (values && [...values]) || [...[...this.state.list][0]];
    let regexp = new RegExp(`${this.escapeRegExp(tableJsonPath)}\\[\\d+\\]`);
    let modifyFieldJsonPath = (value, key) => {
      if (key === 'jsonPath') {
        return value.replace(regexp, `${tableJsonPath}[${idx}]`);
      }
    };
    return _.cloneDeepWith(rowObj, modifyFieldJsonPath);
  };

  addMultipleRow = (tableJsonPath, rowLength, values) => {
    //console.log('jsonPath --->', tableJsonPath);
    let list = (this.state.list && [...this.state.list]) || [];
    let idx = list.length;
    let len = idx + rowLength;
    for (idx; idx < len; idx++) {
      let clonedObj = this.cloneRowObject(tableJsonPath, idx, [...values]);
      list.push(clonedObj);
    }
    this.setState({ list });
    this.addMandatoryFields(list);
    return list;
  };

  addRow = tableJsonPath => {
    let list = [...this.state.list];
    let idx = list.length;
    list.push(this.cloneRowObject(tableJsonPath, idx));
    this.setState({ list });
    this.addMandatoryFields(list);
    return list;
  };

  deleteRow = (tableJsonPath, idxToDelete) => {
    let list = [...this.state.list];
    if (list.length > 1) {
      let length = list.length;
      let deletedItem = list.splice(idxToDelete, 1);
      if (idxToDelete <= list.length) {
        list = this.reIndexingExistingRows(list, tableJsonPath, idxToDelete);
      }
      this.setState({ list });
      this.removeMandatoryFields(tableJsonPath, length - 1);
      this.deleteTableData(tableJsonPath, idxToDelete);
    }
  };

  deleteTableData = (tableJsonPath, idxToDelete) => {
    let tableData = [...this.props.getVal(tableJsonPath, [])];
    tableData.splice(idxToDelete, 1);
    this.props.setVal(tableJsonPath, tableData);
  };

  reIndexingExistingRows = (list, tableJsonPath, startIdx) => {
    for (let i = startIdx; i < list.length; i++) {
      list[i] = this.cloneRowObject(tableJsonPath, i);
    }
    return list;
  };

  renderTableData = (fields, colsWeight, rowIdx) => {
    try {
      //console.log('fields', fields);
      return (
        (fields &&
          fields.map((field, idx) => {
            let colStyle = (colsWeight[idx] && { flex: colsWeight[idx] }) || {};
            let snoColStyle = (field.isSerialNo && { padding: '15px 7px' }) || {};
            return (
              <div style={{ ...colStyle, ...snoColStyle }} className="flex-cell">
                {(field.isSerialNo && rowIdx + 1) || this.renderField(field)}
              </div>
            );
          })) ||
        null
      );
    } catch (e) {
      console.log('error', e);
      return null;
    }
  };

  renderField = (item, screen) => {
    if (screen == 'view' && ['documentList', 'fileTable', 'arrayText', 'arrayNumber'].indexOf(item.type) > -1) {
      if (item.type == 'datePicker') {
        item.isDate = true;
      }
      item.type = 'label';
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
        return (
          <UiSelectField
            ui={this.props.ui}
            useTimestamp={this.props.useTimestamp}
            getVal={this.props.getVal}
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
    }
  };

  findRequiredColumns = item => {
    let requiredColsIdx = [];
    item.tableList.values.map((field, idx) => {
      field.isRequired && requiredColsIdx.push(idx);
    });
    return requiredColsIdx;
  };

  render() {
    const item = { ...this.props.item };
    const headerArry = item.tableList.header || [];
    const fields = item.tableList.values || [];
    const colsWeight = item.tableList.colsWeight || {};
    const isEditMode = item.tableList.isEditMode;
    const list = this.state.list;
    const requiredColumns = this.findRequiredColumns(item);
    const tableJsonPath = item.jsonPath;
    const nestedTables = (item.tableList.tables && [...item.tableList.tables]) || [];

    const renderNestedTables = (childTables, parentTblIdx) => {
      let nestedTables = [...childTables];

      if (nestedTables && nestedTables.length > 0) {
        try {
          return (
            <div className="childTable">
              {nestedTables.map((table, idx) => {
                let modifiedTbl = { ...table };
                modifiedTbl.jsonPath = this.replaceIdxWithTableJsonPath(tableJsonPath, parentTblIdx, modifiedTbl.jsonPath);
                //console.log('NESTED TABLE --->', modifiedTbl.jsonPath, modifiedTbl.tableList.values);
                //console.log("replacing", table.jsonPath, this.replaceIdxWithTableJsonPath(tableJsonPath, parentTblIdx, modifiedTbl.jsonPath));
                modifiedTbl.tableList['values'] = this.cloneRowObject(tableJsonPath, parentTblIdx, modifiedTbl.tableList.values);
                //console.log("clonning --->", modifiedTbl.jsonPath, modifiedTbl.tableList.values);
                return (
                  <UiNestedTablesInputs
                    key={idx}
                    tabIndex={this.props.tabIndex}
                    ui={this.props.ui}
                    addRequiredFields={this.props.addRequiredFields}
                    delRequiredFields={this.props.delRequiredFields}
                    setVal={this.props.setVal}
                    getVal={this.props.getVal}
                    item={{ ...modifiedTbl }}
                    fieldErrors={this.props.fieldErrors}
                    handler={this.props.handler}
                    screen={this.props.screen}
                  />
                );
              }) || null}
            </div>
          );
        } catch (e) {
          console.log('error', e);
        }
      }
      return null;
    };

    return (
      <div className="flex-table flex-table-sm">
        <div className="flex-row">
          {this.renderHeader(headerArry, colsWeight, requiredColumns)}
          {isEditMode && <div style={{ flex: '0.3' }} className="flex-cell flex-table-header" />}
        </div>

        {list.map((fields, idx) => {
          return [
            <div key={idx} className="flex-row">
              {this.renderTableData(fields, colsWeight, idx)}
              {isEditMode && (
                <div
                  style={{
                    flex: '0.3',
                    padding: '7px',
                    justifyContent: 'center',
                    flexDirection: 'center',
                    textAlign: 'center',
                  }}
                  className="flex-cell"
                >
                  <IconButton
                    style={{ margin: '0 auto' }}
                    onClick={() => {
                      this.deleteRow(tableJsonPath, idx);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </div>
              )}
            </div>,
            renderNestedTables(nestedTables, idx),
          ];
        })}

        {isEditMode && (
          <div className="flex-row border-top">
            <div style={{ flexDirection: 'row-reverse', padding: '10px' }} className="flex-cell text-right">
              <RaisedButton
                label="Add"
                primary={true}
                onClick={e => {
                  this.addRow(tableJsonPath);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

//  <RenderNestedTables key={`1A${idx}`} items={nestedTables} parentTblJsonPath={tableJsonPath} parentTblIdx={idx} {...this.props}
//     ui={this.props.ui} addRequiredFields={this.props.addRequiredFields} delRequiredFields={this.props.delRequiredFields} setVal={this.props.setVal}
//     getVal={this.props.getVal}  screen={this.props.screen} fieldErrors={this.props.fieldErrors} handler={this.props.handler}
//     replaceIdxWithTableJsonPath={this.replaceIdxWithTableJsonPath} cloneRowObject={this.cloneRowObject}/>

// const RenderNestedTables = (props) => {
//
//   let nestedTables = [];
//   const {parentTblJsonPath, parentTblIdx, items} = props;
//
//   if(items && items.length > 0)
//     for(let i=0;i<items.length;i++){
//       try{
//         let item = {...items[i]};
//         let values = [...item.tableList.values];
//         item.jsonPath = props.replaceIdxWithTableJsonPath(parentTblJsonPath, parentTblIdx, item.jsonPath);
//         item.tableList['values'] = props.cloneRowObject(parentTblJsonPath, parentTblIdx, values);
//         nestedTables.push((<UiNestedTablesInputs key={item.jsonPath}
//           ui={props.ui} addRequiredFields={props.addRequiredFields} delRequiredFields={props.delRequiredFields}
//           setVal={props.setVal} getVal={props.getVal} item={item}
//           fieldErrors={props.fieldErrors} handler={props.handler}
//           screen={props.screen}/>));
//       }
//       catch(e){
//         console.log('error', e);
//       }
//     }
//
//   console.log('nestedTables', nestedTables);
//
//   return(
//     {nestedTables}
//   )
//
// }
