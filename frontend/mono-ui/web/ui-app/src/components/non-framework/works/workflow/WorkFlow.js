import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
      initialLoad:false
    };
  }
  componentDidMount() {
    // console.log('did mount');
    this.initCall();
  }
  componentWillReceiveProps(nextProps) {
    // console.log('receive props');
    if(!this.state.initialLoad){
      // console.log('receive props succeeds');
      this.initCall();
    }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   console.log(!(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
  //   return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  // }
  initCall = () => {
    // console.log('came to initcall');

    let initCall = [];

    initCall.push(Api.commonApiPost('egov-common-masters/departments/_search'));

    if (this.props.status && _.get(this.props.formData, `${this.props.stateId}`)){
      initCall.push(
        Api.commonApiPost('egov-common-workflows/process/_search', { id: _.get(this.props.formData, `${this.props.stateId}`) }, {}, false, true)
      );
    }

    Promise.all(initCall).then(responses => {
      // console.log(_.get(this.props.formData, `${this.props.stateId}`), responses);
      try {
        self.setState({
          workFlowDepartment: responses[0].Department,
          process: responses[1] && responses[1].processInstance,
          initialLoad:true
        });
        this.props.callbackFromParent(responses[1].processInstance);
      } catch (e) {
        // console.log('Error:', e);
      }
    });
  };
  loadDesignation = departmentId => {
    //clear designation and position
    if (_.get(this.props.formData, `${this.props.path}.designation`))
      this.props.handler({ target: { value: '' } }, `${this.props.path}.designation`, false, '');

    if (_.get(this.props.formData, `${this.props.path}.assignee`))
      this.props.handler({ target: { value: '' } }, `${this.props.path}.assignee`, false, '');

    this.setState({ workFlowDesignation: [] });

    let departmentObj = this.state.workFlowDepartment.find(x => x.id === departmentId);

    if (!departmentObj.name) {
      return;
    }

    // let cs = this.props.status ? _.get(this.props.formData, `${this.props.status}`) : '';

    Api.commonApiPost(
      'egov-common-workflows/designations/_search',
      {
        businessKey: 'AbstractEstimate',
        departmentRule: '',
        currentStatus: self.state.process && self.state.process.status || '',
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
              // self.props.handleError(err.message);
            }
          );
        }
      },
      function(err) {
        //  self.props.handleError(err.message);
      }
    );
  };
  loadPosition = designationId => {
    //clear position
    if (_.get(this.props.formData, `${this.props.path}.assignee`))
      this.props.handler({ target: { value: '' } }, `${this.props.path}.assignee`, false, '');

    this.setState({ workFlowPosition: [] });

    let departmentId = _.get(this.props.formData, `${this.props.path}.department`);
    Api.commonApiPost('/hr-employee/employees/_search', {
      departmentId: departmentId,
      designationId: designationId,
    }).then(
      response => {
        self.setState({ workFlowPosition: response.Employee });
        // self.props.handleChange(designationId, property, isRequired, pattern);
      },
      function(err) {
        // self.props.handleError(err.message);
      }
    );
  };
  // handleChange = (value, property, isRequired, pattern) => {
  //   //Check position or approval comments
  //   self.props.handleChange(value, property, isRequired, pattern);
  // }
  // renderActions = () => {
  //   var actionValues = this.state.process ? this.state.process.attributes.validActions.values : '';
  //   if(actionValues && actionValues.length > 0){
  //     return this.state.process.attributes.validActions.values.map((item, index)=>{
  //       //Forward button disable condition for invalid form
  //       let isDisable = item.name === 'Forward' ? !this.props.isFormValid : false;
  //       return(
  //         <RaisedButton key={index} id={item.name} disabled={isDisable} style={{margin:'15px 5px'}} label={item.name} primary={true} onClick={(e)=>{this.props.updateWorkFlow(item, this.state)}}/>
  //       )
  //     })
  //   }
  // }
  render() {
    self = this;
    // console.log(this.state);
    //console.log('Check State',this.state.process ? this.state.process.attributes.nextAction.code : 'process not there');
    return (
      <Card style={styles.marginStyle}>
        <CardHeader
          style={{ paddingTop: 4, paddingBottom: 0 }}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>{translate('works.create.groups.label.workflowDetails')}</div>}
        />
        <CardText>
          {/*this.state.process && this.state.process.attributes.nextAction.code !== 'END' && this.state.process.attributes.nextAction.code !== 'Pending For License Fee Collection' ?*/}
          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <SelectField
                fullWidth={true}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                maxHeight={200}
                hintText="Select"
                floatingLabelText={
                  <span>
                    {translate('tl.view.workflow.department')} <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                className="custom-form-control-for-select"
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={_.get(this.props.formData, `${this.props.path}.department`) || ''}
                id="department"
                onChange={(event, key, value) => {
                  this.props.handler({ target: { value } }, `${this.props.path}.department`, true, '');
                  this.loadDesignation(value);
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowDepartment &&
                  this.state.workFlowDepartment.map((department, index) => (
                    <MenuItem value={department.id} key={index} primaryText={department.name} />
                  ))}
              </SelectField>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <SelectField
                fullWidth={true}
                hintText="Select"
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                maxHeight={200}
                floatingLabelText={
                  <span>
                    {translate('tl.view.workflow.designation')} <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                className="custom-form-control-for-select"
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={_.get(this.props.formData, `${this.props.path}.designation`) || ''}
                id="designation"
                onChange={(event, key, value) => {
                  this.props.handler({ target: { value } }, `${this.props.path}.designation`, true, '');
                  this.loadPosition(value);
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowDesignation &&
                  this.state.workFlowDesignation.map((designation, index) => (
                    <MenuItem value={designation.id} key={index} primaryText={designation.name} />
                  ))}
              </SelectField>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <SelectField
                fullWidth={true}
                hintText="Select"
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                maxHeight={200}
                floatingLabelText={
                  <span>
                    {translate('tl.view.workflow.approver')} <span style={{ color: '#FF0000' }}> *</span>
                  </span>
                }
                className="custom-form-control-for-select"
                dropDownMenuProps={{
                  targetOrigin: { horizontal: 'left', vertical: 'bottom' },
                }}
                value={_.get(this.props.formData, `${this.props.path}.assignee`) || ''}
                id="assignee"
                onChange={(event, key, value) => {
                  this.props.handler({ target: { value } }, `${this.props.path}.assignee`, true, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {this.state.workFlowPosition &&
                  this.state.workFlowPosition.map((position, index) =>
                    position.assignments.map(
                      (assignment, idx) =>
                        assignment.isPrimary ? <MenuItem value={assignment.position} key={index} primaryText={position.name} /> : ''
                    )
                  )}
              </SelectField>
            </Col>
          </Row>
          {/*: ''}*/}
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
                className="custom-form-control-for-textarea"
                id="comments"
                value={_.get(this.props.formData, `${this.props.path}.comments`) || ''}
                onChange={(event, newValue) => {
                  this.props.handler({ target: { value: newValue } }, `${this.props.path}.comments`, false);
                }}
              />
            </Col>
            {/*<Col xs={12} sm={12} md={12} lg={12}>
            <div className="text-center">
              {this.renderActions()}
            </div>
          </Col>*/}
          </Row>
        </CardText>
      </Card>
    );
  }
}

export default WorkFlow;
