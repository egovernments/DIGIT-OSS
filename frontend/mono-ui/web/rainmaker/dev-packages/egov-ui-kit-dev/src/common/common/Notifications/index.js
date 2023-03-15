import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { Card, Icon } from "components";
import { DownloadFileContainer } from "egov-ui-framework/ui-containers";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import ReadMore from "../ReadMore";
import "./index.css";

const pStyle = {
  backgroundColor: "#EEEEEE",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  height: "65%",
  width: "90%",
};
const divStyle = {
  backgroundColor: "#FC8019",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  height: "35%",
  width: "90%",
};

const Notifications = ({ notifications = [], history }) => {
  const renderUpdate = (notification, index) => {
    const { description, buttons, address, name, SLA, type, id, tenantId, eventDate, eventToDate, documents } = notification;
    return (
      <Card
        className="home-notification"
        style={{ margin: "8px 0px", borderLeft: type === "EVENTSONGROUND" ? "none" : "4px solid #fe7a51" }}
        key={index}
        id={`home-notification${index}`}
        style={{ padding: "12px 8px" }}
        textChildren={
          <Grid container>
            {type === "EVENTSONGROUND" && (
              <Grid item xs={4} direction="column" style={{ maxWidth: "100px", maxHeight: "100px", minWidth: "100px", minHeight: "100px" }}>
                <div style={divStyle}>
                  <Label label={(eventDate.split(":")[0] === eventToDate.split(":")[0]) ? eventDate.split(":")[0] : eventDate.split(":")[0] + "-" + eventToDate.split(":")[0]} color="#fff" fontSize="17px" />
                </div>
                <div style={pStyle}>
                  <Label label={(eventDate.split(":")[1] === eventToDate.split(":")[1] && eventDate.split(":")[0] === eventToDate.split(":")[0]) ? eventDate.split(":")[1] : eventDate.split(":")[1] + "-" + eventToDate.split(":")[1]} color="#FC8019" fontSize="34px" />
                </div>
              </Grid>
            )}
            <Grid
              item
              xs={type === "EVENTSONGROUND" ? 8 : 12}
              sm
              container
              style={{ display: "inline-block" }}
              className="update"
              onClick={() => (type === "EVENTSONGROUND" ? history.push(`/event-details?uuid=${id}&tenantId=${tenantId}`) : {})}
            >
              <Label fontSize={16} color="rgba(0, 0, 0, 0.87)" label={type == "SYSTEMGENERATED" ?getTransformedLocale(name):name} containerStyle={{ marginBottom: 10 }} />

              {type != "EVENTSONGROUND" && (
                <div>
                  <Hidden xsDown>
                    <Label
                      fontSize={14}
                      color="rgba(0, 0, 0, 0.60)"
                      label={description}
                      labelStyle={{ width: "100%", wordWrap: "break-word" }}
                      containerStyle={{ marginBottom: 10 }}
                    />
                  </Hidden>
                  <Hidden smUp>
                    <ReadMore
                      className="read-more-content"
                      charLimit={90}
                      readMoreText="CS_READ_MORE"
                      readLessText="CS_READ_LESS"
                      containerStyle={{ marginBottom: 10 }}
                    >
                      {description}
                    </ReadMore>
                  </Hidden>
                </div>
              )}
              {address && (
                <div className="rainmaker-displayInline">
                  <Icon
                    name="place"
                    action="maps"
                    style={{
                      height: 25,
                      width: 100,
                      maxWidth: 38,
                      color: "#484848",
                    }}
                    viewBox="10 0 24 24"
                  />
                  <Label
                    fontSize={14}
                    color="rgba(0, 0, 0, 0.60)"
                    label={address}
                    containerStyle={{ marginLeft: -7, marginBottom: 10, width: "90%" }}
                  />
                </div>
              )}

              {buttons && buttons.length > 0 && (
                <div style={{ marginTop: 5, display: "flex" }}>
                  {buttons.map((button, index) => {
                    return (
                      <div
                        onClick={() => {
                          if(button.route.includes("digit-ui")){
                            window.location.href=`${button.route.startsWith('digit-ui')?'/':""}${button.route}`;
                          }else{
                            history.push(button.route);
                          }
                        }}
                        style={{ cursor: "pointer", marginBottom: 10 }}
                      >
                        <Label
                          label={`CS_COMMON_${button.label.toUpperCase().replace(/[._:-\s\/]/g, "_")}`}
                          color={"#FC8019"}
                          fontSize={12}
                          containerStyle={index != buttons.length - 1 ? { marginRight: 30 } : {}}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {documents && <DownloadFileContainer data={documents} className="review-documents" backgroundGrey={true} />}
              {type === "EVENTSONGROUND" ? (
                <div className="rainmaker-displayInline">
                  <Icon name="access-time" action="device" viewBox="10 0 24 24" style={{ height: "20px", width: "35px" }} />
                  {SLA}
                </div>
              ) : (
                SLA
              )}
            </Grid>
          </Grid>
        }
      />
    );
  };

  return notifications && notifications.length > 0 && <div>{notifications.map((notification, index) => renderUpdate(notification, index))}</div>;
  //  : (
  //   <div className="no-assessment-message-cont"><Label label="EMPTY_NOTIFICATIONS" /></div>
  // );
};

export default Notifications;
