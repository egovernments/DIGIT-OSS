import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import "./index.css";

const ButtonUi = ({
  label,
  icon = {},
  onClick,
  primary = false,
  className,
  style = {}
}) => {
  return (
    <RaisedButton
      style={style}
      className={`uploader-button ${className}`}
      primary={primary}
      type="button"
      label={label}
      onClick={onClick}
      icon={
        <i style={icon.style} className="material-icons">
          {icon.name}
        </i>
      }
    />
  );
};

export default ButtonUi;
