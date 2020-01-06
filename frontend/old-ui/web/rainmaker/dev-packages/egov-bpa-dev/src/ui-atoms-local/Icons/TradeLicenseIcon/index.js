import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import "../index.css";
class TradeLicenseIcon extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <SvgIcon
        viewBox="0 -8 35 42"
        color="primary"
        className="module-page-icon"
      >
        <path
          d="M22.5,18 L25.5,18 L25.5,22.5 L30,22.5 L30,25.5 L25.5,25.5 L25.5,30 L22.5,30 L22.5,25.5 L18,25.5 L18,22.5 L22.5,22.5 L22.5,18 L22.5,18 Z M12,0 L18,0 C19.6568542,0 21,1.34314575 21,3 L21,6 L27,6 C28.6568542,6 30,7.34314575 30,9 L30,17.295 C28.41,15.87 26.31,15 24,15 C19.0294373,15 15,19.0294373 15,24 C15,25.635 15.435,27.18 16.2,28.5 L3,28.5 C1.335,28.5 0,27.15 0,25.5 L0,9 C0,7.335 1.335,6 3,6 L9,6 L9,3 C9,1.335 10.335,0 12,0 L12,0 Z M18,6 L18,3 L12,3 L12,6 L18,6 Z"
          id="Shape"
        />
      </SvgIcon>
    );
  }
}

export default TradeLicenseIcon;
