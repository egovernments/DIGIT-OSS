import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

const iconStyle = {
  marginRight: "13px",
  height: "24px",
  width: "24px",
};

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const mapIconStyle = {
  marginRight: "7px",
  height: "12px",
  width: "14px",
  borderRadius: "50%",
};

class Details extends Component {
  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };

  onImageClick = (source) => {
    this.props.history.push(`/image?source=${source}`);
  };

  render() {
    const { status, complaint, applicationNo, description, submittedDate, address, addressDetail, mapAction, images, action, role } = this.props;
    const { houseNoAndStreetName, landmark, mohalla, city, locality } = addressDetail || "";
    const icon = {};
    icon.name = "location";
    icon.style = {
      display: "block",
    };
    let statusKey = "";

    if (status) {
      if (status.toLowerCase() == "open") {
        if (action && action === "reopen") {
          statusKey = `CS_COMMON_REOPENED`;
        } else {
          statusKey = `CS_COMMON_SUBMITTED`;
        }
      } else if (status.toLowerCase() == "reassignrequested") {
        if (role === "citizen") {
          statusKey = `CS_COMMON_${status.toUpperCase()}`;
        } else {
          statusKey = `CS_COMMON_CITIZEN_REQUEST_REASSIGN`;
        }
      } else {
        statusKey = `CS_COMMON_${status.toUpperCase()}`;
      }
    }
    const titleKey = complaint && "SERVICEDEFS." + complaint.toUpperCase();

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Icon action="notification" name="sms-failed" color="#767676" />{" "}
                <Label label="CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                {/* Dont delete !! */}
                {/* {role && role == "ao" ? (
                  <div className="rainmaker-displayInline">
                    <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                    <div onClick={this.navigateToComplaintType}>
                      <Icon action="editor" name="mode-edit" style={{ height: 18, width: 18, marginLeft: 16 }} color="#767676" />
                    </div>
                  </div>
                ) : (
                  <Label labelClassName="dark-heading rainmaker-big-font" label={titleKey} />
                )} */}
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMMON_COMPLAINT_NO" />
                  <Label
                    labelStyle={{ color: "inherit" }}
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    id="complaint-details-complaint-number"
                    label={applicationNo}
                  />
                </div>
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMPLAINT_DETAILS_CURRENT_STATUS" />
                  <Label
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    id="complaint-details-current-status"
                    labelStyle={{ color: "inherit" }}
                    label={statusKey}
                  />
                </div>
                <div className="complaint-detail-detail-section-status row">
                  <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_COMPLAINT_DETAILS_SUBMISSION_DATE" />
                  <Label
                    className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                    label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                  />
                </div>
                {description && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label="CS_ADDCOMPLAINT_COMPLAINT_DETAILS" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      label={description}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                <div style={{ marginTop: "16px" }} className="complaint-image-cont">
                  {images &&
                    images.map((image, index) => {
                      return (
                        image && (
                          <div className="complaint-image-wrapper" key={index}>
                            <Image
                              style={imageStyles}
                              size="medium"
                              className="complaint-image"
                              width="100%"
                              height={46}
                              source={image}
                              onClick={() => this.onImageClick(image)}
                            />
                          </div>
                        )
                      );
                    })}
                </div>
                {addressDetail && !isEmpty(addressDetail) && (
                  <div className="rainmaker-displayInline">
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: 13 }} color={"#767676"} />
                    <Label label="CS_COMPLAINT_DETAILS_ADDRESS_DETAILS" labelClassName="dark-heading" />
                  </div>
                )}
                {houseNoAndStreetName && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label
                      className="col-xs-6  col-sm-4 col-md-2 status-color"
                      label={"CS_COMPLAINTDETAILS_HOUSE"}
                      id="complaint-details-complaint-location"
                    />
                    <Label
                      label={houseNoAndStreetName}
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      id="complaint-details-complaint-location"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {mohalla && city && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label
                      className="col-xs-6  col-sm-4 col-md-2 status-color"
                      label={"CS_COMPLAINTDETAILS_MOHALLA"}
                      id="complaint-details-complaint-location"
                    />
                    <div className="col-xs-6  col-sm-8 col-md-10 no-padding complaint-address-display">
                      <Label
                        label={locality}
                        className="status-result-color"
                        id="complaint-details-complaint-location"
                        labelStyle={{ color: "inherit" }}
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
                      />
                    </div>
                  </div>
                )}
                {landmark && (
                  <div className="complaint-detail-detail-section-status row">
                    <Label className="col-xs-6  col-sm-4 col-md-2 status-color" label={"CS_COMPLAINTDETAILS_LANDMARK"} />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10 no-padding status-result-color"
                      label={landmark}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {address && isEmpty(addressDetail) && (
                  <div className="rainmaker-displayInline">
                    <Icon className="map-icon" action="maps" name="place" style={{ marginRight: "13px" }} color={"#767676"} />
                    <Label
                      label={address}
                      className="status-result-color"
                      id="complaint-details-complaint-location"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )}
                {/* <div style={{ marginTop: 10 }}>
                  {mapAction && complaintLoc.lat && (
                    <Button
                      className="employee-complaint-summary-mapBtn"
                      primary={true}
                      label={<Label buttonLabel={true} label={"ES_COMPLAINT_SUMMARY_MAP"} color="#ffffff" />}
                      style={{
                        height: "auto",
                        lineHeight: "auto",
                        minWidth: "inherit",
                      }}
                      labelStyle={{
                        padding: "0 12px 0 0 ",
                        letterSpacing: "0.6px",
                        display: "inline-block",
                        height: "22px",
                        lineHeight: "22px",
                      }}
                      icon={<Icon action="maps" name="place" style={mapIconStyle} color={"#ffffff"} />}
                      onClick={(e) => {
                        this.props.redirectToMap(true);
                      }}
                    />
                  )}
                </div> */}
                {/* {description && (
                  <div className="rainmaker-displayInline">
                    <Icon action="editor" name="format-quote" style={iconStyle} color={"#969696"} />
                    <Label
                      label={description}
                      id="complaint-details-complaint-description"
                      className="status-result-color"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                )} */}
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default Details;
