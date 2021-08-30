import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import AddComplaintForm from "./components/AddComplaintForm";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { Screen } from "modules/common";
import "./index.css";

const ComplaintFormHOC = formHoc({
  formKey: "complaint",
  isCoreConfiguration: true,
  path: "pgr/pgr-citizen"
})(AddComplaintForm);

class AddComplaints extends Component {
  render() {
    const { categories, localizationLabels } = this.props;
    return (
      <Screen>
        <ComplaintFormHOC
          categories={categories}
          localizationLabels={localizationLabels}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { localizationLabels, currentLocation } = state.app;
  const form = state.form["complaint"];
  const categories = state.complaints.categoriesById;
  return { categories, form, localizationLabels, currentLocation };
};

const mapDispatchToProps = dispatch => {
  return {
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddComplaints);
