import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import styles from '../../../../styles/material-ui';
import _ from 'lodash';
import { Col } from 'react-bootstrap';
import MenuItem from 'material-ui/MenuItem';
import Search from 'material-ui/svg-icons/action/search';
import { translate } from '../../../common/common';

export default class RenderField extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    //console.log('customField should update', !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)));
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderCustomField = ({
    field,
    isDisabled,
    handleChange,
    customSearch,
    error,
    value,
    nameValue,
    autocompleteDataSource,
    autocompleteKeyUp,
    autocompleteDataSourceConfig,
    dropdownDataSourceConfig,
    dropdownDataSource,
  }) => {
    var floatingLabelText = (
      <span>
        {translate(field.label)} <span style={{ color: '#FF0000' }}>{field.isMandatory ? ' *' : ''}</span>
      </span>
    );
    switch (field.type) {
      case 'text':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <TextField
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              floatingLabelText={floatingLabelText}
              id={field.id || ''}
              fullWidth={true}
              maxLength={field.maxLength}
              value={value || ''}
              errorText={field.isDisabled ? '' : error || ''}
              disabled={isDisabled || false}
              onChange={(event, value) => handleChange(value, field)}
            />
          </Col>
        );
      case 'textSearch':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <div style={{ position: 'relative' }}>
              <TextField
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={floatingLabelText}
                fullWidth={true}
                maxLength={field.maxLength}
                value={value || ''}
                errorText={field.isDisabled ? '' : error || ''}
                disabled={isDisabled || false}
                onChange={(event, value) => {
                  handleChange(value, field);
                }}
              />
              <span>
                <Search
                  style={{
                    position: 'absolute',
                    top: 32,
                    right: 10,
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    customSearch(field.code);
                  }}
                />
              </span>
            </div>
          </Col>
        );
      case 'textarea':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <TextField
              fullWidth={true}
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              floatingLabelText={floatingLabelText}
              multiLine={true}
              value={value || ''}
              id={field.id || ''}
              disabled={isDisabled || false}
              errorText={error || ''}
              maxLength={field.maxLength}
              onChange={(event, value) => handleChange(value, field)}
            />
          </Col>
        );
      case 'date':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <TextField
              fullWidth={true}
              hintText="DD/MM/YYYY"
              disabled={isDisabled || false}
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              floatingLabelText={floatingLabelText}
              value={value || ''}
              id={field.id || ''}
              errorText={error || ''}
              maxLength={field.maxLength}
              onChange={(event, value) => handleChange(value, field)}
            />
          </Col>
        );
      case 'autocomplete':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <AutoComplete
              fullWidth={true}
              disabled={isDisabled || false}
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              dataSourceConfig={autocompleteDataSourceConfig}
              dataSource={autocompleteDataSource}
              id={field.id || ''}
              onKeyUp={e => autocompleteKeyUp(e, field)}
              floatingLabelText={floatingLabelText}
            />
          </Col>
        );
      case 'dropdown':
        value = value + (nameValue ? '~' + nameValue : '');
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <SelectField
              fullWidth={true}
              disabled={isDisabled || false}
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFixed={true}
              floatingLabelText={floatingLabelText}
              value={value || ''}
              id={field.id || ''}
              maxHeight={200}
              onChange={(event, key, value) => {
                handleChange(value, field);
              }}
            >
              {dropdownDataSource &&
                dropdownDataSource.map((item, index) => {
                  if (field.codeName) {
                    return (
                      <MenuItem
                        value={`${item[dropdownDataSourceConfig.value]}~${translate(item[dropdownDataSourceConfig.text])}`}
                        key={index}
                        primaryText={translate(item[dropdownDataSourceConfig.text])}
                      />
                    );
                  } else {
                    return (
                      <MenuItem
                        value={`${item[dropdownDataSourceConfig.value]}`}
                        key={index}
                        primaryText={translate(item[dropdownDataSourceConfig.text])}
                      />
                    );
                  }
                })}
            </SelectField>
          </Col>
        );
      case 'checkbox':
        return (
          <Col xs={12} sm={4} md={4} lg={4}>
            <Checkbox
              label={floatingLabelText}
              checked={value || false}
              id={field.id || ''}
              onCheck={(e, isChecked) => {
                handleChange(isChecked ? true : false, field);
              }}
            />
          </Col>
        );
      default:
        return null;
    }
  };

  render() {
    return this.renderCustomField(this.props);
  }
}
