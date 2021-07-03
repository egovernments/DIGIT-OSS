import React from "react";
import { Card, ToolTipUi, Icon } from "components";
import Field from "egov-ui-kit/utils/field";
import "./index.css";

const GenericForm = ({ form, handleFieldChange, cardTitle, formKey, containerStyle, handleRemoveItem, disabled, className, formName }) => {
  const fields = form.fields || {};
  return (
    <Card
      style={containerStyle}
      textChildren={
        <div className={`${formKey} col-sm-12`}>
          {handleRemoveItem && (
            <div className="remove-unit-assessment" style={{ cursor: "pointer" }} onClick={handleRemoveItem}>
              <Icon action="navigation" name="close" />
            </div>
          )}
          {cardTitle && cardTitle}
          {formName && <div className="text-left">{formName}</div>}
          {Object.keys(fields).map((fieldKey, index) => {
            return (
              // <div key={index}>
              fieldKey === "dummy" ? (
                <div className="col-xs-6 dummy-field" style={{ height: 72, marginTop: 14 }} />
              ) : (
                <div
                  style={
                    fields[fieldKey].hideField
                      ? {}
                      : fields[fieldKey].toolTip
                      ? { display: "flex", alignItems: "center", height: 80 }
                      : { height: 80 }
                  }
                  className={
                    fields[fieldKey].numcols ? (fields[fieldKey].hideField ? "hidden-field" : `col-sm-${fields[fieldKey].numcols} ${fields[fieldKey].id}`) : `col-sm-6 ${fields[fieldKey].id}`
                  }
                >
                  <Field
                    fieldKey={fieldKey}
                    field={fields[fieldKey]}
                    handleFieldChange={handleFieldChange}
                    disabled={disabled}
                    className={className}
                  />
                  {fields[fieldKey].toolTip && !fields[fieldKey].hideField && (
                    <ToolTipUi id={"form-wizard-tooltip"} title={fields[fieldKey].toolTipMessage} />
                  )}
                </div>
              )
              // </div>
            );
          })}
        </div>
      }
      className={className}
    />
  );
};
export default GenericForm;
