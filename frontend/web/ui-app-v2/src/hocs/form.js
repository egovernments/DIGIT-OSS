import React from "react";
import { LoadingIndicator } from "components";
import { connect } from "react-redux";
import { handleFieldChange, initForm, submitForm } from "redux/form/actions";

const form = ({ formKey, rowData, edit = false }) => (Form) => {
  class FormWrapper extends React.Component {
    constructor(props) {
      super(props);
      try {
        this.formConfig = require(`config/forms/specs/${formKey}`).default;
      } catch (error) {
        // the error is assumed to have occured due to absence of config; so ignore it!
      }
    }

    componentDidMount() {
      this.formConfig && this.props.initForm(this.formConfig, rowData);
    }

    submitForm = () => {
      const { form } = this.props;
      const saveUrl = edit ? form.editUrl : form.saveUrl;
      this.props.submitForm(formKey, saveUrl);
    };

    handleFieldChange = (fieldKey, value) => {
      this.props.handleFieldChange(formKey, fieldKey, value);
    };

    render() {
      const { handleFieldChange, submitForm } = this;
      const { loading } = this.props;

      return (
        <div>
          <form
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
    const { loading } = form || false;
    return { form, loading };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
      submitForm: (formKey, saveUrl) => dispatch(submitForm(formKey, saveUrl)),
      initForm: (form) => dispatch(initForm(form)),
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(FormWrapper);
};

export default form;
