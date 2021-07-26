import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { ActionButton } from "modules/common";
import { Icon, MapLocation, ShareButton } from "components";
import CommonShare from "egov-ui-kit/components/CommonShare";
import { Screen } from "modules/common";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";

import {
  getDateFromEpoch,
  mapCompIDToName,
  isImage,
  fetchImages,
  returnSLAStatus,
  getPropertyFromObj,
  findLatestAssignee,
  getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
  fetchComplaints,
  sendMessage,
  sendMessageMedia
} from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";

import "./index.css";

class ComplaintDetails extends Component {
  state = {
    openMap: false
  };
  componentDidMount() {
    let {
      fetchComplaints,
      match,
      resetFiles,
      transformedComplaint,
      prepareFormData,
      fetchComplaintCategories
    } = this.props;
    prepareFormData("complaints", transformedComplaint);
    fetchComplaintCategories();
    fetchComplaints([
      { key: "serviceRequestId", value: match.params.serviceRequestId }
    ]);
    if (this.props.form && this.props.form.complaintResolved) {
      resetFiles("complaintResolved");
    }
    let { details } = this.state;
    if (
      this.props.location &&
      this.props.location.search.split("=")[1] === "rejected"
    ) {
      this.setState({
        status: {
          status: "Rejected",
          message: "JR.INSPECTOR - J KUMAR",
          bgColor: "#f5a623"
        },
        details: {
          ...details,
          status: "Rejected"
        }
      });
    } else if (
      this.props.location &&
      this.props.location.search.split("=")[1] === "filed"
    ) {
      this.setState({
        status: {
          status: "Submitted",
          message: "JR.INSPECTOR - J KUMAR",
          bgColor: "#f5a623"
        },
        details: {
          ...details,
          status: "Submitted"
        }
      });
    } else if (
      this.props.location &&
      this.props.location.search.split("=")[1] === "unassigned"
    ) {
      this.setState({
        status: {
          status: "Unassigned",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623"
        },
        details: {
          ...details,
          status: "Unassigned"
        },
        role: "AO",
        hasComments: false
      });
    } else if (
      this.props.location &&
      this.props.location.search.split("=")[1] === "unassigned&reassign"
    ) {
      this.setState({
        status: {
          status: "Reassign",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623"
        },
        details: {
          ...details,
          status: "Reassign"
        },
        role: "AO"
      });
    } else if (
      this.props.location &&
      this.props.location.search.split("=")[1] === "assigned"
    ) {
      this.setState({
        status: {
          status: "Assign",
          message: "Jr.INSPECTOR - J KUMAR",
          bgColor: "#f5a623"
        },
        details: {
          ...details,
          status: "Assign"
        },
        role: "AO"
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history.location.search === "?map") {
      this.setState({ openMap: true });
    } else {
      this.setState({ openMap: false });
    }
    const { transformedComplaint, prepareFormData } = this.props;
    if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
      prepareFormData("complaints", nextProps.transformedComplaint);
    }
  }

  redirectToMap = isOpen => {
    var pathName = this.props.history.location.pathname;
    if (isOpen === true) this.props.history.push(pathName + "?map");
    else if (isOpen === false) this.props.history.goBack();
  };

  btnOneOnClick = (complaintNo, label) => {
    //Action for first button
    let { history } = this.props;
    switch (label) {
      case "ES_REJECT_BUTTON":
        history.push(`/reject-complaint/${complaintNo}`);
        break;
      case "ES_REQUEST_REQUEST_RE_ASSIGN":
        history.push(`/request-reassign/${complaintNo}`);
        break;
    }
  };
  btnTwoOnClick = (complaintNo, label) => {
    //Action for second button
    let { history } = this.props;
    switch (label) {
      case "ES_COMMON_ASSIGN":
        history.push(`/assign-complaint/${complaintNo}`);
        break;
      case "ES_COMMON_REASSIGN":
        history.push(`/reassign-complaint/${complaintNo}`);
        break;
      case "ES_RESOLVE_MARK_RESOLVED":
        history.push(`/complaint-resolved/${complaintNo}`);
        break;
    }
  };

  ShareButtonOnClick = () => {
    const complaintData = this.props.transformedComplaint.complaint;
    const name = complaintData.filedBy ? complaintData.filedBy : "NA";
    const moblileNo = complaintData.filedUserMobileNumber
      ? complaintData.filedUserMobileNumber
      : "NA";
    const complaintNo = complaintData.applicationNo
      ? complaintData.applicationNo
      : "NA";
    const complaintType = this.props.complaintTypeLocalised
      ? this.props.complaintTypeLocalised
      : "NA";
    const address = complaintData.address ? complaintData.address : "NA";
    const { sendMessage } = this.props;

    const shareMetaData = {
      tenantId: getTenantId(),
      shareSource: "WEB",
      shareMedia: "SMS",
      shareContent: [
        {
          to: "",
          content: { name, moblileNo, complaintNo, complaintType, address },
          expiredIn: "",
          documents: []
        }
      ],
      shareTemplate: "complaintDetails"
    };
    sendMessage(shareMetaData);

    // const messageStr =
    //   "Name: " + name + "\nMobile: " + moblileNo + "\nComplaint No: " + complaintNo + "\nComplaint Type: " + complaintType + "\nAddress: " + address;
  };

  shareCallback = () => {
    let { complaint } = this.props.transformedComplaint;

    navigator
      .share({
        title: "Complaint Summary",
        text: `Dear Sir/Madam,\nPlease find complaint detail given below :\n${get(
          complaint,
          "filedBy",
          ""
        )}, ${get(complaint, "filedUserMobileNumber", "")},\n${get(
          complaint,
          "complaint",
          ""
        )}, ${get(complaint, "description", "")}\nAddress: ${get(
          complaint,
          "addressDetail.houseNoAndStreetName",
          ""
        )},\n${get(complaint, "addressDetail.locality", "")},\n${get(
          complaint,
          "addressDetail.landMark",
          ""
        )}\nSLA: ${get(
          complaint,
          "timelineSLAStatus.slaStatement",
          ""
        )}\nThanks`,
        url: ""
      })
      .then(() => console.log("Successful share"))
      .catch(error => console.log("Error sharing", error));
  };

  render() {
    let { shareCallback } = this;
    let { comments, openMap } = this.state;
    let { complaint, timeLine } = this.props.transformedComplaint;
    let {
      role,
      serviceRequestId,
      history,
      isAssignedToEmployee,
      reopenValidChecker
    } = this.props;
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
        } else if (complaint.complaintStatus.toLowerCase() === "assigned") {
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
          {complaint && !openMap && (
            <div>
              {/* <div className="share-btn">
                {navigator.share && (
                  <CommonShare variant="fab" shareCallback={shareCallback} roleDefination={{ rolePath: "user-info.roles", roles: ["EMPLOYEE"] }} />
                )}
               *<ShareButton onLoadFn={this.ShareButtonOnClick} />*
              </div> */}
              <div className="form-without-button-cont-generic">
                <Details
                  {...complaint}
                  role={role}
                  history={history}
                  mapAction={true}
                  redirectToMap={this.redirectToMap}
                  action={action}
                  complaintLoc={complaintLoc}
                />
                <ComplaintTimeLine
                  status={complaint.status}
                  timelineSLAStatus={complaint.timelineSLAStatus}
                  timeLine={timeLine}
                  history={history}
                  handleFeedbackOpen={this.handleFeedbackOpen}
                  role={role}
                  feedback={complaint ? complaint.feedback : ""}
                  rating={complaint ? complaint.rating : ""}
                  filedBy={
                    complaint && complaint.filedBy ? complaint.filedBy : ""
                  }
                  filedUserMobileNumber={
                    complaint ? complaint.filedUserMobileNumber : ""
                  }
                  reopenValidChecker={reopenValidChecker}
                />
                <Comments
                  comments={comments}
                  role={role}
                  isAssignedToEmployee={isAssignedToEmployee}
                />
              </div>
              <div>
                {(role === "ao" &&
                  complaint.complaintStatus.toLowerCase() !== "closed") ||
                (role === "employee" &&
                  isAssignedToEmployee &&
                  complaint.complaintStatus.toLowerCase() === "assigned" &&
                  complaint.complaintStatus.toLowerCase() !== "closed") ? (
                  <ActionButton
                    btnOneLabel={btnOneLabel}
                    btnOneOnClick={() =>
                      this.btnOneOnClick(serviceRequestId, btnOneLabel)
                    }
                    btnTwoLabel={btnTwoLabel}
                    btnTwoOnClick={() =>
                      this.btnTwoOnClick(serviceRequestId, btnTwoLabel)
                    }
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </Screen>
        {complaintLoc.lat && openMap && (
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
                  color: "#484848"
                }}
                action="navigation"
                name={"arrow-back"}
              />
            </div>
            <MapLocation
              currLoc={complaintLoc}
              icon={pinIcon}
              hideTerrainBtn={true}
              viewLocation={true}
            />
          </div>
        )}
      </div>
    );
  }
}

const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map((role, index) => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

//Don't Delete this
const getLatestStatus = status => {
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
  return citizenObjById && citizenObjById[id]
    ? citizenObjById[id].mobileNumber
    : "";
};
let gro = "";
const mapStateToProps = (state, ownProps) => {
  const { complaints, common, auth, form } = state;
  const { id } = auth.userInfo;
  const { citizenById } = common || {};
  const reopenValidChecker = get(
    state,
    "common.pgrContants.RAINMAKER-PGR.UIConstants[0].REOPENSLA",
    4232000000
  );
  const { employeeById, departmentById, designationsById, cities } =
    common || {};
  const { categoriesById } = complaints;
  const { userInfo } = state.auth;
  const serviceRequestId = ownProps.match.params.serviceRequestId;
  let selectedComplaint =
    complaints["byId"][
      decodeURIComponent(ownProps.match.params.serviceRequestId)
    ];
  let filedUserName =
    selectedComplaint &&
    selectedComplaint.citizen &&
    selectedComplaint.citizen.name;
  let isFiledByCSR =
    selectedComplaint &&
    selectedComplaint.actions &&
    selectedComplaint.actions[selectedComplaint.actions.length - 1].by &&
    selectedComplaint.actions[selectedComplaint.actions.length - 1].by.split(
      ":"
    )[1] &&
    selectedComplaint.actions[selectedComplaint.actions.length - 1].by.split(
      ":"
    )[1] === "Citizen Service Representative";
  const role =
    roleFromUserInfo(userInfo.roles, "GRO") ||
    roleFromUserInfo(userInfo.roles, "DGRO")
      ? "ao"
      : roleFromUserInfo(userInfo.roles, "CSR")
      ? "csr"
      : "employee";

  let isAssignedToEmployee = true;
  if (selectedComplaint) {
    let userId =
      selectedComplaint &&
      selectedComplaint.actions &&
      selectedComplaint.actions[selectedComplaint.actions.length - 1].by.split(
        ":"
      )[0];
    let details = {
      status: selectedComplaint.status || "",
      complaint: mapCompIDToName(
        complaints.categoriesById,
        selectedComplaint.serviceCode
      ),
      applicationNo: selectedComplaint.serviceRequestId,
      description: selectedComplaint.description,
      submittedDate: getDateFromEpoch(
        selectedComplaint.auditDetails.createdTime
      ),
      landMark: selectedComplaint.landmark,
      address: selectedComplaint.address,
      addressDetail: selectedComplaint.addressDetail
        ? selectedComplaint.addressDetail
        : {},
      latitude: selectedComplaint.lat,
      longitude: selectedComplaint.long,
      images: fetchImages(selectedComplaint.actions).filter(imageSource =>
        isImage(imageSource)
      ),
      complaintStatus: selectedComplaint.status
        ? getLatestStatus(selectedComplaint.status)
        : "",
      feedback: selectedComplaint.feedback,
      rating: selectedComplaint.rating,
      //filedBy: userId && mapCitizenIdToName(citizenById, userId),
      filedBy: filedUserName
        ? isFiledByCSR
          ? `${filedUserName} @CSR`
          : filedUserName
        : null,

      //filedUserMobileNumber: userId && mapCitizenIdToMobileNumber(citizenById, userId),
      filedUserMobileNumber:
        selectedComplaint &&
        selectedComplaint.citizen &&
        selectedComplaint.citizen.mobileNumber,
      timelineSLAStatus: returnSLAStatus(
        getPropertyFromObj(
          categoriesById,
          selectedComplaint.serviceCode,
          "slaHours",
          "NA"
        ),
        selectedComplaint.auditDetails.createdTime
      )
    };

    let timeLine = [];
    timeLine = selectedComplaint.actions.filter(
      action => action.status && action.status
    );
    isAssignedToEmployee = id == findLatestAssignee(timeLine) ? true : false; //not checking for type equality due to mismatch
    timeLine.map(action => {
      if (action && action.status && action.status === "assigned") {
        let assignee = action.assignee;
        gro = action.by.split(":")[0];
        const selectedEmployee =
          employeeById && assignee && employeeById[assignee];
        action.employeeName =
          assignee && getPropertyFromObj(employeeById, assignee, "name", "");
        action.employeeMobileNumber =
          assignee &&
          getPropertyFromObj(employeeById, assignee, "mobileNumber", "");
        action.employeeDesignation =
          selectedEmployee &&
          getPropertyFromObj(
            designationsById,
            selectedEmployee.assignments[0].designation,
            "name",
            ""
          );
        action.employeeDepartment =
          selectedEmployee &&
          getPropertyFromObj(
            departmentById,
            selectedEmployee.assignments[0].department,
            "name",
            ""
          );
        action.groName =
          assignee && getPropertyFromObj(employeeById, gro, "name", "");
        action.groDesignation =
          assignee &&
          getPropertyFromObj(
            designationsById,
            employeeById &&
              employeeById[gro] &&
              employeeById[gro].assignments[0].designation,
            "name",
            ""
          );
        action.groMobileNumber =
          assignee && getPropertyFromObj(employeeById, gro, "mobileNumber", "");
      } else if (
        action &&
        action.status &&
        action.status === "reassignrequested"
      ) {
        let assignee = action.by.split(":")[0];
        action.employeeMobileNumber =
          assignee &&
          getPropertyFromObj(employeeById, assignee, "mobileNumber", "");
      }
    });

    let transformedComplaint = {
      complaint: details,
      timeLine
    };
    const { localizationLabels } = state.app;
    const complaintTypeLocalised = getTranslatedLabel(
      `SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
      localizationLabels
    );

    return {
      form,
      transformedComplaint,
      role,
      serviceRequestId,
      isAssignedToEmployee,
      complaintTypeLocalised,
      reopenValidChecker
    };
  } else {
    return {
      form,
      transformedComplaint: {},
      role,
      serviceRequestId,
      isAssignedToEmployee,
      reopenValidChecker
    };
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
    fetchComplaints: criteria => dispatch(fetchComplaints(criteria)),
    resetFiles: formKey => dispatch(resetFiles(formKey)),
    sendMessage: message => dispatch(sendMessage(message)),
    sendMessageMedia: message => dispatch(sendMessageMedia(message)),
    prepareFormData: (jsonPath, value) =>
      dispatch(prepareFormData(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplaintDetails);
