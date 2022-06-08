import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { translate } from './common';
import Api from '../../api/api';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import styles from '../../styles/material-ui';

export default class Fields extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pad = n => {
    return n < 10 ? '0' + n : n;
  };

  shouldComponentUpdate(nextProps, nextState) {
    //console.log('nextState', nextState, this.state);
    //console.log('nextProps', nextProps, this.props);
    //console.log('ItShouldUpdate', !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderFields = obj => {
    let des = translate(obj.description);
    let mandatory = obj.required == true ? ' *' : '';
    let description = des + mandatory;
    if (obj.variable) {
      switch (obj.dataType) {
        case 'string':
          if (obj.url) return <CustomAutoComplete obj={obj} description={description} value={this.props.value} handler={this.props.handler} />;
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(e, newValue) => this.props.handler(newValue, obj.code, obj.required, '')}
                errorText={this.props.error ? this.props.error : ''}
                maxLength="50"
              />
            </Col>
          );
        case 'checkbox':
          return (
            <Col xs={12} sm={12} md={12} lg={12}>
              {/* errorText={this.props.error ? this.props.error : ""} */}
              <div>
                <Checkbox
                  label={description}
                  checked={this.props.value ? this.props.value : false}
                  onCheck={(e, isChecked) => {
                    this.props.handler(isChecked ? true : '', obj.code, obj.required, '');
                  }}
                />
                {this.props.error ? <span className="errorMsg">{this.props.error}</span> : null}
              </div>
            </Col>
          );
        case 'radiogroup':
          return (
            <Col xs={12} sm={12} md={12} lg={12}>
              {/*this.props.error ? (<span className="errorMsg">{this.props.error}</span>) : null*/}
              <div className="radio-group">
                <div className="field-title">
                  {obj.description}
                  {obj.required ? ' *' : ''}
                  {this.props.error ? (
                    <div>
                      <span className="errorMsg">{this.props.error}</span>
                    </div>
                  ) : null}
                </div>
                <RadioButtonGroup
                  name={obj.code}
                  defaultSelected={this.props.value}
                  className="row"
                  onChange={(e, value) => {
                    this.props.handler(value, obj.code, obj.required, '');
                  }}
                >
                  {obj.attribValues &&
                    obj.attribValues.map(
                      (dd, index) => (dd.isActive ? <RadioButton className="col-md-4" key={index} value={dd.key} label={translate(dd.name)} /> : null)
                    )}
                </RadioButtonGroup>
              </div>
            </Col>
          );
        case 'textarea':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textarea"
                fullWidth={true}
                ref={obj.code}
                multiLine={true}
                rowsMax={4}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(e, newValue) => this.props.handler(newValue, obj.code, obj.required, '')}
                errorText={this.props.error ? this.props.error : ''}
                maxLength="500"
              />
            </Col>
          );
        case 'integer':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(e, newValue) => this.props.handler(newValue, obj.code, obj.required, /^[+-]?\d+$/)}
                errorText={this.props.error ? this.props.error : ''}
                maxLength="10"
              />
            </Col>
          );
        case 'long':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(e, newValue) => this.props.handler(newValue, obj.code, obj.required, /^[+-]?\d+$/)}
                errorText={this.props.error ? this.props.error : ''}
                maxLength="18"
              />
            </Col>
          );
        case 'double':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <TextField
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(e, newValue) => this.props.handler(newValue, obj.code, obj.required, /^[+-]?\d+(\.\d+)?$/)}
                errorText={this.props.error ? this.props.error : ''}
              />
            </Col>
          );
        case 'date':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <DatePicker
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={
                  this.props.value ? new Date(this.props.value.split('-')[2], this.props.value.split('-')[1] - 1, this.props.value.split('-')[0]) : ''
                }
                formatDate={date => {
                  let dateObj = new Date(date);
                  let year = dateObj.getFullYear();
                  let month = dateObj.getMonth() + 1;
                  let dt = dateObj.getDate();
                  dt = dt < 10 ? '0' + dt : dt;
                  month = month < 10 ? '0' + month : month;
                  return dt + '-' + month + '-' + year;
                }}
                onChange={(nothing, date) => {
                  let dateObj = new Date(date);
                  let year = dateObj.getFullYear();
                  let month = dateObj.getMonth() + 1;
                  let dt = dateObj.getDate();
                  dt = dt < 10 ? '0' + dt : dt;
                  month = month < 10 ? '0' + month : month;
                  this.props.handler(dt + '-' + month + '-' + year, obj.code, obj.required, '');
                }}
              />
            </Col>
          );
        case 'datetime':
          //console.log(this.props.value, this.props.value.split(' '));
          let date, time;
          if (this.props.value) {
            date = this.props.value.split(' ')[0];
            time = this.props.value.split(' ')[1];
            //console.log((this.props.value && date && time) ? new Date(date.split('-')[2], date.split('-')[1]-1, date.split('-')[0], time.split(':')[0], time.split(':')[1], time.split(':')[2]) : '');
          }
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <DatePicker
                className="custom-form-control-for-textfield"
                fullWidth={true}
                ref={obj.code}
                floatingLabelText={description}
                value={
                  this.props.value && date && time
                    ? new Date(
                        date.split('-')[2],
                        date.split('-')[1] - 1,
                        date.split('-')[0],
                        time.split(':')[0],
                        time.split(':')[1],
                        time.split(':')[2]
                      )
                    : ''
                }
                formatDate={date => {
                  return this.props.value;
                }}
                onChange={(nothing, date) => {
                  let dateObj = new Date(date);
                  let year = dateObj.getFullYear();
                  let month = dateObj.getMonth() + 1;
                  let dt = dateObj.getDate();
                  dt = dt < 10 ? '0' + dt : dt;
                  month = month < 10 ? '0' + month : month;
                  this.props.handler(dt + '-' + month + '-' + year, obj.code, obj.required, '');
                  this.refs[obj.code + 'timepicker'].openDialog();
                }}
              />
              <TimePicker
                ref={obj.code + 'timepicker'}
                format="24hr"
                style={{ display: 'none' }}
                onChange={(nothing, time) => {
                  this.props.handler(
                    this.props.value + ' ' + this.pad(time.getHours()) + ':' + this.pad(time.getMinutes()) + ':00',
                    obj.code,
                    obj.required,
                    ''
                  );
                }}
              />
            </Col>
          );
        case 'singlevaluelist':
          if (obj.url)
            return <CustomSelectField obj={obj} description={description} isMultiple={false} value={this.props.value} handler={this.props.handler} />;
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                fullWidth={true}
                ref={obj.code}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(event, key, value) => {
                  this.props.handler(value, obj.code, obj.required, '');
                }}
              >
                <MenuItem value="" primaryText="Select" />
                {obj.attribValues.map(
                  (dd, index) => (dd.isActive ? <MenuItem value={translate(dd.key)} key={index} primaryText={translate(dd.name)} /> : null)
                )}
              </SelectField>
            </Col>
          );
        case 'multivaluelist':
          if (obj.url)
            return <CustomSelectField obj={obj} description={description} isMultiple={true} value={this.props.value} handler={this.props.handler} />;
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <SelectField
                className="custom-form-control-for-select"
                hintText="Select"
                fullWidth={true}
                ref={obj.code}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                multiple={true}
                floatingLabelText={description}
                value={this.props.value}
                onChange={(event, key, value) => {
                  this.props.handler(value, obj.code, obj.required, '');
                }}
              >
                {obj.attribValues &&
                  obj.attribValues.map(
                    (dd, index) =>
                      dd.isActive ? (
                        <MenuItem
                          value={translate(dd.key)}
                          insetChildren={true}
                          checked={this.props.value && this.props.value.indexOf(dd.key) > -1}
                          key={index}
                          primaryText={translate(dd.name)}
                        />
                      ) : null
                  )}
              </SelectField>
            </Col>
          );
        case 'file':
          return (
            <Col xs={12} md={3}>
              <div>{description}</div>
              <input type="file" className="form-control" />
            </Col>
          );
        case 'multifile':
          return (
            <Col xs={12} sm={4} md={3} lg={3}>
              <div>{description}</div>
              <input type="file" multiple className="form-control" />
            </Col>
          );
      }
    } else {
      return (
        <Col xs={12} md={3}>
          {des}
        </Col>
      );
    }
  };
  render() {
    return this.renderFields(this.props.obj);
  }
}

