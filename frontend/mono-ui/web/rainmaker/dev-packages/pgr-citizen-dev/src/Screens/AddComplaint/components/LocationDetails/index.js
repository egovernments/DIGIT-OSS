import React from "react";
import { Card, TextFieldIcon, TextField, AutoSuggestDropdown } from "components";
import { Link } from "react-router-dom";
import TrackIcon from "material-ui/svg-icons/maps/my-location";

const LocationDetails = ({ formKey, locationDetails, landmark, city, mohalla, houseNo, handleFieldChange }) => {
  return (
    <div className="location-details-main-cont">
      <Card
        className="location-details-card common-padding-for-new-complaint-card"
        textChildren={
          <div>
            <Link to={`/map?${formKey}`}>
              <TextFieldIcon
                id="addComplaint-location-details"
                iconStyle={{ marginTop: "9px" }}
                {...locationDetails}
                iconPosition="after"
                Icon={TrackIcon}
                name="location-details"
              />
            </Link>
            {/* <DropDown
              className="fix-for-layout-break"
              fullWidth={true}
              onChange={(e, value, selectedValue) => handleFieldChange("city", selectedValue)}
              {...city}
            /> */}
            <AutoSuggestDropdown
              className="fix-for-layout-break"
              fullWidth={true}
              dataSource={city && city.dropDownData}
              onChange={(chosenCity, index) => {
                handleFieldChange("city", chosenCity.value);
              }}
              //onChange={(e, value, selectedValue) => handleFieldChange("city", selectedValue)}
              {...city}
            />
            <AutoSuggestDropdown
              className="fix-for-layout-break"
              fullWidth={true}
              dataSource={mohalla && mohalla.dropDownData}
              onChange={(chosenRequest, index) => {
                handleFieldChange("mohalla", chosenRequest.value);
              }}
              floatingLabelText={mohalla && mohalla.floatingLabelText}
              {...mohalla}
            />
            <TextField id="addComplaint-house-no" {...houseNo} onChange={(e, value) => handleFieldChange("houseNo", value)} name="house-no" />
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
