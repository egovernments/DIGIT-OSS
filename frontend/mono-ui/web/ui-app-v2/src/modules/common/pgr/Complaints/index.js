import React from "react";
import { Image, Card, Icon } from "components";
import Label from "utils/translationNode";
import { getDateFromEpoch } from "utils/commons";
import "./index.css";

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const callIconStyle = {
  marginLeft: "17px",
  height: "17px",
  width: "17px",
  borderRadius: "50%",
  top: "0px",
};

const bottomInfoTemplate = (item, role) => {
  return role !== "citizen" ? (
    <div>
      {item.complaintStatus === "ASSIGNED" && (
        <div className="employee-bottom-info-cont">
          <div className="submitted-by-text">
            {role === "ao"
              ? item.assignedTo !== "NA" && (
                  <div className="clearfix">
                    <div className="inline-Localization-text">
                      <Label containerStyle={{ display: "inline-block" }} label="ES_ALL_COMPLAINTS_ASSIGNED_TO" />
                      <Label
                        containerStyle={{ display: "inline-block" }}
                        color="#464646"
                        labelStyle={{ marginLeft: "3px" }}
                        label={item.assignedTo}
                      />
                    </div>
                    <div
                      style={{ display: "inline-block" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = `tel:+91${item.employeePhoneNumber}`;
                        window.location.href = link;
                      }}
                    >
                      <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    </div>
                  </div>
                )
              : item.submittedBy !== "NA" && (
                  <div className="clearfix">
                    <div className="inline-Localization-text">
                      <Label containerStyle={{ display: "inline-block" }} label={"ES_ALL_COMPLAINTS_SUBMITTED_BY"} />
                      <Label
                        containerStyle={{ display: "inline-block" }}
                        color="#464646"
                        labelStyle={{ marginLeft: "3px" }}
                        label={item.submittedBy}
                      />
                    </div>
                    <div
                      style={{ float: "left" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = `tel:+91${item.citizenPhoneNumber}`;
                        window.location.href = link;
                      }}
                    >
                      <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    </div>
                  </div>
                )}
          </div>
        </div>
      )}
      {item.escalatedTo && (
        <div className="submitted-by-text">
          Escalated To: <span style={{ color: "#464646" }}>{item.escalatedTo}</span>
        </div>
      )}
      {item.reassign && (
        <div className="employee-bottom-msg">
          <Label label={role === "ao" ? `${item.reassignRequestedBy} requested for re-assign` : "You have requested for re-assign"} dark={true} />
        </div>
      )}
    </div>
  ) : (
    ""
  );
};
const getStatusAndChangeColor = (status, assignee) => {
  let statusObj = {
    style: {},
    message: "",
  };
  switch (status) {
    case "CS_COMMON_OPEN_UCASE":
      statusObj.style = {
        color: "#f89a3f",
      };
      statusObj.message = (
        <div>
          <Label label={`Complaint `} />
          <Label className="complaint-status-reassigned" label={`CS_COMMON_RE_ASSIGNED`} />
          <Label label={` to `} />
          <Label className="complaint-assignee" label={`${assignee}`} />
        </div>
      );
      break;
    case "CS_COMMON_CLOSED_UCASE":
      statusObj.style = {
        color: "#5385a6",
      };
      statusObj.message = (
        <div>
          <Label label={`Complaint `} />
          <Label className="complaint-status-resolved" label="CS_COMMON_RESOLVED" />
          <Label label={`. Please rate`} />
        </div>
      );
      break;
    case "CS_COMMON_REJECTED_UCASE":
      statusObj.style = {
        color: "#484848",
      };
      statusObj.message = (
        <div>
          <Label label={`Complaint has been `} />
          <Label className="complaint-status-rejected" label={`CS_COMMON_REJECTED`} />
          <Label label={`. Please rate`} />
        </div>
      );
      break;
    default:
      statusObj.style = {
        color: "#484848",
      };
      statusObj.message = `Complaint Re-assigned to ${assignee}`;
  }
  if (status && status.includes("Overdue")) {
    statusObj.style = { color: "#e74c3c" };
    statusObj.message = "";
  }
  if (status && status.includes("left")) {
    statusObj.style = { color: "#22b25f" };
    statusObj.message = "";
  }
  return statusObj;
};

const Complaints = ({ index, complaints, onClick, complaintLocation, track, role, onComplaintClick, noComplaintMessage }) => {
  return complaints.length === 0 ? (
    <div className="no-complaints-message-cont">
      <Label label={noComplaintMessage} dark={true} fontSize={"16px"} labelStyle={{ letterSpacing: "0.7px" }} />
    </div>
  ) : (
    complaints.map((complaint, complaintIndex) => {
      const complaintHeader = complaint.header && "SERVICEDEFS." + complaint.header.toUpperCase();
      return (
        <div id={"complaint-" + complaintIndex} className="complaints-card-main-cont" key={`complaint-${complaintIndex}`}>
          <Card
            onClick={(e) => {
              onComplaintClick(encodeURIComponent(complaint.complaintNo));
            }}
            className="complaint-card"
            textChildren={
              <div className="complaint-card-wrapper">
                <div className="complaint-header-cont">
                  <Label
                    className="complaint-header text-bold dark-color"
                    fontSize="16px"
                    dark={true}
                    bold={true}
                    label={complaintHeader ? complaintHeader : "Default"}
                    containerStyle={{ maxWidth: "60%" }}
                    labelStyle={{ letterSpacing: 0.7, wordWrap: "break-word", width: "100%" }}
                  />

                  <Label
                    className="complaint-status-text text-bold"
                    labelStyle={{ letterSpacing: 0.7, wordBreak: "normal", ...getStatusAndChangeColor(complaint.status.status).style }}
                    label={complaint.status.status}
                  />
                </div>
                <div className="complaint-date-cont">
                  <Icon action="action" name="date-range" />
                  <span className="complaint-date">{getDateFromEpoch(complaint.date)}</span>
                </div>
                <div className="complaint-number-cont">
                  <div className="complaint-number complaint-date">
                    <Label fontSize="12px" label={"CS_COMMON_COMPLAINT_NO"} />
                    <Label fontSize="12px" label={" : "} />
                    <Label fontSize="12px" label={complaint.complaintNo} className="complaint-complaint-number" />
                  </div>
                </div>
                {complaintLocation && (
                  <div className="complaint-address-cont">
                    <Icon action="maps" name="place" style={{ height: 24, width: 24, marginRight: 10 }} color={"#767676"} />
                    <Label fontSize="12px" label={complaint.address} className="complaint-address" />
                  </div>
                )}
                {complaint &&
                  complaint.images &&
                  complaint.images.length > 0 && (
                    <div className="complaint-image-cont">
                      {complaint.images.map((image, index) => {
                        return (
                          image && (
                            <div className="complaint-image-wrapper" key={index}>
                              <Image style={imageStyles} size="medium" className="complaint-image" width="100%" height={46} source={image} />{" "}
                            </div>
                          )
                        );
                      })}
                    </div>
                  )}
                {role === "citizen" && (
                  <Label labelStyle={{ marginLeft: "3px" }} label={complaint.status.statusMessage} className="complaint-status-text dark-color" />
                )}
                {bottomInfoTemplate(complaint, role)}
              </div>
            }
          />
        </div>
      );
    })
  );
};

export default Complaints;
