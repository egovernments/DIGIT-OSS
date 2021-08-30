import React, { Component } from "react";
import { Card, TimeLine, Icon, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import { getDateFromEpoch, isImage } from "egov-ui-kit/utils/commons";

const timelineButtonLabelStyle = {
  lineHeight: 1,
  color: "#ffffff",
  fontWeight: 500,
};
const timelineButtonContainerStyle = {
  lineHeight: 1,
};

const statusContainerStyle = {
  display: "inline-block",
  marginRight: "3px",
};

const nameContainerStyle = {
  display: "inline-block",
};

const displayBlock = {
  display: "block",
  marginBottom: 5,
};
const timelineIconCommonStyle = {
  height: "38px",
  width: "38px",
  borderRadius: "50%",
  padding: "7px",
  marginLeft: "-7px",
};

const statusCommonIconStyle = {
  ...timelineIconCommonStyle,
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)",
  border: "solid 1px #fe7a51",
};

const statusResolvedIconStyle = {
  ...timelineIconCommonStyle,
  backgroundColor: "#22b25f",
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.22)",
  border: "solid 1px #22b25f",
};

const statusRejectedIconStyle = {
  ...timelineIconCommonStyle,
  backgroundColor: "#e74c3c",
  // boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.22)",
  border: "solid 1px #e74c3c",
};

const callIconStyle = {
  marginLeft: "17px",
  height: "17px",
  width: "17px",
  borderRadius: "50%",
  position: "absolute",
  top: "0px",
};

const connectorStyle = {
  display: "block",
  border: "solid 1px #fe7a51",
  minHeight: "28px",
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "open":
    case "pending":
      return <Icon action="custom" name="file-plus" style={statusCommonIconStyle} color={"#fe7a51"} />;
    case "reassignrequested":
      return <Icon action="custom" name="reassign-request" style={statusCommonIconStyle} color={"#fe7a51"} />;
    case "assigned":
    case "re-assign":
      return <Icon action="custom" name="file-send" style={statusCommonIconStyle} color={"#fe7a51"} />;
    case "rejected":
      return <Icon action="content" name="clear" style={statusRejectedIconStyle} color={"#FFFFFF"} />;
    case "resolved":
      return <Icon action="action" name="done" style={statusResolvedIconStyle} color={"#FFFFFF"} />;
    case "closed":
      return <Icon action="action" name="stars" style={statusResolvedIconStyle} color={"#FFFFFF"} />;
  }
};

//prventing number of times showing button for duplicate status
var openStatusCount = 0;
var rejectStatusCount = 0;
var resolveStatusCount = 0;
var assigneeStatusCount = 0;
var reassignRequestedCount = 0;

