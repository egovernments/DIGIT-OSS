import React, { Component } from "react";
import { Screen } from "modules/common";
import { Card, Icon, MapLocation, Button } from "components";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import Label from "egov-ui-kit/utils/translationNode";
import "../index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import Grid from "@material-ui/core/Grid";
import { getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedNotifications } from "egov-ui-kit/utils/commons";

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

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "",
      openMap: false,
    };
  }

  openMapHandler = (isOpen) => {
    this.setState({ openMap: isOpen });
  };

  componentDidMount = async () => {
    const uuid = getQueryArg(window.location.href, "uuid");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
      {
        key: "ids",
        value: uuid,
      },
    ];

    const requestBody = {
      apiId: "org.egov.pt",
      ver: "1.0",
      ts: 1502890899493,
      action: "asd",
      did: "4354648646",
      key: "xyz",
      msgId: "654654",
      requesterId: "61",
      authToken: getAccessToken(),
    };

    try {
      const response = await httpRequest("post", "/egov-user-event/v1/events/_search", "_search", queryObject, requestBody);
      if (response) {
        this.setState({
          response: response.events,
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  render() {
    const { response, openMap } = this.state;
    const { openMapHandler } = this;
    const notification = getTransformedNotifications(response)[0];
    const { description, SLA, address, locationObj, eventCategory, name, eventDate } = notification || "";
    return (
      <Screen className="notifications-screen-style">
        <Card
          className="home-notification"
          style={{ margin: "8px 0px" }}
          style={{ padding: "12px 8px" }}
          textChildren={
            <Grid container>
              {eventDate && (
                <Grid item xs={4} direction="column" style={{ maxWidth: "100px", maxHeight: "100px", minWidth: "100px", minHeight: "100px" }}>
                  <div style={divStyle}>
                    <Label label={eventDate.split(":")[0]} color="#fff" fontSize="17px" />
                  </div>
                  <div style={pStyle}>
                    <Label label={eventDate.split(":")[1]} color="#FC8019" fontSize="34px" />
                  </div>
                </Grid>
              )}
              <Grid item xs={8} sm container>
                <div className="update">
                  <Label
                    leftWrapperStyle
                    fontSize={16}
                    color="rgba(0, 0, 0, 0.87)"
                    label={name}
                    labelStyle={{ width: "100%", wordWrap: "break-word" }}
                    containerStyle={{ marginBottom: 5 }}
                  />
                  <Label
                    leftWrapperStyle
                    fontSize={14}
                    color="rgba(0, 0, 0, 0.60)"
                    label={"MSEVA_EVENTCATEGORIES_" + eventCategory}
                    labelStyle={{ width: "100%", wordWrap: "break-word" }}
                    containerStyle={{ marginBottom: 5, marginTop: 10 }}
                  />
                </div>
              </Grid>
            </Grid>
          }
        />
        <Card
          style={{ margin: "8px 0px" }}
          style={{ padding: "12px 8px" }}
          textChildren={
            <div>
              <Label
                leftWrapperStyle
                fontSize={14}
                color="rgba(0, 0, 0, 0.60)"
                label={description}
                labelStyle={{ width: "100%", wordWrap: "break-word" }}
                containerStyle={{ marginBottom: 20 }}
              />
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
                  <Label fontSize={14} color="rgba(0, 0, 0, 0.60)" label={address} containerStyle={{ marginLeft: 2, marginBottom: 10 }} />
                </div>
              )}
              <div
                onClick={() => {
                  openMapHandler(true);
                }}
                style={{ cursor: "pointer", marginBottom: 20, marginLeft: 40 }}
              >
                <Label label={`GET DIRECTIONS`} color="#FC8019" fontSize={14} />
              </div>

              <div className="rainmaker-displayInline">
                <Icon name="access-time" action="device" viewBox="10 0 24 24" style={{ height: "20px", width: "35px" }} />
                {SLA}
              </div>
              {openMap && (
                <div>
                  <Icon
                    className="mapBackBtn"
                    onClick={() => {
                      openMapHandler(false);
                    }}
                    style={{
                      height: 24,
                      width: 24,
                      color: "#484848",
                    }}
                    action="navigation"
                    name={"arrow-back"}
                  />
                  <MapLocation currLoc={locationObj} icon={pinIcon} hideTerrainBtn={true} viewLocation={true} />
                </div>
              )}
            </div>
          }
        />
        {/* <div className="responsive-action-button-cont">
          <Button
            primary={true}
            fullWidth={true}
            style={{ boxShadow: "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)" }}
            label="ADD TO MY CALENDAR"
            className="responsive-action-button"
          />
        </div> */}
      </Screen>
    );
  }
}

export default EventDetails;
