import React from "react";
import { Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const cardStyle = {
  padding: "32px 16px",
};

const iconStyle = {
  padding: "12px",
  width: "48px",
  height: "48px",
  color: "#fff",
  borderRadius: "50%",
};

const NewAndOldComplaints = ({ history }) => {
  return (
    <Card
      id="home-complaint-card"
      style={cardStyle}
      textChildren={
        <div className="row newAndOldComplaints-content-section">
          <div
            id="home-new-complaint"
            className="col-xs-6"
            onClick={(e) => {
              history.push("/add-complaint");
            }}
          >
            <Icon style={{ ...iconStyle, background: "#fe7a51" }} action="content" name="add" />
            <Label containerStyle={{ marginTop: "10px" }} color="#484848" bold={true} fontSize={16} label="CS_HOME_FILE_COMPLAINT" />
          </div>
          <div
            id="home-old-complaint"
            className="col-xs-6"
            onClick={(e) => {
              history.push("/my-complaints");
            }}
          >
            <Icon style={{ height: "48px", color: "#fff", width: "48px" }} action="custom" name="my-complaint" />

            <Label containerStyle={{ marginTop: "10px" }} color="#484848" bold={true} fontSize={16} label="CS_HOME_MY_COMPLAINTS" />
          </div>
        </div>
      }
    />
  );
};

export default NewAndOldComplaints;
