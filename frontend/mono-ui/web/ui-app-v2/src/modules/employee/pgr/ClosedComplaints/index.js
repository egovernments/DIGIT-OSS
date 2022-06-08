import React, { Component } from "react";
import { connect } from "react-redux";
import Screen from "modules/common/common/Screen";
import Complaints from "modules/common/pgr/Complaints";
import { fetchComplaints } from "redux/complaints/actions";
import { transformComplaintForComponent } from "utils/commons";
import orderby from "lodash/orderBy";
import "./index.css";

class ClosedComplaints extends Component {
  componentDidMount() {
    let { fetchComplaints } = this.props;
    fetchComplaints([{ key: "status", value: "rejected,resolved,closed" }]);
  }

  onComplaintClick = (complaintNo) => {
    this.props.history.push(`/employee/complaint-details/${complaintNo}`);
  };

  render() {
    const { onComplaintClick } = this;
    const { closedComplaints, role } = this.props;
    return (
      <Screen>
        <Complaints
          noComplaintMessage={"No complaints here !!!"}
          onComplaintClick={onComplaintClick}
          complaints={closedComplaints}
          role={role}
          complaintLocation={true}
        />
      </Screen>
    );
  }
}

const isAssigningOfficer = (roles) => {
  const roleCodes = roles.map((role, index) => {
    return role.code;
  });
  return roleCodes.indexOf("GRO" || "RO") > -1 ? true : false;
};

const displayStatus = (status = "", assignee) => {
  let statusObj = {};
  if (status.toLowerCase() == "rejected" || status.toLowerCase() == "resolved") {
    statusObj.status = `CS_COMMON_${status.toUpperCase()}_UCASE`;
  } else {
    statusObj.status = status;
  }
  if (status.toLowerCase() == "open") {
    statusObj.statusMessage = `CS_COMMON_SUBMITTED`;
  } else {
    statusObj.statusMessage = `CS_COMMON_${status.toUpperCase()}`;
  }

  return statusObj;
};

const mapStateToProps = (state) => {
  const { complaints, common } = state;
  const { categoriesById } = complaints;
  const { userInfo } = state.auth;
  const { citizenById, employeeById } = common || {};
  const role = isAssigningOfficer(userInfo.roles) ? "ao" : "employee";
  const transformedComplaints = transformComplaintForComponent(complaints, role, employeeById, citizenById, categoriesById, displayStatus);
  const closedComplaints = orderby(transformedComplaints.filter((complaint) => complaint.complaintStatus === "CLOSED"), "date", "desc");

  return { userInfo, closedComplaints, role };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria) => dispatch(fetchComplaints(criteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClosedComplaints);
