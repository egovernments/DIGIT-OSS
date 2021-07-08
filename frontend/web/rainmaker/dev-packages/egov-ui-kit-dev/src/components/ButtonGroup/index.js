import React from "react";
import PropTypes from "prop-types";
import FlatButton from "material-ui/FlatButton";
import "./index.css";

const ButtonGroup = ({
  items,
  onClick,
  selected,
  multiple,
  defaultStyle = {},
  selectedStyle = {},
  selectedLabelStyle = {},
  defaultLabelStyle = {},
  id,
}) => {
  return items.map((item, index) => {
    return (
      <FlatButton
        id={"button-item-" + index}
        className="button-item"
        multiple={multiple}
        key={index}
        label={item.label}
        style={
          !multiple
            ? item.value === selected ? { ...defaultStyle, ...selectedStyle } : defaultStyle
            : selected.indexOf(item.value) > -1 ? { ...defaultStyle, ...selectedStyle } : defaultStyle
        }
        hoverColor='#4848481a'
        onClick={() => {
          onClick(item.value, multiple);
        }}
        labelStyle={
          !multiple
            ? item.value === selected ? { ...defaultLabelStyle, ...selectedLabelStyle } : defaultLabelStyle
            : selected.indexOf(item.value) > -1 ? { ...defaultLabelStyle, ...selectedLabelStyle } : defaultLabelStyle
        }
      />
    );
  });
};

ButtonGroup.prototype = {
  onClick: PropTypes.func,
  multiple: PropTypes.bool,
  defaultStyle: PropTypes.object,
  selectedStyle: PropTypes.object,
  selectedLabelStyle: PropTypes.object,
  defaultLabelStyle: PropTypes.object,
};

export default ButtonGroup;
