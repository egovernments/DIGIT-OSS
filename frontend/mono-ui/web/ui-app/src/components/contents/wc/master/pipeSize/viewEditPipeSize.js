import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import DataTable from '../../../../common/Table';
import { translate } from '../../../../common/common';

const $ = require('jquery');
$.DataTable = require('datatables.net');
const dt = require('datatables.net-bs');

const buttons = require('datatables.net-buttons-bs');

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
require('datatables.net-buttons/js/buttons.print.js'); // Print view button

var _this;
var flag = 0;

const getNameById = function(object, id, property = '') {
  if (id == '' || id == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].id == id) {
        return object[i].sizeInMilimeter;
      }
    } else {
      if (object[i].hasOwnProperty(property)) {
        if (object[i].id == id) {
          return object[i][property];
        }
      } else {
        return '';
      }
    }
  }
  return '';
};
const getNameByBoundary = function(object, id) {
  if (id == '' || id == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (object[i].id == id) {
      return object[i].boundaryType.sizeInMilimeter;
    }
  }
};

const styles = {
  headerStyle: {
    fontSize: 19,
  },
  marginStyle: {
    margin: '15px',
  },
  paddingStyle: {
    padding: '15px',
  },
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  customWidth: {
    width: 100,
  },
};

var flag = 0;
class searchPipeSize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSourceConfig: {
        text: 'sizeInMilimeter',
        value: 'id',
      },
      complaintSource: [],
      boundarySource: [],
      boundaryTypeList: [],
      isSearchClicked: false,
      resultList: [],
      boundaryInitialList: [],
      positionSource: [],
    };
  }

  setInitialState = _state => {
    this.setState(_state);
  };

  componentWillUpdate() {
    if (flag == 1) {
      flag = 0;
      $('#searchTable')
        .dataTable()
        .fnDestroy();
    }
  }

  componentWillMount() {
    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
    let { initForm } = this.props;
    initForm();
  }

  componentWillUnmount() {
    $('#searchTable')
      .DataTable()
      .destroy(true);
  }

  componentDidUpdate() {
    $('#searchTable').DataTable({
      dom: 'lBfrtip',
      buttons: [],
      bDestroy: true,
      language: {
        emptyTable: 'No Records',
      },
    });
  }

  componentDidMount() {}

  search = e => {
    e.preventDefault();
    var self = this;
    var searchSet = Object.assign({}, self.props.pipeSizeSearchSet);

    if (searchSet.active == false) {
      searchSet.active = false;
    } else {
      searchSet.active = true;
    }

    searchSet.pageSize = 250;
    self.props.setLoadingStatus('loading');
    Api.commonApiPost('/wcms/masters/pipesize/_search/', searchSet, {}, false, true).then(
      function(response) {
        flag = 1;
        self.setState({
          resultList: response.pipeSizes,
          isSearchClicked: true,
        });

        self.props.setLoadingStatus('hide');
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  handleNavigation = id => {
    let url = this.props.location.pathname;
    console.log('url', url);
    if (url == '/wc/pipeSize/view') {
      this.props.history.push('/wc/viewPipeSize/' + id);
    } else {
      this.props.history.push('/wc/createPipeSize/' + id);
    }
  };

  render() {
    _this = this;
    let { pipeSizeSearchSet, handleAutoCompleteKeyUp, handleChange } = this.props;
    let { search, handleNavigation } = this;
    let {
      allSourceConfig,
      complaintSource,
      boundarySource,
      boundaryTypeList,
      open,
      resultList,
      isSearchClicked,
      boundaryInitialList,
      positionSource,
    } = this.state;
    let url;

    console.log('pipeSizeSearchSet', pipeSizeSearchSet);
    const renderBody = function() {
      if (resultList && resultList.length)
        return resultList.map(function(val, i) {
          return (
            <tr
              key={i}
              onClick={() => {
                handleNavigation(val.id, url);
              }}
            >
              <td>{val.code}</td>
              <td>{val.sizeInMilimeter}</td>
              <td>{val.sizeInInch}</td>
              <td>{val.description}</td>
              <td>{val.active ? 'true' : 'false'}</td>
            </tr>
          );
        });
    };

    const viewTable = function() {
      if (isSearchClicked)
        return (
          <Card>
            <CardHeader title={<strong style={{ color: '#5a3e1b' }}> {translate('pgr.searchresult')} </strong>} />
            <CardText>
              <Table id="searchTable" style={{ color: 'black', fontWeight: 'normal' }} bordered responsive>
                <thead>
                  <tr>
                    <th>{translate('core.lbl.code')}</th>
                    <th>{translate('core.lbl.add.sizeInMilimeter')}</th>
                    <th>{translate('core.lbl.add.sizeInInch')}</th>
                    <th>{translate('core.lbl.description')}</th>
                    <th>{translate('pgr.lbl.active')} </th>
                  </tr>
                </thead>
                <tbody>{renderBody()}</tbody>
              </Table>
            </CardText>
          </Card>
        );
    };

    return (
      <div className="searchPipeSize">
        <form
          autoComplete="off"
          onSubmit={e => {
            search(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> Search Pipe Size </div>} />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={'Pipe Size' + '*'}
                      value={pipeSizeSearchSet.sizeInMilimeter ? pipeSizeSearchSet.sizeInMilimeter : ''}
                      maxLength={100}
                      onChange={e => {
                        pipeSizeSearchSet.active = true;
                        handleChange(e, 'sizeInMilimeter', true, /^[a-zA-Z0-9 ]*$/g);
                      }}
                      id="sizeInMilimeter"
                    />
                  </Col>
                  <div className="clearfix" />
                  <Col xs={12} md={3} sm={6}>
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      style={styles.checkbox}
                      defaultChecked={pipeSizeSearchSet.active || true}
                      onCheck={(e, i, v) => {
                        var e = {
                          target: {
                            value: i,
                          },
                        };
                        handleChange(e, 'active', true, '');
                      }}
                      id="active"
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton style={{ margin: '15px 5px' }} type="submit" label={translate('core.lbl.search')} primary={true} />
          </div>
        </form>
        {viewTable()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { pipeSizeSearchSet: state.form.form };
};
const mapDispatchToProps = dispatch => ({
  initForm: type => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: ['active'],
          required: [],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (e, property, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
  handleAutoCompleteKeyUp: (e, type) => {
    var self = _this;
    dispatch({
      type: 'HANDLE_CHANGE',
      property: type,
      value: '',
      isRequired: true,
      pattern: '',
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(searchPipeSize);
