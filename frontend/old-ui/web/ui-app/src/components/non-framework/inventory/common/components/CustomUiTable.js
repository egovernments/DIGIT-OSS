import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../../../common/common';
import { connect } from 'react-redux';
import Api from '../../../../../api/api';
import _ from 'lodash';
import jp from 'jsonpath';
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

// const $ = require('jquery');
// $.DataTable = require('datatables.net');
// const dt = require('datatables.net-bs');
//
// const buttons = require('datatables.net-buttons-bs');
//
// require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
// require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
// require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
// require('datatables.net-buttons/js/buttons.print.js'); // Print view button

import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons-bs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

var enumWithUnderscore = [
  {
    propertyName: 'rateType',
  },
];

class CustomUiTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    if ($.fn.DataTable.isDataTable('#searchTable')) {
      $('#searchTable')
        .DataTable()
        .destroy(true);
    }
  }

  // componentWillReceiveProps(){
  // 	// console.log('componentWillReceiveProps');
  // 	// this.clearDataTable();
  // 	// this.initializeDataTable();
  // }

  clearDataTable() {
    if ($.fn.DataTable.isDataTable('#searchTable')) {
      $('#searchTable')
        .DataTable()
        .clear();
      $('#searchTable')
        .DataTable()
        .draw();
    }
    return null;
  }

  initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#searchTable')) {
      $('#searchTable')
        .DataTable()
        .draw();
      return;
    }

    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: [
        'excel',
        {
          extend: 'pdf',
          orientation: 'landscape',
          pageSize: 'LEGAL',
          exportOptions: {
            modifier: {
              page: 'current',
            },
          },
          customize: function(doc) {
            doc.defaultStyle.fontSize = 10; //<-- set fontsize to 16 instead of 10
            // var myTable = document.getElementById('searchTable');
            // myTable.style.border="1px solid black";
          },
          text: 'Pdf/Print',
        },
        'copy',
        'csv',
        // ,  {
        //   extend: 'print',
        //   customize: function ( win ) {
        //       $(win.document.body)
        //           .css( 'font-size', '8pt' )
        //       //     .prepend(
        //       //         '<img src="http://datatables.net/media/images/logo-fade.png" style="position:absolute; top:0; left:0;" />'
        //       //     );
        // 			//
        //       // $(win.document.body).find( 'table' )
        //       //     .addClass( 'compact' )
        //       //     .css( 'font-size', 'inherit' );
        //   }
        // }
      ],
      ordering: false,
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });

    return null;
  }

  componentDidMount() {
    let self = this;
    if (this.props.resultList.resultHeader && this.props.resultList.resultHeader.length) {
      for (let m = 0; m < this.props.resultList.resultHeader.length; m++) {
        if (this.props.resultList.resultHeader[m].url) {
          let splitArray = this.props.resultList.resultHeader[m].url.split('?');
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
          Api.commonApiPost(context, id, {}, '', self.props.useTimestamp || false).then(
            function(response) {
              let keys = jp.query(response, splitArray[1].split('|')[1]);
              let values = jp.query(response, splitArray[1].split('|')[2]);
              let dropDownData = {};
              for (var k = 0; k < keys.length; k++) {
                dropDownData[keys[k]] = values[k];
              }
              self.setState(
                {
                  [self.props.resultList.resultHeader[m].label]: dropDownData,
                },
                function() {}
              );
            },
            function(err) {}
          );
        }
      }
    }

    this.initializeDataTable();
  }

  render() {
    let { resultList, rowClickHandler, showDataTable, showHeader, tableSelectionData } = this.props;
    let self = this;

    const getNameById = function(item2, i2) {
      if (resultList.resultHeader[i2].url) {
        return self.state[resultList.resultHeader[i2].label] ? self.state[resultList.resultHeader[i2].label][item2] : item2 + '';
      } else if (resultList.resultHeader[i2].isDate) {
        var _date = new Date(Number(item2));
        return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
      } else {
        return item2 === true
          ? translate('employee.createPosition.groups.fields.outsourcepost.value1')
          : item2 === false ? translate('employee.createPosition.groups.fields.outsourcepost.value2') : item2 === null ? '' : item2 + '';
      }
    };

    const _removeEnumUnderScore = function(item2, i2) {
      if (resultList.resultHeader[i2].label == 'Rate Type') {
      }
    };

    const onChangeSelectionCheckbox = code => {
      let tableSelectionData = [...this.props.tableSelectionData] || [];
      let idx = tableSelectionData.indexOf(code);
      if (idx > -1) tableSelectionData.splice(idx, 1);
      else {
        if (this.props.resultList.isMultipleSelection) tableSelectionData.push(code);
        else tableSelectionData[0] = code;
      }
      this.props.setTableSelectionData(tableSelectionData);
    };

    const renderTable = function() {
      return (
        <Card className="uiCard">
          <CardHeader
            title={<strong> {showHeader == undefined ? translate('ui.table.title') : showHeader ? translate('ui.table.title') : ''} </strong>}
          />
          <CardText>
            <Table
              className="table table-striped table-bordered"
              cellSpacing="0"
              width="100%"
              id={showDataTable == undefined ? 'searchTable' : showDataTable ? 'searchTable' : ''}
              responsive
            >
              <thead>
                <tr>
                  {resultList.resultHeader &&
                    resultList.resultHeader.length &&
                    resultList.resultHeader.map((item, i) => {
                      return <th key={i}>{translate(item.label)}</th>;
                    })}
                </tr>
              </thead>
              <tbody>
                {resultList.hasOwnProperty('resultValues') &&
                  resultList.resultValues.map((item, i) => {
                    return (
                      // onClick={() => {rowClickHandler(i)}}
                      <tr key={i}>
                        {item.map((item2, i2) => {
                          if (i2 === 0) {
                            if (resultList.isMultipleSelection)
                              return (
                                <td key={i2}>
                                  <Checkbox checked={tableSelectionData.indexOf(item2) > -1} onCheck={onChangeSelectionCheckbox.bind(this, item2)} />
                                </td>
                              );
                            else
                              return (
                                <td key={i2}>
                                  {/* <Checkbox checked={tableSelectionData.indexOf(item2) > -1}
																		 onCheck={onChangeSelectionCheckbox.bind(this, item2)}/> */}
                                  <RadioButtonGroup
                                    name={i2}
                                    onChange={onChangeSelectionCheckbox.bind(this, item2)}
                                    valueSelected={tableSelectionData[0] || undefined}
                                  >
                                    <RadioButton value={`${item2}`} />
                                  </RadioButtonGroup>
                                </td>
                              );
                          } else if (typeof item2 === 'object') {
                            return (
                              <td key={i2}>
                                <Checkbox checked={(item2 && item2.value) || ''} />
                              </td>
                            );
                          }

                          return <td key={i2}>{typeof item2 != 'undefined' ? getNameById(item2, i2) : ''}</td>;
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </CardText>
        </Card>
      );
    };

    return (
      <div>
        {/* {this.clearDataTable()} */}
        {this.props.resultList && renderTable()}
        {this.initializeDataTable()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tableSelectionData: state.report.tableSelectionData,
});

const mapDispatchToProps = dispatch => ({
  setTableSelectionData: tableSelectionData => {
    dispatch({ type: 'SET_TABLE_SELECTION_DATA', tableSelectionData });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomUiTable);
