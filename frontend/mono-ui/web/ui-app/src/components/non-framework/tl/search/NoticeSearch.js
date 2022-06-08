import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import NoticeSearchResult from './NoticeSearchResult';
import { translate, dateToEpoch } from '../../../common/common';
import Api from '../../../../api/api';
import styles from '../../../../styles/material-ui';

const patterns = {
  date: /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g,
  ownerName: /^.[a-zA-Z. ]{2,99}$/,
  tradeTitle: /^[a-zA-Z0-9@:()/#,. -]*$/,
  mobileNumber: /^\d{10}$/g,
};

class NoticeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      appNumberConfig: {
        text: 'applicationNumber',
        value: 'applicationNumber',
      },
      licenseNumberConfig: {
        text: 'licenseNumber',
        value: 'licenseNumber',
      },
    };
  }
  componentDidMount() {
    let { setLoadingStatus } = this.props;
    this.props.initForm();
    setLoadingStatus('loading');
    Promise.all([
      Api.commonApiPost('tl-masters/status/v1/_search', { moduleType: 'NEW LICENSE' }, {}, false, true),
      Api.commonApiPost('/egov-location/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName', {
        boundaryTypeName: 'Ward',
        hierarchyTypeName: 'ADMINISTRATION',
      }),
      Api.commonApiPost('/tl-services/license/v1/_search', {}, {}, false, true),
    ]).then(data => {
      //AutoComplete for Application Number, Trade License number
      try {
        let applicationNumberSource = data[2].licenses.filter(element => {
          return element.applicationNumber ? true : false;
        });
        let licenseNumberSource = data[2].licenses.filter(element => {
          return element.licenseNumber ? true : false;
        });
        this.setState({
          applicationStatus: data[0].licenseStatuses,
          ward: data[1].Boundary,
          applicationNumberSource,
          licenseNumberSource,
        });
      } catch (e) {
        console.log('Error');
      }
      setLoadingStatus('hide');
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  search = () => {
    let { NoticeSearch } = this.props;
    let finalObj = { ...NoticeSearch };
    for (var k in finalObj) {
      if (!finalObj[k]) delete finalObj[k];
    }
    finalObj['dateFrom'] ? (finalObj['dateFrom'] = dateToEpoch(finalObj['dateFrom'])) : '';
    finalObj['dateTo'] ? (finalObj['dateTo'] = dateToEpoch(finalObj['dateTo'])) : '';
    this.setState({
      searchParams: finalObj,
      showTable: true,
    });
  };
  clearField = code => {
    this.props.handleChange('', code, false, '', '');
  };
  handleError = msg => {
    let { toggleDailogAndSetText, setLoadingStatus } = this.props;
    setLoadingStatus('hide');
    toggleDailogAndSetText(true, msg);
  };
  render() {
    let { handleChange, setLoadingStatus, NoticeSearch, fieldErrors } = this.props;
    let { handleError } = this;
    return (
      <div>
        <Card style={styles.marginStyle}>
          <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('Search Notice')}</div>} />
          <CardText style={{ paddingTop: 0 }}>
            <Grid>
              <Row>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <AutoComplete
                    ref="applicationNumber"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.result.groups.applicationNumber')}
                    errorText={fieldErrors.applicationNumber ? fieldErrors.applicationNumber : ''}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSource={this.state.applicationNumberSource ? this.state.applicationNumberSource : []}
                    dataSourceConfig={this.state.appNumberConfig}
                    menuStyle={{ overflow: 'auto', maxHeight: '200px' }}
                    listStyle={{ overflow: 'auto' }}
                    value={NoticeSearch.applicationNumber}
                    onNewRequest={(chosenRequest, index) => {
                      if (index === -1) {
                        this.refs['applicationNumber'].setState({
                          searchText: '',
                        });
                        handleChange('', 'applicationNumber', false, '', '');
                      } else {
                        handleChange(chosenRequest.applicationNumber, 'applicationNumber', false, '', 'Select application number the list');
                      }
                    }}
                    onUpdateInput={(searchText, dataSource, params) => {
                      this.clearField('applicationNumber');
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.groups.tradeOwnerName')}
                    value={NoticeSearch.ownerName ? NoticeSearch.ownerName : ''}
                    errorText={fieldErrors.ownerName ? fieldErrors.ownerName : ''}
                    onChange={(e, newValue) => {
                      handleChange(newValue, 'ownerName', false, patterns.ownerName, 'Enter Valid Trade Owner Name(Min:3, Max:100)');
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.groups.mobileNumber')}
                    value={NoticeSearch.mobileNumber ? NoticeSearch.mobileNumber : ''}
                    errorText={fieldErrors.mobileNumber ? fieldErrors.mobileNumber : ''}
                    maxLength="10"
                    onChange={(e, newValue) => {
                      handleChange(newValue, 'mobileNumber', false, patterns.mobileNumber, translate('core.lbl.enter.mobilenumber'));
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.groups.tradeTitle')}
                    value={NoticeSearch.tradeTitle ? NoticeSearch.tradeTitle : ''}
                    errorText={fieldErrors.tradeTitle ? fieldErrors.tradeTitle : ''}
                    onChange={(e, newValue) => {
                      handleChange(newValue, 'tradeTitle', false, patterns.tradeTitle, 'Enter Valid Trade Title (Max: 250)');
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <AutoComplete
                    ref="tradeLicenseNumber"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.groups.licenseNumber')}
                    errorText={fieldErrors.tradeLicenseNumber ? fieldErrors.tradeLicenseNumber : ''}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSource={this.state.licenseNumberSource ? this.state.licenseNumberSource : []}
                    dataSourceConfig={this.state.licenseNumberConfig}
                    menuStyle={{ overflow: 'auto', maxHeight: '200px' }}
                    listStyle={{ overflow: 'auto' }}
                    value={NoticeSearch.tradeLicenseNumber ? NoticeSearch.tradeLicenseNumber : ''}
                    onNewRequest={(chosenRequest, index) => {
                      if (index === -1) {
                        this.refs['tradeLicenseNumber'].setState({
                          searchText: '',
                        });
                        handleChange('', 'tradeLicenseNumber', false, '', '');
                      } else {
                        handleChange(chosenRequest.licenseNumber, 'tradeLicenseNumber', false, '', '');
                      }
                    }}
                    onUpdateInput={(searchText, dataSource, params) => {
                      this.clearField('tradeLicenseNumber');
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <SelectField
                    maxHeight={200}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.groups.applicationStatus')}
                    value={NoticeSearch.applicationStatus ? NoticeSearch.applicationStatus : ''}
                    errorText={fieldErrors.applicationStatus ? fieldErrors.applicationStatus : ''}
                    onChange={(event, key, payload) => {
                      handleChange(payload, 'applicationStatus', false, '', '');
                    }}
                  >
                    <MenuItem value="" primaryText="Select" />
                    {this.state.applicationStatus
                      ? this.state.applicationStatus.map(
                          (status, index) => (status.active ? <MenuItem key={index} value={status.code} primaryText={status.name} /> : '')
                        )
                      : ''}
                  </SelectField>
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <SelectField
                    maxHeight={200}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.create.groups.licensedocumenttype.licenseapptype')}
                    value={NoticeSearch.applicationType ? NoticeSearch.applicationType : ''}
                    errorText={fieldErrors.applicationType ? fieldErrors.applicationType : ''}
                    onChange={(event, key, payload) => {
                      handleChange(payload, 'applicationType', false, '', '');
                    }}
                  >
                    <MenuItem value="" primaryText="Select" />
                    <MenuItem value="NEW" primaryText="New" />
                    <MenuItem value="RENEW" primaryText="Renew" />
                    <MenuItem value="TITLE_TRANSFER" primaryText="Title Transfer" />
                    <MenuItem value="CANCELLATION" primaryText="Cancellation" />
                    <MenuItem value="BUSINESS_NAME_CHANGE" primaryText="Business Name Change" />
                  </SelectField>
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <SelectField
                    maxHeight={200}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.create.licenses.groups.TradeLocationDetails.Ward')}
                    value={NoticeSearch.ward ? NoticeSearch.ward : ''}
                    errorText={fieldErrors.ward ? fieldErrors.ward : ''}
                    onChange={(event, key, payload) => {
                      handleChange(payload, 'ward', false, '', '');
                    }}
                  >
                    <MenuItem value="" primaryText="Select" />
                    {this.state.ward ? this.state.ward.map((ward, index) => <MenuItem key={index} value={ward.code} primaryText={ward.name} />) : ''}
                  </SelectField>
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <SelectField
                    maxHeight={200}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.documenttype')}
                    value={NoticeSearch.documentType ? NoticeSearch.documentType : ''}
                    errorText={fieldErrors.documentType ? fieldErrors.documentType : ''}
                    onChange={(event, key, payload) => {
                      handleChange(payload, 'documentType', false, '', '');
                    }}
                  >
                    <MenuItem value="" primaryText="Select" />
                    <MenuItem value="ACKNOWLEDGEMENT" primaryText="Acknowledgement" />
                    <MenuItem value="LICENSE_CERTIFICATE" primaryText="License Certificate" />
                    <MenuItem value="REJECTION_LETTER" primaryText="Rejection Letter" />
                  </SelectField>
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.fromDate')}
                    value={NoticeSearch.dateFrom ? NoticeSearch.dateFrom : ''}
                    errorText={fieldErrors.dateFrom ? fieldErrors.dateFrom : ''}
                    onChange={(e, newValue) => {
                      handleChange(
                        (newValue.length === 2 || newValue.length === 5) && newValue.length > NoticeSearch.dateFrom.length
                          ? newValue + '/'
                          : newValue,
                        'dateFrom',
                        false,
                        patterns.date,
                        'Enter in dd/mm/yyyy Format'
                      );
                    }}
                  />
                </Col>
                <Col xs={12} sm={4} md={3} lg={3}>
                  <TextField
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    floatingLabelText={translate('tl.search.toDate')}
                    value={NoticeSearch.dateTo ? NoticeSearch.dateTo : ''}
                    errorText={fieldErrors.dateTo ? fieldErrors.dateTo : ''}
                    onChange={(e, newValue) => {
                      handleChange(
                        (newValue.length === 2 || newValue.length === 5) && newValue.length > NoticeSearch.dateTo.length ? newValue + '/' : newValue,
                        'dateTo',
                        false,
                        patterns.date,
                        'Enter in dd/mm/yyyy Format'
                      );
                    }}
                  />
                </Col>
              </Row>
            </Grid>
          </CardText>
        </Card>
        <div className="text-center">
          <RaisedButton
            disabled={
              Object.values(fieldErrors).filter(String).length === 0 ? (Object.values(NoticeSearch).filter(String).length >= 1 ? false : true) : true
            }
            style={{ margin: '15px 5px' }}
            label={translate('core.lbl.search')}
            primary={true}
            onClick={e => {
              this.search();
            }}
          />
        </div>
        {this.state.showTable ? (
          <NoticeSearchResult
            searchParams={this.state.searchParams}
            noticeSearch={NoticeSearch}
            setLoadingStatus={setLoadingStatus}
            handleError={handleError}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.form.form);
  return {
    NoticeSearch: state.form.form,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(NoticeSearch);
