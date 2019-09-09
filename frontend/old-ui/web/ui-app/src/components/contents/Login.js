import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import { Redirect } from 'react-router-dom';
import Api from '../../api/api';
import { translate } from '../common/common';
import IconButton from 'material-ui/IconButton';
import $ from 'jquery';
var axios = require('axios');

window.counter = 0;

const hideAutoFillColorStyle = {
  WebkitBoxShadow: '0 0 0 1000px white inset',
};
const hintStyle = { zIndex: '1' };

const styles = {
  errorStyle: {
    color: red500,
  },
  customWidth: {
    width: 150,
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
  checkbox: {
    marginBottom: 16,
    marginTop: 24,
  },
  floatingIconButton: {
    marginRight: 20,
    float: 'left',
  },
  marginTop: {
    marginTop: 30,
  },
  buttonTopMargin: {
    marginTop: 20,
  },
  floatLeft: {
    float: 'left',
  },
  fullWidth: {
    width: '100%',
  },
  iconSize: {
    fontSize: 24,
    marginRight: 5,
    marginLeft: 5,
  },
  moreDetailsCont: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  marginBottom: {
    marginBottom: 30,
  },
};

class Login extends Component {
  static isPrivate = false;

  constructor(props) {
    super(props);
    this.state = {
      isActive: {
        checked: false,
      },
      localeready: false,
      locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'en_IN',
      dataSource: [],
      errorMsg: '',
      open: false,
      open1: false,
      mobNo: '',
      mobErrorMsg: '',
      srn: '',
      crtNo: '',
      otp: '',
      otpErrorMsg: '',
      hideOtp: false,
      pwdErrorMsg: '',
      newPwd: '',
      pwd: '',
      uuid: '',
      open2: false,
      open3: false,
      optSent: false,
      signUpObject: {
        userName: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        emailId: '',
        name: '',
      },
      signUpErrorMsg: '',
    };
    this.loginRequest = this.loginRequest.bind(this);
    this.showPasswordModal = this.showPasswordModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.sendRecovery = this.sendRecovery.bind(this);
    this.validateOTP = this.validateOTP.bind(this);
    this.generatePassword = this.generatePassword.bind(this);
    this.handleSignUpModalOpen = this.handleSignUpModalOpen.bind(this);
    this.generateSignUpOTP = this.generateSignUpOTP.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  componentDidMount() {
    let { initForm, setLoadingStatus, setHome } = this.props;
    initForm();
    setLoadingStatus('loading');
    setHome(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userRequest');
    localStorage.removeItem('type');
    localStorage.removeItem('id');
    this.handleLocaleChange(this.state.locale);
    //if(localStorage.reload) {
    localStorage.removeItem('reload');
    this.props.forceLogout();
    //}

    if (window.location.href.indexOf('?') > -1 && window.location.href.indexOf('signup') > -1) {
      this.handleSignUpModalOpen();
    }
  }

  handleLocaleChange = value => {
    //console.log(value);
    let { setLoadingStatus } = this.props;
    var self = this;
    var tenantId = this.props.match.params.tenantId || 'default';
    localStorage.setItem('tenantId', tenantId);
    Api.commonApiGet('/localization/messages', { locale: value, tenantId: tenantId }, {}, true).then(
      function(response) {
        self.setState({ locale: value });
        self.setState({ localeready: true });
        localStorage.setItem('locale', value);
        localStorage.setItem('lang_response', JSON.stringify(response.messages));
        setLoadingStatus('hide');
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message);
        setLoadingStatus('hide');
      }
    );
  };

  loginRequest(e) {
    var current = this;
    this.props.setLoadingStatus('loading');
    e.preventDefault();
    var self = this,
      props = this.props,
      flag = 0;
    let { setActionList } = this.props;
    self.setState({
      errorMsg: '',
    });
    var instance = axios.create({
      baseURL: window.location.origin,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0',
      },
    });

    var params = new URLSearchParams();
    params.append('username', props.credential.username);
    params.append('password', props.credential.password);
    params.append('grant_type', 'password');
    params.append('scope', 'read');
    params.append('userType', 'EMPLOYEE');
    params.append('tenantId', typeof props.match.params.tenantId != 'undefined' ? props.match.params.tenantId : 'default');

    instance
      .post('/user/oauth/token', params)
      .then(function(response) {
        localStorage.setItem('auth-token', response.data.access_token);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userRequest', JSON.stringify(response.data.UserRequest));
        localStorage.setItem('auth', response.data.access_token);
        localStorage.setItem('type', response.data.UserRequest.type);
        localStorage.setItem('id', response.data.UserRequest.id);
        localStorage.setItem('tenantId', response.data.UserRequest.tenantId);
        localStorage.setItem('refresh-token', response.data.refresh_token);
        localStorage.setItem('expires-in', response.data.expires_in);

        window.timeObject = setInterval(function() {
          // console.log(window.counter);
          window.counter++;
          if (window.counter == parseInt(localStorage.getItem('expires-in')) - 300) {
            var instanceTwo = axios.create({
              baseURL: window.location.origin,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0',
              },
            });

            var paramsTwo = new URLSearchParams();
            paramsTwo.append('grant_type', 'refresh_token');
            paramsTwo.append('tenantId', localStorage.getItem('tenantId'));
            paramsTwo.append('refresh_token', localStorage.getItem('refresh-token'));

            instanceTwo.post('/user/oauth/token', paramsTwo).then(function(responseTwo) {
              localStorage.setItem('auth-token', responseTwo.data.access_token);
              localStorage.setItem('token', responseTwo.data.access_token);
              localStorage.setItem('userRequest', JSON.stringify(responseTwo.data.UserRequest));
              localStorage.setItem('auth', responseTwo.data.access_token);
              localStorage.setItem('type', responseTwo.data.UserRequest.type);
              localStorage.setItem('id', responseTwo.data.UserRequest.id);
              localStorage.setItem('tenantId', responseTwo.data.UserRequest.tenantId);
              localStorage.setItem('refresh-token', responseTwo.data.refresh_token);
              localStorage.setItem('expires-in', responseTwo.data.expires_in);
              window.counter = 0;
            });
          }
        }, 1000);

        if (window.location.href.indexOf('?') > -1 && window.location.href.indexOf('link') > -1) {
          var query = window.location.href.split('?')[1].split('&');
          props.login(false, response.data.access_token, response.data.UserRequest, true);
          for (var i = 0; i < query.length; i++) {
            if (query[i].indexOf('link') > -1) {
              switch (query[i].split('=')[1]) {
                case 'waternodue':
                  self.props.setRoute('/non-framework/citizenServices/no-dues/search/wc');
                  break;
                case 'propertytaxextract':
                  self.props.setRoute('/non-framework/citizenServices/no-dues/extract/pt');
                  break;
                case 'propertytaxdue':
                  self.props.setRoute('/non-framework/citizenServices/no-dues/search/pt');
                  break;
              }
            }
          }
        } else props.login(false, response.data.access_token, response.data.UserRequest);

        let roleCodes = [];
        for (var i = 0; i < response.data.UserRequest.roles.length; i++) {
          roleCodes.push(response.data.UserRequest.roles[i].code);
        }
        //old menu item api access/v1/actions/_get
        Api.commonApiPost(
          'access/v1/actions/mdms/_get',
          {},
          {
            tenantId: response.data.UserRequest.tenantId,
            roleCodes,
            enabled: true,
            actionMaster: 'actions-test',
          }
        ).then(
          function(response) {
            var actions = response.actions || [];
            var roles = JSON.parse(localStorage.userRequest).roles;
            actions.unshift({
              id: 12299,
              name: 'SearchRequest',
              url: '/search/service/requests',
              displayName: 'Search Service Requests',
              orderNumber: 35,
              queryParams: '',
              parentModule: 75,
              enabled: true,
              serviceCode: '',
              tenantId: null,
              createdDate: null,
              createdBy: null,
              lastModifiedDate: null,
              lastModifiedBy: null,
              path: 'Service Request.Requests.Search',
            });

            // $.ajax({
            //     url: "https://raw.githubusercontent.com/abhiegov/test/master/reportList.json?timestamp="+new Date().getTime(),
            //     success: function(res) {
            //         var list = JSON.parse(res);
            //         if(list.length == 0) {
            //           for(var i=0; i<actions.length; i++) {
            //             // if(actions[i].path == "Grievance Redressal.Reports.Ageing Report") {
            //             //   actions.splice(i, 1);
            //             //   break;
            //             // }
            //           }
            //         }
            //         localStorage.setItem("actions", JSON.stringify(actions));
            //         setActionList(actions);
            //     },
            //     error: function() {
            //         localStorage.setItem("actions", JSON.stringify(actions));
            //         setActionList(actions);
            //     }
            // })
            localStorage.setItem('actions', JSON.stringify(actions));
            setActionList(actions);
          },
          function(err) {
            //old menu item api access/v1/actions/_get
            Api.commonApiPost(
              'access/v1/actions/_get',
              {},
              {
                tenantId: response.data.UserRequest.tenantId,
                roleCodes,
                enabled: true,
              }
            ).then(
              function(response) {
                var actions = response.actions || [];
                var roles = JSON.parse(localStorage.userRequest).roles;
                actions.unshift({
                  id: 12299,
                  name: 'SearchRequest',
                  url: '/search/service/requests',
                  displayName: 'Search Service Requests',
                  orderNumber: 35,
                  queryParams: '',
                  parentModule: 75,
                  enabled: true,
                  serviceCode: '',
                  tenantId: null,
                  createdDate: null,
                  createdBy: null,
                  lastModifiedDate: null,
                  lastModifiedBy: null,
                  path: 'Service Request.Requests.Search',
                });

                // $.ajax({
                //     url: "https://raw.githubusercontent.com/abhiegov/test/master/reportList.json?timestamp="+new Date().getTime(),
                //     success: function(res) {
                //         var list = JSON.parse(res);
                //         if(list.length == 0) {
                //           for(var i=0; i<actions.length; i++) {
                //             // if(actions[i].path == "Grievance Redressal.Reports.Ageing Report") {
                //             //   actions.splice(i, 1);
                //             //   break;
                //             // }
                //           }
                //         }
                //         localStorage.setItem("actions", JSON.stringify(actions));
                //         setActionList(actions);
                //     },
                //     error: function() {
                //         localStorage.setItem("actions", JSON.stringify(actions));
                //         setActionList(actions);
                //     }
                // })
                localStorage.setItem('actions', JSON.stringify(actions));
                setActionList(actions);
              },
              function(err) {
                console.log(err);
              }
            );
          }
        );
      })
      .catch(function(response) {
        current.props.setLoadingStatus('hide');
        self.setState({
          errorMsg: translate('login.error.msg'),
        });
      });
  }

  handleCheckBoxChange = prevState => {
    this.setState(prevState => {
      prevState.isActive.checked = !prevState.isActive.checked;
    });
  };

  handleUpdateInput = value => {
    this.setState({
      dataSource: [value, value + value, value + value + value],
    });
  };

  showPasswordModal() {
    this.setState({
      open: true,
      hideOtp: false,
    });
  }

  handleClose(name) {
    this.setState({
      [name]: false,
    });
  }

  handleStateChange(e, name, pattern, errorMsg) {
    pattern = pattern || '';
    if (/\./.test(name)) {
      let errorText = '';
      //signup validation
      var names = name.split('.');
      if (pattern.toString().trim().length > 0) {
        if (pattern.test(e.target.value)) {
          //pattern validation succeeded
          errorText = '';
        } else {
          //pattern validation failed
          errorText = errorMsg;
        }
      }
      this.setState({
        mobErrorMsg: '',
        [names[0]]: {
          ...this.state[names[0]],
          [names[1]]: e.target.value,
          [names[1] + 'Msg']: errorText,
        },
      });
    } else {
      this.setState({
        mobErrorMsg: '',
        [name]: e.target.value,
      });
    }
  }

  sendRecovery(type) {
    var self = this;
    if (!self.state.mobNo)
      return self.setState({
        mobErrorMsg: translate('pgr.lbl.loginreqrd'),
      });
    else
      self.setState({
        mobErrorMsg: '',
      });

    if (type == 'link') {
    } else {
      var rqst = {
        mobileNumber: self.state.mobNo,
        tenantId: localStorage.getItem('tenantId') || 'default',
      };

      Api.commonApiPost('user-otp/v1/_send', {}, { otp: rqst }).then(
        function(response) {
          self.setState(
            {
              open: false,
            },
            function() {
              self.setState({
                open1: true,
              });
            }
          );
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message);
        }
      );
    }
  }

  searchSRN = (e, isCertificate = false) => {
    let { setRoute, setHome } = this.props;
    if (this.state.srn.trim() || this.state.crtNo.trim()) {
      if (isCertificate) {
        setRoute('/service/request/view/' + encodeURIComponent(this.state.crtNo.trim()) + '/true');
        setHome(true);
      } else {
        setRoute('/service/request/view/' + encodeURIComponent(this.state.srn.trim()) + '/false');
        setHome(true);
      }
    }
    //this.props.toggleSnackbarAndSetText(true, "Feature Coming Soon. . .");
  };

  validateOTP() {
    var self = this;
    if (!self.state.otp) {
      return self.setState({
        otpErrorMsg: translate('pgr.lbl.otprqrd'),
      });
    } else {
      self.setState({
        otpErrorMsg: '',
      });
    }

    var rqst = {
      tenantId: localStorage.getItem('tenantId') || 'default',
      otp: self.state.otp,
      identity: self.state.mobNo,
    };
    Api.commonApiPost('otp/v1/_validate', {}, { otp: rqst }).then(
      function(response) {
        self.setState({
          hideOtp: true,
          uuid: response.otp.UUID,
        });
      },
      function(err) {
        self.props.toggleSnackbarAndSetText(true, err.message);
      }
    );
  }

  handleSignUpModalOpen() {
    this.setState({
      open3: !this.state.open3,
      optSent: false,
    });
  }

  generatePassword() {
    var self = this;
    if (!self.state.pwd || !self.state.newPwd) {
      return self.setState({
        pwdErrorMsg: translate('Password field is required.'),
      });
    } else {
      self.setState({
        pwdErrorMsg: '',
      });
    }

    if (self.state.pwd != self.state.newPwd) {
      return self.setState({
        pwdErrorMsg: translate('core.error.password.confirmpassword.same'),
      });
    } else {
      var rqst = {
        userName: self.state.mobNo,
        newPassword: self.state.newPwd,
        tenantId: localStorage.getItem('tenantId') || 'default',
        otpReference: self.state.uuid,
      };

      Api.commonApiPost('user/password/nologin/_update', {}, { ...rqst }, true).then(
        function(response) {
          self.setState({
            open1: false,
            mobNo: '',
            pwd: '',
            newPwd: '',
            open2: true,
          });
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message);
        }
      );
    }
  }

  generateSignUpOTP() {
    var self = this;
    if (self.state.signUpObject.mobileNumber.length != 10) {
      self.setState({
        signUpErrorMsg: translate('core.lbl.enter.mobilenumber'),
      });
    } else if (self.state.signUpObject.password != self.state.signUpObject.confirmPassword) {
      self.setState({
        signUpErrorMsg: translate('core.error.password.confirmpassword.same'),
      });
    } else {
      var signUpObject = Object.assign({}, self.state.signUpObject);
      delete signUpObject.confirmPassword;
      signUpObject.userName = signUpObject.mobileNumber;
      //Generate OTP
      self.props.setLoadingStatus('loading');
      Api.commonApiPost(
        'user-otp/v1/_send',
        {},
        {
          otp: {
            mobileNumber: signUpObject.mobileNumber,
            tenantId: localStorage.getItem('tenantId') || 'default',
          },
        }
      ).then(
        function(response) {
          self.setState({
            signUpErrorMsg: '',
            optSent: true,
          });
          self.props.setLoadingStatus('hide');
        },
        function(err) {
          self.props.toggleSnackbarAndSetText(true, err.message);
          self.props.setLoadingStatus('hide');
        }
      );
    }
  }

  signUp() {
    var self = this;
    if (!self.state.signUpObject.otp) {
      self.setState({
        signUpErrorMsg: translate('pgr.lbl.otprqrd'),
      });
    } else {
      self.props.setLoadingStatus('loading');
      Api.commonApiPost(
        'otp/v1/_validate',
        {},
        {
          otp: {
            tenantId: localStorage.getItem('tenantId') || 'default',
            otp: self.state.signUpObject.otp,
            identity: self.state.signUpObject.mobileNumber,
          },
        }
      ).then(
        function(response) {
          var user = Object.assign({}, self.state.signUpObject);
          delete user.confirmPassword;
          user.userName = user.mobileNumber;
          user.otpReference = response.otp.UUID;
          user.tenantId = localStorage.getItem('tenantId') || 'default';
          Api.commonApiPost(
            'user/citizen/_create',
            {},
            {
              User: user,
            }
          ).then(
            function(response) {
              self.props.setLoadingStatus('hide');

              self.setState({
                open3: false,
                signUpErrorMsg: '',
                optSent: false,
              });
              self.props.toggleDailogAndSetText(true, translate('core.account.created.successfully'));
            },
            function(err) {
              self.props.setLoadingStatus('hide');
              self.props.toggleDailogAndSetText(true, err.message);
            }
          );
        },
        function(err) {
          self.props.setLoadingStatus('hide');
          self.props.toggleDailogAndSetText(true, err.message);
        }
      );
    }
  }

  openAnonymousComplaint = () => {
    let { setRoute, setHome } = this.props;
    setRoute('/pgr/createGrievance');
    setHome(true);
  };

  openServices = () => {
    this.props.toggleSnackbarAndSetText(true, 'Feature Coming Soon. . .');
  };

  isAllFields = () => {
    let { signUpObject } = this.state;
    if (signUpObject.mobileNumber && signUpObject.name && signUpObject.password && signUpObject.confirmPassword && signUpObject.otp) {
      if (this.passwordValidation() === '') {
        return true;
      } else {
        return false;
      }
    } else return false;
  };

  hasAllFields = () => {
    let { signUpObject } = this.state;
    let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (
      signUpObject.mobileNumber &&
      signUpObject.name &&
      signUpObject.password &&
      signUpObject.confirmPassword &&
      pattern.test(signUpObject.password) &&
      signUpObject.password == signUpObject.confirmPassword &&
      (!signUpObject.emailId ||
        (signUpObject.emailId &&
          /^(?=.{6,64}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            signUpObject.emailId
          )))
    ) {
      return true;
    } else {
      return false;
    }
  };

  passwordValidation = () => {
    let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (this.state.signUpObject.password.trim().length > 0 && this.state.signUpObject.confirmPassword.trim().length > 0) {
      if (pattern.test(this.state.signUpObject.password) && this.state.signUpObject.password === this.state.signUpObject.confirmPassword) {
        return '';
      } else {
        return translate('pgr.lbl.pswdmatch');
      }
    }
  };

  handleClearForm = () => {
    this.setState({
      signUpObject: {
        userName: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        emailId: '',
        name: '',
      },
      signUpErrorMsg: '',
    });
  };

  searchGrievanceSRN = () => {
    let { setRoute, setHome } = this.props;
    if (this.state.searchGrievanceSRN && this.state.searchGrievanceSRN.trim()) {
      setRoute('/pgr/viewGrievance/' + encodeURIComponent(this.state.searchGrievanceSRN.trim()));
      setHome(true);
    }
  };

  render() {
    //console.log("IN LOGIN");
    let { login, credential, handleChange, isFormValid, fieldErrors, history, tenantInfo } = this.props;
    let {
      loginRequest,
      showPasswordModal,
      handleClose,
      handleStateChange,
      sendRecovery,
      searchSRN,
      validateOTP,
      generatePassword,
      handleSignUpModalOpen,
      generateSignUpOTP,
      signUp,
    } = this;
    let {
      errorMsg,
      open,
      mobErrorMsg,
      mobNo,
      srn,
      crtNo,
      otp,
      otpErrorMsg,
      open1,
      open2,
      hideOtp,
      pwdErrorMsg,
      pwd,
      newPwd,
      open3,
      optSent,
      signUpObject,
    } = this.state;
    // if (token) {
    //     return (
    //       <Redirect to="/dashboard"/>
    //     )
    // } else {

    const showError = function() {
      if (errorMsg) {
        return <p className="text-danger">{errorMsg}</p>;
      }
    };

    const showForOTP = function() {
      if (!hideOtp) {
        return (
          <TextField
            floatingLabelText={translate('core.lbl.enter.OTP')}
            style={styles.fullWidth}
            errorText={otpErrorMsg}
            id="otp"
            value={otp}
            onChange={e => handleStateChange(e, 'otp')}
          />
        );
      }
    };

    const showForPwd = function() {
      if (hideOtp) {
        return (
          <div>
            <TextField
              floatingLabelText="New Password"
              style={styles.fullWidth}
              errorText={pwdErrorMsg}
              id="otp"
              value={pwd}
              onChange={e => handleStateChange(e, 'pwd')}
            />
            <TextField
              floatingLabelText="Confirm Password"
              style={styles.fullWidth}
              errorText={pwdErrorMsg}
              id="otp"
              value={newPwd}
              onChange={e => handleStateChange(e, 'newPwd')}
            />
          </div>
        );
      }
    };

    return (
      <div>
        {this.state.localeready ? (
          <div className="Login">
            <Grid>
              <Row>
                <Col lg={12}>
                  <SelectField
                    floatingLabelText={translate('core.lbl.setlanguage')}
                    value={this.state.locale}
                    onChange={(event, key, payload) => {
                      this.props.setLoadingStatus('loading');
                      this.setState({ localeready: false });
                      this.handleLocaleChange(payload);
                    }}
                    className="pull-right"
                  >
                    <MenuItem value={'en_IN'} primaryText="English" />
                    <MenuItem value={'mr_IN'} primaryText="मराठी" />
                  </SelectField>
                </Col>
              </Row>
              <Row style={styles.marginTop}>
                <Col xs={12} md={6} mdPush={6} style={styles.marginBottom}>
                  <form
                    autoComplete="off"
                    onSubmit={e => {
                      loginRequest(e);
                    }}
                  >
                    <Card>
                      <CardText>
                        <Row>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <h4>{translate('core.lbl.signin')}</h4>
                            <Row>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                  floatingLabelText={translate('core.lbl.addmobilenumber/login')}
                                  errorText={fieldErrors.username ? fieldErrors.username : ''}
                                  id="username"
                                  fullWidth={true}
                                  autoComplete="off"
                                  value={credential.username ? credential.username : ''}
                                  onChange={e => handleChange(e, 'username', true, '')}
                                />
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                  tabIndex="0"
                                  floatingLabelText={translate('core.lbl.password')}
                                  type="password"
                                  fullWidth={true}
                                  autoComplete="new-password"
                                  errorText={fieldErrors.password ? fieldErrors.password : ''}
                                  id="password"
                                  value={credential.password ? credential.password : ''}
                                  onChange={e => handleChange(e, 'password', true, '')}
                                />
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                {showError()}
                              </Col>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton
                                  disabled={!isFormValid}
                                  type="submit"
                                  label={translate('core.lbl.signin')}
                                  style={{ width: 150, marginTop: 20 }}
                                  primary={true}
                                />
                                <FlatButton
                                  label={translate('core.lbl.forgot.password')}
                                  labelStyle={{ fontSize: 12 }}
                                  style={styles.buttonTopMargin}
                                  hoverColor={'#ffffff'}
                                  onClick={showPasswordModal}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardText>
                    </Card>
                  </form>
                </Col>
                <Col xs={12} md={6} mdPull={6}>
                  <Row>
                    <Col xs={12} md={12} onClick={handleSignUpModalOpen}>
                      <IconButton style={styles.floatingIconButton}>
                        <i className="material-icons">person</i>
                      </IconButton>
                      <div style={{ float: 'left', cursor: 'pointer' }}>
                        <h4>{translate('pgr.title.create.account')}</h4>
                        <p>{translate('pgr.msg.createaccount.avail.onlineservices')}</p>
                      </div>
                    </Col>

                    <Col xs={12} md={12} style={styles.buttonTopMargin} onClick={this.openServices}>
                      <IconButton style={styles.floatingIconButton}>
                        <i className="material-icons">mode_edit</i>
                      </IconButton>
                      <div style={{ float: 'left', cursor: 'pointer' }}>
                        <h4>{translate('pgr.lbl.apply.service')}</h4>
                        <p>{translate('pgr.lbl.apply.servicetag')}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={12} style={styles.buttonTopMargin} onClick={this.openAnonymousComplaint}>
                      <IconButton style={styles.floatingIconButton}>
                        <i className="material-icons">mode_edit</i>
                      </IconButton>
                      <div style={{ float: 'left', cursor: 'pointer' }}>
                        <h4>{translate('pgr.lbl.register.grievance')}</h4>
                        <p>{translate('pgr.lbl.register.grievance')}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={12} style={styles.buttonTopMargin}>
                      <IconButton style={styles.floatingIconButton} primary={true}>
                        <i className="material-icons">search</i>
                      </IconButton>
                      <div style={styles.floatLeft}>
                        <h4>{translate('pgr.lbl.search.grievance')}</h4>
                        <TextField
                          hintText={translate('pgr.lbl.search.grievance')}
                          value={this.state.searchGrievanceSRN || ''}
                          onChange={(e, newValue) => {
                            this.setState({ searchGrievanceSRN: newValue });
                          }}
                        />
                        <RaisedButton
                          label={translate('core.lbl.search')}
                          onClick={e => {
                            this.searchGrievanceSRN(e);
                          }}
                          secondary={true}
                          className="searchButton"
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={12} style={styles.buttonTopMargin}>
                      <IconButton style={styles.floatingIconButton} primary={true}>
                        <i className="material-icons">search</i>
                      </IconButton>
                      <div style={styles.floatLeft}>
                        <h4>{translate('pgr.msg.complaintstatus.application')}</h4>
                        <TextField
                          hintText={translate('pgr.lbl.applicationnumber')}
                          value={srn}
                          onChange={e => {
                            handleStateChange(e, 'srn');
                          }}
                        />
                        <RaisedButton
                          label={translate('core.lbl.search')}
                          onClick={e => {
                            searchSRN(e);
                          }}
                          secondary={true}
                          className="searchButton"
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={12} style={styles.buttonTopMargin}>
                      <IconButton style={styles.floatingIconButton} primary={true}>
                        <i className="material-icons">search</i>
                      </IconButton>
                      <div style={styles.floatLeft}>
                        <h4>{translate('pgr.msg.complaintstatus.certificate')}</h4>
                        <TextField
                          hintText={translate('pgr.lbl.certificateNumber')}
                          value={crtNo}
                          onChange={e => {
                            handleStateChange(e, 'crtNo');
                          }}
                        />
                        <RaisedButton
                          label={translate('core.lbl.varify')}
                          onClick={e => {
                            searchSRN(e, true);
                          }}
                          secondary={true}
                          className="searchButton"
                        />
                      </div>
                    </Col>
                    {/*<Col xs={12} md={12} style={styles.buttonTopMargin}>
                                              <IconButton  style={styles.floatingIconButton}>
                                                  <i className="material-icons">phone</i>
                                              </IconButton>
                                              <div style={styles.floatLeft}>
                                                <h4>{translate('pgr.lbl.grievancecell')}</h4>
                                                <p>{translate("ui.login.call") + " " + (tenantInfo && tenantInfo.length && tenantInfo[0] ? (tenantInfo[0].helpLineNumber || "-") : "-") + " " + translate("ui.login.registerGrievance")}</p>
                                              </div>
                                            </Col>*/}
                  </Row>
                </Col>
              </Row>
            </Grid>
            <hr />
            <Grid>
              <Row style={styles.moreDetailsCont}>
                <Col xs={12} md={4} style={styles.buttonTopMargin}>
                  <FontIcon style={styles.iconSize}>
                    <i className="material-icons">location_on</i>
                  </FontIcon>
                  <p>{tenantInfo && tenantInfo.length && tenantInfo[0].address}</p>
                  <a
                    target="_blank"
                    href={
                      'https://www.google.com/maps/preview/@-' +
                      (tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].city && tenantInfo[0].city.latitude) +
                      ',' +
                      (tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].city && tenantInfo[0].city.longitude) +
                      ',8z'
                    }
                  >
                    Find us on google maps
                  </a>
                </Col>
                <Col xs={12} md={4} style={styles.buttonTopMargin}>
                  <FontIcon style={styles.iconSize}>
                    <i className="material-icons">phone</i>
                  </FontIcon>
                  <p>{tenantInfo && tenantInfo.length && tenantInfo[0].contactNumber}</p>
                  <a href={'mailto:' + (tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].emailId)}>
                    {tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].emailId}
                  </a>
                </Col>
                <Col xs={12} md={4} style={styles.buttonTopMargin}>
                  <FontIcon style={styles.iconSize}>
                    <i className="material-icons">share</i>
                  </FontIcon>
                  <p>Share us on</p>
                  <a target="_blank" href={tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].twitterUrl}>
                    <i className="fa fa-twitter" style={styles.iconSize} />
                  </a>
                  <a target="_blank" href={tenantInfo && tenantInfo.length && tenantInfo[0] && tenantInfo[0].facebookUrl}>
                    <i className="fa fa-facebook" style={styles.iconSize} />
                  </a>
                </Col>
              </Row>
            </Grid>
            <Dialog
              title={translate('pgr.lbl.recoverpswd')}
              actions={[
                <FlatButton
                  label={translate('core.lbl.cancel')}
                  primary={false}
                  onTouchTap={() => {
                    handleClose('open');
                  }}
                />,
                <FlatButton
                  label={translate('pgr.lbl.sendotp')}
                  secondary={true}
                  onTouchTap={e => {
                    sendRecovery('otp');
                  }}
                />,
              ]}
              modal={false}
              open={open}
              onRequestClose={e => {
                handleClose('open');
              }}
            >
              <TextField
                floatingLabelText={translate('core.lbl.addmobilenumber/login')}
                style={styles.fullWidth}
                errorText={mobErrorMsg}
                id="mobNo"
                value={mobNo}
                onChange={e => handleStateChange(e, 'mobNo')}
              />
              <div style={{ textAlign: 'right', fontSize: '12px' }}>{translate('pgr.lbl.recoverylink')}</div>
            </Dialog>
            <Dialog
              title={!hideOtp ? translate('pgr.lbl.otpnumber') : translate('core.lbl.new.password')}
              actions={[
                <FlatButton
                  label={translate('core.lbl.cancel')}
                  primary={false}
                  onTouchTap={e => {
                    handleClose('open1');
                  }}
                />,
                <FlatButton
                  label={!hideOtp ? translate('pgr.lbl.verify') : translate('core.lbl.submit')}
                  secondary={true}
                  onTouchTap={e => {
                    !hideOtp ? validateOTP() : generatePassword();
                  }}
                />,
              ]}
              modal={false}
              open={open1}
              onRequestClose={e => {
                handleClose('open1');
              }}
            >
              {showForOTP()}
              {showForPwd()}
            </Dialog>
            <Snackbar
              open={this.state.open2}
              message={translate('core.msg.success.password.updated')}
              style={{ textAlign: 'center' }}
              onRequestClose={e => {
                handleClose('open2');
              }}
              autoHideDuration={4000}
            />
            <Dialog
              title={translate('pgr.title.create.account')}
              autoScrollBodyContent={true}
              actions={[
                <FlatButton
                  label={translate('core.lbl.cancel')}
                  primary={false}
                  onTouchTap={e => {
                    handleClose('open3');
                    this.handleClearForm();
                  }}
                />,
                <FlatButton
                  label={optSent ? translate('core.lbl.signup') : translate('pgr.lbl.generate.otp')}
                  secondary={true}
                  disabled={
                    signUpObject.mobileNumberMsg === undefined || !this.hasAllFields()
                      ? true
                      : signUpObject.mobileNumberMsg ? true : optSent ? !this.isAllFields() : false
                  }
                  onTouchTap={e => {
                    !optSent ? generateSignUpOTP() : signUp();
                  }}
                />,
              ]}
              modal={true}
              open={open3}
              onRequestClose={e => {
                handleClose('open3');
              }}
              contentStyle={{ maxWidth: '500px' }}
            >
              <Row className="formcontainer">
                <Col xs={12} md={12}>
                  <TextField
                    floatingLabelText={translate('core.lbl.mobilenumber')}
                    fullWidth={true}
                    autoComplete="off"
                    value={signUpObject.mobileNumber}
                    disabled={optSent}
                    errorText={signUpObject.mobileNumberMsg ? signUpObject.mobileNumberMsg : ''}
                    onChange={e => handleStateChange(e, 'signUpObject.mobileNumber', /^\d{10}$/g, translate('pgr.lbl.mobnum'))}
                  />
                </Col>
                <Col xs={12} md={12}>
                  <TextField
                    floatingLabelText={translate('core.lbl.password')}
                    fullWidth={true}
                    value={signUpObject.password}
                    autoComplete="off"
                    type="password"
                    errorText={signUpObject.passwordMsg ? signUpObject.passwordMsg : ''}
                    onChange={e =>
                      handleStateChange(
                        e,
                        'signUpObject.password',
                        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                        translate('pgr.lbl.btwncharacter')
                      )
                    }
                  />
                </Col>
                <Col xs={12} md={12}>
                  <TextField
                    floatingLabelText={translate('core.lbl.confirm.password')}
                    fullWidth={true}
                    value={signUpObject.confirmPassword}
                    autoComplete="off"
                    type="password"
                    errorText={!signUpObject.passwordMsg ? this.passwordValidation() : ''}
                    onChange={e => handleStateChange(e, 'signUpObject.confirmPassword')}
                  />
                </Col>
                <Col xs={12} md={12}>
                  <TextField
                    floatingLabelText={translate('core.lbl.fullname')}
                    fullWidth={true}
                    value={signUpObject.name}
                    errorText={signUpObject.nameMsg ? signUpObject.nameMsg : ''}
                    onChange={e =>
                      handleStateChange(e, 'signUpObject.name', /^[a-zA-Z ]{1,50}$/, 'Should contain only alphabets and space. Max: 50 Characters')
                    }
                  />
                </Col>
                <Col xs={12} md={12}>
                  <TextField
                    floatingLabelText={translate('core.lbl.email')}
                    fullWidth={true}
                    value={signUpObject.emailId}
                    errorText={signUpObject.emailId ? (signUpObject.emailIdMsg ? signUpObject.emailIdMsg : '') : ''}
                    onChange={e =>
                      handleStateChange(
                        e,
                        'signUpObject.emailId',
                        /^(?=.{6,64}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        translate('pgr.lbl.validemailid')
                      )
                    }
                  />
                </Col>
                <Col xs={12} md={12}>
                  {optSent ? (
                    <TextField
                      floatingLabelText={translate('core.lbl.otp')}
                      fullWidth={true}
                      value={signUpObject.otp}
                      onChange={e => handleStateChange(e, 'signUpObject.otp')}
                    />
                  ) : (
                    ''
                  )}
                </Col>
                <Col md={12}>
                  <p className="text-danger">{this.state.signUpErrorMsg}</p>
                </Col>
              </Row>
            </Dialog>
          </div>
        ) : (
          ''
        )}
      </div>
    );
    // }
  }
}

const mapStateToProps = state => ({
  credential: state.form.form,
  fieldErrors: state.form.fieldErrors,
  isFormValid: state.form.isFormValid,
  tenantInfo: state.common.tenantInfo,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: ['username', 'password'],
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
  login: (error, token, userRequest, doNotNavigate) => {
    let payload = {
      access_token: token,
      UserRequest: userRequest,
      doNotNavigate: doNotNavigate,
    };
    dispatch({ type: 'LOGIN', error, payload });
  },
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  setActionList: actionList => {
    dispatch({ type: 'SET_ACTION_LIST', actionList });
  },
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
  setHome: showHome => dispatch({ type: 'SET_HOME', showHome }),
  forceLogout: () => dispatch({ type: 'FORCE_LOGOUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
