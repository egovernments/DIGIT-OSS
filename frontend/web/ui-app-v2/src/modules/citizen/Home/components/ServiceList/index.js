import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon } from "components";
import Label from "utils/translationNode";
import "./index.css";

const ServiceList = () => {
  return (
    <Card
      className="service-list"
      style={{ padding: "12px 8px" }}
      textChildren={
        <div>
          <div className="row upper-row">
            <Link to="/citizen/pt-payment-step-one">
              <div className="col-xs-4 service-item text-center">
                <div>
                  <Icon className="service-icon" action="custom" name="property-tax" />
                </div>
                <Label dark={true} className="service-label" label="PT_PAYMENT_STEP_HEADER" />
              </div>
            </Link>
            <Link to="/citizen/my-complaints">
              <div className="col-xs-4 service-item text-center">
                <div>
                  <Icon className="service-icon" action="custom" name="water-tap" />
                </div>
                <Label dark={true} className="service-label" label="PT_HOME_WATER_CHARGES" />
              </div>
            </Link>
            <Link to="/citizen/my-complaints">
              <div className="col-xs-4 service-item text-center">
                <div>
                  <Icon className="service-icon" action="custom" name="licenses" />
                </div>
                <Label dark={true} className="service-label" label="PT_HOME_LICENSES" />
              </div>
            </Link>
          </div>
          <div className="row lower-row">
            <Link to="/citizen/my-complaints">
              <div className="col-xs-4 service-item text-center file-complaint">
                <div>
                  <Icon className="service-icon" action="alert" name="warning" />
                </div>
                <Label dark={true} className="service-label" label="PT_HOME_COMPLAINT" />
              </div>
            </Link>
            <Link to="/citizen/my-complaints">
              <div className="col-xs-4 service-item text-center">
                <div>
                  <Icon className="service-icon" action="custom" name="birth-death" />
                </div>
                <Label dark={true} className="service-label" label="PT_HOME_BIRTH_DEATH" />
              </div>
            </Link>
            <Link to="/citizen/my-complaints">
              <div className="col-xs-4 service-item text-center">
                <div>
                  <Icon className="service-icon" action="custom" name="fire" />
                </div>
                <Label dark={true} className="service-label" label="PT_HOME_FIRE_NOC" />
              </div>
            </Link>
          </div>
        </div>
      }
    />
  );
};

export default ServiceList;
