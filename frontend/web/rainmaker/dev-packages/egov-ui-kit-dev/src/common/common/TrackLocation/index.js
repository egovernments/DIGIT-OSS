import React, { Component } from "react";
import { connect } from "react-redux";
import { MapLocation, Button, Icon } from "components";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

const pickBtn = {
  lineHeight: "38px",
  display: "block",
  margin: 0,
  backgroundColor: "#f5a623",
  color: "#ffffff",
  fontFamily: "Roboto",
  fontSize: "7px",
  height: 38,
  fontWeight: 500,
  fontStyle: "normal",
};

var add = {};

class TrackLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMyAddress: false,
      currLoc: {},
      pickedLoc: {},
    };
  }

  componentDidMount() {
    var myLocation = { lat: 12.9279, lng: 77.6271 };
    //To set the map to any defined location.
    if (this.state.showMyAddress === true && myLocation) {
      this.setState({
        currLoc: myLocation,
      });
    }
  }

  //For Compass Click -- set map to current location
  getMyLocation = () => {
    const { currentLocation } = this.props;
    if (!isEmpty(currentLocation)) {
      const { lat, lng } = currentLocation;
      this.setState({
        currLoc: { lat: parseFloat(lat), lng: parseFloat(lng) },
      });
    } else if (navigator.geolocation) {
      // can be resused
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currLoc: { lat: position.coords.latitude, lng: position.coords.longitude },
          });
        },
        function(error) {
          console.log(error.code);
        }
      );
    }
  };

  setPickedLocation = (lati, long) => {
    add.lat = lati;
    add.lng = long;
  };

  onClickPick = () => {
    this.convertToAddress(add);
    this.setPrevPageFlag();
    this.props.history.goBack();
  };

  convertToAddress = (add) => {
    const { lat, lng } = add;
    this.setState({
      currLoc: {},
    });
    lat && this.props.handleFieldChange(this.props.formKey, "latitude", parseFloat(lat).toFixed(6));
    lng && this.props.handleFieldChange(this.props.formKey, "longitude", parseFloat(lng).toFixed(6));
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: lat, lng: lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          //Results[0] gives the nearest address
          this.props.handleFieldChange(this.props.formKey, "address", results[0].formatted_address);
        }
      }
    });
  };

  onCLickMapBackBtn = () => {
    this.setPrevPageFlag();
    this.props.history.goBack();
  };

  setPrevPageFlag = () => {
    if (this.props.formKey === "propertyTax") {
      sessionStorage.setItem("backFromPTMap", true);
    }
  };

  render() {
    let { currLoc } = this.state;
    const { location } = this.props;
    var _currloc = !isEmpty(currLoc) ? currLoc : isEmpty(location) ? { lat: 12.972442, lng: 77.580643 } : location;
    return (
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <div className="back-btn">
          <Icon
            id="map-back-btn"
            style={{
              height: 24,
              width: 24,
              color: "#484848",
            }}
            action="navigation"
            name={"arrow-back"}
            onClick={this.onCLickMapBackBtn}
          />
        </div>
        <MapLocation
          currLoc={_currloc}
          setLocation={this.setPickedLocation}
          getMyLoc={this.getMyLocation}
          icon={pinIcon}
          hideTerrainBtn={true}
          dragInfoBox={false}
          viewLocation={false}
        />
        <div className="responsive-action-button-cont">
          <Button
            id="map-pick-button"
            className="pick responsive-action-button"
            label={<Label buttonLabel={true} label="CORE_COMMON_PICK" />}
            style={pickBtn}
            primary={true}
            labelColor="#ffffff"
            onClick={this.onClickPick}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const formKey = window.location.href.split("?")[1];
  const form = state.form[formKey];
  const fields = (form && form.fields) || {};
  const currentLocation = state.app.currentLocation || {};
  var location = {};
  if (fields.latitude && fields.latitude.value) location = { lat: parseFloat(fields.latitude.value), lng: parseFloat(fields.longitude.value) };
  return { location, formKey, currentLocation };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackLocation);
