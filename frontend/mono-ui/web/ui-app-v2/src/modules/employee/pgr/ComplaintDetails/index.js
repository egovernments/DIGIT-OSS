import React, { Component } from "react";
import Details from "modules/common/pgr/complaintDetails/components/Details";
import ComplaintTimeLine from "modules/common/pgr/complaintDetails/components/ComplaintTimeLine";
import Comments from "modules/common/pgr/complaintDetails/components/Comments";
import Actions from "modules/common/pgr/complaintDetails/components/ActionButton";
import { Icon, MapLocation } from "components";
import Screen from "modules/common/common/Screen";
import pinIcon from "assets/Location_pin.svg";
import { getDateFromEpoch, mapCompIDToName, isImage, fetchImages, returnSLAStatus, getPropertyFromObj, findLatestAssignee } from "utils/commons";
import { fetchComplaints } from "redux/complaints/actions";
import { connect } from "react-redux";
import "./index.css";

class ComplaintDetails extends Component {
  state = {
    openMap: false,
  };

  componentDidMount() {
    let { fetchComplaints, match } = this.props;
    fetchComplaints([{ key: "serviceRequestId", value: match.params.serviceRequestId }]);
    let { details } = this.state;
    if (this.props.location && this.props.location.search.split("=")[1] === "rejected") {
      this.setState({
        status: {
          status: "Rejected",
          message: "JR.INSPECTOR - J KUMAR",
          bgColor: "#f5a623",
        },
        details: {
          ...details,
          status: "Rejected",
        },
      });
    } else if (this.props.location && this.props.location.search.split("=")[1] === "filed") {
      this.setState({
        status: {
          status: "Submitted",
          message: "JR.INSPECTOR - J KUMAR",
          bgColor: "#f5a623",
        },
        details: {
          ...details,
          status: "Submitted",
        },
      });
    } else if (this.props.location && this.props.location.search.split("=")[1] === "unassigned") {
      this.setState({
        status: {
          status: "Unassigned",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623",
        },
        details: {
          ...details,
          status: "Unassigned",
        },
        role: "AO",
        hasComments: false,
      });
    } else if (this.props.location && this.props.location.search.split("=")[1] === "unassigned&reassign") {
      this.setState({
        status: {
          status: "Reassign",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623",
        },
        details: {
          ...details,
          status: "Reassign",
        },
        role: "AO",
      });
    } else if (this.props.location && this.props.location.search.split("=")[1] === "assigned") {
      this.setState({
        status: {
          status: "Assign",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623",
        },
        details: {
          ...details,
          status: "Assign",
        },
        role: "AO",
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history.location.search === "?map") {
      this.setState({ openMap: true });
    } else {
      this.setState({ openMap: false });
    }
  }

  redirectToMap = (isOpen) => {
    var pathName = this.props.history.location.pathname;
    if (isOpen === true) this.props.history.push(pathName + "?map");
    else if (isOpen === false) this.props.history.goBack();
  };

  btnOneOnClick = (complaintNo, label) => {
    //Action for first button
    let { history } = this.props;
    switch (label) {
      case "ES_REJECT_BUTTON":
        history.push(`/employee/reject-complaint/${complaintNo}`);
        break;
      case "ES_REQUEST_REQUEST_RE_ASSIGN":
        history.push(`/employee/request-reassign/${complaintNo}`);
        break;
    }
  };
  btnTwoOnClick = (complaintNo, label) => {
    //Action for second button
    let { history } = this.props;
    switch (label) {
      case "ES_COMMON_ASSIGN":
        history.push(`/employee/assign-complaint/${complaintNo}`);
        break;
      case "ES_COMMON_REASSIGN":
        history.push(`/employee/reassign-complaint/${complaintNo}`);
        break;
      case "ES_RESOLVE_MARK_RESOLVED":
        history.push(`/employee/complaint-resolved/${complaintNo}`);
        break;
    }
  };

  render() {
    let { comments, openMap } = this.state;
    let { complaint, timeLine } = this.props.transformedComplaint;
    let { role, serviceRequestId, history, isAssignedToEmployee } = this.props;
    let btnOneLabel = "";
    let btnTwoLabel = "";
    let action;
    let complaintLoc = {};
    if (complaint && complaint.latitude) {
      complaintLoc = { lat: complaint.latitude, lng: complaint.longitude };
    }
    if (complaint) {
      if (role === "ao") {
        if (complaint.complaintStatus.toLowerCase() === "unassigned") {
          btnOneLabel = "ES_REJECT_BUTTON";
          btnTwoLabel = "ES_COMMON_ASSIGN";
        } else if (complaint.complaintStatus.toLowerCase() === "reassign") {
          btnOneLabel = "ES_REJECT_BUTTON";
          btnTwoLabel = "ES_COMMON_REASSIGN";
        }
      } else if (role === "employee") {
        if (complaint.complaintStatus.toLowerCase() === "assigned") {
          btnOneLabel = "ES_REQUEST_REQUEST_RE_ASSIGN";
          btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
        }
      }
    }
    if (timeLine && timeLine[0]) {
      action = timeLine[0].action;
    }

    return (
      <div>
        <Screen>
          {complaint &&
            !openMap && (
              <div>
                <Details {...complaint} role={role} history={history} mapAction={true} redirectToMap={this.redirectToMap} action={action} />
                <ComplaintTimeLine
                  status={complaint.status}
                  timelineSLAStatus={complaint.timelineSLAStatus}
                  timeLine={timeLine}
                  history={history}
                  handleFeedbackOpen={this.handleFeedbackOpen}
                  role={role}
                  feedback={complaint ? complaint.feedback : ""}
                  rating={complaint ? complaint.rating : ""}
                  filedBy={complaint ? complaint.filedBy : ""}
                  filedUserMobileNumber={complaint ? complaint.filedUserMobileNumber : ""}
                />
                <Comments comments={comments} role={role} isAssignedToEmployee={isAssignedToEmployee} />
                <div>
                  {(role === "ao" &&
                    complaint.complaintStatus.toLowerCase() !== "assigned" &&
                    complaint.complaintStatus.toLowerCase() !== "closed") ||
                  (role === "employee" &&
                    isAssignedToEmployee &&
                    complaint.complaintStatus.toLowerCase() === "assigned" &&
                    complaint.complaintStatus.toLowerCase() !== "closed") ? (
                    <Actions
                      btnOneLabel={btnOneLabel}
                      btnOneOnClick={() => this.btnOneOnClick(serviceRequestId, btnOneLabel)}
                      btnTwoLabel={btnTwoLabel}
                      btnTwoOnClick={() => this.btnTwoOnClick(serviceRequestId, btnTwoLabel)}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
        </Screen>
        {complaintLoc.lat &&
          openMap && (
            <div>
              <div className="back-btn" style={{ top: 32 }}>
                <Icon
                  className="mapBackBtn"
                  onClick={() => {
                    this.redirectToMap(false);
                  }}
                  style={{
                    height: 24,
                    width: 24,
                    color: "#484848",
                  }}
                  action="navigation"
                  name={"arrow-back"}
                />
              </div>
              <MapLocation currLoc={complaintLoc} icon={pinIcon} hideTerrainBtn={true} viewLocation={true} />
            </div>
          )}
      </div>
    );
  }
}

const isAssigningOfficer = (roles) => {
  const roleCodes = roles.map((role, index) => {
    return role.code;
  });
  return roleCodes.indexOf("GRO" || "RO") > -1 ? true : false;
};

//Don't Delete this
const getLatestStatus = (status) => {
  let transformedStatus = "";
  switch (status.toLowerCase()) {
    case "open":
    case "new":
      transformedStatus = "UNASSIGNED";
      break;
    case "resolved":
    case "rejected":
    case "closed":
      transformedStatus = "CLOSED";
      break;
    case "assigned":
      transformedStatus = "ASSIGNED";
      break;
    case "reassignrequested":
      transformedStatus = "REASSIGN";
      break;
    default:
      transformedStatus = "CLOSED";
      break;
  }
  return transformedStatus;
};
const mapCitizenIdToName = (citizenObjById, id) => {
  return citizenObjById && citizenObjById[id] ? citizenObjById[id].name : "";
};
const mapCitizenIdToMobileNumber = (citizenObjById, id) => {
  return citizenObjById && citizenObjById[id] ? citizenObjById[id].mobileNumber : "";
};
let gro = "";
const mapStateToProps = (state, ownProps) => {
  const { complaints, common, auth } = state;
  const { id } = auth.userInfo;
  const { citizenById } = common || {};
  const { employeeById, departmentById, designationsById } = common || {};
  const { categoriesById } = complaints;
  const { userInfo } = state.auth;
  const serviceRequestId = ownProps.match.params.serviceRequestId;
  let selectedComplaint = complaints["byId"][decodeURIComponent(ownProps.match.params.serviceRequestId)];
  const role = isAssigningOfficer(userInfo.roles) ? "ao" : "employee";
  let isAssignedToEmployee = true;
  if (selectedComplaint) {
    let userId = selectedComplaint && selectedComplaint.actions && selectedComplaint.actions[selectedComplaint.actions.length - 1].by.split(":")[0];
    let details = {
      status: selectedComplaint.status,
      complaint: mapCompIDToName(complaints.categoriesById, selectedComplaint.serviceCode),
      applicationNo: selectedComplaint.serviceRequestId,
      description: selectedComplaint.description,
      submittedDate: getDateFromEpoch(selectedComplaint.auditDetails.createdTime),
      address: selectedComplaint.address,
      latitude: selectedComplaint.lat,
      longitude: selectedComplaint.long,
      images: fetchImages(selectedComplaint.actions).filter((imageSource) => isImage(imageSource)),
      complaintStatus: selectedComplaint.status && getLatestStatus(selectedComplaint.status),
      feedback: selectedComplaint.feedback,
      rating: selectedComplaint.rating,
      filedBy: userId && mapCitizenIdToName(citizenById, userId),
      filedUserMobileNumber: userId && mapCitizenIdToMobileNumber(citizenById, userId),
      timelineSLAStatus: returnSLAStatus(
        getPropertyFromObj(categoriesById, selectedComplaint.serviceCode, "slaHours", "NA"),
        selectedComplaint.auditDetails.createdTime
      ),
    };

    let timeLine = [];
    timeLine = selectedComplaint.actions.filter((action) => action.status && action.status);
    isAssignedToEmployee = id == findLatestAssignee(timeLine) ? true : false; //not checking for type equality due to mismatch
    timeLine.map((action) => {
      if (action && action.status && action.status === "assigned") {
        let assignee = action.assignee;
        gro = action.by.split(":")[0];
        const selectedEmployee = employeeById && assignee && employeeById[assignee];
        action.employeeName = assignee && getPropertyFromObj(employeeById, assignee, "name", "");
        action.employeeMobileNumber = assignee && getPropertyFromObj(employeeById, assignee, "mobileNumber", "");
        action.employeeDesignation =
          selectedEmployee && getPropertyFromObj(designationsById, selectedEmployee.assignments[0].designation, "name", "");
        action.employeeDepartment = selectedEmployee && getPropertyFromObj(departmentById, selectedEmployee.assignments[0].department, "name", "");
        action.groName = assignee && getPropertyFromObj(employeeById, gro, "name", "");
        action.groDesignation =
          assignee &&
          getPropertyFromObj(designationsById, employeeById && employeeById[gro] && employeeById[gro].assignments[0].designation, "name", "");
        action.groMobileNumber = assignee && getPropertyFromObj(employeeById, gro, "mobileNumber", "");
      } else if (action && action.status && action.status === "reassignrequested") {
        let assignee = action.by.split(":")[0];
        action.employeeMobileNumber = assignee && getPropertyFromObj(employeeById, assignee, "mobileNumber", "");
      }
    });

    let transformedComplaint = {
      complaint: details,
      timeLine,
    };
    return { transformedComplaint, role, serviceRequestId, isAssignedToEmployee };
  } else {
    return { transformedComplaint: {}, role, serviceRequestId, isAssignedToEmployee };
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria) => dispatch(fetchComplaints(criteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintDetails);
