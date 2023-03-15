import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Label from "../../utils/translationNode";
import "./index.css";

const floatingLabelStyle = {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.6000000238418579)",
  fontWeight: 500,
  transform: "scale(1) translate(0px, -16px)",
  top: 30,
};

const floatingLabelBaseShrinkStyle = {
  fontSize: "12px",
  color: "rgba(0, 0, 0, 0.6000000238418579)",
  transform: "scale(1) translate(0px, -16px)",
  fontWeight: 500,
};

const hintBaseStyle = {
  fontSize: "16px",
  letterSpacing: "0.7px",
  color: "rgba(0, 0, 0, 0.3799999952316284)",
};

const requiredStyle = {
  color: "red",
};

const underlineFocusBaseStyle = {
  borderColor: "#e0e0e0",
};

const underlineDisabledStyle = {
  borderBottom: "1px solid #e0e0e0",
};

const DropDownUi = ({
  className,
  menuInnerDivStyle,
  errorText,
  localePrefix,
  errorStyle = {},
  value,
  fullWidth = false,
  labelStyle,
  required,
  dropDownData,
  children,
  selected,
  onChange,
  menuStyle,
  id,
  style = {},
  floatingLabelText,
  underlineStyle,
  hintText,
  hintStyle,
  jsonPath,
  dataFetchConfig,
  errorMessage,
  toolTip,
  iconStyle,
  autoWidth,
  toolTipMessage,
  updateDependentFields,
  beforeFieldChange,
  ...rest
}) => {
  const { moduleName, masterName } = localePrefix || "";

  const getTransformedLocale = (label) => {
    return label.toUpperCase().replace(/[.:-\s\/]/g, "_");
  };

  const getDropdownLabel = (value,label) => {
    return typeof localePrefix === "string" ? (
      <Label label={`${getTransformedLocale(localePrefix)}_${getTransformedLocale(value)}`} />
    ) : typeof localePrefix === "object" ? (
      <Label label={`${getTransformedLocale(moduleName)}_${getTransformedLocale(masterName)}_${getTransformedLocale(value)}`} />
    ) : typeof localePrefix === "boolean" ? (
       <Label label={label} />
    ) :
      value;
  };

  const renderSelectMenuItems = () => {
    return dropDownData.map((option, index) => {
      return (
        <MenuItem
          className="menu-class"
          key={index}
          value={option.value}
          primaryText={localePrefix ? getDropdownLabel(option.value,option.label) :option.label}
        />
      );
    });
  };

  return (
    <SelectField
      errorText={errorText}
      errorStyle={errorStyle}
      className={`dropdown ${className}`}
      id={id}
      style={style}
      autoWidth={autoWidth}
      underlineDisabledStyle={underlineDisabledStyle}
      menuStyle={menuStyle}
      fullWidth={fullWidth}
      dropDownMenuProps={{
        targetOrigin: { horizontal: "left", vertical: "top" },
      }}
      labelStyle={labelStyle}
      onChange={onChange}
      selected="Select"
      value={value}
      hintText={hintText}
      floatingLabelShrinkStyle={floatingLabelBaseShrinkStyle}
      floatingLabelFixed={true}
      floatingLabelText={[
        floatingLabelText,
        required ? (
          <span key={`error-${className}`} style={requiredStyle}>
            {" "}
            *
          </span>
        ) : null,
      ]}
      floatingLabelStyle={floatingLabelStyle}
      iconStyle={ iconStyle ? iconStyle : { fill: "#484848" }}
      underlineStyle={{ ...underlineFocusBaseStyle, ...underlineStyle }}
      hintStyle={{ ...hintBaseStyle, ...hintStyle }}
      {...rest}
    >
      {dropDownData && dropDownData.length > 0 &&  renderSelectMenuItems()}
    </SelectField>
  );
};

DropDownUi.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.string,
};

export default DropDownUi;
