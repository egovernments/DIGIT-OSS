import React from "react";
import formHoc from "egov-ui-kit/hocs/form";
import GenericForm from "egov-ui-kit/common/GenericForm";

class DependantFormsHOC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dependentForms: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.combination !== nextProps.combination) {
      this.setFormContent(nextProps.combination);
    }
  }

  componentDidMount() {
    const { combination } = this.props;
    this.setFormContent(combination);
  }

  setFormContent = (combination) => {
    const { formsToAdd, removeForm } = this.props;
    formsToAdd &&
      formsToAdd.removeForms.forEach((formKey) => {
        removeForm(formKey);
      });
    this.setState({
      dependentForms: this.getAllForms(combination),
    });
  };

  getAllForms = (combination) => {
    const { formsToAdd, moduleName } = this.props;
    return (
      formsToAdd &&
      formsToAdd.formKeys.map((formKey, index) => {
        let DependantForm = formHoc({ formKey: formKey, path: `${moduleName}/${combination}` })(GenericForm);
        return (
          <div key={index}>
            <DependantForm />
          </div>
        );
      })
    );
  };

  render() {
    const { dependentForms } = this.state;
    return <div>{dependentForms && [...this.state.dependentForms]}</div>;
  }
}

export default DependantFormsHOC;
