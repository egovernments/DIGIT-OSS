import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import AddComplaintForm from "./components/AddComplaintForm";
import Screen from "modules/common/common/Screen";
import "./index.css";

const ComplaintFormHOC = formHoc({ formKey: "complaint" })(AddComplaintForm);

class AddComplaints extends Component {
  render() {
    const { categories, localizationLabels } = this.props;
    return (
      <Screen>
        <ComplaintFormHOC categories={categories} localizationLabels={localizationLabels} />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { localizationLabels } = state.app;
  const categories = state.complaints.categoriesById;
  return { categories, localizationLabels };
};

export default connect(mapStateToProps)(AddComplaints);
