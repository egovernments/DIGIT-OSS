import React, { Component } from 'react';
import _ from 'lodash';

import { translate } from '../../common/common';
var DateTimeField = require('react-bootstrap-datetimepicker');
var moment = require('moment');

const UiTimeField = props => {
  const renderTimePicker = () => {
    const { item } = props;

    var inputProps = {
      placeholder: 'hh:mm',
      id: item.jsonPath.split('.').join('-'),
      disabled: item.isDisabled,
    };
    var action = props.actionName;
    var time = props.getVal(item.jsonPath) || undefined;

    if (_.isEmpty(props.getVal(item.jsonPath)) && item.reset) {
      inputProps['value'] = '';
    } else if ((action === 'update' || action === 'create') && time && !/date/.test(time)) {
      time = parseInt(time);
      inputProps['value'] = moment(time).format('h:mm A');
    }

    switch (props.ui) {
      case 'google':
        return (
          <div
            style={{
              marginTop: '17px',
              display: item.hide ? 'none' : 'inline-block',
            }}
            className="custom-form-control-for-datepicker"
          >
            <label>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
            </label>
            <br />
            <DateTimeField
              mode="time"
              dateTime={time}
              size="sm"
              inputFormat="h:mm A"
              inputProps={inputProps}
              defaultText=""
              onChange={e => {
                props.handler(
                  { target: { value: e } },
                  item.jsonPath,
                  item.isRequired ? true : false,
                  /\d{12,13}/,
                  item.requiredErrMsg,
                  item.patternErrMsg || translate('framework.time.error.message'),
                  item.expression,
                  item.expressionMsg,
                  true
                );
              }}
            />
            <div
              style={{
                height: '23px',
                visibility: props.fieldErrors && props.fieldErrors[item.jsonPath] ? 'visible' : 'hidden',
                position: 'relative',
                fontSize: '12px',
                lineHeight: '23px',
                color: 'rgb(244, 67, 54)',
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                float: 'left',
              }}
            >
              {props.fieldErrors && props.fieldErrors[item.jsonPath] ? props.fieldErrors[item.jsonPath] : ' '}
            </div>
          </div>
        );
    }
  };

  return renderTimePicker();
};

export default UiTimeField;
