import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Table } from 'react-bootstrap';
import _ from 'lodash';
import ShowFields from '../../framework/showFields';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { translate } from '../../common/common';
import Api from '../../../api/api';
import UiButton from '../../framework/components/UiButton';
import UiDynamicTable from '../../framework/components/UiDynamicTable';
import { fileUpload } from '../../framework/utility/utility';
import ReactPaginate from 'react-paginate';

var specifications = {};

let reqRequired = [];
const getNameById = function(object, id) {
  if (!id) return '';
  for (var i = 0; i < object.length; i++) {
    if (id == object[i].id) return object[i].name || object[i].code;
  }
};

class Report extends Component {
  state = {
    pathname: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      resultList: [],
      pageSize: 10,
      pageCount: 0,
      currentPage: 1,
      designationList: [],
      departmentList: [],
      positionList: [],
    };
  }

  setInitialState(_state) {
    this.setState(_state);
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

  fetchURLData(url, query = {}, defaultObject, cb) {
    Api.commonApiPost(url, query).then(
      function(res) {
        cb(res);
      },
      function(err) {
        cb(defaultObject);
      }
    );
  }

  initData() {
    specifications = require(`../../framework/specs/employee/master/searchEmployee`).default;
    let { setMetaData, setModuleName, setActionName, initForm, setMockData, setFormData } = this.props;
    let obj = specifications['employee.empsearch'];
    reqRequired = [];
    this.setLabelAndReturnRequired(obj);
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName('employee');
    setActionName('empsearch');
    var formData = {};
    if (obj && obj.groups && obj.groups.length) this.setDefaultValues(obj.groups, formData);
    setFormData(formData);
    this.setState({
      pathname: this.props.history.location.pathname,
    });
  }

  componentDidMount() {
    let self = this;
    this.initData();
    let count = 3,
      _state = {};
    let checkCountAndSetState = function(key, res) {
      _state[key] = res;
      count--;
      if (count == 0) {
        self.setInitialState(_state);
      }
    };

    self.fetchURLData('hr-masters/positions/_search', {}, [], function(res) {
      checkCountAndSetState('positionList', res['Position']);
    });
    self.fetchURLData('hr-masters/designations/_search', {}, [], function(res) {
      checkCountAndSetState('designationList', res['Designation']);
    });
    self.fetchURLData('egov-common-masters/departments/_search', {}, [], function(res) {
      checkCountAndSetState('departmentList', res['Department']);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.pathname != nextProps.history.location.pathname) {
      this.initData();
    }
  }

  search = (e, pageNumber) => {
    if (e) e.preventDefault();
    let self = this;
    self.props.setLoadingStatus('loading');
    var formData = { ...this.props.formData };
    for (var key in formData) {
      if (formData[key] !== '' && typeof formData[key] == 'undefined') delete formData[key];
    }

    formData.pageSize = self.state.pageSize;
    if (typeof pageNumber != undefined) formData.pageNumber = pageNumber;
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
        self.setState(
          {
            resultList: res.Employee,
            showResult: true,
            pageCount: res.Page ? res.Page.totalPages || 1 : 1,
          },
          function() {}
        );

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
    this.props.setRoute('/employee/' + this.props.match.params.actionName + '/' + row.id);
  };

  handlePageClick = data => {
    this.setState({ currentPage: Number(data.selected) + 1 });
    this.search('', Number(data.selected) + 1);
  };

  render() {
    let { mockData, moduleName, actionName, formData, fieldErrors, isFormValid } = this.props;
    let { search, handleChange, getVal, addNewCard, removeCard, rowClickHandler, handlePageClick, handleNavigation } = this;
    let { showResult, resultList, pageCount, designationList, departmentList, positionList, pageSize, currentPage } = this.state;

    const renderBody = function() {
      if (resultList.length) {
        return resultList.map(function(val, i) {
          return (
            <tr
              key={i}
              onClick={() => {
                handleNavigation(val);
              }}
              style={{ cursor: 'pointer' }}
            >
              <td>{currentPage == 1 ? i + 1 : (currentPage - 1) * pageSize + (i + 1)}</td>
              <td>{val.code}</td>
              <td>{val.name}</td>
              <td>{getNameById(departmentList, val.assignments[0].department)}</td>
              <td>{getNameById(designationList, val.assignments[0].designation)}</td>
              <td>{getNameById(positionList, val.assignments[0].position)}</td>
            </tr>
          );
        });
      }
    };

    const showPagination = function() {
      return (
        <div style={{ textAlign: 'center' }}>
          <ReactPaginate
            previousLabel={translate('pgr.lbl.previous')}
            nextLabel={translate('pgr.lbl.next')}
            breakLabel={<a href="">...</a>}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      );
    };

    const displayTableCard = function() {
      return (
        <Card className="uiCard">
          <CardHeader title={<strong> {translate('ui.table.title')} </strong>} />
          <CardText>
            <Table bordered responsive className="table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{translate('employee.searchEmployee.groups.fields.code')}</th>
                  <th>{translate('employee.searchEmployee.groups.fields.name')}</th>
                  <th>{translate('employee.searchEmployee.groups.fields.department')}</th>
                  <th>{translate('employee.searchEmployee.groups.fields.designation')}</th>
                  <th>{translate('employee.searchEmployee.groups.fields.position')}</th>
                </tr>
              </thead>
              <tbody>{renderBody()}</tbody>
            </Table>
            <br />
            {showPagination()}
          </CardText>
        </Card>
      );
    };

    return (
      <div className="SearchResult">
        <form
          onSubmit={e => {
            search(e);
          }}
        >
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName && (
              <ShowFields
                groups={mockData['employee.empsearch'].groups}
                noCols={mockData['employee.empsearch'].numCols}
                ui="google"
                handler={handleChange}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={mockData['employee.empsearch'].useTimestamp || false}
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
            {showResult && displayTableCard()}
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Report);
