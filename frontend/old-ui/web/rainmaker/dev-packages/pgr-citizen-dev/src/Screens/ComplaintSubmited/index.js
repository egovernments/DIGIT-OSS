import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Button } from "components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { Screen } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import "./index.css";

class ComplaintSubmitted extends Component {
  componentDidMount = () => {
    const { resetFiles } = this.props;
    if (this.props.form && this.props.form.complaint) {
      resetFiles("complaint");
    }
  };

  continueComplaintSubmit = () => {
    this.props.history.push("/");
  };

  // the retrival logic to be changed!
  getComplaintNumber = () => {
    const { search } = this.props.location;
    return (search && search.length && search.split("=").length && search.split("=")[1]) || null;
  };

  render() {
    const complaintnumber = this.getComplaintNumber();
    return (
      <div>
        <Screen className="complaint-submitted-card">
          <div className="complaint-submitted-boldlabel">
            <Label labelClassName="complaint-submitted-label" label="CS_COMPLAINT_SUBMITTED_LABEL1" fontSize="16px" />
            <FloatingActionButton backgroundColor="#22b25f" style={{ marginBottom: "16px" }}>
              <Icon name={"check"} action={"navigation"} />
            </FloatingActionButton>
            <Label labelClassName="thank-you-label" id="thank-you-text" label="CS_COMPLAINT_SUBMITTED_THANKYOU" fontSize="16px" />
            <div className="complaint-submitted-complaintNo-cont">
              <Label labelClassName="complaint-number-label" label="CS_COMMON_COMPLAINT_NO" fontSize="16px" />
              <Label
                labelClassName="complaint-number-value-label"
                className="complaint-number-value"
                label={complaintnumber}
                containerStyle={{ marginLeft: 5 }}
                labelStyle={{ lineHeight: 1.5 }}
              />
            </div>
          </div>
          <div className="complaint-submitted-label">
            <Label id="complaint-submitted-success-message" label="CS_COMPLAINT_SUBMITTED_LABEL2" />
          </div>
          <div className="btn-without-bottom-nav col-lg-offset-3 col-md-offset-3 col-lg-6 col-md-6">
            <Button
              id="complaint-submitted-continue"
              primary={true}
              label={<Label buttonLabel={true} label="CORE_COMMON_CONTINUE" />}
              fullWidth={true}
              onClick={this.continueComplaintSubmit}
            />
          </div>
        </Screen>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const formKey = "complaint";
  return {
    formKey,
    form: state.form[formKey],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetFiles: (formKey) => dispatch(resetFiles(formKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplaintSubmitted);
