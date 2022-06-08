import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EXIF } from 'exif-js';
import ImagePreview from '../../common/ImagePreview.js';
import SimpleMap from '../../common/GoogleMaps.js';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Fields from '../../common/Fields';
import Api from '../../../api/api';
import styles from '../../../styles/material-ui';
import { translate, validate_fileupload, format_lat_long } from '../../common/common';
var axios = require('axios');

var _this;
var request = {};

class grievanceCreate extends Component {
  static isPrivate = false;
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      receivingModes: [],
      receivingCenter: [],
      topComplaintTypes: [],
      grievanceCategory: [],
      grievanceType: [],
      boundarySource: [],
      boundarySourceConfig: {
        text: 'name',
        value: 'id',
      },
      open: false,
      openPreview: false,
      openOTP: false,
      toastOpen: false,
    };
    this.search = this.search.bind(this);
    this.loadReceivingCenter = this.loadReceivingCenter.bind(this);
    this.loadGrievanceType = this.loadGrievanceType.bind(this);
    this.processCreate = this.processCreate.bind(this);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleOTPOpen = () => {
    this.setState({ openOTP: true });
  };

  handleOTPClose = () => {
    this.setState({ openOTP: false });
  };

  handlePreviewOpen = () => {
    this.setState({ openPreview: true });
  };

  handlePreviewClose = () => {
    this.setState({ openPreview: false });
  };

  handleView = () => {
    let { initForm, setRoute } = this.props;
    initForm(localStorage.getItem('type'));
    this.setState({ open: false });
    setRoute('/pgr/viewGrievance/' + encodeURIComponent(this.state.serviceRequestId));
  };

  validateOTP = () => {
    //otp validate
    if (!this.state.otpValue) {
      return false;
    }
    this.props.setLoadingStatus('loading');
    let mob = this.props.grievanceCreate.phone;
    let tenant = localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default';
    var rqst = {
      tenantId: tenant,
      otp: this.state.otpValue,
      identity: mob,
    };
    Api.commonApiPost('otp/v1/_validate', {}, { otp: rqst }).then(
      function(response) {
        //create SRN
        _this.handleOTPClose();
        let finobj = {
          key: 'otpReference',
          name: response.otp.UUID,
        };
        request['serviceRequest'].attribValues.push(finobj);
        _this.createGrievance(request);
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  loadReceivingCenter(value) {
    this.setState({ isReceivingCenterReq: false });
    if (value === 'MANUAL') {
      Api.commonApiPost('/pgr-master/receivingcenter/v1/_search').then(
        function(response) {
          _this.setState({ receivingCenter: response.ReceivingCenterType });
        },
        function(err) {
          _this.handleError(err.message);
        }
      );
      this.props.ADD_MANDATORY('receivingCenter');
      this.props.handleChange('', 'receivingCenter', true, '');
    } else {
      this.props.REMOVE_MANDATORY('receivingCenter');
      this.props.handleChange('', 'receivingCenter', false, '');
      this.props.REMOVE_MANDATORY('externalCRN');
      this.props.handleChange('', 'externalCRN', false, '');
    }
  }

  loadReceivingCenterDD = name => {
    this.props.ADD_MANDATORY(name);
    return (
      <Col xs={12} sm={4} md={3} lg={3}>
        <SelectField
          className="custom-form-control-for-select"
          hintText="Select"
          maxHeight={200}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFixed={true}
          floatingLabelText={translate('pgr.lbl.receivingcenter') + ' *'}
          value={this.props.grievanceCreate.receivingCenter ? this.props.grievanceCreate.receivingCenter : ''}
          onChange={(event, key, value) => {
            this.loadCRN(value);
            this.props.handleChange(value, name, true, '');
          }}
          errorText={this.props.fieldErrors.receivingCenter ? this.props.fieldErrors.receivingCenter : ''}
        >
          <MenuItem value="" primaryText="Select" />
          {this.state.receivingCenter.map(
            (receivingcenter, index) =>
              receivingcenter.active ? <MenuItem value={receivingcenter.id} key={index} primaryText={receivingcenter.name} /> : ''
          )}
        </SelectField>
      </Col>
    );
  };

  loadGrievanceType(value) {
    var currentThis = this;
    Api.commonApiPost('/pgr-master/service/v1/_search', { type: 'category', categoryId: value, keywords: 'complaint', active: true }).then(
      function(response) {
        currentThis.setState({ grievanceType: response.Service });
      },
      function(err) {
        currentThis.handleError(err.message);
      }
    );
  }

  componentDidMount() {
    this.setState({ type: localStorage.getItem('type') });
    let { initForm } = this.props;
    initForm(localStorage.getItem('type'));
    var currentThis = this;

    this.props.setLoadingStatus('loading');

    this.getCityDetails();
  }

  getCityDetails = () => {
    //Get City details for tenant
    Api.commonApiPost('/tenant/v1/tenant/_search', { code: localStorage.getItem('tenantId') || 'default' }).then(
      function(response) {
        _this.setState({
          citylat: response.tenant[0].city.latitude,
          citylng: response.tenant[0].city.longitude,
        });
        _this.Maps();
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  Maps = () => {
    //isMapsEnabled
    Api.commonApiPost('/egov-location/boundarys/isshapefileexist').then(
      function(response) {
        if (response.ShapeFile.fileExist) {
          _this.setState({ isMapsEnabled: response.ShapeFile.fileExist });
        }
        _this.topComplaintTypes();
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  topComplaintTypes = () => {
    //Top ComplaintTypes
    Api.commonApiPost('/pgr/services/v1/_search', { type: 'frequency', count: 5 }).then(
      function(response) {
        //console.log(JSON.stringify(response))
        var topComplaint = [];
        for (var j = 0; j < response.complaintTypes.length; j++) {
          if (response.complaintTypes[j].keywords.indexOf('complaint') > -1) topComplaint.push(response.complaintTypes[j]);
        }
        _this.setState({ topComplaintTypes: topComplaint });
        _this.grievanceCategory();
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  grievanceCategory = () => {
    //Grievance Category
    Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', { keyword: 'complaint' }).then(
      function(response) {
        _this.setState({ grievanceCategory: response.ServiceGroups });
        if (localStorage.getItem('type') === null) _this.OTP();
        else if (localStorage.getItem('type') === 'EMPLOYEE') _this.receivingMode();
        else _this.props.setLoadingStatus('hide');
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  OTP = () => {
    //OTP enabled for tenant
    Api.commonApiPost('/pgr-master/OTPConfig/_search').then(
      function(response) {
        _this.setState({ otpEnabled: response.otpConfig[0].otpEnabledForAnonymousComplaint });
        _this.props.setLoadingStatus('hide');
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  receivingMode = () => {
    //ReceivingMode
    Api.commonApiPost('/pgr-master/receivingmode/v1/_search').then(
      function(response) {
        _this.setState({ receivingModes: response.ReceivingModeType });
        _this.props.setLoadingStatus('hide');
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  serviceDefinition = code => {
    this.props.setLoadingStatus('loading');
    Api.commonApiPost('/pgr/servicedefinition/v1/_search', { serviceCode: code }).then(
      function(response) {
        _this.setState({ attributes: response.attributes });
        _this.props.setLoadingStatus('hide');
      },
      function(err) {
        _this.props.setLoadingStatus('hide');
        _this.handleError(err.message);
      }
    );
  };

  loadSD = () => {
    if (this.state.attributes.length > 0) {
      return this.state.attributes.map((item, index) => {
        if (item.roles.indexOf(localStorage.getItem('type')) > -1 && item.actions.indexOf('REGISTERED') > -1) {
          if (item.required) this.props.ADD_MANDATORY(item.code);
          return (
            <Fields
              key={index}
              error={this.props.fieldErrors[item.code]}
              obj={item}
              value={this.props.grievanceCreate[item.code] ? this.props.grievanceCreate[item.code] : ''}
              handler={_this.props.handleChange}
            />
          );
        }
      });
    }
  };

  search = () => {
    // e.preventDefault();
    if (!((this.props.grievanceCreate.lat && this.props.grievanceCreate.lat) || this.props.grievanceCreate.addressId)) {
      this.handleError('Grievance location is mandatory!');
      return false;
    }
    //console.log('Initial Position:',this.state.citylat, this.state.citylng);
    //console.log('Changed Position:',this.props.grievanceCreate.lat, this.props.grievanceCreate.lng);
    this.props.setLoadingStatus('loading');
    //validate with API
    if (this.props.grievanceCreate.lat && this.props.grievanceCreate.lng) {
      Api.commonApiGet('/egov-location/boundarys', {
        'boundary.latitude': this.props.grievanceCreate.lat,
        'boundary.longitude': this.props.grievanceCreate.lng,
        'boundary.tenantId': localStorage.getItem('tenantId') || 'default',
      }).then(
        function(response) {
          if (response.Boundary.length === 0) {
            _this.props.setLoadingStatus('hide');
            _this.handleError(translate('pgr.lbl.outofboundary'));
          } else {
            //usual createGrievance
            _this.initialCreateBasedonType();
          }
        },
        function(err) {
          _this.props.setLoadingStatus('hide');
          _this.handleError(err.message);
        }
      );
    } else {
      //usual createGrievance
      this.initialCreateBasedonType();
    }
    //console.log(this.props.grievanceCreate);
  };

  initialCreateBasedonType = () => {
    let type = this.state.type;
    if (type === 'CITIZEN') {
      var userArray = [],
        userRequest = {};
      userArray.push(localStorage.getItem('id'));
      userRequest['id'] = userArray;
      userRequest['tenantId'] = localStorage.getItem('tenantId') ? localStorage.getItem('tenantId') : 'default';
      let userInfo = Api.commonApiPost('/user/v1/_search', {}, userRequest).then(
        function(userResponse) {
          var userName = userResponse.user[0].name;
          var userMobile = userResponse.user[0].mobileNumber;
          var userEmail = userResponse.user[0].emailId;
          _this.processCreate(userName, userMobile, userEmail);
        },
        function(err) {
          _this.props.setLoadingStatus('hide');
          _this.handleError(err.message);
        }
      );
    } else if (type === 'EMPLOYEE') {
      _this.processCreate();
    } else {
      _this.processCreate();
    }
  };

  processCreate = (userName = '', userMobile = '', userEmail = '') => {
    request = {};
    var data = {};
    var finobj = {};
    data['serviceCode'] = this.props.grievanceCreate.serviceCode;
    data['description'] = this.props.grievanceCreate.description;
    data['addressId'] = this.props.grievanceCreate.addressId ? this.props.grievanceCreate.addressId.id : '';
    data['lat'] = this.props.grievanceCreate.addressId ? '' : this.props.grievanceCreate.lat;
    data['lng'] = this.props.grievanceCreate.addressId ? '' : this.props.grievanceCreate.lng;
    data['address'] = this.props.grievanceCreate.address;
    data['serviceRequestId'] = '';
    data['firstName'] = this.props.grievanceCreate.firstName ? this.props.grievanceCreate.firstName : userName;
    data['phone'] = this.props.grievanceCreate.phone ? this.props.grievanceCreate.phone : userMobile;
    data['email'] = this.props.grievanceCreate.email ? this.props.grievanceCreate.email : userEmail;
    data['status'] = true;
    data['serviceName'] = '';
    data['requestedDatetime'] = '';
    data['mediaUrl'] = '';
    data['tenantId'] = localStorage.getItem('tenantId') || 'default';
    data['isAttribValuesPopulated'] = true;
    data['attribValues'] = [];

    finobj = {
      key: 'systemReceivingMode',
      name: this.props.grievanceCreate.receivingMode ? this.props.grievanceCreate.receivingMode : 'Website',
    };
    data['attribValues'].push(finobj);

    if (this.props.grievanceCreate.receivingCenter) {
      finobj = {
        key: 'systemReceivingCenter',
        name: this.props.grievanceCreate.receivingCenter,
      };
      data['attribValues'].push(finobj);
    }

    if (this.props.grievanceCreate.externalCRN) {
      finobj = {
        key: 'systemExternalCRN',
        name: this.props.grievanceCreate.externalCRN,
      };
      data['attribValues'].push(finobj);
    }

    finobj = {
      key: 'systemStatus',
      name: 'REGISTERED',
    };
    data['attribValues'].push(finobj);

    if (this.props.grievanceCreate.requesterAddress) {
      finobj = {
        key: 'systemRequesterAddress',
        name: this.props.grievanceCreate.requesterAddress ? this.props.grievanceCreate.requesterAddress : '',
      };
      data['attribValues'].push(finobj);
    }

    finobj = {
      key: 'keyword',
      name: 'Complaint',
    };
    data['attribValues'].push(finobj);

    if (localStorage.getItem('type') === 'CITIZEN') {
      finobj = {
        key: 'systemCitizenUserId',
        name: localStorage.getItem('id'),
      };
      data['attribValues'].push(finobj);
    }

    request['serviceRequest'] = data;

    //console.log(JSON.stringify(request));
    if (localStorage.getItem('type') === null && this.state.otpEnabled) {
      this.otpCreate('create');
    } else {
      this.createGrievance(request);
    }
  };

  otpCreate = status => {
    let currentThis = this;
    let mob = this.props.grievanceCreate.phone;
    let tenant = localStorage.getItem('tenantId') || 'default';
    //send OTP and validate it
    if (!mob) {
      return false;
    }
    Api.commonApiPost('/pgr/v1/otp/_send', {}, { mobileNumber: mob, tenantId: tenant }).then(
      function(response) {
        //validate OTP
        currentThis.props.setLoadingStatus('hide');
        if (response.isSuccessful) {
          {
            currentThis.handleOTPOpen();
            status === 'resend' ? currentThis.setState({ otpResend: true, otpValue: '' }) : '';
          }
        } else {
          currentThis.handleError(translate('core.error.opt.generation'));
        }
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
        currentThis.handleError(err.message);
      }
    );
  };

  createGrievance = request => {
    var currentThis = this;
    Api.commonApiPost('/pgr/seva/v1/_create', {}, request).then(
      function(createresponse) {
        var srn = createresponse.serviceRequests[0].serviceRequestId;
        currentThis.setState({ serviceRequestId: srn });
        var ack = `${translate('pgr.lbl.crnunderprocess')}. ${translate('pgr.lbl.crn')} is ${srn}. ${translate('pgr.msg.future.reference')}.`;
        currentThis.setState({ srn: translate('pgr.lbl.crnformat') + ':' + srn });
        currentThis.setState({ acknowledgement: ack });

        if (currentThis.props.files) {
          if (currentThis.props.files.length === 0) {
            //console.log('create succesfully done. No file uploads');
            currentThis.props.setLoadingStatus('hide');
            {
              currentThis.handleOpen();
            }
          } else {
            //console.log('create succesfully done. still file upload pending');
            for (let i = 0; i < currentThis.props.files.length; i++) {
              //this.props.files.length[i]
              let formData = new FormData();
              formData.append('tenantId', localStorage.getItem('tenantId'));
              formData.append('module', 'PGR');
              formData.append('tag', createresponse.serviceRequests[0].serviceRequestId);
              formData.append('file', currentThis.props.files[i]);
              Api.commonApiPost('/filestore/v1/files', {}, formData).then(
                function(response) {
                  if (i === currentThis.props.files.length - 1) {
                    //console.log('All files succesfully uploaded');
                    currentThis.props.setLoadingStatus('hide');
                    {
                      currentThis.handleOpen();
                    }
                  }
                },
                function(err) {
                  currentThis.handleError(err.message);
                }
              );
            }
          }
        }
      },
      function(err) {
        currentThis.props.setLoadingStatus('hide');
      }
    );
  };

  handleError = msg => {
    let { toggleDailogAndSetText, toggleSnackbarAndSetText } = this.props;
    toggleDailogAndSetText(true, msg);
    //toggleSnackbarAndSetText(true, "Could not able to create complaint. Try again")
  };

  handleTouchTap = () => {
    this.setState({
      toastOpen: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      toastOpen: false,
    });
  };

  loadCRN = RCValue => {
    var valid = false;
    this.state.receivingCenter.forEach(function(item, index) {
      if (item.id === RCValue) {
        valid = item.iscrnrequired;
      }
    });

    if (valid) {
      this.props.ADD_MANDATORY('externalCRN');
      this.props.handleChange('', 'externalCRN', true, '');
      this.setState({ isReceivingCenterReq: valid });
    } else {
      this.props.REMOVE_MANDATORY('externalCRN');
      this.props.handleChange('', 'externalCRN', false, '');
      this.setState({ isReceivingCenterReq: false });
    }
  };

  handleUploadValidation = (e, formats, limit) => {
    //console.log(this.props.files.length , limit);
    if (this.props.files.length >= limit) {
      this.handleError(translate('pgr.lbl.maxfile') + ':' + limit);
      return;
    }
    let validFile = validate_fileupload(e.target.files, formats);
    if (validFile === true) {
      if (this.props.files.length === 0 && this.state.isMapsEnabled) {
        EXIF.getData(e.target.files[0], function() {
          var imagelat = EXIF.getTag(this, 'GPSLatitude'),
            imagelongt = EXIF.getTag(this, 'GPSLongitude');
          if (imagelat && imagelongt) {
            var formatted_lat = format_lat_long(imagelat.toString());
            var formatted_long = format_lat_long(imagelongt.toString());
            if (formatted_lat && formatted_long) {
              axios
                .post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + formatted_lat + ',' + formatted_long + '&sensor=true')
                .then(function(response) {
                  //console.log(response.data.results[0].formatted_address);
                  _this.props.handleMap(formatted_lat, formatted_long, 'address');
                });
            }
          }
        });
      }
      this.props.handleUpload(e);
    } else this.handleError(validFile);
  };

  getAddress = (lat, lng) => {
    axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true').then(function(response) {
      let address = response.data.results[0] ? response.data.results[0].formatted_address : '';
      _this.setState({
        customAddress: address,
      });
    });
  };

  renderImagePreview = files => {
    return files.map((file, index) => {
      return <ImagePreview file={file} idx={index} key={index} preview={this.preview} handler={this.props.handleFileRemoval} />;
    });
  };

  preview = dataSrc => {
    this.props.setLoadingStatus('loading');
    this.handlePreviewOpen();
    this.setState({ iframe_src: dataSrc });
    this.props.setLoadingStatus('hide');
  };

  render() {
    //console.log(this.state.customAddress);
    //console.log(this.props.grievanceCreate.addressId);
    const actions = [<FlatButton label={translate('pgr.lbl.view')} primary={true} onTouchTap={this.handleView} />];
    const otpActions = [
      <FlatButton label={translate('pgr.lbl.resend.otp')} primary={true} onClick={e => this.otpCreate('resend')} />,
      <FlatButton label={translate('pgr.lbl.proceed')} primary={true} onTouchTap={this.validateOTP} />,
    ];
    _this = this;
    let {
      grievanceCreate,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      files,
      handleChange,
      setCategoryandType,
      handleAutoCompleteKeyUp,
      buttonText,
    } = this.props;
    let { search, processCreate, isMapsEnabled, loadCRN, handleUploadValidation, getAddress } = this;

    return (
      <div className="grievanceCreate">
        <h2 className="application-title">{translate('pgr.lbl.register.grievance')}</h2>
        <form autoComplete="off">
          {this.state.type === 'EMPLOYEE' || this.state.type === null ? (
            <Card style={styles.marginStyle}>
              <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('core.lbl.contact.information')}</div>} />
              <CardText style={{ paddingTop: 0 }}>
                <Grid>
                  <Row>
                    {this.state.type === 'EMPLOYEE' ? (
                      <Col xs={12} sm={4} md={3} lg={3}>
                        <SelectField
                          className="custom-form-control-for-select"
                          hintText="Select"
                          maxHeight={200}
                          fullWidth={true}
                          floatingLabelStyle={styles.floatingLabelStyle}
                          floatingLabelFixed={true}
                          floatingLabelText={translate('pgr.lbl.receivingmode') + ' *'}
                          value={grievanceCreate.receivingMode ? grievanceCreate.receivingMode : ''}
                          onChange={(event, key, value) => {
                            this.loadReceivingCenter(value);
                            handleChange(value, 'receivingMode', true, '');
                          }}
                          errorText={fieldErrors.receivingMode ? fieldErrors.receivingMode : ''}
                        >
                          <MenuItem value="" primaryText="Select" />
                          {this.state.receivingModes !== undefined
                            ? this.state.receivingModes.map(
                                (receivingmode, index) =>
                                  receivingmode.active ? <MenuItem value={receivingmode.code} key={index} primaryText={receivingmode.name} /> : ''
                              )
                            : ''}
                        </SelectField>
                      </Col>
                    ) : (
                      ''
                    )}
                    {grievanceCreate.receivingMode === 'MANUAL' ? this.loadReceivingCenterDD('receivingCenter') : ''}
                    {this.state.isReceivingCenterReq ? (
                      <Col xs={12} sm={4} md={3} lg={3}>
                        <TextField
                          className="custom-form-control-for-textarea"
                          floatingLabelStyle={styles.floatingLabelStyle}
                          floatingLabelFixed={true}
                          floatingLabelText={translate('CRN') + ' *'}
                          multiLine={true}
                          errorText={this.props.fieldErrors.externalCRN ? this.props.fieldErrors.externalCRN : ''}
                          value={this.props.grievanceCreate.externalCRN ? this.props.grievanceCreate.externalCRN : ''}
                          maxLength="20"
                          onChange={(event, value) => this.props.handleChange(value, 'externalCRN', true, '')}
                        />
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                  <Row>
                    <Col xs={12} sm={4} md={3} lg={3}>
                      <TextField
                        className="custom-form-control-for-textfield"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFixed={true}
                        floatingLabelText={translate('core.lbl.add.name') + ' *'}
                        value={grievanceCreate.firstName ? grievanceCreate.firstName : ''}
                        errorText={fieldErrors.firstName ? fieldErrors.firstName : ''}
                        maxLength="100"
                        onChange={(event, value) => handleChange(value, 'firstName', true, /^[a-zA-Z ]{1,100}$/, translate('pgr.lbl.alphaspace'))}
                      />
                    </Col>
                    <Col xs={12} sm={4} md={3} lg={3}>
                      <TextField
                        className="custom-form-control-for-textfield"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFixed={true}
                        floatingLabelText={translate('core.lbl.mobilenumber') + ' *'}
                        errorText={fieldErrors.phone ? fieldErrors.phone : ''}
                        value={grievanceCreate.phone ? grievanceCreate.phone : ''}
                        maxLength="10"
                        onChange={(event, value) => handleChange(value, 'phone', true, /^\d{10}$/g, translate('core.lbl.enter.mobilenumber'))}
                      />
                    </Col>
                    <Col xs={12} sm={4} md={3} lg={3}>
                      <TextField
                        className="custom-form-control-for-textfield"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFixed={true}
                        floatingLabelText={translate('core.lbl.email.compulsory')}
                        errorText={fieldErrors.email ? fieldErrors.email : ''}
                        value={grievanceCreate.email ? grievanceCreate.email : ''}
                        maxLength="50"
                        onChange={(event, value) =>
                          handleChange(
                            value,
                            'email',
                            false,
                            /^(?=.{6,64}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            'Enter valid Email ID'
                          )
                        }
                      />
                    </Col>
                    <Col xs={12} sm={4} md={3} lg={3}>
                      <TextField
                        className="custom-form-control-for-textarea"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFixed={true}
                        floatingLabelText={translate('core.lbl.address')}
                        multiLine={true}
                        errorText={fieldErrors.requesterAddress ? fieldErrors.requesterAddress : ''}
                        value={grievanceCreate.requesterAddress ? grievanceCreate.requesterAddress : ''}
                        maxLength="250"
                        onChange={(event, value) =>
                          handleChange(
                            value,
                            'requesterAddress',
                            false,
                            /^.[^]{0,250}$/,
                            translate('pgr.lbl.max') + ' 250 ' + translate('pgr.lbl.characters')
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>
          ) : (
            ''
          )}
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.lbl.grievance.category')} </div>} />
            <CardText style={{ paddingTop: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div>
                      {this.state.topComplaintTypes.map((topComplaint, index) => (
                        <RaisedButton
                          label={topComplaint.serviceName}
                          key={index}
                          style={{ margin: '15px 5px' }}
                          onTouchTap={event => {
                            this.serviceDefinition(topComplaint.serviceCode);
                            setCategoryandType({ serviceCode: topComplaint.serviceCode, groupId: topComplaint.groupId });
                          }}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
                {this.state.topComplaintTypes.length > 0 ? (
                  <Row>
                    <Col xs={12} sm={4} md={3} lg={3} style={{ textAlign: 'center' }}>
                      <FlatButton primary={true} label={translate('core.lbl.or')} disabled={true} />
                    </Col>
                  </Row>
                ) : (
                  ''
                )}
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.category') + ' *'}
                      maxHeight={200}
                      value={grievanceCreate.serviceCategory ? grievanceCreate.serviceCategory : ''}
                      errorText={fieldErrors.serviceCategory ? fieldErrors.serviceCategory : ''}
                      onChange={(event, key, value) => {
                        this.loadGrievanceType(value), handleChange(value, 'serviceCategory', true, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {this.state.grievanceCategory !== undefined
                        ? this.state.grievanceCategory.map((grievanceCategory, index) => (
                            <MenuItem value={grievanceCategory.id} key={index} primaryText={grievanceCategory.name} />
                          ))
                        : ''}
                    </SelectField>
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <SelectField
                      className="custom-form-control-for-select"
                      hintText="Select"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.type') + ' *'}
                      maxHeight={200}
                      value={grievanceCreate.serviceCode ? grievanceCreate.serviceCode : ''}
                      errorText={fieldErrors.serviceCode ? fieldErrors.serviceCode : ''}
                      onChange={(event, key, value) => {
                        value ? this.serviceDefinition(value) : '';
                        handleChange(value, 'serviceCode', true, '');
                      }}
                    >
                      <MenuItem value="" primaryText="Select" />
                      {this.state.grievanceType.map((grievanceType, index) => (
                        <MenuItem value={grievanceType.serviceCode} key={index} primaryText={grievanceType.serviceName} />
                      ))}
                    </SelectField>
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <Card style={styles.marginStyle}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.lbl.grievancedetails')} </div>} />
            <CardText style={{ paddingTop: 0 }}>
              <Grid>
                {this.state.attributes ? this.loadSD() : ''}
                <Row>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textarea"
                      fullWidth={true}
                      hintText={translate('pgr.lbl.tencharacter')}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievancedetails') + ' *'}
                      multiLine={true}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      value={grievanceCreate.description ? grievanceCreate.description : ''}
                      maxLength="1000"
                      onChange={(event, value) =>
                        handleChange(
                          value,
                          'description',
                          true,
                          /^.[^]{9,1000}$/,
                          translate('pgr.lbl.min') +
                            ' 10 ' +
                            translate('pgr.lbl.characters') +
                            '. ' +
                            translate('pgr.lbl.max') +
                            ' 1000 ' +
                            translate('pgr.lbl.characters')
                        )
                      }
                    />
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <TextField
                      className="custom-form-control-for-textarea"
                      fullWidth={true}
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('core.lbl.landmark')}
                      multiLine={true}
                      errorText={fieldErrors.address ? fieldErrors.address : ''}
                      value={grievanceCreate.address ? grievanceCreate.address : ''}
                      maxLength="100"
                      onChange={(event, value) =>
                        handleChange(value, 'address', false, /^.[^]{0,100}$/, translate('pgr.lbl.max') + ' 100 ' + translate('pgr.lbl.characters'))
                      }
                    />
                  </Col>
                  <Col xs={12} sm={4} md={6} lg={6}>
                    <AutoComplete
                      className="custom-form-control-for-textfield"
                      hintText={translate('pgr.lbl.selectmap')}
                      ref="autocomplete"
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFixed={true}
                      floatingLabelText={translate('pgr.lbl.grievance.location') + ' *'}
                      filter={AutoComplete.noFilter}
                      fullWidth={true}
                      dataSource={this.state.boundarySource}
                      dataSourceConfig={this.state.boundarySourceConfig}
                      menuStyle={{ overflow: 'auto', maxHeight: '150px' }}
                      listStyle={{ overflow: 'auto' }}
                      onKeyUp={handleAutoCompleteKeyUp}
                      value={grievanceCreate.addressId}
                      onNewRequest={(chosenRequest, index) => {
                        if (index === -1) {
                          this.refs['autocomplete'].setState({ searchText: '' });
                        } else {
                          handleChange(chosenRequest, 'addressId', true, '');
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ position: 'relative' }}>
                  <p className="errorMsg" style={{ position: 'absolute', top: 0, left: 15, 'z-index': 10 }}>
                    (Allowed File Formats : jpg, jpeg, png)
                  </p>
                  <Col xs={12} sm={4} md={3} lg={3}>
                    <RaisedButton
                      label={translate('pgr.lbl.uploadphoto')}
                      containerElement="label"
                      style={{ marginTop: '20px', marginBottom: '20px' }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleUploadValidation(e, ['jpg', 'jpeg', 'png'], 3)}
                      />
                    </RaisedButton>
                  </Col>
                  {this.renderImagePreview(files)}
                </Row>
                {this.state.isMapsEnabled && (this.state.citylat && this.state.citylng) ? (
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div style={{ width: '100%', height: 400 }}>
                        <SimpleMap
                          lat={this.props.grievanceCreate.lat ? this.props.grievanceCreate.lat : this.state.citylat}
                          lng={this.props.grievanceCreate.lng ? this.props.grievanceCreate.lng : this.state.citylng}
                          markers={[]}
                          handler={(lat, lng) => {
                            getAddress(lat, lng);
                            this.props.handleMap(lat, lng, 'address');
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                ) : (
                  ''
                )}
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              style={{ margin: '15px 5px' }}
              onClick={e => {
                search();
              }}
              disabled={!isFormValid}
              label="Create"
              primary={true}
            />
          </div>
        </form>
        <div>
          <Dialog title={this.state.srn} open={this.state.openPreview} onRequestClose={this.handlePreviewClose}>
            <img src={this.state.iframe_src} style={{ width: '100%' }} alt="" />
          </Dialog>
          <Dialog title={this.state.srn} actions={actions} modal={true} open={this.state.open}>
            {this.state.acknowledgement}
          </Dialog>
          <Dialog title={translate('core.msg.enter.otp')} actions={otpActions} modal={true} open={this.state.openOTP}>
            <TextField
              className="custom-form-control-for-textfield"
              value={this.state.otpValue || ''}
              fullWidth={true}
              errorText={this.state.otpResend ? translate('pgr.lbl.otp.success') : ''}
              onChange={(event, newString) => this.setState({ otpValue: newString })}
            />
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.form.form);
  return {
    grievanceCreate: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    isTableShow: state.form.showTable,
    buttonText: state.form.buttonText,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: type => {
    var requiredArray = [];
    if (type === 'CITIZEN') {
      requiredArray = ['serviceCategory', 'serviceCode', 'description', 'addressId'];
    } else if (type === 'EMPLOYEE') {
      requiredArray = ['receivingMode', 'firstName', 'phone', 'serviceCategory', 'serviceCode', 'description', 'addressId'];
    } else {
      requiredArray = ['firstName', 'phone', 'serviceCategory', 'serviceCode', 'description', 'addressId'];
    }

    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: requiredArray,
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  ADD_MANDATORY: property => {
    dispatch({ type: 'ADD_MANDATORY', property, value: '', isRequired: true, pattern: '' });
  },
  REMOVE_MANDATORY: property => {
    dispatch({ type: 'REMOVE_MANDATORY', property, value: '', isRequired: true, pattern: '' });
  },
  handleAutoCompleteKeyUp: e => {
    var currentThis = _this;
    dispatch({ type: 'HANDLE_CHANGE', property: 'addressId', value: '', isRequired: false, pattern: '' });
    if (e.target.value) {
      Api.commonApiGet('/egov-location/boundarys/getLocationByLocationName', { locationName: e.target.value }).then(
        function(response) {
          currentThis.setState({ boundarySource: response });
        },
        function(err) {
          currentThis.handleError(err.message);
        }
      );
    }
  },
  setCategoryandType: e => {
    var group = e.groupId;
    var sCode = e.serviceCode;

    dispatch({ type: 'HANDLE_CHANGE', property: 'serviceCategory', value: group, isRequired: true, pattern: '' });

    var currentThis = _this;
    Api.commonApiPost('/pgr-master/service/v1/_search', { type: 'category', categoryId: group, keywords: 'complaint', active: true }).then(
      function(response) {
        currentThis.setState({ grievanceType: response.Service });
        dispatch({ type: 'HANDLE_CHANGE', property: 'serviceCode', value: sCode, isRequired: true, pattern: '' });
      },
      function(err) {
        currentThis.handleError(err.message);
      }
    );
  },
  handleMap: (lat, lng, field) => {
    dispatch({ type: 'HANDLE_CHANGE', property: 'lat', value: lat, isRequired: false, pattern: '' });
    dispatch({ type: 'HANDLE_CHANGE', property: 'lng', value: lng, isRequired: false, pattern: '' });
    dispatch({ type: 'REMOVE_MANDATORY', property: 'addressId', value: '', isRequired: false, pattern: '' });
    dispatch({ type: 'HANDLE_CHANGE', property: 'addressId', value: '', isRequired: false, pattern: '' });
    _this.refs['autocomplete'].setState({ searchText: '' });
  },
  handleUpload: e => {
    dispatch({ type: 'FILE_UPLOAD', files: e.target.files[0] });
  },
  handleChange: (value, property, isRequired, pattern, errorMsg) => {
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern, errorMsg });
    if (property === 'serviceCategory') {
      dispatch({ type: 'HANDLE_CHANGE', property: 'serviceCode', value: '', isRequired: true, pattern: '' });
    } else if (property === 'addressId') {
      dispatch({ type: 'ADD_MANDATORY', property: 'addressId', value: '', isRequired: true, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'lat', value: '', isRequired: false, pattern: '' });
      dispatch({ type: 'HANDLE_CHANGE', property: 'lng', value: '', isRequired: false, pattern: '' });
    }
  },
  handleFileRemoval: filename => {
    dispatch({ type: 'FILE_REMOVE', removefiles: filename });
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
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(grievanceCreate);
