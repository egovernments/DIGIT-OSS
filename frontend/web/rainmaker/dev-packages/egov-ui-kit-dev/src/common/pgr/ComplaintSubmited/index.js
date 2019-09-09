import React, { Component } from "react";
import { connect } from "react-redux";
//import { withRouter } from "react-router";
import { Icon, Button } from "components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { Screen } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

class ComplaintSubmitted extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push(this.props.homeRoute);
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
          <div>
            <div className="complaint-submitted-boldlabel">
             <FloatingActionButton backgroundColor="#22b25f" style={{ marginBottom: "16px" }}>
                <Icon name={"check"} action={"navigation"} />
              </FloatingActionButton>
              {!this.props.removeGreeting && (
                <Label labelClassName="thank-you-label" id="thank-you-text" label="CS_COMPLAINT_SUBMITTED_THANKYOU" fontSize="16px" />
              )}
              <Label labelClassName="complaint-submitted-label" label="CS_COMPLAINT_SUBMITTED_LABEL1" fontSize="16px" />
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
              {this.props.lastLabel && (
                <div className="complaint-submitted-label">
                  {/* <Label id="complaint-submitted-success-message" label="CS_COMPLAINT_SUBMITTED_LABEL2" /> */}
                  {this.props.lastLabel}
                </div>
              )}
            </div>
          </div>
          <div className="responsive-action-button-cont">
            <Button
              id="complaint-submitted-continue"
              primary={true}
              label={<Label buttonLabel={true} label="CORE_COMMON_CONTINUE" />}
              fullWidth={true}
              onClick={this.continueComplaintSubmit}
              className="responsive-action-button"
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

export default connect(
  mapStateToProps,
  null
)(ComplaintSubmitted);
