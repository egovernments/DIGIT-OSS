import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import { fetchComplaints } from "egov-ui-kit/redux/complaints/actions";
import { fileUpload } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ComplaintResolvedForm from "./components/ComplaintResolvedForm";
import "./index.css";

const ComplaintResolvedHOC = formHoc({
  formKey: "complaintResolved",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(ComplaintResolvedForm);

class ComplaintResolved extends Component {
  componentDidMount() {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([
      { key: "serviceRequestId", value: match.params.serviceRequestId }
    ]);
  }

  onSubmit = e => {
    if (!this.props.isFormValid) {
      e.preventDefault();
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please upload photo or write comments",
          labelKey: "ERR_PLEASE_UPLOAD_PHOTO"
        },
        "error"
      );
    }
  };

  render() {
    return (
      <Screen className="background-white">
        <ComplaintResolvedHOC onSubmit={this.onSubmit} />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { form } = state || {};
  const { fields, files } = (form && form["complaintResolved"]) || {};
  const formValidArray = fields
    ? Object.keys(fields).reduce((result, current) => {
        if (current !== "action") {
          const formValid =
            fields[current].value ||
            (files && files.media && files.media.length)
              ? true
              : false;
          result.push(formValid);
        }
        return result;
      }, [])
    : [];
  const isFormValid =
    formValidArray && formValidArray.length
      ? formValidArray.indexOf(true) === -1
        ? false
        : true
      : false;
  return { isFormValid };
};

const mapDispatchToProps = dispatch => {
  return {
    fileUpload: (formKey, fieldKey, file) =>
      dispatch(fileUpload(formKey, fieldKey, file)),
    fetchComplaints: criteria => dispatch(fetchComplaints(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplaintResolved);
