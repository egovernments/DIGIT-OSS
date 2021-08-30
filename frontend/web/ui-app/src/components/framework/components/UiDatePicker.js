import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { translate } from '../../common/common';
import $ from 'jquery';
import _ from 'lodash';
var DateTime = require('react-datetime');
var moment = require('moment');

const datePat = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
class UiDatePicker extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    var keyPressed = false;
    let { handler } = this.props;

    $('.custom-form-control-for-datepicker input').on('keypress', e => {
      // For checking the garbage data on key press event
      keyPressed = true;
    });

    $('.custom-form-control-for-datepicker input').on('focusout', e => {
      // Adding an extra keypress check to ignore garbage value --> Fix for "selection from calender" bug
      if (
        keyPressed &&
        !e.target.value.match(
          /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g
        )
      ) {
        handler({ target: { value: '' } }, e.target.id.split('-').join('.'), false, /\d{12,13}/, '', '' || translate('framework.date.error.message'));
        var autoComField = document.getElementById(e.target.id);
        autoComField.value = '';
        keyPressed = false;
      }
    });
  }

  calcMinMaxDate = dateStr => {
    if (dateStr) {
      if (dateStr == 'today') {
        return moment();
      } else if (dateStr.indexOf('+') > -1) {
        var oneDay = 24 * 60 * 60 * 1000;
        dateStr = dateStr.split('+')[1];
        return moment(new Date(new Date().getTime() + Number(dateStr) * oneDay));
      } else {
        var oneDay = 24 * 60 * 60 * 1000;
        dateStr = dateStr.split('-')[1];
        return moment(new Date(new Date().getTime() - Number(dateStr) * oneDay));
      }
    } else {
      return '';
    }
  };

  getDateFormat = timeLong => {
    if (timeLong) {
      if ((timeLong.toString().length == 12 || timeLong.toString().length == 13) && new Date(Number(timeLong)).getTime() > 0) {
        var _date = new Date(Number(timeLong));
        return ('0' + _date.getDate()).slice(-2) + '/' + ('0' + (_date.getMonth() + 1)).slice(-2) + '/' + _date.getFullYear();
      } else {
        return timeLong;
      }
    } else if (!timeLong) return '';
  };

  renderDatePicker = item => {
    let formData = _.cloneDeep(this.props.formData);

    _.set(formData, this.props.item.jsonPath, formData[item.jsonPath]);

    switch (this.props.ui) {
      case 'google':
        let label = !item.isHideLabel && (
          <div>
            <label>
              {item.label} <span style={{ color: '#FF0000' }}>{item.isRequired ? ' *' : ''}</span>
            </label>
            <br />
          </div>
        );
        let dateTimeValue = this.props.getVal(item.jsonPath);
        if(item.defaultDate && !dateTimeValue){
          dateTimeValue = new Date();
          _.set(this.props.formData, this.props.item.jsonPath, new Date().getTime());
        }
       
        return (
          <div
            style={{
              width: '100%',
              marginTop: '17px',
              display: item.hide ? 'none' : 'inline-block',
            }}
            className="custom-form-control-for-datepicker"
          >
            {label}
            <DateTime
              value={dateTimeValue}
              dateFormat="DD/MM/YYYY"
              timeFormat={false}
              inputProps={{
                placeholder: 'DD/MM/YYYY',
                id: item.jsonPath.split('.').join('-'),
                disabled: item.isDisabled,
              }}
              isValidDate={currentDate => {
                if (item.minDate && item.maxDate) {
                  return this.calcMinMaxDate(item.minDate).isBefore(currentDate) && this.calcMinMaxDate(item.maxDate).isAfter(currentDate);
                } else if (item.minDate) {
                  return this.calcMinMaxDate(item.minDate).isBefore(currentDate);
                } else if (item.maxDate) {
                  return this.calcMinMaxDate(item.maxDate).isAfter(currentDate);
                } else return true;
              }}
              closeOnSelect={true}
              closeOnTab={true}
              onChange={e => {
                this.minMaxvalidation(e, item);
              }}
            />
            <div
              style={{
                height: !!item.style && !!item.style.height ? `${item.style.height}!important` : '23px',
                visibility: this.props.fieldErrors && this.props.fieldErrors[item.jsonPath] ? 'visible' : 'hidden',
                position: 'relative',
                fontSize: '12px',
                lineHeight: '23px',
                color: 'rgb(244, 67, 54)',
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                float: 'left',
              }}
            >
              {this.props.fieldErrors && this.props.fieldErrors[item.jsonPath] ? this.props.fieldErrors[item.jsonPath] : ' '}
            </div>
          </div>
        );
    }
  };

  minMaxvalidation = (e, item) => {
    // Added new else block for string input
    //chosen date
    if (typeof e === 'object') {
      if (item.minDate || item.maxDate) {
        if (moment().diff(moment(e.toDate()), 'days') < 0 && item.maxDate === 'today') {
          this.props.handler(
            { target: { value: '' } },
            item.jsonPath,
            item.isRequired ? true : false,
            /\d{12,13}/,
            item.requiredErrMsg,
            item.patternErrMsg || translate('framework.date.error.message'),
            item.expression,
            item.expressionMsg,
            true
          );
          let { toggleDailogAndSetText } = this.props;
          toggleDailogAndSetText(true, translate('framework.date.futureEror.message'));
        } else {
          //random string - not proper date
          this.props.handler(
            { target: { value: typeof e == 'string' ? e : e.valueOf() } },
            item.jsonPath,
            item.isRequired ? true : false,
            /\d{12,13}/,
            item.requiredErrMsg,
            item.patternErrMsg || translate('framework.date.error.message'),
            item.expression,
            item.expressionMsg,
            true
          );
        }
      } else {
        this.props.handler(
          { target: { value: typeof e == 'string' ? e : e.valueOf() } },
          item.jsonPath,
          item.isRequired ? true : false,
          /\d{12,13}/,
          item.requiredErrMsg,
          item.patternErrMsg || translate('framework.date.error.message'),
          item.expression,
          item.expressionMsg,
          true
        );
      }
    } else {
      // Else Block for the case of string --> Change the target value to string value
      this.props.handler(
        { target: { value: typeof e == 'string' ? e : e.valueOf() } },
        item.jsonPath,
        item.isRequired ? true : false,
        /\d{12,13}/,
        item.requiredErrMsg,
        item.patternErrMsg || translate('framework.date.error.message'),
        item.expression,
        item.expressionMsg,
        true
      );
    }
  };

  render() {
    return this.renderDatePicker(this.props.item);
  }
}

const mapStateToProps = state => {
  return {
    formData: state.frameworkForm.form,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UiDatePicker);