class CustomAutoComplete extends Component {
  constructor() {
    super();
    this.state = {
      searchList: [],
      searchText: '',
      prevText: '',
      searchListConfig: {
        text: 'name',
        value: 'key',
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log('nextState', nextState, this.state);
    //console.log('nextProps', nextProps, this.props);
    //console.log('ItShouldUpdate', !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onKeyUpHandler = e => {
    var obj = this.props.obj;
    if (e.target.value && e.target.value !== this.state.prevText) {
      this.setState({ prevText: e.target.value });
      this.props.handler('', obj.code, obj.required, '');
      var urlsPart = obj.url.split('?');
      var queryParams = {};
      var url = '';
      let _this = this;
      if (urlsPart.length === 2) {
        queryParams = JSON.parse('{"' + urlsPart[1].replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
          return key === '' ? value : decodeURIComponent(value);
        });
        url = urlsPart[0];
      } else url = this.props.obj.url;

      Object.keys(queryParams).map(key => {
        if (!queryParams[key]) {
          queryParams[key] = e.target.value;
          return;
        }
      });

      Api.commonApiGet(url, queryParams).then(
        function(response) {
          if (!response instanceof Array) {
            var jsonArryKey = Object.keys(response).length > 1 ? Object.keys(response)[1] : '';
            if (jsonArryKey) {
              response = response[jsonArryKey];
            } else {
              response = [];
            }
          }

          const searchList = [];
          response.map(item => {
            searchList.push({ key: item.id, name: item.name });
          });
          _this.setState({ searchList });
        },
        function(err) {}
      );
    }
  };

  render() {
    const obj = this.props.obj;

    return (
      <Col xs={12} sm={4} md={3} lg={3}>
        <AutoComplete
          hintText={this.props.description}
          ref={obj.code}
          fullWidth={true}
          floatingLabelText={this.props.description}
          filter={AutoComplete.noFilter}
          dataSource={this.state.searchList}
          dataSourceConfig={this.state.searchListConfig}
          menuStyle={{ overflow: 'auto', maxHeight: '150px' }}
          listStyle={{ overflow: 'auto', lineHeight: '36px', fontSize: '14px' }}
          onKeyUp={this.onKeyUpHandler}
          value={this.props.value}
          onNewRequest={(item, index) => {
            if (index === -1) {
              this.setState({ searchText: '' });
            } else {
              this.setState({ prevText: item.name });
              this.props.handler(item.key, obj.code, obj.required, '');
            }
          }}
        />
      </Col>
    );
  }
}

class CustomSelectField extends Component {
  constructor() {
    super();
    this.state = {
      attribValues: [],
      loadingText: '',
      isLoading: true,
    };
  }

