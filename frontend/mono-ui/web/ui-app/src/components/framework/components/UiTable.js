import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../common/common';
import { connect } from 'react-redux';
import Api from '../../../api/api';
import _ from 'lodash';
import jp from 'jsonpath';
import Button from './UiButton';
import UiCheckBox from './UiCheckBox';

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

class UiTable extends Component {
  state = {};
  showObjectInTable = field => {
    var flag = false;
    var str = '';
    if (Array.isArray(field)) {
      field.forEach(function(item, index) {
        if (typeof item == 'object') {
          str += (item.name ? item.name : item.code) + ',';
        } else {
          str += item + ',';
        }
      });
      return str.slice(0, -1);
    } else {
      return field;
    }
  };

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  componentWillUpdate(nextProps) {
    let { flag } = this.props;
    if (flag == 1 && nextProps.selectedValue ==='') {
      flag = 0;
      $('#searchTable')
        .dataTable()
        .fnDestroy();
    }
  }

  componentDidUpdate() {
    if(this.props.selectedValue ===''){
    this.initTable();
  }
  }

  initTable = () => {
    const { resultList,orientation } = this.props;
    let hidesearch = resultList.hasOwnProperty('hidesearch') ? resultList.hidesearch : false;
    const resultHeader = resultList.hasOwnProperty('resultHeader') ? resultList.resultHeader : [];
    const columns = resultHeader.map((item, i) => (item.label !== 'Action' ? i : -1)).filter(index => index !== -1);

    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      order: [],
      searching: hidesearch,
      lengthChange: hidesearch,
      buttons: hidesearch
        ? [
            {
              extend: 'excel',
              text: 'Excel',
              exportOptions: {
                columns,
              },
            },
            {
              extend: 'csv',
              text: 'CSV',
              exportOptions: {
                columns,
              },
            },
            {
              extend: 'pdfHtml5',
              orientation: orientation,
              text: 'PDF',
              pageSize: 'LEGAL',
              exportOptions: {
                columns,
                order: 'applied',
              },
              customize: function(doc) {
                doc.defaultStyle.fontSize = 10;
              },
            },
            {
              extend: 'print',orientation: orientation, text: 'Print', exportOptions: { columns }
            },
            { extend: 'copy', text: 'Copy', exportOptions: { columns } },
          ]
        : [],
      ordering: false,
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
  };

  componentDidMount() {
    let hidesearch = this.props.resultList.hidesearch;
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

    this.initTable();
  }

  formatAMPM = date => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  };

  render() {
    let {
      resultList,
      rowClickHandler,
      showDataTable,
      showHeader,
      rowButtonClickHandler,
      rowCheckboxClickHandler,
      rowIconClickHandler,
      selectedValue,
      selectedValues,
    } = this.props;
    let self = this;

    const getNameById = function(item2, i2) {
      if (resultList.resultHeader[i2] && resultList.resultHeader[i2].isChecked) {
        var selected = false;
        if (selectedValues.length > 0) {
          let idx = selectedValues.indexOf(item2);
          if (idx > -1) selected = true;
        } else if (selectedValue == item2) {
          selected = true;
        }
        return (
          <span style={{ 'margin-right': '20px' }}>
            <UiCheckBox
              item={resultList.resultHeader[i2].checkedItem}
              ui="google"
              handler={() => {
                rowCheckboxClickHandler(item2);
              }}
              isSelected={selected}
            />
          </span>
        );
      } else if (resultList.resultHeader[i2] && resultList.resultHeader[i2].isAction) {
        if (_.isArray(item2)) {
          return resultList.resultHeader[i2].actionItems.map((actionitem, index) => {
            return (
              <span style={{ 'margin-right': '20px' }}>
                <a
                  onClick={() => {
                    rowButtonClickHandler(actionitem.url, item2[1]);
                  }}
                >
                  {item2[0]}
                </a>
              </span>
            );
          });
        } else {
          return resultList.resultHeader[i2].actionItems.map((actionitem, index) => {
            return (
              <span style={{ 'margin-right': '20px' }}>
                <Button
                  item={{ label: actionitem.label, uiType: 'primary' }}
                  ui="google"
                  handler={() => {
                    rowButtonClickHandler(actionitem.url, item2);
                  }}
                />
              </span>
            );
          });
        }
      } else if (resultList.resultHeader[i2] && resultList.resultHeader[i2].url) {
        return self.state[resultList.resultHeader[i2].label] ? self.state[resultList.resultHeader[i2].label][item2] : item2 + '';
      } else if (resultList.resultHeader[i2] && resultList.resultHeader[i2].isDate) {
        var _date = new Date(Number(item2));
        return _date == "Invalid Date" ? item2 : ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
      } else if (resultList.resultHeader[i2] && resultList.resultHeader[i2].isTime) {
        return self.formatAMPM(new Date(parseInt(item2)));
      } else if (resultList.resultHeader[i2] && resultList.resultHeader[i2].isComma) {
        let _commaVal = item2.toString();
        var y = _commaVal.split('.')[1];
        _commaVal = _commaVal.split('.')[0];
        var lastThree = _commaVal.substring(_commaVal.length - 3);
        var otherNumbers = _commaVal.substring(0, _commaVal.length - 3);
        if (otherNumbers != '') lastThree = ',' + lastThree;
        var resCal = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        var res = y == null ? resCal : resCal + '.' + y;
        return res;
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
                  <th>{translate('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {resultList.hasOwnProperty('resultValues') &&
                  resultList.resultValues.map((item, i) => {
                    return (
                      <tr key={i}>
                        {item.map((item2, i2) => {
                          return <td key={i2}>{typeof item2 != 'undefined' ? getNameById(self.showObjectInTable(item2), i2) : ''}</td>;
                        })}

                        <td style={{ textAlign: 'center', marginRight: '10px' }}>
                          <i
                            style={{ marginRight: '10px' }}
                            onClick={() => {
                              rowIconClickHandler(i, 'view');
                            }}
                            className="material-icons"
                          >
                            remove_red_eye
                          </i>
                          <i
                            onClick={() => {
                              rowIconClickHandler(i, 'update');
                            }}
                            className="material-icons"
                          >
                            edit
                          </i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </CardText>
        </Card>
      );
    };

    return <div>{this.props.resultList && renderTable()}</div>;
  }
}

const mapStateToProps = state => ({ flag: state.report.flag });

const mapDispatchToProps = dispatch => ({
  setFlag: flag => {
    dispatch({ type: 'SET_FLAG', flag });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiTable);
