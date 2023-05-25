import React from "react";
import { Card, TextFieldIcon, TextField, AutoSuggestDropdown } from "components";
import { Link } from "react-router-dom";
import TrackIcon from "material-ui/svg-icons/maps/my-location";
import { AutosuggestContainer } from "egov-ui-framework/ui-containers";

const LocationDetails = ({ formKey, locationDetails, landmark, city, mohalla, houseNo, handleFieldChange }) => {
  if(city && city.dropDownData && city.dropDownData.length > 0) {
    city.dropDownData.map((item, key)=>{
      city.dropDownData[key].code = item.value;
      city.dropDownData[key].name = item.label;
    })
  }
  if(mohalla && mohalla.dropDownData && mohalla.dropDownData.length > 0) {
    mohalla.dropDownData.map((item, key)=>{
      mohalla.dropDownData[key].code = item.value;
      mohalla.dropDownData[key].name = item.label;
    })
  }
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
            {city && <AutosuggestContainer
              className="fix-for-layout-break autocomplete-dropdown"
              fullWidth={true}
              data={city && city.dropDownData}
              onChange={(chosenCity, index) => {
                handleFieldChange("city", chosenCity.target.value, city.jsonPath);
              }}
              label={{labelKey: city.floatingLabelText }}
              placeholder={{labelKey: city.hintText}}
              id={city.id}
              type={city.type}
              required={city.required}
              jsonPath={city.jsonPath}
              localePrefix={city.localePrefix}
              labelsFromLocalisation={city.labelsFromLocalisation}
              gridDefination={{
                xs: 12,
                sm: 12
              }}
              toolTip={city.toolTip}
              toolTipMessage={city.toolTipMessage}
              boundary={city.boundary}
              errorMessage={city.errorMessage}
              errorStyle={city.errorStyle}
              pattern={city.pattern}
              isClearable={true}
            />}
            {mohalla && <AutosuggestContainer
              className="fix-for-layout-break autocomplete-dropdown"
              fullWidth={true}
              data={mohalla && mohalla.dropDownData}
              onChange={(chosenCity, index) => {
                handleFieldChange("mohalla", chosenCity.target.value, mohalla.jsonPath);
              }}
              label={{labelKey: mohalla.floatingLabelText }}
              placeholder={{labelKey: mohalla.hintText}}
              id={mohalla.id}
              type={mohalla.type}
              required={mohalla.required}
              jsonPath={mohalla.jsonPath}
              localePrefix={mohalla.localePrefix}
              labelsFromLocalisation={mohalla.labelsFromLocalisation}
              gridDefination={{
                xs: 12,
                sm: 12
              }}
              toolTip={mohalla.toolTip}
              toolTipMessage={mohalla.toolTipMessage}
              boundary={mohalla.boundary}
              errorMessage={mohalla.errorMessage}
              errorStyle={mohalla.errorStyle}
              pattern={mohalla.pattern}
              isClearable={true}
            />}
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
