import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import Api from '../../../api/api';
import { translate } from '../../common/common';

export default class UiWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      departments: [],
      buttons: [],
      employees: [],
      hide: false,
      status: '',
    };
  }

  componentDidMount() {
    this.initData(this.props);
  }

  initData = props => {
    let { item, workflowId } = props;

    Api.commonApiPost('egov-common-masters/departments/_search', {}, {}, null, false).then(
      function(res) {
        this.setState({
          departments: res && res.Department && res.Department.constructor == Array ? res.Department : [],
        });
      },
      function(err) {}
    );

    if (workflowId) {
      //Fetch workflow history
      Api.commonApiPost(
        'egov-common-workflows/history',
        {
          workflowId: workflowId,
        },
        {},
        null,
        true
      ).then(
        function(res) {
          this.setState({
            history: res && res.tasks && res.tasks.constructor == Array ? res.tasks : [],
          });
        },
        function(err) {}
      );

      //Fetch buttons
      Api.commonApiPost(
        'egov-common-workflows/process/_search',
        {
          id: workflowId,
        },
        {},
        null,
        false
      ).then(
        function(res) {
          if (
            res &&
            res.processInstance &&
            res.processInstance.attributes &&
            res.processInstance.attributes.validActions &&
            res.processInstance.attributes.validActions.values &&
            res.processInstance.attributes.validActions.values.length
          ) {
            var flg = 0;
            for (var j = 0; j < res.processInstance.attributes.validActions.values.length; j++) {
              if (
                res.processInstance.attributes.validActions.values[j].key.toLowerCase() == 'forward' ||
                res.processInstance.attributes.validActions.values[j].key.toLowerCase() == 'submit'
              ) {
                flg = 1;
              }
            }

            this.setState({
              buttons: res.processInstance.attributes.validActions.values,
              hide: flg == 1 ? false : true,
            });
          }

          if (res && res.processInstance) {
            Api.commonApiPost(
              '/egov-common-workflows/designations/_search',
              {
                businessKey: item.businessKey,
                approvalDepartmentName: '',
                departmentRule: '',
                currentStatus: res.processInstance.status,
                additionalRule: '',
                pendingAction: '',
                designation: '',
                amountRule: '',
              },
              {},
              null,
              false
            ).then(
              function(res3) {
                if (res3 && res3.length) {
                  var count = res3.length;
                  for (let i = 0; i < res3.length; i++) {
                    Api.commonApiPost(
                      '/hr-masters/designations/_search',
                      {
                        name: res3[i].name,
                      },
                      {},
                      null,
                      false
                    ).then(
                      function(res2) {
                        res3[i].id = res2.Designation && res2.Designation[0] ? res2.Designation[0].id : '-';
                        count--;
                        if (count == 0) {
                          this.setState({
                            designations: res3,
                            status: res.processInstance.status,
                          });
                        }
                      },
                      function(err) {}
                    );
                  }
                }
              },
              function(err) {}
            );
          }
        },
        function(err) {}
      );
    } else {
      Api.commonApiPost(
        '/egov-common-workflows/designations/_search',
        {
          businessKey: item.businessKey,
          approvalDepartmentName: '',
          departmentRule: '',
          currentStatus: '',
          additionalRule: '',
          pendingAction: '',
          designation: '',
          amountRule: '',
        },
        {},
        null,
        false
      ).then(
        function(res3) {
          if (res3 && res3.length) {
            var count = res3.length;
            for (let i = 0; i < res3.length; i++) {
              Api.commonApiPost(
                '/hr-masters/designations/_search',
                {
                  name: res3[i].name,
                },
                {},
                null,
                false
              ).then(
                function(res2) {
                  res3[i].id = res2.Designation && res2.Designation[0] ? res2.Designation[0].id : '-';
                  count--;
                  if (count == 0) {
                    this.setState({
                      designations: res3,
                    });
                  }
                },
                function(err) {}
              );
            }
          }
        },
        function(err) {}
      );
    }
  };

  getEmployee = item => {
    if (this.props.getVal(item.jsonPath.departmentPath) && this.props.getVal(item.jsonPath.designationPath)) {
      Api.commonApiPost(
        'hr-employee/employees/_search',
        {
          departmentId: this.props.getVal(item.jsonPath.departmentPath),
          designationId: this.props.getVal(item.jsonPath.designationPath),
        },
        {},
        null,
        false
      ).then(
        function(res) {
          this.setState({
            employees: res.Employee,
          });
        },
        function(err) {}
      );
    }
  };

  getPosition = id => {
    for (var i = 0; i < this.state.employees.length; i++) {
      if (this.state.employees[i].id == id) {
        if (this.state.employees[i].assignments && this.state.employees[i].assignments[0]) {
          return this.state.employees[i].assignments[0].position;
        }
        break;
      }
    }

    return '';
  };

  renderWFHistory = item => {
    let { history } = this.state;
    if (history && history.length) {
      return (
        <Table bordered responsive className="table-striped">
          <thead>
            <tr>
              <th>{translate('employee.ServiceHistory.fields.date')}</th>
              <th>{translate('wc.create.workflow.UpdatedBy')}</th>
              <th>{translate('collection.create.status')}</th>
              <th>{translate('wc.create.workflow.currentOwner')}</th>
              <th>{translate('reports.common.comments')}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((v, i) => {
              return (
                <tr key={i}>
                  <td>{v.createdDate || '-'}</td>
                  <td>{v.senderName || '-'}</td>
                  <td>{v.status || '-'}</td>
                  <td>{v.owner && v.owner.name ? v.owner.name : '-'}</td>
                  <td>{v.comments || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
  };

  renderWorkflowCard = item => {
    return (
      <div>
        {!this.state.hide && (
          <Row>
            <Col xs={12} md={3}>
              <SelectField
                className="custom-form-control-for-select"
                dropDownMenuProps={{
                  animated: true,
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                floatingLabelFixed={true}
                floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                floatingLabelText={
                  <span>
                    {translate('employee.Assignment.fields.department')}
                    <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                value={this.props.getVal(item.jsonPath.departmentPath)}
                onChange={(event, key, value) => {
                  this.getEmployee(item);
                  this.props.handler({ target: { value } }, item.jsonPath.departmentPath, true, item.requiredErrMsg, item.patternErrMsg);
                }}
              >
                {this.state.departments &&
                  this.state.departments.map(function(v, i) {
                    return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                  })}
              </SelectField>
            </Col>
            <Col xs={12} md={3}>
              <SelectField
                className="custom-form-control-for-select"
                floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                floatingLabelFixed={true}
                dropDownMenuProps={{
                  animated: true,
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                floatingLabelText={
                  <span>
                    {translate('employee.Assignment.fields.designation')}
                    <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                value={this.props.getVal(item.jsonPath.designationPath)}
                onChange={(event, key, value) => {
                  this.getEmployee(item);
                  this.props.handler({ target: { value } }, item.jsonPath.designationPath, true, item.requiredErrMsg, item.patternErrMsg);
                }}
              >
                {this.state.designations &&
                  this.state.designations.map(function(v, i) {
                    return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                  })}
              </SelectField>
            </Col>
            <Col xs={12} md={3}>
              <SelectField
                className="custom-form-control-for-select"
                floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
                floatingLabelFixed={true}
                dropDownMenuProps={{
                  animated: true,
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                floatingLabelText={
                  <span>
                    {translate('wc.create.groups.approvalDetails.fields.approver')}
                    <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                value={this.props.getVal(item.jsonPath.assigneePath)}
                onChange={(event, key, value) => {
                  this.props.handler(
                    { target: { value: this.getPosition(value) } },
                    item.jsonPath.assigneePath,
                    true,
                    item.requiredErrMsg,
                    item.patternErrMsg
                  );
                }}
              >
                {this.state.employees &&
                  this.state.employees.map(function(v, i) {
                    return <MenuItem value={v.id} key={i} primaryText={v.name} />;
                  })}
              </SelectField>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12} md={12}>
            <TextField
              className="custom-form-control-for-textfield"
              floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
              floatingLabelFixed={true}
              type="text"
              multiple={true}
              fullWidth={true}
              rows={3}
              floatingLabelText={translate('wc.create.groups.approvalDetails.fields.comments')}
              value={this.props.getVal(item.jsonPath.commentsPath)}
              onChange={e => {
                this.props.handler(e, item.jsonPath.commentsPath, true, item.requiredErrMsg, item.patternErrMsg);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  };

  renderButtons = item => {
    if (this.state.buttons && this.state.buttons.length) {
      return (
        <div style={{ textAlign: 'center' }}>
          {this.state.buttons.map(function(v, i) {
            return (
              <span>
                <RaisedButton
                  onClick={e => {
                    this.props.initiateWF(v, item, this.state.hide, this.state.status);
                  }}
                  label={v.name}
                  primary={true}
                />
                &nbsp;&nbsp;
              </span>
            );
          })}
        </div>
      );
    }
  };

  renderUiWorkflow = item => {
    switch (this.props.ui) {
      case 'google':
        return (
          <div>
            {this.renderWFHistory(item)}
            <br />
            {this.renderWorkflowCard(item)}
            <br />
            {this.renderButtons(item)}
          </div>
        );
    }
  };

  render() {
    return <div>{this.renderUiWorkflow()}</div>;
  }
}
