import React from "react";
import { LoadingIndicator } from "components";
import { connect } from "react-redux";
import { handleFieldChange, initForm, submitForm, deleteForm } from "egov-ui-kit/redux/form/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const form = ({ formKey, path, copyName, rowData, isCoreConfiguration, edit = false, ...rest }) => (Form) => {
  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);
      const { extraFields } = rest;
      try {
        if (isCoreConfiguration && path) {
          this.formConfig = require(`egov-ui-kit/config/forms/specs/${path}/${formKey}`).default;
        } else if (path) {
          this.formConfig = require(`config/forms/specs/${path}/${formKey}`).default;
        } else {
          this.formConfig = require(`config/forms/specs/${formKey}`).default;
        }
        if (extraFields) {
          this.formConfig = {
            ...this.formConfig,
            ["fields"]: {
              ...this.formConfig.fields,
              ...extraFields,
            },
          };
        }
      } catch (error) {
        // the error is assumed to have occured due to absence of config; so ignore it!
      }
    }

    componentDidMount() {
      if (this.formConfig && copyName) {
        let formConf = { ...this.formConfig };
        formConf = this.createCopy(formConf);
        this.props.initForm(formConf, rowData);
      } else {
        this.formConfig && this.props.initForm(this.formConfig, rowData);
      }
    }

    createCopy = (formConf) => {
      let updatedFormConf = { ...formConf };
      const { formatConfig } = updatedFormConf;
      updatedFormConf.name = copyName;
      formKey = updatedFormConf.name;
      if (formatConfig) {
        updatedFormConf = formatConfig({ ...this.props, ...rest, config: updatedFormConf });
      }
      return updatedFormConf;
    };

    submitForm = () => {
      const { form } = this.props;
      const saveUrl = edit ? form.editUrl : form.saveUrl;
      this.props.submitForm(formKey, saveUrl);
    };

    handleFieldChange = (fieldKey, value, jsonPath) => {
      this.props.handleFieldChange(formKey, fieldKey, value);
      this.props.prepareFinalObject(jsonPath, value);
    };

    render() {
      const { handleFieldChange, submitForm } = this;
      const { loading } = this.props;
      return (
        <div>
          <form
            id={formKey}
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
          >
            <Form {...this.props} formKey={formKey} submitForm={submitForm} handleFieldChange={handleFieldChange} />
          </form>
          {loading && <LoadingIndicator />}
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    const form = state.form[formKey] || {};
    const formKeys = Object.keys(state.form);
    const { loading } = form || false;
    return { form, formKeys, loading };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
      submitForm: (formKey, saveUrl) => dispatch(submitForm(formKey, saveUrl)),
      initForm: (form) => dispatch(initForm(form)),
      deleteForm: () => dispatch(deleteForm(formKey)),
      prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(FormWrapper);
};

export default form;
