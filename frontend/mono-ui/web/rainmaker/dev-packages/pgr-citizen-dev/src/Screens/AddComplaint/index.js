import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import AddComplaintForm from "./components/AddComplaintForm";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { Screen } from "modules/common";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";


const ComplaintFormHOC = formHoc({
  formKey: "complaint",
  isCoreConfiguration: true,
  path: "pgr/pgr-citizen"
})(AddComplaintForm);

class AddComplaints extends Component {
  componentDidMount() {
    this.props.resetForm();
    const { fetchComplaintCategories } = this.props;
    fetchComplaintCategories();
  }
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
    fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    resetForm:()=>dispatch(prepareFinalObject("services",[{}]))  
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddComplaints);
