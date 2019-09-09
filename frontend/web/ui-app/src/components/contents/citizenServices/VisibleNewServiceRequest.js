import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NewServiceRequest from './NewServiceRequest';

const mapStateToProps = state => {
  return {
    form: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: requiredArray => {
    if (!requiredArray) requiredArray = [];

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
  toggleDailogAndSetText: (dailogState, msg) => {
    dispatch({ type: 'TOGGLE_DAILOG_AND_SET_TEXT', dailogState, msg });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  handleChange: (value, property, isRequired, pattern) => {
    dispatch({ type: 'HANDLE_CHANGE', property, value, isRequired, pattern });
  },
  addFile: action => {
    dispatch({
      type: 'FILE_UPLOAD_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      files: action.files,
    });
  },
  removeFile: action => {
    dispatch({
      type: 'FILE_REMOVE_BY_CODE',
      isRequired: action.isRequired,
      code: action.code,
      name: action.name,
    });
  },
});

const VisibleNewServiceRequest = connect(mapStateToProps, mapDispatchToProps)(NewServiceRequest);

export default VisibleNewServiceRequest;
