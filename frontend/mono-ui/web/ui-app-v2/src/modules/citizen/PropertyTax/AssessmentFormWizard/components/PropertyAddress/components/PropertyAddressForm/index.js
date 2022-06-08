import React from "react";
import { LabelTextFieldIcon, TextFieldIcon, Icon, Card } from "components";
import Field from "utils/field";
import { Link } from "react-router-dom";
import TrackIcon from "material-ui/svg-icons/maps/my-location";

const PropertyAddressForm = ({ form, handleFieldChange }) => {
  const fields = form.fields || {};
  console.log(form);
  return (
    <Card
      textChildren={
        <div className="pt-property-address col-xs-12">
          {Object.keys(fields).map((fieldKey, index) => {
            return (
              <div className="col-xs-6">
                <Field fieldKey={fieldKey} field={fields[fieldKey]} handleFieldChange={handleFieldChange} />
              </div>
            );
          })}

          {/* <Link to="/citizen/map?propertyTax">
        <TextFieldIcon id="pt-location" {...fields.location} iconPosition="after" Icon={TrackIcon} />
      </Link> */}
        </div>
      }
    />
  );
};
export default PropertyAddressForm;
