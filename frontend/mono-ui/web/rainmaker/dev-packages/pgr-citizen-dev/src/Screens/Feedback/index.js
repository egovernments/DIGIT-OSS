import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import { fetchComplaints } from "egov-ui-kit/redux/complaints/actions";
import FeedbackForm from "./components/FeedbackForm";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import "./index.css";

const FeedbackFormHOC = formHoc({
  formKey: "feedback",
  isCoreConfiguration: true,
  path: "pgr/pgr-citizen"
})(FeedbackForm);

class Feedback extends Component {
  state = {
    value: []
  };

  componentDidMount = () => {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([
      { key: "serviceRequestId", value: match.params.serviceRequestId }
    ]);
  };

  onCheck = value => {
    var valueArray = this.state.value.slice(0);
    if (valueArray.indexOf(value) > -1) {
      valueArray.splice(valueArray.indexOf(value), 1);
    } else {
      valueArray.push(value);
    }
    this.setState({ value: valueArray });
    this.props.handleFieldChange(
      "feedback",
      "selectedSevice",
      valueArray.toString()
    );
  };

  onSubmit = e => {
    const { rating } = this.props;
    if (!rating) {
      e.preventDefault();
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please provide ratings",
          labelKey: "ERR_PLEASE_PROVIDE_RATINGS"
        },
        "error"
      );
    }
  };

  render() {
    let { value } = this.state;
    return (
      <Screen className="background-white">
        <FeedbackFormHOC
          onSubmit={this.onSubmit}
          onCheck={this.onCheck}
          checkBoxValue={value}
        />
      </Screen>
    );
  }
}

const mapStateToProps = ({ form }) => {
  let rating = get(form, "feedback.fields.rating.value");

  return { rating };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComplaints: criteria => dispatch(fetchComplaints(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feedback);
