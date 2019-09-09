import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Button, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const SearchPropertyForm = ({ handleFieldChange, form, formKey, onSearchClick }) => {
  const fields = form.fields || {};

  return (
    <div className="form-without-button-cont-generic">
      <Card
        textChildren={
          <div className={`${formKey} col-xs-12`}>
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
            <div className="search-property-btn col-sm-12">
              <Button
                label={<Label label="PT_SEARCH_BUTTON" buttonLabel={true} fontSize="16px" />}
                className=""
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
