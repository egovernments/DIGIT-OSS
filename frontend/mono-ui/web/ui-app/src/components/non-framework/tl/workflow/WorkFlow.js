import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import styles from '../../../../styles/material-ui';
import { translate } from '../../../common/common';
import Api from '../../../../api/api';

var self;

class WorkFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workFlowDepartment: [],
      workFlowDesignation: [],
      workFlowPosition: [],
    };
  }
  componentDidMount() {
    if (this.props.viewLicense.applications) {
      // console.log('Did Mount',this.props.viewLicense.departmentId, this.props.viewLicense.designationId, this.props.viewLicense.positionId );
      this.initCall(this.props.viewLicense);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      // console.log('Will Receive Props',nextProps.viewLicense);
      this.initCall(nextProps.viewLicense);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(!(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  initCall = obj => {
    this.setState({
      departmentId: obj.departmentId,
      designationId: obj.designationId,
      positionId: obj.positionId,
      stateId: obj.applications[0].state_id,
      statusName: obj.applications[0].statusName,
      approvalComments: obj.approvalComments,
    });
    // console.log('came to init call:',obj.departmentId, this.state.workFlowDepartment.length);
    if (!obj.departmentId && this.state.workFlowDepartment.length === 0) {
      // console.log('try to load department');
      Api.commonApiPost('egov-common-masters/departments/_search').then(
        response => {
          self.setState({ workFlowDepartment: response.Department });
          self.worKFlowActions(obj);
        },
        function(err) {
          self.props.handleError(err.message);
        }
      );
    }
  };
  worKFlowActions = obj => {
    // console.log('came to workflow actions');
    if (this.state.stateId && !this.props.departmentId) {
      // console.log('try to load workflow process:', self.state.stateId, obj.applications[0].state_id);
      if (this.state.stateId === obj.applications[0].state_id) {
        // console.log('workflow process:');
        Api.commonApiPost('egov-common-workflows/process/_search', { id: obj.applications[0].state_id }, {}, false, true).then(
          response => {
            // console.log('process status:',response.processInstance.status);
            self.setState({ process: response.processInstance });
          },
          function(err) {
            self.props.handleError(err.message);
          }
        );
      }
    }
  };
  handleDesignation = (departmentId, property, isRequired, pattern) => {
    // Load designation based on department
    this.setState({
      workFlowDesignation: [],
      workFlowPosition: [],
    });

    if (!departmentId) {
      this.props.handleChange('', 'departmentId', isRequired, pattern);
      return;
    } else {
      self.props.handleChange(departmentId, property, isRequired, pattern);
    }

    this.props.handleChange('', 'designationId', isRequired, pattern);
    this.props.handleChange('', 'positionId', isRequired, pattern);

    let departmentObj = this.state.workFlowDepartment.find(x => x.id === departmentId);
    Api.commonApiPost(
      'egov-common-workflows/designations/_search',
      {
        businessKey: 'New Trade License',
        departmentRule: '',
        currentStatus: self.state.process.status,
        amountRule: '',
        additionalRule: '',
        pendingAction: '',
        approvalDepartmentName: departmentObj.name,
        designation: '',
      },
      {},
      false,
      false
    ).then(
      res => {
        for (var i = 0; i < res.length; i++) {
          Api.commonApiPost('hr-masters/designations/_search', {
            name: res[i].name,
          }).then(
            response => {
              // response.Designation.unshift({id:-1, name:'None'});
              self.setState({
                ...self.state,
                workFlowDesignation: [...self.state.workFlowDesignation, ...response.Designation],
              });
            },
            function(err) {
              self.props.handleError(err.message);
            }
          );
        }
      },
      function(err) {
        self.props.handleError(err.message);
      }
    );
  };
  handlePosition = (designationId, property, isRequired, pattern) => {
    this.setState({
      workFlowPosition: [],
    });
    self.props.handleChange('', 'positionId', isRequired, pattern);
    // Load position based on designation and department

    if (!designationId) {
      this.props.handleChange('', 'designationId', isRequired, pattern);
      return;
    }

    Api.commonApiPost('/hr-employee/employees/_search', {
      departmentId: self.state.departmentId,
      designationId: designationId,
    }).then(
      response => {
        self.setState({ workFlowPosition: response.Employee });
        self.props.handleChange(designationId, property, isRequired, pattern);
      },
      function(err) {
        self.props.handleError(err.message);
      }
    );
  };
  handleChange = (value, property, isRequired, pattern) => {
    //Check position or approval comments
    self.props.handleChange(value, property, isRequired, pattern);
  };
  renderActions = () => {
    var actionValues = this.state.process ? this.state.process.attributes.validActions.values : '';
    if (actionValues && actionValues.length > 0) {
      return this.state.process.attributes.validActions.values.map((item, index) => {
        //Forward button disable condition for invalid form
        let isDisable = item.name === 'Forward' ? !this.props.isFormValid : false;
        return (
          <RaisedButton
            key={index}
            id={item.name}
            disabled={isDisable}
            style={{ margin: '15px 5px' }}
            label={item.name}
            primary={true}
            onClick={e => {
              this.props.updateWorkFlow(item, this.state);
            }}
          />
        );
      });
    }
  };
  render() {
    self = this;
    //console.log('Check State',this.state.process ? this.state.process.attributes.nextAction.code : 'process not there');
    return (
      <div>
        {this.state.process &&
        this.state.process.attributes.nextAction.code !== 'END' &&
        this.state.process.attributes.nextAction.code !== 'Pending For License Fee Collection' ? (
          <Row>
            <Col xs={12} sm={6} md={4} lg={3}>
              <SelectField
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('tl.view.workflow.department')}
                maxHeight={200}
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={this.state.departmentId || ''}
                id="approverDepartment"
                onChange={(event, key, value) => {
                  this.handleDesignation(value, 'departmentId', true, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowDepartment !== undefined
                  ? this.state.workFlowDepartment.map((department, index) => (
                      <MenuItem value={department.id} key={index} primaryText={department.name} />
                    ))
                  : ''}
              </SelectField>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <SelectField
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('tl.view.workflow.designation')}
                maxHeight={200}
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={this.state.designationId || ''}
                id="approverDesignation"
                onChange={(event, key, value) => {
                  this.handlePosition(value, 'designationId', true, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowDesignation !== undefined
                  ? this.state.workFlowDesignation.map((designation, index) => (
                      <MenuItem value={designation.id} key={index} primaryText={designation.name} />
                    ))
                  : ''}
              </SelectField>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <SelectField
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={translate('tl.view.workflow.approver')}
                maxHeight={200}
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={this.state.positionId || ''}
                id="approver"
                onChange={(event, key, value) => {
                  this.handleChange(value, 'positionId', true, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowPosition !== undefined
                  ? this.state.workFlowPosition.map((position, index) =>
                      position.assignments.map(
                        (assignment, idx) =>
                          assignment.isPrimary ? (
                            <MenuItem
                              value={assignment.position + '~' + position.name + '~' + assignment.designation}
                              key={index}
                              primaryText={position.name}
                            />
                          ) : (
                            ''
                          )
                      )
                    )
                  : ''}
              </SelectField>
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <TextField
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              floatingLabelText={translate('tl.view.workflow.comments')}
              fullWidth={true}
              multiLine={true}
              rows={2}
              rowsMax={4}
              maxLength="500"
              value={this.state.approvalComments || ''}
              id="comments"
              onChange={(event, newValue) => {
                this.handleChange(newValue, 'approvalComments', false, /^.[^]{0,500}$/);
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="text-center">{this.renderActions()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default WorkFlow;
