import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import AddComplaintForm from "./components/AddComplaintForm";
import { Screen } from "modules/common";
import { handleFieldChange,setFieldProperty } from "egov-ui-kit/redux/form/actions";
import isEqual from "lodash/isEqual";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";

const ComplaintFormHOC = formHoc({
  formKey: "complaint",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(AddComplaintForm);

class AddComplaints extends Component {
  // componentWillReceiveProps = (nextProps) => {
  //   const { form, handleFieldChange } = this.props;
  //    if (form) {
  //const tenantId = getTenantId();
  //   // if (nextProps.currentLocation && nextProps.currentLocation.address) {
  //   //   const { lat, lng, address } = nextProps.currentLocation;
  //   //   handleFieldChange("complaint", "latitude", lat);
  //   //   handleFieldChange("complaint", "longitude", lng);
  //   //   handleFieldChange("complaint", "address", address);
  //   // }
  //handleFieldChange("complaint", "city", tenantId);
  //}
  //};
  componentDidMount() {
    this.props.resetForm();
    this.props.resetFieldValue();
    const { fetchComplaintCategories } = this.props;
    fetchComplaintCategories();
  }
  componentWillReceiveProps = nextprops => {
    if (!isEqual(nextprops, this.props)) {
      let inputType = document.getElementsByTagName("input");
      for (let input in inputType) {
        if (inputType[input].type === "number") {
          inputType[input].addEventListener("mousewheel", function() {
            this.blur();
          });
        }
      }
    }
  };

  render() {
    const { categories, localizationLabels } = this.props;
    return (
      <Screen>
        <ComplaintFormHOC
          categories={categories}
          localizationLabels={localizationLabels}
          history={this.props.history}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { localizationLabels } = state.app;
  // const  form = state.form["complaint"];
  const categories = state.complaints.categoriesById;
  return { categories, localizationLabels };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    resetForm:()=>dispatch(prepareFinalObject("services",[{}])),
    resetFieldValue:()=>dispatch(setFieldProperty("complaint","city","value","")),  

    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddComplaints);
