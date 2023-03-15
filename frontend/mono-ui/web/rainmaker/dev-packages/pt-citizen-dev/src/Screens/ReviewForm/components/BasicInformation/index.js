import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Card } from "components";

import "./index.css";

const BasicInformation = ({ form, icon, editIcon }) => {
  const fields = form.fields || {};
  return (
    <Card
      textChildren={
        <div>
          <div className="pt-rf-title">
            <span className="pt-rf-icon">{icon}</span>
            <span className="pt-rf-title-text">Basic Information</span>
            <span className="pt-rf-edit-icon">{editIcon}</span>
          </div>
          <div className="pt-review-form col-xs-12">
            {Object.keys(fields).map((fieldKey, index) => {
              const field = { ...fields[fieldKey] };
              field.disabled = true;
              return (
                <div key={index} className="col-xs-6">
                  <div className="pt-review-form-field">
                    <Field fieldKey={fieldKey} field={field} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
};

export default BasicInformation;
