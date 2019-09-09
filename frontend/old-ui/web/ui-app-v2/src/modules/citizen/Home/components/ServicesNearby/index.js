import React from "react";
import { Carousel, Icon, Card } from "components";
import { Link } from "react-router-dom";
import Label from "utils/translationNode";
import "./index.css";

const iconStyle = {
  width: "30px",
  height: "30px",
  fill: "#00bbd3",
};

const servicesNearby = [
  <Link to="">
    <div className="service-cont">
      <div>
        <Icon style={iconStyle} className="service-icon" action="custom" name="police-station" />
      </div>
      <Label dark={true} className="service-label" label="Police Station" />
    </div>
  </Link>,
  <Link to="">
    <div className="service-cont">
      <div>
        <Icon style={iconStyle} className="service-icon" action="custom" name="blood-bank" />
      </div>
      <Label dark={true} className="service-label" label="Blood Bank" />
    </div>
  </Link>,
  <Link to="">
    <div className="service-cont">
      <div>
        <Icon style={iconStyle} className="service-icon" action="custom" name="hospital" />
      </div>
      <Label dark={true} className="service-label" label="Hospital" />
    </div>
  </Link>,
  <Link to="">
    <div className="service-cont">
      <div>
        <Icon style={iconStyle} className="service-icon" action="custom" name="fire-station" />
      </div>
      <Label dark={true} className="service-label" label="Fire Station" />
    </div>
  </Link>,
];

const ServicesNearby = () => {
  return (
    <Card
      className="service-nearby"
      style={{ padding: "12px 8px" }}
      textChildren={
        <div>
          <div className="servicenearby-label-cont">
            <Label label="NEAR ME" bold={true} dark={true} labelStyle={{ letterSpacing: 0.6 }} />
          </div>
          <div className="servicenearby-carousel-cont">
            <Carousel items={servicesNearby} />
          </div>
        </div>
      }
    />
  );
};

export default ServicesNearby;
