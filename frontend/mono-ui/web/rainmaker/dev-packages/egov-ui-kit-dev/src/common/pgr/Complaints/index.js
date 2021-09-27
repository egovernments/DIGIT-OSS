import React from "react";
import { Image, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";
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
  position: "relative",
  top: "2px",
};

const bottomInfoTemplate = (item, role) => {
  return role !== "citizen" ? (
    <div>
      <div className="employee-bottom-info-cont">
        {(role === "ao" || role === "csr") && (
          <div className="submitted-by-text">
            {item.complaintStatus === "ASSIGNED" && item.assignedTo !== "NA" && (
              <div className="clearfix">
                <div className="inline-Localization-text">
                  <Label containerStyle={{ display: "inline-block" }} fontSize={12} label="ES_ALL_COMPLAINTS_ASSIGNED_TO" />
                  <Label
                    containerStyle={{ display: "inline-block" }}
                    fontSize={12}
                    color="#464646"
                    labelStyle={{ marginLeft: "3px" }}
                    label={item.assignedTo}
                  />
                </div>
                {item.employeePhoneNumber && (
                  <a
                    className="pgr-call-icon"
                    href={`tel:+91${item.employeePhoneNumber}`}
                    style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "flex-end" }}
                  >
                    <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    <span style={{ marginLeft: "10px", color: "#767676", fontSize: 12, lineHeight: "12px" }}>{`+91 ${
                      item.employeePhoneNumber
                    }`}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        {(role === "employee" || role === "csr") && (
          <div className="submitted-by-text">
            {item.submittedBy !== "NA" && (
              <div className="clearfix">
                <div className="inline-Localization-text">
                  <Label containerStyle={{ display: "inline-block" }} fontSize={12} label={"ES_COMMON_FILED_BY"} />
                  <Label
                    containerStyle={{ display: "inline-block" }}
                    fontSize={12}
                    color="#464646"
                    labelStyle={{ marginLeft: "3px" }}
                    label={item.submittedBy}
                  />
                </div>
                {item.citizenPhoneNumber && (
                  <a
                    className="pgr-call-icon"
                    href={`tel:+91${item.citizenPhoneNumber}`}
                    style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "flex-end" }}
                  >
                    <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    <span style={{ marginLeft: "10px", color: "#767676", fontSize: 12, lineHeight: "12px" }}>{`+91 ${item.citizenPhoneNumber}`}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {item.escalatedTo && role !== "csr" && (
        <div className="submitted-by-text">
          Escalated To: <span style={{ color: "#464646" }}>{item.escalatedTo}</span>
        </div>
      )}
      {item.reassign && role !== "csr" && (
        <div className="employee-bottom-msg rainmaker-displayInline">
          <Label label={role === "ao" ? `${item.reassignRequestedBy}` : "CS_MYCOMPLAINTS_REASSIGN_MESSAGE2"} dark={true} fontSize={12} />
          <Label label={"CS_MYCOMPLAINTS_REASSIGN_MESSAGE1"} dark={true} containerStyle={{ marginLeft: 4 }} fontSize={12} />
        </div>
      )}
    </div>
  ) : null;
};

const getStatusAndChangeColor = (status, assignee) => {
  let statusObj = {
    style: {},
    message: "",
    containerStyle: {},
  };
  switch (status) {
    case "CS_COMMON_OPEN_UCASE":
      statusObj.style = {
        // color: "#f89a3f",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_COMMON_COMPLAINT"} />
          <Label className="complaint-status-reassigned" label={`CS_COMMON_RE_ASSIGNED`} />
          <Label label={"CS_MYCOMPLAINTS_TO"} />
          <Label className="complaint-assignee" label={`${assignee}`} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "red",
      };
      break;
    case "CS_COMMON_CLOSED_UCASE":
      statusObj.style = {
        // color: "#5385a6",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_COMMON_COMPLAINT"} />
          <Label className="complaint-status-resolved" label="CS_COMMON_RESOLVED" />
          <Label label={"CS_MYCOMPLAINTS_RATE"} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "#4CAF50",
      };
      break;
    case "CS_COMMON_REJECTED_UCASE":
      statusObj.style = {
        // color: "#e74c3c",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_MYCOMPLAINTS_COMPLAINT_PREFIX"} />
          <Label className="complaint-status-rejected" label={`CS_COMMON_REJECTED`} />
          <Label label={"CS_MYCOMPLAINTS_RATE"} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "red",
      };
      break;
    default:
      statusObj.style = {
        // color: "#484848",
        color: "#ffffff",
      };
      statusObj.message = `CS_MYCOMPLAINTS_RE_ASSIGNED ${assignee}`;
      statusObj.containerStyle = {
        backgroundColor: "#4CAF50",
      };
  }
  if (status && status.toLowerCase().includes(`overdue`)) {
    statusObj.style = { color: "#e74c3c" };
    statusObj.message = "";
  }
  if (status && status.toLowerCase().includes(`left`)) {
    statusObj.style = { color: "#22b25f" };
    statusObj.message = "";
  }
  if (status && status.includes(`/`)) {
    if (["0", "1", "2", "3"].indexOf(status.split("/")[0]) > -1) {
      statusObj.style = { color: "#e74c3c" };
      statusObj.message = "";
    } else {
      statusObj.style = { color: "#22b25f" };
      statusObj.message = "";
    }
  }
  return statusObj;
};

const Complaints = ({ complaints, complaintLocation, role, onComplaintClick, noComplaintMessage, heightOffset }) => {
  return complaints.length === 0 ? (
    <div className="no-complaints-message-cont" style={heightOffset && { height: `calc(100vh - ${heightOffset})` }}>
      <Label label={noComplaintMessage} dark={true} fontSize={"16px"} labelStyle={{ letterSpacing: "0.7px" }} />
    </div>
  ) : (
    complaints.map((complaint, complaintIndex) => {
      const { houseNoAndStreetName, landmark, mohalla, city, locality } = complaint.addressDetail || "";
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

                  <div
                    style={
                      role === "citizen"
                        ? {
                            justifyContent: "center",
                            display: "flex",
                            borderRadius: 12,
                            width: "25%",
                            height: "24px",
                            alignItems: "center",
                            ...getStatusAndChangeColor(complaint.status.status).containerStyle,
                          }
                        : {}
                    }
                  >
                    <Label
                      className="complaint-status-text text-bold"
                      labelStyle={{
                        whiteSpace: "pre",
                        letterSpacing: 0.7,
                        wordBreak: "normal",

                        ...getStatusAndChangeColor(complaint.status.status).style,
                      }}
                      // containerStyle={
                      //   role === "citizen"
                      //     ? {
                      //         width: "20%",
                      //         justifyContent: "center",
                      //         display: "flex",
                      //         ...getStatusAndChangeColor(complaint.status.status).containerStyle,
                      //       }
                      //     : {}
                      // }
                      fontSize={role === "citizen" ? 12 : 14}
                      label={complaint.status.status}
                      dynamicArray={[Math.abs(complaint.SLA)]}
                      bold={true}
                    />
                  </div>
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
                {complaintLocation && complaint.addressDetail && !isEmpty(complaint.addressDetail) && (
                  <div className="rainmaker-displayInline" style={{ paddingBottom: "10px" }}>
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: 10 }} color={"#767676"} />
                    <div className="complaint-address-display">
                      <Label
                        label={houseNoAndStreetName}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="12px"
                      />
                      {houseNoAndStreetName && (
                        <Label
                          label={","}
                          className="comma-style"
                          id="complaint-details-complaint-location"
                          labelStyle={{ color: "inherit" }}
                          fontSize="16px"
                        />
                      )}
                      <Label
                        label={locality}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="12px"
                      />
                      <Label
                        label={","}
                        className="comma-style"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="16px"
                      />
                      <Label
                        label={`TENANT_TENANTS_${city.toUpperCase().replace(/[.]/g, "_")}`}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="12px"
                      />
                      {landmark && (
                        <Label
                          label={","}
                          className="comma-style"
                          id="complaint-details-complaint-location"
                          labelStyle={{ color: "inherit" }}
                          fontSize="16px"
                        />
                      )}
                      <Label
                        label={landmark}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
                        fontSize="12px"
                      />
                    </div>
                  </div>
                )}

                {complaintLocation && complaint.address && isEmpty(complaint.addressDetail) && (
                  <div className="complaint-address-cont">
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: 10 }} color={"#767676"} />
                    <Label fontSize="12px" color="#484848" label={complaint.address} className="complaint-address" />
                  </div>
                )}
                {role === "citizen" && complaint && complaint.images && complaint.images.length > 0 && (
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
