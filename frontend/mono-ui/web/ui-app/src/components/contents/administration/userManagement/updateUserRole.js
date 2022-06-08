import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Subheader from 'material-ui/Subheader';
import Api from '../../../../api/api';
import { translate } from '../../../common/common';
const constants = require('../../../common/constants');

const styles = {
  headerStyle: {
    fontSize: 19,
  },
  marginStyle: {
    margin: '15px',
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

var _this;

class updateUserRole extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    _this = this;
    let { initForm } = this.props;
    initForm();
    let tenantId = localStorage.getItem('tenantId') || 'default';
    _this.props.setLoadingStatus('loading');
    Api.commonApiPost('/access/v1/roles/_search').then(
      function(response) {
        _this.props.setLoadingStatus('loading');
        var ALL_ROLES = response.roles.filter(function(el) {
          return el.code !== constants.ROLE_CITIZEN;
        });
        _this.setState({ allRoles: ALL_ROLES });
        Api.commonApiPost('/user/v1/_search', {}, { tenantId: tenantId, id: [_this.props.match.params.userId] }).then(
          function(response) {
            _this.setState({ userName: response.user[0].userName });
            _this.setState({ name: response.user[0].name });
            _this.setState({ userRoles: response.user[0].roles });
            _this.setState({ userResponse: response.user[0] });
            let userArray = [];
            response.user[0].roles.map((roles, index) => {
              userArray.push(roles.code);
            });
            _this.props.handleChange(userArray, 'allRoles', false, '');
            _this.props.handleChange(userArray, 'userRoles', false, '');
            _this.props.setLoadingStatus('hide');
          },
          function(err) {
            _this.props.setLoadingStatus('hide');
            _this.handleError(err.message);
          }
        );
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  }

  renderChip(data) {
    return (
      <Chip key={data.code} onRequestDelete={() => this.handleRequestDelete(data.code)} style={styles.chip}>
        {data.name}
      </Chip>
    );
  }

  updateUserRole = value => {
    let userArray = [];
    userArray = [...this.props.updateUserRole.userRoles];
    if (value.length > 0) {
      let currentval = value.slice(-1).pop();
      userArray.push(value.slice(-1).pop());
      var obj = this.state.allRoles.filter(function(el) {
        return el.code == currentval;
      });
      var userroleobj = this.state.userRoles.filter(function(el) {
        return el.code == currentval;
      });
      if (userroleobj[0] === undefined) {
        this.setState({
          userRoles: this.state.userRoles.concat([obj[0]]),
        });
        this.props.handleChange(userArray, 'userRoles', false, '');
      } else {
        let removekey = _.difference(this.props.updateUserRole.allRoles, value);
        this.removeUserRole(removekey[0]);
      }
    } else {
      let removekey = _.difference(this.props.updateUserRole.allRoles, value);
      this.removeUserRole(removekey[0]);
    }
  };

  removeUserRole = removekey => {
    var index = this.props.updateUserRole.userRoles.indexOf(removekey);
    if (index !== -1) {
      this.props.updateUserRole.userRoles.splice(index, 1);
      this.props.handleChange(this.props.updateUserRole.userRoles, 'userRoles', false, '');
      // console.log('removed user role:', removekey, index);
    }
    var filteredPeople = this.state.userRoles.filter(item => item.code !== removekey);
    this.setState({
      userRoles: filteredPeople,
    });
  };

  handleRequestDelete = code => {
    var allRoleIndex = this.props.updateUserRole.allRoles.indexOf(code);
    if (allRoleIndex !== -1) {
      this.props.updateUserRole.allRoles.splice(allRoleIndex, 1);
      this.props.handleChange(this.props.updateUserRole.allRoles, 'allRoles', false, '');
      // console.log('removed all role:', code, allRoleIndex);
      this.removeUserRole(code);
    }
  };

  handleError = msg => {
    let { toggleDailogAndSetText, toggleSnackbarAndSetText } = this.props;
    toggleDailogAndSetText(true, msg);
  };

  update = () => {
    _this.props.setLoadingStatus('loading');
    let userRolesArray = this.props.updateUserRole.userRoles;
    let tenantId = localStorage.getItem('tenantId') || 'default';
    var roles = [];
    if (userRolesArray.length > 0) {
      //array exists
      for (let i = 0; i < userRolesArray.length; i++) {
        let obj = {};
        obj['code'] = userRolesArray[i];
        roles.push(obj);
      }
    } else {
      roles = [];
      //array empty - empty roles
    }
    var userObj = { ...this.state.userResponse };
    userObj.tenantId = tenantId;
    userObj.roles = roles;
    userObj.dob = null;
    userObj.bloodGroup = null;
    Api.commonApiPost('/user/users/' + this.props.match.params.userId + '/_updatenovalidate', {}, { user: userObj }).then(
      function(response) {
        _this.props.setLoadingStatus('hide');
        let msg = `${translate('core.lbl.urmapping')} ${translate('core.lbl.updatedsuccessful')}`;
        _this.handleError(msg);
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  search = () => {
    let { setRoute } = this.props;
    setRoute('/administration/searchUserRole');
  };

  render() {
    let { update, search, handleTouchTap } = this;
    let { updateUserRole, handleChange, isFormValid } = this.props;
    return (
      <div className="userRole">
        <Card style={styles.marginStyle}>
          <CardHeader
            style={{ paddingBottom: 0 }}
            title={
              <div style={styles.headerStyle}>
                {' '}
                {translate('core.lbl.urinfo')} : {this.state.userName} ({this.state.name})
              </div>
            }
          />
          <CardText style={{ paddingTop: 0 }}>
            <Grid>
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <SelectField
                    fullWidth={true}
                    maxHeight={300}
                    floatingLabelText={translate('core.lbl.allroles')}
                    multiple={true}
                    value={updateUserRole.allRoles ? updateUserRole.allRoles : ''}
                    onChange={(event, key, value) => {
                      handleChange(value, 'allRoles', false, '');
                      this.updateUserRole(value);
                    }}
                  >
                    {this.state.allRoles
                      ? this.state.allRoles.map((allRoles, index) => (
                          <MenuItem
                            value={allRoles.code}
                            key={index}
                            primaryText={allRoles.name}
                            insetChildren={true}
                            checked={updateUserRole.allRoles && updateUserRole.allRoles.indexOf(allRoles.code) > -1}
                          />
                        ))
                      : ''}
                  </SelectField>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Subheader>{translate('core.lbl.assgnedroles')}</Subheader>
                  <div style={styles.wrapper}>{this.state.userRoles ? this.state.userRoles.map(this.renderChip, this) : ''}</div>
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
        <div className="text-center">
          <RaisedButton
            style={{ margin: '15px 5px' }}
            onTouchTap={e => update(e)}
            disabled={!isFormValid}
            label={translate('pgr.lbl.update')}
            primary={true}
          />
          <RaisedButton style={{ margin: '15px 5px' }} onTouchTap={e => search(e)} label={translate('core.lbl.search')} primary={true} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //console.log(JSON.stringify(state.form.form));
  return {
    updateUserRole: state.form.form,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value,
      isRequired,
      pattern,
      errorMsg,
    });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(updateUserRole);
