import { AutoSuggestDropdown, DropDown, Label, MobileNumberField, SingleCheckbox, TextField, TextFieldIcon } from "components";
import { AutosuggestContainer } from "egov-ui-framework/ui-containers";
import React from "react";
import { RadioButton } from "../components";


const styles = {
  radioButtonStyle: {
    display: 'flex',
    position: 'inherit',
    top: '-5px'
  },
  labelStyle: {
    font: "12px",
    letterSpacing: 0.6,
    marginBottom: 5,
    marginTop: 14,
  },

  radioButtonItemStyle: {
    marginBottom: "18px",
    paddingLeft: "2px",
    height: "16px",
  },
  selectedLabelStyle: {
    color: 'rgba(0, 0, 0, 0.44)',
  },
  radioButtonLabelStyle: {
    // lineHeight: 1,
    // marginBottom: 8,
  },
  iconStyle: {
    width: 16,
    height: 27,
  },
};


const Field = ({ fieldKey, handleFieldChange, field = {}, disabled, onTextFieldIconClick, ...rest }) => {
  const renderField = () => {
    const { type, tooltip, label, hideField, Icon, iconRedirectionURL, visible, ...fieldProps } = field;
    if (fieldProps.dropDownData && fieldProps.dropDownData.length > 0) {
      fieldProps.dropDownData.map((data, key) => {
        fieldProps.dropDownData[key].code = data.value;
        fieldProps.dropDownData[key].name = data.label;
      });
    }
    if (hideField) return null;
    switch (type) {
      case "textfield":
      case "textarea":
        return <TextField {...rest} {...fieldProps} onChange={(e, value) => handleFieldChange(fieldKey, value)} multiLine={type === "textarea"} disabled={disabled || fieldProps.disabled} />;
      case "mobilenumber":
        return <MobileNumberField {...rest} {...fieldProps} onChange={(e, value) => handleFieldChange(fieldKey, value)} disabled={disabled || fieldProps.disabled} />;
      case "number":
      case "password":
        return <TextField {...rest} {...fieldProps} type={type} onChange={(e, value) => handleFieldChange(fieldKey, value)} disabled={disabled || fieldProps.disabled} />;
      case "checkbox":
        return (
          <SingleCheckbox {...rest} {...fieldProps} style={{ marginTop: "27px" }} onCheck={(e) => handleFieldChange(fieldKey, e.target.checked)} disabled={disabled || fieldProps.disabled} />
        );
      case "label":
        return <Label {...rest} {...fieldProps} />;
      case "singleValueList":
        return (
          <DropDown
            {...rest}
            {...fieldProps}
            dropDownData={fieldProps.dropDownData || []}
            onChange={(e, value, selectedValue) => handleFieldChange(fieldKey, selectedValue)}
          />
        );
      case "textFieldIcon":
        return (
          <TextFieldIcon
            iconPosition="right"
            Icon={Icon}
            {...fieldProps}
            {...rest}
            onIconClick={
              iconRedirectionURL
                ? () => {
                  window.open(iconRedirectionURL);
                }
                : () => onTextFieldIconClick()
            }
            onChange={(e, value) => handleFieldChange(fieldKey, value)}
          />
        );
      case "autoSuggestDropdown":
        return (
          <AutoSuggestDropdown
            {...rest}
            {...fieldProps}
            dataSource={fieldProps && fieldProps.dropDownData || []}
            onChange={(chosenRequest, index) => {
              handleFieldChange(fieldKey, chosenRequest.value);
            }}
          />
        );
      case "radioButton":
        return (
          <div>
            {visible !== false ? <RadioButton
            {...rest}
            {...fieldProps}
            style={styles.radioButtonStyle}
            options={fieldProps && fieldProps.options || []}
            radioButtonItemStyle={styles.radioButtonItemStyle}
            radioButtonLabelStyle={styles.radioButtonLabelStyle}
            selectedLabelStyle={styles.selectedLabelStyle}
            className={`radio-button-${fieldProps.id}`}
            iconStyle={styles.iconStyle}
            labelStyle={styles.radioButtonLabelStyle}
            valueSelected={fieldProps.value}
            handleChange={(e, value) => {
              handleFieldChange(fieldKey, value);
            }}
          ></RadioButton> : ""}
          </div>
          
        );

      case "AutocompleteDropdown":
        return (
          <AutosuggestContainer
            id={fieldProps.id}
            type={fieldProps.type}
            required={fieldProps.required}
            jsonPath={fieldProps.jsonPath}
            localePrefix={fieldProps.localePrefix}
            data={fieldProps && fieldProps.dropDownData}
            className="autocomplete-dropdown"
            label={{ labelKey: fieldProps.floatingLabelText }}
            placeholder={{ labelKey: fieldProps.hintText }}
            labelsFromLocalisation={fieldProps.labelsFromLocalisation}
            gridDefination={fieldProps.gridDefination}
            toolTip={fieldProps.toolTip}
            toolTipMessage={fieldProps.toolTipMessage}
            boundary={fieldProps.boundary}
            errorMessage={fieldProps.errorMessage}
            errorStyle={fieldProps.errorStyle}
            pattern={fieldProps.pattern}
            value={fieldProps.value}
            defaultSort={fieldProps.defaultSort}
            canFetchValueFromJsonpath={false}
            formName={fieldProps.formName}
            isClearable={true}
            disabled={disabled || fieldProps.disabled}
            onChange={(chosenRequest, index) => {
              handleFieldChange(fieldKey, chosenRequest.target.value, fieldProps.jsonPath);
            }}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default Field;
