import React, { Component } from "react";
import { Icon, List, Image, Card, MapLocation } from "components";
import { connect } from "react-redux";
import { Screen } from "modules/common";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import Logo from "egov-ui-kit/assets/images/mseva-punjab.png";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const listInnerDivStyle = {
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "40px",
};

const iconStyle = {
  width: "20px",
  height: "20px",
  padding: "0px",
  fill: "#f5a623",
  top: "-3px",
  margin: "0px 0px 0px 8px",
};

const facebookStyle = {
  height: "47.7px",
  width: "47.7px",
  borderRadius: "50%",
  padding: "5px",
  background: "#3b5998",
};

const twitterStyle = {
  marginRight: 32,
  height: "47.7px",
  width: "47.7px",
  borderRadius: "50%",
  padding: "5px",
  background: "#55acee",
};

const defaultLoader = "Loading ...";

// const location = { lat: 12.9199988, lng: 77.67078 };

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMap: false,
    };
  }
  fetchCurrentTenant = () => {};

  openMapHandler = (isOpen) => {
    var pathName = this.props.history.location.pathname;
    if (isOpen === true) this.props.history.push(pathName + "?map");
    else if (isOpen === false) this.props.history.goBack();
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.history.location.search === "") {
      this.setState({ openMap: false });
    } else {
      this.setState({ openMap: true });
    }
  };

  onItemClick = (item, index) => {};

  returnListItems = () => {
    let { emailId, contactNumber, address, OfficeTimings, domainUrl } = this.props.currentTenant[0] || {};

    return [
      {
        leftIcon: <Icon style={iconStyle} action="maps" name="place" />,
        primaryText: <Label label={address ? address : defaultLoader} />,
        secondaryText: address && (
          <div onClick={() => this.openMapHandler(true)}>
            <Label id="contactus-open-map" label="CS_CONTACTUS_OPEN_MAP" className="openMap" labelStyle={{ color: "#00bbd3" }} />
          </div>
        ),
        style: {
          paddingBottom: "8px",
          paddingTop: "8px",
          marginTtop: "10px",
        },
      },
      {
        leftIcon: <Icon style={iconStyle} action="communication" name="call" />,
        primaryText: (
          <a className="pgr-call-icon phoneNumberStyle" href={`tel:+91${contactNumber}`} style={{ textDecoration: "none" }} rel="noopener noreferrer">
            {contactNumber ? contactNumber : defaultLoader}
          </a>
        ),
        style: {
          paddingBottom: "8px",
          paddingTop: "8px",
        },
      },
      {
        leftIcon: <Icon style={iconStyle} action="device" name="access-time" />,
        primaryText: OfficeTimings && Object.keys(OfficeTimings)[0],
        secondaryText: (OfficeTimings && OfficeTimings[Object.keys(OfficeTimings)[0]]) || defaultLoader,
        style: {
          paddingBottom: "8px",
          paddingTop: "8px",
        },
      },
      {
        insetChildren: true,
        primaryText: OfficeTimings && Object.keys(OfficeTimings)[1],
        secondaryText: OfficeTimings && OfficeTimings[Object.keys(OfficeTimings)[1]],
        style: {
          paddingBottom: "5px",
          paddingTop: "8px",
        },
      },

      {
        leftIcon: <Icon style={iconStyle} action="communication" name="email" />,
        primaryText: emailId ? emailId : defaultLoader,
        style: {
          paddingBottom: "8px",
          paddingTop: "8px",
        },
      },
      {
        leftIcon: <Icon style={iconStyle} action="action" name="language" />,
        primaryText: (
          <a
            className="phoneNumberStyle"
            target="_blank"
            rel="noopener noreferrer"
            href={domainUrl && domainUrl.includes("http") ? domainUrl : `http://${domainUrl}` }
            style={{ textDecoration: "none" }}
          >
            {domainUrl || defaultLoader}
          </a>
        ),
        style: {
          paddingBottom: "8px",
          paddingTop: "8px",
        },
      },
    ];
  };

  render() {
    let { facebookUrl, twitterUrl, city } = this.props.currentTenant[0] || {};
    let location = {
      lat: city && city.latitude,
      lng: city && city.longitude,
    };
    return (
      <div className="form-without-button-cont-generic">
        <Screen className="contactus-main-cont">
          <Card
            id="contactus-card"
            className="contactus-main-card"
            textChildren={
              <div>
                <Image className="mseva-logo contact-us-logo" source={`${Logo}`} />
                <div className="contactus-list-container">
                  <List onItemClick={this.onItemClick} innerDivStyle={listInnerDivStyle} items={this.returnListItems()} />
                </div>
                <div style={{ textAlign: "center", paddingBottom: "8px" }}>
                  {twitterUrl && (
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      {
                        <Icon
                          id="contactus-twitter"
                          className="contactus-twitter"
                          style={twitterStyle}
                          action="custom"
                          name="twitter"
                          color="ffffff"
                        />
                      }
                    </a>
                  )}
                  {facebookUrl && (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                      {
                        <Icon
                          id="contactus-facebook"
                          className="contactus-facebook"
                          style={facebookStyle}
                          action="custom"
                          name="facebook"
                          color="ffffff"
                        />
                      }
                    </a>
                  )}
                </div>
              </div>
            }
          />
        </Screen>
        {this.state.openMap && (
          <div>
            <div className="back-btn" style={{ top: 24 }}>
              <Icon
                className="mapBackBtn"
                onClick={() => {
                  this.openMapHandler(false);
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
            <MapLocation currLoc={location} icon={pinIcon} hideTerrainBtn={true} viewLocation={true} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo: user, tenantId } = state.auth;
  const cities = state.common.cities || [];
  const searchKey = user.permanentCity || tenantId;
  const currentTenant = cities && cities.filter((city) => city.key === searchKey);
  return { currentTenant };
};

export default connect(
  mapStateToProps,
  null
)(ContactUs);
