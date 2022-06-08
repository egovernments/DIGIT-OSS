import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "hocs/form";
import Screen from "modules/common/common/Screen";
import RejectComplaintForm from "./components/RejectComplaintForm";
import { fetchComplaints } from "redux/complaints/actions";
import Label from "utils/translationNode";
import { handleFieldChange } from "redux/form/actions";
import "./index.css";

const RejectComplaintHOC = formHOC({ formKey: "rejectComplaint" })(RejectComplaintForm);

class RejectComplaint extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
  };
  componentDidMount() {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([{ key: "serviceRequestId", value: match.params.serviceRequestId }]);
  }

  options = [
    { value: "Not a valid complaint", label: <Label label="ES_REASSIGN_OPTION_ONE" /> },
    { value: "Out of operational scope", label: <Label label="ES_REJECT_OPTION_TWO" /> },
    { value: "Operation already underway", label: <Label label="ES_REJECT_OPTION_THREE" /> },
    { value: "Other", label: <Label label="ES_REJECT_OPTION_FOUR" /> },
  ];

  commentsValue = {};

  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value,
    });
    this.concatComments(this.commentsValue);
  };
  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
    this.commentsValue.radioValue = value;
    this.concatComments(this.commentsValue);
  };
  concatComments = (val) => {
    let com1 = "";
    let com2 = "";
    if (val.radioValue) {
      com1 = val.radioValue + ";";
    }
    if (val.textVal) {
      com2 = val.textVal;
    }
    let concatvalue = com1 + com2;
    this.props.handleFieldChange("rejectComplaint", "comments", concatvalue);
  };

  render() {
    const { handleCommentsChange, handleOptionsChange } = this;
    const { valueSelected, commentValue } = this.state;

    return (
      <Screen className="reject-complaint-main-container">
        <RejectComplaintHOC
          options={this.options}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          optionSelected={valueSelected}
          commentValue={commentValue}
        />
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

export default connect(null, mapDispatchToProps)(RejectComplaint);
