import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "utils/translationNode";
import SuccessMessage from "modules/common/common/SuccessMessage/components/successmessage";
import { fetchComplaints } from "redux/complaints/actions";
import { connect } from "react-redux";
import "modules/common/common/SuccessMessage/components/successmessage/index.css";

class ComplaintAssigned extends Component {
  componentDidMount = () => {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([{ key: "serviceRequestId", value: match.params.serviceRequestId }]);
  };

  handleComplaintReassigned = () => {
    this.props.history.push("/employee/all-complaints");
  };

  render() {
    let { employeeDetails } = this.props;
    const isReassign = window.location.href.includes("complaint-reassigned") ? true : false;
    return (
      <div className="success-message-main-screen">
        <SuccessMessage
          successmessage={(isReassign ? "Re-Assigned to " : "Assigned to ") + employeeDetails.employeeName}
          secondaryLabel={employeeDetails && employeeDetails.employeeDesignation}
          tertiaryLabel={employeeDetails && employeeDetails.employeeDepartment + " Department"}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
        />
        <div className="btn-without-bottom-nav">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.handleComplaintReassigned}
          />
        </div>
      </div>
    );
  }
}

const getNameFromId = (obj, id, defaultValue) => {
  return obj && id && obj[id] ? obj[id].name : defaultValue;
};

const mapStateToProps = (state, ownProps) => {
  const { complaints } = state;
  const { departmentById, designationsById, employeeById } = state.common;
  let selectedComplaint = complaints["byId"][decodeURIComponent(window.location.href.split("/").pop())];
  const selectedEmployee = employeeById[selectedComplaint.actions[0].assignee];
  const employeeDetails = {
    employeeName: selectedEmployee && selectedEmployee.name,
    employeeDesignation: selectedEmployee && getNameFromId(designationsById, selectedEmployee.assignments[0].designation, "Engineer"),
    employeeDepartment: selectedEmployee && getNameFromId(departmentById, selectedEmployee.assignments[0].department, "Administration"),
  };
  return { employeeDetails };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria) => dispatch(fetchComplaints(criteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintAssigned);