const StatusContent = ({ stepData, currentStatus, changeRoute, feedback, rating, role, filedBy, filedUserMobileNumber, reopenValidChecker }) => {
  var {
    action,
    when: date,
    media,
    status,
    comments,
    employeeName,
    employeeDesignation,
    employeeDepartment,
    businessKey: complaintNo,
    groName,
    employeeMobileNumber,
    groMobileNumber,
    groDesignation,
  } = stepData;
  const currDate = new Date().getTime();
  const resolvedDate = new Date(date).getTime();
  const isReopenValid = currDate - resolvedDate <= reopenValidChecker;
  switch (status) {
    case "open":
      openStatusCount++;
      return (
        <div className="complaint-timeline-content-section">
          <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
          <Label
            labelClassName="dark-color complaint-timeline-status"
            containerStyle={filedBy && filedBy.includes("@CSR") ? displayBlock : statusContainerStyle}
            label={`${
              action === "reopen"
                ? "CS_COMMON_COMPLAINT_REOPENED"
                : role !== "citizen"
                ? filedBy
                  ? filedBy.includes("@CSR")
                    ? "ES_COMPLAINT_FILED_BY_CSR"
                    : "ES_COMMON_FILED_BY"
                  : `CS_COMPLAINT_DETAILS_COMPLAINT_FILED`
                : `CS_COMPLAINT_DETAILS_COMPLAINT_FILED`
            }`}
          />
          {action !== "reopen" && role !== "citizen" && filedBy && (
            <Label
              label={filedBy.includes("@CSR") ? filedBy.replace("@CSR", "") : filedBy}
              containerStyle={nameContainerStyle}
              fontSize={filedBy.includes("@CSR") ? 12 : 14}
              dark={filedBy.includes("@CSR") ? false : true}
            />
          )}
          {role !== "citizen" && action !== "reopen" && filedUserMobileNumber && (
            <a
              className="citizen-mobileNumber-style"
              href={`tel:+91${filedUserMobileNumber}`}
              style={{ textDecoration: "none", position: "relative" }}
            >
              <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
              <span
                style={{
                  fontSize: filedBy.includes("@CSR") ? 12 : 14,
                  marginLeft: "43px",
                }}
              >{`+91 ${filedUserMobileNumber}`}</span>
            </a>
          )}

          {action === "reopen" && (
            <div>
              <Label
                labelClassName="rainmaker-small-font complaint-timeline-comments"
                containerStyle={{ width: "192px" }}
                label={comments ? comments.split(";")[0] : ""}
              />
              {media && (
                <div style={{ display: "flex" }}>
                  {media.map((image, index) => {
                    return (
                      isImage(image) && (
                        <div
                          style={{ marginRight: 8 }}
                          className="complaint-detail-detail-section-padding-zero"
                          id={`complaint-timeline-reopen-${openStatusCount}-image-${index}`}
                          key={index}
                        >
                          <Image
                            style={{
                              width: "97px",
                              height: "93px",
                            }}
                            size="medium"
                            source={image}
                            onClick={() => changeRoute.push(`/image?source=${image}`)}
                          />
                        </div>
                      )
                    );
                  })}
                </div>
              )}
              <Label
                labelClassName="rainmaker-small-font complaint-timeline-status"
                containerStyle={{ width: "192px" }}
                label={comments && comments.split(";")[1] ? `" ${comments.split(";")[1]} "` : ""}
              />
            </div>
          )}
        </div>
      );
    case "assigned":
      assigneeStatusCount++;
      switch (role && role.toLowerCase()) {
        case "ao":
        case "citizen":
        case "csr":
          return (
            <div className="complaint-timeline-content-section">
              <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
              <Label
                labelClassName="dark-color complaint-timeline-status"
                containerStyle={statusContainerStyle}
                label={`${
                  action == "assign"
                    ? employeeName
                      ? "CS_COMMON_ASSIGNED_TO"
                      : "ES_COMPLAINT_ASSIGNED_HEADER"
                    : employeeName
                    ? "CS_COMMON_REASSIGNED_TO"
                    : "ES_COMPLAINT_REASSIGNED_HEADER"
                }`}
              />
              <Label labelClassName="dark-color" containerStyle={nameContainerStyle} label={`${employeeName}`} />
              {employeeMobileNumber && assigneeStatusCount === 1 && (
                <a className="pgr-call-icon" href={`tel:+91${employeeMobileNumber}`} style={{ textDecoration: "none", position: "relative" }}>
                  <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                  <span style={{ marginLeft: "43px" }}>{`+91 ${employeeMobileNumber}`}</span>
                </a>
              )}
              <Label
                labelClassName="rainmaker-small-font complaint-timeline-department"
                // containerStyle={{ width: "192px" }}
                label={employeeDesignation}
              />
              <Label
                labelClassName="rainmaker-small-font complaint-timeline-department"
                // containerStyle={{ width: "192px" }}
                label={employeeDepartment}
              />
            </div>
          );
          break;
        case "employee":
          return (
            <div className="complaint-timeline-content-section">
              <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
              <Label
                labelClassName="dark-color complaint-timeline-status"
                containerStyle={statusContainerStyle}
                label={`${
                  action == "assign"
                    ? groName
                      ? "ES_COMPLAINT_DETAILS_ASSIGNED_BY"
                      : "ES_COMPLAINT_ASSIGNED_HEADER"
                    : groName
                    ? "ES_COMPLAINT_DETAILS_REASSIGNED_BY"
                    : "ES_COMPLAINT_REASSIGNED_HEADER"
                }`}
              />
              {groName && <Label labelClassName="dark-color" containerStyle={nameContainerStyle} label={`${groName}`} />}
              {/* {assigneeStatusCount === 1 &&
                groName &&
                groMobileNumber && (
                  <a className="pgr-call-icon" href={`tel:+91${groMobileNumber}`} style={{ textDecoration: "none", position: "relative" }}>
                    <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    <span style={{ marginLeft: "43px" }}>{`+91 ${groMobileNumber}`}</span>
                  </a>
                )} */}
              {groName && (
                <Label
                  labelClassName="rainmaker-small-font complaint-timeline-designation"
                  containerStyle={{ width: "192px" }}
                  label={`${groDesignation}`}
                />
              )}
            </div>
          );
          break;
        // default:
        //   return (
        //     <div className="complaint-timeline-content-section">
        //       <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
        //       <Label
        //         labelClassName="dark-color complaint-timeline-status"
        //         containerStyle={statusContainerStyle}
        //         label={`${action == "assign" ? "ES_COMPLAINT_ASSIGNED_HEADER" : "ES_COMPLAINT_REASSIGNED_HEADER"}`}
        //       />
        //     </div>
        //   );
      }

    case "reassignrequested":
      reassignRequestedCount++;

      return (
        <div className="complaint-timeline-content-section">
          <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
          {role === "citizen" && (
            <div>
              <Label
                labelClassName="dark-color complaint-timeline-status"
                containerStyle={statusContainerStyle}
                label={`${groName ? "CS_COMPLAINT_DETAILS_BEING_REASSIGNED" : "CS_COMMON_STATUS_BEING_REASSIGNED"}`}
              />
              {groName && <Label labelClassName="dark-color" containerStyle={nameContainerStyle} label={`${groName}`} />}
            </div>
          )}
          {role !== "citizen" && (
            <div>
              <Label
                labelClassName="dark-color complaint-timeline-status"
                containerStyle={statusContainerStyle}
                label={`${"CS_COMMON_RE-ASSIGN REQUESTED"}`}
              />

              <Label
                labelClassName="rainmaker-small-font complaint-timeline-comments"
                containerStyle={{ width: "192px" }}
                label={comments ? comments.split(";")[0] : ""}
              />
              <Label
                labelClassName="rainmaker-small-font complaint-timeline-comments"
                containerStyle={{ width: "192px" }}
                label={comments && comments.split(";")[1] ? `" ${comments.split(";")[1]} "` : ""}
              />
            </div>
          )}
        </div>
      );

    case "rejected":
      rejectStatusCount++;
      return (
        <div className="complaint-timeline-content-section">
          <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
          <Label labelClassName="dark-color complaint-timeline-status" label="CS_MYCOMPLAINTS_REJECTED" />
          <Label labelClassName="rainmaker-small-font" containerStyle={{ width: "192px" }} label={comments ? comments.split(";")[0] : ""} />
          <Label
            labelClassName="rainmaker-small-font complaint-timeline-comments"
            containerStyle={{ width: "192px" }}
            label={comments && comments.split(";")[1] ? `" ${comments.split(";")[1]} "` : ""}
          />
          {isReopenValid && currentStatus === "rejected" && (role === "citizen" || role === "csr") && rejectStatusCount === 1 && (
            <div
              className="complaint-details-timline-button"
              onClick={(e) => {
                role === "citizen"
                  ? changeRoute.push(`/reopen-complaint/${encodeURIComponent(complaintNo)}`)
                  : changeRoute.push(`/reopen-complaint/${encodeURIComponent(complaintNo)}`);
              }}
            >
              <Label
                label="CS_COMPLAINT_DETAILS_REOPEN"
                fontSize="12px"
                labelStyle={timelineButtonLabelStyle}
                containerStyle={timelineButtonContainerStyle}
              />
            </div>
          )}
        </div>
      );
    case "resolved":
      resolveStatusCount++;
      return (
        <div className="complaint-timeline-content-section">
          <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
          <Label labelClassName="dark-color complaint-timeline-status" label="CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED" />
          {media && (
            <div style={{ display: "flex" }}>
              {media.map((image, index) => {
                return (
                  isImage(image) && (
                    <div
                      style={{ marginRight: 8 }}
                      className="complaint-detail-detail-section-padding-zero"
                      id={`complaint-details-resolved-${resolveStatusCount}-image=${index}`}
                      key={index}
                    >
                      <Image
                        style={{
                          width: "97px",
                          height: "93px",
                        }}
                        size="medium"
                        source={image}
                        onClick={() => changeRoute.push(`/image?source=${image}`)}
                      />
                    </div>
                  )
                );
              })}
            </div>
          )}

          <Label labelClassName="rainmaker-small-font complaint-timeline-comments" containerStyle={{ width: "192px" }} label={comments} />
          {currentStatus === "resolved" && (role === "citizen" || role === "csr") && resolveStatusCount === 1 && (
            <div className="rainmaker-displayInline">
              {role !== "csr" && (
                <div
                  className="complaint-details-timline-button"
                  onClick={(e) => {
                    changeRoute.push(`/feedback/${encodeURIComponent(complaintNo)}`);
                  }}
                >
                  <Label
                    label="CS_COMPLAINT_DETAILS_RATE"
                    fontSize="12px"
                    labelStyle={timelineButtonLabelStyle}
                    containerStyle={timelineButtonContainerStyle}
                  />
                </div>
              )}
              {isReopenValid && (
                <div
                  className="complaint-details-timline-button"
                  onClick={(e) => {
                    role === "citizen"
                      ? changeRoute.push(`/reopen-complaint/${encodeURIComponent(complaintNo)}`)
                      : changeRoute.push(`/reopen-complaint/${encodeURIComponent(complaintNo)}`);
                  }}
                >
                  <Label
                    label="CS_COMPLAINT_DETAILS_REOPEN"
                    fontSize="12px"
                    labelStyle={timelineButtonLabelStyle}
                    containerStyle={timelineButtonContainerStyle}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );

    case "closed":
      return (
        <div className="complaint-timeline-content-section">
          <Label labelClassName="rainmaker-small-font complaint-timeline-date" label={getDateFromEpoch(date)} />
          <Label labelClassName="dark-color complaint-timeline-status" label="CS_COMMON_CITIZEN_FEEDBACK" />
          <div style={{ display: "flex" }}>
            {" "}
            <Label labelClassName="rainmaker-small-font complaint-timeline-rating" labelStyle={{ color: "#22b25f" }} label={`${rating}/5 `} />{" "}
            <Label labelClassName="rainmaker-small-font complaint-timeline-feedback" label={feedback && ` (${feedback})`} />
          </div>
          <Label labelClassName="rainmaker-small-font complaint-timeline-comments" label={comments ? `" ${comments} "` : ""} />
        </div>
      );
    case "pending":
      return (
        <div className="complaint-timeline-content-section">
          <Label
            style={{ paddingTop: "6px" }}
            labelClassName="dark-color complaint-timeline-status"
            containerStyle={
              filedBy && filedBy.includes("@CSR")
                ? {
                    display: "block",
                    marginBottom: 5,
                    paddingTop: "6px",
                  }
                : {
                    display: "inline-block",
                    marginRight: "3px",
                    paddingTop: "6px",
                  }
            }
            label={"CS_COMPLAINT_DETAILS_PENDING_STATUS"}
          />
        </div>
      );
  }
};

const DueDate = ({ duedateText }) => {
  return (
    duedateText &&
    duedateText.slaStatement && (
      <Label
        labelStyle={duedateText.slaStatement.toLowerCase().includes("overdue") ? { color: "#e74c3c" } : { color: "#22b25f" }}
        className="Complaint-details-duedate"
        label={duedateText.slaStatement}
        dynamicArray={[Math.abs(duedateText.daysCount)]}
      />
    )
  );
};

class ComplaintTimeLine extends Component {
  render() {
    openStatusCount = 0;
    rejectStatusCount = 0;
    resolveStatusCount = 0;
    assigneeStatusCount = 0;
    reassignRequestedCount = 0;
    let { status, history, role, timeLine, feedback, rating, filedBy, filedUserMobileNumber, timelineSLAStatus, reopenValidChecker } = this.props;
    if (timeLine && timeLine.length === 1 && timeLine[0].status === "open") {
      timeLine = [{ status: "pending" }, ...timeLine];
    }
    let steps = timeLine.map((step, key) => {
      return {
        props: {
          active: true,
        },
        labelProps: {
          icon: <StatusIcon status={step.status} />,
        },
        contentProps: {
          style: {
            marginTop: "-50px",
            paddingRight: 0,
          },
        },
        contentChildren: (
          <StatusContent
            stepData={step}
            currentStatus={status.toLowerCase()}
            changeRoute={history}
            feedback={feedback}
            rating={rating}
            role={role}
            filedBy={filedBy}
            filedUserMobileNumber={filedUserMobileNumber}
            reopenValidChecker={reopenValidChecker}
          />
        ),
      };
    });

    return (
      <div>
        <Card
          style={{
            paddingBottom: "0px",
          }}
          textChildren={
            <div>
              <div className="rainmaker-displayInline" style={{ position: "relative" }}>
                <Icon action="action" name="timeline" color="#767676" />{" "}
                <Label label="CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                {timelineSLAStatus && role && role !== "citizen" && <DueDate duedateText={timelineSLAStatus} />}
              </div>
              <div className="complaintTimeLineContainer">
                <TimeLine
                  stepperProps={{
                    orientation: "vertical",
                    borderLeft: "1px solid #fe7a51",
                  }}
                  steps={steps}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default ComplaintTimeLine;