  componentWillMount() {
    this.renderAttributes(this.props.obj);
    this.setState({ loadingText: translate('csv.lbl.loading') });
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log('nextState', nextState, this.state);
    //console.log('nextProps', nextProps, this.props);
    //console.log('ItShouldUpdate', !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderAttributes = obj => {
    var urlsPart = obj.url.split('?');
    var queryParams = {};
    var url = '';
    let _this = this;
    if (urlsPart.length === 2) {
      queryParams = JSON.parse('{"' + urlsPart[1].replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
        return key === '' ? value : decodeURIComponent(value);
      });
      url = urlsPart[0];
    } else url = obj.url;
    Api.commonApiPost(url, queryParams, {}).then(
      function(response) {
        var jsonArryKey = Object.keys(response).length > 1 ? Object.keys(response)[1] : '';
        if (jsonArryKey) {
          const attribValues = [];
          response[jsonArryKey].map(item => {
            attribValues.push({ key: item.id, name: item.name });
          });
          _this.setState({ attribValues, isLoading: false, loadingText: '' });
        }
      },
      function(err) {}
    );
  };

  renderMenuItems = props => {
    return this.state.attribValues.map((dd, index) => {
      if (this.props.isMultiple)
        return (
          <MenuItem
            value={translate(dd.key)}
            insetChildren={true}
            checked={this.props.value && this.props.value.indexOf(dd.key) > -1}
            key={index}
            primaryText={translate(dd.name)}
          />
        );
      else return <MenuItem value={translate(dd.key)} key={index} primaryText={translate(dd.name)} />;
    });
  };

  render() {
    const obj = this.props.obj;
    const description = this.props.description;
    const menuItems = this.renderMenuItems(this.props.isMultiple) || null;
    return (
      <Col xs={12} sm={4} md={3} lg={3}>
        <SelectField
          fullWidth={true}
          ref={obj.code}
          multiple={this.props.isMultiple}
          floatingLabelText={description}
          floatingLabelFixed={this.state.isLoading}
          hintText={this.state.loadingText}
          value={this.props.value}
          onChange={(event, key, value) => {
            this.props.handler(value, obj.code, obj.required, '');
          }}
        >
          {menuItems}
        </SelectField>
      </Col>
    );
  }
}
