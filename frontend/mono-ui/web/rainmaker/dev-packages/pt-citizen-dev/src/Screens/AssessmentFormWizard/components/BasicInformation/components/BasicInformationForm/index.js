import React from "react";
import { Card } from "components";
import Field from "egov-ui-kit/utils/field";

const BasicInformationForm = ({ form, handleFieldChange }) => {
  const fields = form.fields || {};
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
        </div>
      }
    />
  );
};
export default BasicInformationForm;
