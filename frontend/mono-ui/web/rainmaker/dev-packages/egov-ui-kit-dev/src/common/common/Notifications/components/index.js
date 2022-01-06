import React, { Component } from "react";
import { Screen } from "modules/common";
import { Card, Icon, MapLocation } from "components";
import { connect } from "react-redux";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { getNotifications } from "egov-ui-kit/redux/app/actions";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import Label from "egov-ui-kit/utils/translationNode";
import Grid from "@material-ui/core/Grid";
import get from "lodash/get";
import "../index.css";

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
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const { getNotifications, notifications } = this.props;
    if (!notifications) {
      let queryObject = [
        {
          key: "tenantId",
          value: tenantId,
        },
        {
          key: "eventTypes",
          value: "EVENTSONGROUND",
        },
      ];
      const requestBody = {
        RequestInfo: {
          apiId: "org.egov.pt",
          ver: "1.0",
          ts: 1502890899493,
          action: "asd",
          did: "4354648646",
          key: "xyz",
          msgId: "654654",
          requesterId: "61",
          authToken: getAccessToken(),
        },
      };
      getNotifications(queryObject, requestBody);
    }
  };

  render() {
    const { openMap } = this.state;
    const { openMapHandler } = this;
    const { eventDetails, loading } = this.props;
    const { description, SLA, address, locationObj, eventCategory, name, eventDate,eventToDate, entryFees } = eventDetails || "";
    return (
      <Screen className="notifications-screen-style" loading={loading}>
        {eventCategory && <Card
          className="home-notification"
          style={{ margin: "8px 0px" }}
          style={{ padding: "12px 8px" }}
          textChildren={
            <Grid container>
              {eventDate && (
                <Grid item xs={4} direction="column" style={{ maxWidth: "100px", maxHeight: "100px", minWidth: "100px", minHeight: "100px" }}>
                 <div style={divStyle}>
                  <Label label={(eventDate.split(":")[0]===eventToDate.split(":")[0])? eventDate.split(":")[0]:eventDate.split(":")[0]+"-"+eventToDate.split(":")[0]} color="#fff" fontSize="17px" />
                </div>
                <div style={pStyle}>
                  <Label label={(eventDate.split(":")[1]===eventToDate.split(":")[1]&&eventDate.split(":")[0]===eventToDate.split(":")[0])?eventDate.split(":")[1]: eventDate.split(":")[1]+"-"+eventToDate.split(":")[1]} color="#FC8019" fontSize="34px" />
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
        />}
       {description &&  <Card
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
                <div className="rainmaker-displayInline" >
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
             <Label fontSize={14} color="rgba(0, 0, 0, 0.60)" label={address} containerStyle={{ marginLeft: 2, marginBottom: 10,width :"90%" }} />
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
              {entryFees > 0 && (
                <div className="rainmaker-displayInline" style={{ marginTop: 8 }}>
                  <Icon name="rupee" action="custom" viewBox="10 0 24 24" style={{ height: "20px", width: "35px" }} />
                  <Label label={`${entryFees}`} containerStyle={{ marginLeft: 5 }} />
                </div>
              )}
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
        />}
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

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const loading = get(state.app, "notificationObj.loading");
  const uuid = getQueryArg(window.location.href, "uuid");
  const eventDetails = notifications && notifications.hasOwnProperty(uuid) ? get(notifications, uuid) : {};
  return { eventDetails, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetails);
