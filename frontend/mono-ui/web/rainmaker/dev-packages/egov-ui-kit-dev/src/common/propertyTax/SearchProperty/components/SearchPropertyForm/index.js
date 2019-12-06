import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Button } from "egov-ui-kit/components";
import { Card } from "egov-ui-kit/components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const SearchPropertyForm = ({ handleFieldChange, form, formKey, onSearchClick ,
  onResetClick}) => {
  const fields = form.fields || {};

  return (
    <div className="form-without-button-cont-generic">
      <Card
        textChildren={
          <div>
            <div className="search-form-header">
              <Label
                label="PT_SEARCH_PROPERTY"
                dark={true}
                fontSize={18}
                fontWeight={1200}
                bold={true}
              />
              <Label
                label="PT_SEARCHPROPERTY_SEARCH_CONDITION"
                dark={false}
                fontSize={14}
                bold={false}
              />
            </div>
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
              <div className="col-sm-12">
                <div className="col-sm-6 reset-property-btn">
                  <Button
                    label={
                      <Label
                        label="PT_RESET_BUTTON"
                        buttonLabel={true}
                        fontSize="16px"
                        color="rgb(72, 72, 72)"
                      />
                    }
                    className=""
                    onClick={() => onResetClick()}
                    primary={false}
                    backgroundColor="white"
                    fullWidth={true}
                    style={{
                      backgroundColor: "white"
                     
                    }}
                  />
                </div>
                <div className=" col-sm-6  search-property-btn">
                  <Button
                    label={
                      <Label
                        label="PT_SEARCH_BUTTON"
                        buttonLabel={true}
                        fontSize="16px"
                      />
                    }
                    className=""
                    onClick={() => onSearchClick(form, formKey)}
                    primary={false}
                    backgroundColor="grey"
                    labelStyle={{ color: "white" }}
                    fullWidth={true}
                    style={{
                      color: "white",
                      backgroundColor: "rgb(105, 105, 105)"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>}
      />
    </div>
  );
};

export default SearchPropertyForm;
