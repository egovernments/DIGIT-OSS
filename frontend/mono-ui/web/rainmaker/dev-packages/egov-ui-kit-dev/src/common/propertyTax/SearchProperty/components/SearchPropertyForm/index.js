import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Button } from "egov-ui-kit/components";
import { Card } from "egov-ui-kit/components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const SearchPropertyForm = ({ handleFieldChange, form, formKey, onSearchClick }) => {
  const fields = form.fields || {};

  return (
    <div className="form-without-button-cont-generic">
      <Card
        textChildren={
          <div className={`${formKey} col-sm-12`}>
            {Object.keys(fields).map((fieldKey, index) => {
              return (
                <div
                  style={fields[fieldKey].toolTip ? { display: "flex", alignItems: "center" } : {}}
                  key={index}
                  className={fields[fieldKey].numcols ? `col-sm-${fields[fieldKey].numcols}` : `col-sm-6`}
                >
                  <Field fieldKey={fieldKey} field={fields[fieldKey]} handleFieldChange={handleFieldChange} />
                </div>
              );
            })}
            <div className="text-center">
              <Button
                label={<Label label="PT_SEARCH_BUTTON" buttonLabel={true} fontSize="16px" />}
                className="search-property-btn"
                onClick={() => onSearchClick(form, formKey)}
                primary={true}
                fullWidth={true}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SearchPropertyForm;
