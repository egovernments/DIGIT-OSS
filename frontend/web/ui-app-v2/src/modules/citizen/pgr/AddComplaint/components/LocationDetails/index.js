import React from "react";
import { Card, TextFieldIcon, TextField } from "components";
import { Link } from "react-router-dom";
import TrackIcon from "material-ui/svg-icons/maps/my-location";

const LocationDetails = ({ formKey, locationDetails, landmark, handleFieldChange }) => {
  return (
    <div className="location-details-main-cont">
      <Card
        className="location-details-card common-padding-for-new-complaint-card"
        textChildren={
          <div>
            <Link to={`/citizen/map?${formKey}`}>
              <TextFieldIcon id="addComplaint-location-details" {...locationDetails} iconPosition="after" Icon={TrackIcon} name="location-details" />
            </Link>
            <TextField
              id="addComplaint-landmark-details"
              {...landmark}
              onChange={(e, value) => handleFieldChange("landmark", value)}
              name="landmark-details"
            />
          </div>
        }
      />
    </div>
  );
};

export default LocationDetails;
