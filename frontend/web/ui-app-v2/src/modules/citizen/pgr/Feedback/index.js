import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import Screen from "modules/common/common/Screen";
import { fetchComplaints } from "redux/complaints/actions";
import FeedbackForm from "./components/FeedbackForm";
import { handleFieldChange } from "redux/form/actions";
import "./index.css";

const FeedbackFormHOC = formHoc({ formKey: "feedback" })(FeedbackForm);

class Feedback extends Component {
  state = {
    value: [],
  };

  componentDidMount = () => {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([{ key: "serviceRequestId", value: match.params.serviceRequestId }]);
  };

  onCheck = (value) => {
    var valueArray = this.state.value.slice(0);
    if (valueArray.indexOf(value) > -1) {
      valueArray.splice(valueArray.indexOf(value), 1);
    } else {
      valueArray.push(value);
    }
    this.setState({ value: valueArray });
    this.props.handleFieldChange("feedback", "selectedSevice", valueArray.toString());
  };

  render() {
    let { value } = this.state;
    return (
      <Screen className="feedback-main-screen">
        <FeedbackFormHOC onCheck={this.onCheck} checkBoxValue={value} />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria) => dispatch(fetchComplaints(criteria)),
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
  };
};

export default connect(null, mapDispatchToProps)(Feedback);
