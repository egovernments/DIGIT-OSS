import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "components";
import Complaints from "modules/common/pgr/Complaints";
import Screen from "modules/common/common/Screen";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { fetchComplaints } from "redux/complaints/actions";
import { displayLocalizedStatusMessage, transformComplaintForComponent } from "utils/commons";
import orderby from "lodash/orderBy";
import "./index.css";

class MyComplaints extends Component {
  componentDidMount = () => {
    let { fetchComplaints } = this.props;
    fetchComplaints([]);
  };

  onComplaintClick = (complaintNo) => {
    this.props.history.push(`/citizen/complaint-details/${complaintNo}`);
  };

  render() {
    let { transformedComplaints, history, loading } = this.props;
    let { onComplaintClick } = this;
    return (
      <Screen loading={loading}>
        <div className="complaints-main-container clearfix">
          <Complaints
            onComplaintClick={onComplaintClick}
            complaints={transformedComplaints}
            onClick={this.imageOnClick}
            track={true}
            role={"citizen"}
            noComplaintMessage={"CS_MYCOMPLAINTS_NO_COMPLAINTS"}
          />

          <div className="floating-button-cont">
            <FloatingActionButton
              id="mycomplaints-add"
              onClick={(e) => {
                history.push("/citizen/add-complaint");
              }}
              className="floating-button"
            >
              <Icon action="content" name="add" />
            </FloatingActionButton>
          </div>
        </div>
      </Screen>
    );
  }
}

const displayStatus = (status = "", assignee, action) => {
  let statusObj = {};
  if (status.toLowerCase() == "closed" || status.toLowerCase() == "rejected" || status.toLowerCase() == "resolved") {
    statusObj.status = "CS_COMMON_CLOSED_UCASE";
  } else {
    statusObj.status = "CS_COMMON_OPEN_UCASE";
  }

  if (status) {
    if (status === "open" && action && action === "reopen") {
      statusObj.statusMessage = displayLocalizedStatusMessage("reopened");
    } else if (status === "assigned" && action && action === "reassign") {
      statusObj.statusMessage = displayLocalizedStatusMessage("reassigned");
    } else {
      statusObj.statusMessage = displayLocalizedStatusMessage(status);
    }
  }

  return statusObj;
};

const mapStateToProps = (state) => {
  const complaints = state.complaints || {};
  const { categoriesById } = complaints;
  const { common } = state;
  const { employeeById, citizenById } = common;
  const role = "citizen";
  const { loading } = complaints || false;
  const transformedComplaints = transformComplaintForComponent(complaints, role, employeeById, citizenById, categoriesById, displayStatus);
  var closedComplaints = orderby(transformedComplaints.filter((complaint) => complaint.status === "Closed"), ["date"], ["desc"]);
  var nonClosedComplaints = orderby(transformedComplaints.filter((complaint) => complaint.status != "Closed"), ["date"], ["desc"]);
  return { complaints, transformedComplaints: [...nonClosedComplaints, ...closedComplaints], loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria) => dispatch(fetchComplaints(criteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyComplaints);
