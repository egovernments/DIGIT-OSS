import React from "react";
import PropTypes from "prop-types";
import InputAdornment from "../../ui-atoms/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import TextField from "../../ui-atoms/TextFields/Text";
import Icon from "../../ui-atoms/Icon";
import isEmpty from "lodash/isEmpty";

function InputWithIcon(props) {
  const { label, iconObj, ...rest } = props;
  const extraProps =
    !isEmpty(iconObj) &&
    (iconObj.position === "end"
      ? {
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              {iconObj.onClick ? (
                <IconButton>
                  <span
                    onClick={() => {
                      iconObj.onClick();
                    }}
                    style={{
                      color: iconObj.color
                        ? iconObj.color
                        : "rgba(0, 0, 0, 0.60"
                    }}
                  >
                    {iconObj.iconName && <Icon iconName={iconObj.iconName} />}
                    <span
                      style={
                        iconObj.iconName
                          ? { position: "relative", top: "-7px" }
                          : {}
                      }
                    >
                      {iconObj.label && iconObj.label}
                    </span>
                  </span>
                </IconButton>
              ) : (
                  <span
                    style={{
                      color: iconObj.color
                        ? iconObj.color
                        : "rgba(0, 0, 0, 0.60"
                    }}
                  >
                    {iconObj.iconName && <Icon iconName={iconObj.iconName} />}
                    <span
                      style={
                        iconObj.iconName
                          ? { position: "relative", top: "-7px" }
                          : {}
                      }
                    >
                      {iconObj.label && iconObj.label}
                    </span>
                  </span>
                )}
            </InputAdornment>
          )
        }
      }
      : {
        InputProps: {
          startAdornment: (
            <InputAdornment position="start" style={{ position: "relative", top: "2px", flex: "none" }}>
              {
                iconObj.onClick ?
                  <IconButton onClick={() => {
                    iconObj.onClick()
                  }}>
                    <span
                      style={{
                        color: iconObj.color ? iconObj.color : "rgba(0, 0, 0, 0.60"
                      }}
                    >
                      {iconObj.iconName && <Icon iconName={iconObj.iconName} />}
                      <span
                        style={
                          iconObj.iconName
                            ? { position: "relative", top: "-7px" }
                            : {}
                        }
                      >
                        {iconObj.label && iconObj.label}
                      </span>
                    </span>
                  </IconButton> :
                  <span
                    style={{
                      color: iconObj.color ? iconObj.color : "rgba(0, 0, 0, 0.60"
                    }}
                  >
                    {iconObj.iconName && <Icon iconName={iconObj.iconName} />}
                    <span
                      style={
                        iconObj.iconName
                          ? { position: "relative", top: "-7px" }
                          : {}
                      }
                    >
                      {iconObj.label && iconObj.label}
                    </span>
                  </span>
              }
            </InputAdornment>
          )
        }
      });

  return <TextField label={label} {...extraProps} {...rest} />;
}

InputWithIcon.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default InputWithIcon;
