import React from "react";
import {
  Card,
  TextField,
  DropDown,
  AutoSuggestDropdown,
  Button
} from "components";
import { AutosuggestContainer } from "egov-ui-framework/ui-containers";
import AdditionalDetailsCard from "../AdditionalDetails";
import ComplaintTypeCard from "../ComplaintType";
import MohallaDropdown from "../MohallaDropdown";

const AddComplaintForm = ({
  formKey,
  localizationLabels,
  handleFieldChange,
  form,
  categories,
  history
}) => {
  const fields = form.fields || {};
  const { name, phone, mohalla, city, address, landmark, houseNo } = fields;
  const submit = form.submit;
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
    <div className="create-complaint-main-cont">
      {/* <Label label="Complaint Submission" fontSize={20} dark={true} bold={true} containerStyle={{ padding: "24px 0 8px 17px" }} /> */}
      <div className="create-comp-csr-form-cont form-without-button-cont-generic">
        <Card
          id="create-complaint-card"
          className="create-complaint-main-card"
          textChildren={
            <div className="col-xs-12" style={{ padding: 0 }}>
              <div className="col-sm-6 col-xs-12">
                <TextField
                  className="fix-for-layout-break"
                  {...name}
                  name="create-complaint"
                  onChange={(e, value) => handleFieldChange("name", value)}
                />
              </div>
              <div className="col-sm-6 col-xs-12">
                <TextField
                  className="fix-for-layout-break"
                  {...phone}
                  name="complainant-mobile-no"
                  onChange={(e, value) => handleFieldChange("phone", value)}
                />
              </div>
              <div className="col-sm-6 col-xs-12">
                <ComplaintTypeCard
                  className="fix-for-layout-break"
                  localizationLabels={localizationLabels}
                  categories={categories}
                  complaintType={fields.complaintType}
                />
              </div>
              <div className="col-sm-6 col-xs-12">
                <AdditionalDetailsCard
                  className="fix-for-layout-break"
                  handleFieldChange={handleFieldChange}
                  additionalDetails={fields.additionalDetails}
                />
              </div>
              <div className="col-sm-6 col-xs-12">
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
                  toolTip={city.toolTip}
                  toolTipMessage={city.toolTipMessage}
                  boundary={city.boundary}
                  errorMessage={city.errorMessage}
                  errorStyle={city.errorStyle}
                  pattern={city.pattern}
                  isClearable={true}
                />}
              </div>
              <div className="col-sm-6 col-xs-12">
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
                  toolTip={mohalla.toolTip}
                  toolTipMessage={mohalla.toolTipMessage}
                  boundary={mohalla.boundary}
                  errorMessage={mohalla.errorMessage}
                  errorStyle={mohalla.errorStyle}
                  pattern={mohalla.pattern}
                  isClearable={true}
                />}
              </div>
              <div className="col-sm-6 col-xs-12">
                <TextField
                  className="fix-for-layout-break"
                  {...houseNo}
                  onChange={(e, value) => handleFieldChange("houseNo", value)}
                  name="house-no"
                />
              </div>
              <div className="col-sm-6 col-xs-12">
                <TextField
                  className="fix-for-layout-break"
                  {...landmark}
                  onChange={(e, value) => handleFieldChange("landmark", value)}
                  name="landmark-details"
                />
              </div>
            </div>
          }
        />
      </div>
      <div className="responsive-action-button-cont">
        <Button
          primary={true}
          fullWidth={true}
          style={{
            width: 230,
            boxShadow:
              "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)"
          }}
          {...submit}
          className="responsive-action-button"
        />
      </div>
    </div>
  );
};

export default AddComplaintForm;
