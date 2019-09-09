import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import "./style.css";

const DropDownUi = ({
  label,
  options = [],
  name,
  selected,
  handleChange,
  style
}) => {
  const labelProperty = {
    floatingLabelFixed: true,
    floatingLabelText: <span>{label}</span>,
    hintText: "-- Please Select --"
  };

  const renderSelectMenuItems = () => {
    return options.map((value, index) => {
      return <MenuItem key={index} value={value} primaryText={value} />;
    });
  };

  return (
    <SelectField
      className="custom-form-control-for-select"
      style={style}
      floatingLabelStyle={{
        color: "#696969",
        fontSize: "20px",
        whiteSpace: "nowrap"
      }}
      dropDownMenuProps={{
        animated: false,
        targetOrigin: { horizontal: "left", vertical: "bottom" }
      }}
      labelStyle={{ color: "#5F5C57" }}
      value={selected}
      onChange={handleChange}
      {...labelProperty}
    >
      {renderSelectMenuItems()}
    </SelectField>
  );
};

DropDownUi.propTypes = {
  label: PropTypes.string,
  handleChange: PropTypes.func,
  selected: PropTypes.string,
  options: PropTypes.array.isRequired
};

export default DropDownUi;
