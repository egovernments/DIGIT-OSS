import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import "./index.css";

const floatingLabelStyle = {
  fontSize: "12px",
  color: "#00bcd1",
  fontWeight: 500,
  transform: "scale(1) translate(0px, -16px)",
  top: 30,
};

const hintBaseStyle = {
  fontSize: "16px",
  letterSpacing: "0.7px",
  color: "#b3b3b3",
  opacity: 1,
};

const requiredStyle = {
  color: "red",
};

const underlineFocusBaseStyle = {
  borderColor: "#e0e0e0",
};

const DropDownUi = ({
  className,
  value,
  fullWidth = false,
  labelStyle,
  required,
  dropDownData,
  children,
  selected,
  onChange,
  id,
  style = {},
  floatingLabelText,
  underlineStyle,
  hintText,
  hintStyle,
}) => {
  const renderSelectMenuItems = () => {
    return dropDownData.map((option, index) => {
      return <MenuItem key={index} value={option.value} primaryText={option.label} />;
    });
  };

  return (
    <SelectField
      className={`dropdown ${className}`}
      id={id}
      style={style}
      fullWidth={fullWidth}
      dropDownMenuProps={{
        targetOrigin: { horizontal: "left", vertical: "top" },
      }}
      labelStyle={labelStyle}
      onChange={onChange}
      selected="Select"
      value={value}
      hintText={hintText}
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
      iconStyle={{ fill: "#484848" }}
      underlineStyle={{ ...underlineFocusBaseStyle, ...underlineStyle }}
      hintStyle={{ ...hintBaseStyle, ...hintStyle }}
    >
      {renderSelectMenuItems()}
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
