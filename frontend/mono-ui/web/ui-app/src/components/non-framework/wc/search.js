import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import { fileUpload } from '../../framework/utility/utility';
import ServerSideTable from '../../common/table/ServerSideTable';
import $ from 'jquery';
import ReactPaginate from 'react-paginate';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import jszip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons-bs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

var specifications = {};

let reqRequired = [];
class Report extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      resultList: [],
      values: [],
      isSearchClicked: false,
      pageCount: 0,
    };
  }

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(configObject.groups[i].fields[j].label);
          if (configObject.groups[i].fields[j].isRequired) reqRequired.push(configObject.groups[i].fields[j].jsonPath);
        }

        if (configObject.groups[i].children && configObject.groups[i].children.length) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setDefaultValues(groups, dat) {
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].fields.length; j++) {
        if (
          typeof groups[i].fields[j].defaultValue == 'string' ||
          typeof groups[i].fields[j].defaultValue == 'number' ||
          typeof groups[i].fields[j].defaultValue == 'boolean'
        ) {
          //console.log(groups[i].fields[j].name + "--" + groups[i].fields[j].defaultValue);
          _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
        }

        if (groups[i].fields[j].children && groups[i].fields[j].children.length) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            this.setDefaultValues(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  getVal = path => {
    return typeof _.get(this.props.formData, path) != 'undefined' ? _.get(this.props.formData, path) : '';
  };

  componentWillMount() {
    // $('#searchTable').DataTable({
    //    dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
    //    buttons: [ 'excel', 'pdf','copy', 'csv',  'print'],
    //    bDestroy: true,
    //    language: {
    //        "emptyTable": "No Records"
    //    }
    // });
  }

  componentWillUnmount() {
    // $('#searchTable').DataTable().destroy(true);
  }

  componentWillUpdate() {
    // let {flag} = this.props;
    // if(flag == 1) {
    //   flag = 0;
    //   $('#searchTable').dataTable().fnDestroy();
    // }
  }

  componentDidUpdate() {
    // $('#searchTable').DataTable({
    //      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
    //      buttons: [ 'excel', 'pdf','copy', 'csv',  'print'],
    //       ordering: false,
    //       bDestroy: true,
    //       language: {
    //          "emptyTable": "No Records"
    //       }
    // });
  }

  initData() {
    specifications = require(`../../framework/specs/wc/master/searchConnection`).default;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['wc.searchconnection'];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('wc');
    setActionName('searchconnection');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  componentDidMount() {
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  search = (bool, pageNumber) => {
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    for (var key in formData) {
      if (formData[key] == '' || typeof formData[key] == 'undefined') delete formData[key];
    }

    formData.pageSize = 5;
    formData.pageNumber = pageNumber ? pageNumber : 1;
    Api.commonApiPost(
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].url,
      formData,
      {},
      null,
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`].useTimestamp,
      true
    ).then(
      function(res) {
        self.props.setLoadingStatus('hide');
        self.props.setFlag(1);
        self.setState({
          resultList: res.Connection,
          showResult: true,
          pageCount: Math.ceil(res.Connection[0].totalCount / 10),
          isSearchClicked: true,
        });

        self.props.setFlag(1);
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message, false, true);
        self.props.setLoadingStatus('hide');
      }
    );
  };

  getVal = path => {
    return _.get(this.props.formData, path) || '';
  };

  handleChange = (e, property, isRequired, pattern, requiredErrMsg = 'Required', patternErrMsg = 'Pattern Missmatch') => {
    let { handleChange } = this.props;
    handleChange(e, property, isRequired, pattern, requiredErrMsg, patternErrMsg);
  };

  handleNavigation = row => {
    if (row.isLegacy) {
      this.props.setRoute('/legacy/view' + '/' + encodeURIComponent(row.consumerNumber));
    } else {
      this.props.setRoute('/waterConnection/view' + '/' + encodeURIComponent(row.acknowledgementNumber));
    }
  };
  resetAndSearch = e => {
    e.preventDefault();
    var self = this;
    self.setState(
      {
        pageCount: 0,
      },
      function() {
        self.search();
      }
    );
  };

  showPagination = () => {
    if (this.state.isSearchClicked) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ReactPaginate
            previousLabel={translate('pgr.lbl.previous')}
            nextLabel={translate('pgr.lbl.next')}
            breakLabel={<a href="">...</a>}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      );
    }
  };

  handlePageClick = data => {
    let selected = data.selected;
    this.search(true, selected + 1);
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler, handleNavigation, resetAndSearch } = this;
    let { showResult, resultList, isSearchClicked, pageCount } = this.state;
    let self = this;
    console.log(formData);

    const renderBody = function() {
      if (resultList.length) {
        return resultList.map(function(val, i) {
          if (val.withProperty) {
            return (
              <tr
                key={i}
                onClick={() => {
                  handleNavigation(val);
                }}
                style={{ cursor: 'pointer' }}
              >
                <td>{i + 1}</td>
                <td>{val.acknowledgementNumber}</td>
                <td>{val.property.propertyOwner[0].name}</td>
                <td>{val.property.address}</td>
                <td>{val.legacyConsumerNumber}</td>
                <td>{val.usageTypeName}</td>
                <td>{val.connectionStatus}</td>
                <td>{val.property.propertyIdentifier}</td>
              </tr>
            );
          } else {
            return (
              <tr
                key={i}
                onClick={() => {
                  handleNavigation(val);
                }}
                style={{ cursor: 'pointer' }}
              >
                <td>{i + 1}</td>
                <td>{val.acknowledgementNumber}</td>
                <td>{val.connectionOwners[0].name}</td>
                <td>{val.address.addressLine1}</td>
                <td>{val.legacyConsumerNumber}</td>
                <td>{val.usageTypeName}</td>
                <td>{val.connectionStatus}</td>
                <td>{val.property.propertyIdentifier}</td>
              </tr>
            );
          }
        });
        this.setState({
          isSearchClicked: true,
        });
      }
    };

    const displayTableCard = function() {
      return (
        <Card className="uiCard">
          <CardHeader title={<strong> {translate('ui.table.title')} </strong>} />
          <CardText>
            <Table id="searchTable" bordered responsive className="table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{translate('wc.search.result.acknowledgementNumber')}</th>
                  <th>{translate('fn.ApplicationDetails.applicantName')}</th>
                  <th>{translate('reports.property.address')}</th>
                  <th>{translate('wc.create.groups.applicantDetails.consumerNo')}</th>
                  <th>{translate('wc.search.result.usageType')}</th>
                  <th>{translate('wc.search.result.connectionStatus')}</th>
                  <th>{translate('wc.search.result.propertyidentifier')}</th>
                </tr>
              </thead>
              <tbody>{renderBody()}</tbody>
            </Table>
            {self.showPagination()}
            <br />
          </CardText>
        </Card>
      );
    };

    return (
      <div className="SearchResult">
        <form
          onSubmit={e => {
            resetAndSearch(e);
          }}
        >
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData['wc.searchconnection'] && (
              <ShowFields
                groups={mockData['wc.searchconnection'].groups}
                noCols={mockData['wc.searchconnection'].numCols}
                ui="google"
                handler={handleChange}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['wc.searchconnection'].useTimestamp || false}
                addNewCard={''}
                removeCard={''}
              />
            )}
          <div style={{ textAlign: 'center' }}>
            <br />
            <UiButton
              item={{
                label: 'Search',
                uiType: 'submit',
                isDisabled: isFormValid ? false : true,
              }}
              ui="google"
            />
            <br />
            {isSearchClicked && displayTableCard()}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  flag: state.report.flag,
  isFormValid: state.frameworkForm.isFormValid,
});

const mapDispatchToProps = dispatch => ({
  initForm: requiredFields => {
    dispatch({
      type: 'SET_REQUIRED_FIELDS',
      requiredFields,
    });
  },
  setMetaData: metaData => {
    dispatch({ type: 'SET_META_DATA', metaData });
  },
  setMockData: mockData => {
    dispatch({ type: 'SET_MOCK_DATA', mockData });
  },
  setModuleName: moduleName => {
    dispatch({ type: 'SET_MODULE_NAME', moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: 'SET_ACTION_NAME', actionName });
  },
  handleChange: (e, property, isRequired, pattern, requiredErrMsg, patternErrMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE_FRAMEWORK',
      property,
      value: e.target.value,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: 'TOGGLE_SNACKBAR_AND_SET_TEXT',
      snackbarState,
      toastMsg,
      isSuccess,
      isError,
    });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  setFlag: flag => {
    dispatch({ type: 'SET_FLAG', flag });
  },
  setFormData: data => {
    dispatch({ type: 'SET_FORM_DATA', data });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
