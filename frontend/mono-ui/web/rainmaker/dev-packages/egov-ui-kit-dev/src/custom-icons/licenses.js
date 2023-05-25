import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const LicenceIcon = (props) => {
  return (
    <SvgIcon className="custom-icon" viewBox="0 0 24 24" {...props}>
      <path
        d="M8,13 L8,12 L1.01,12 L1,16 C1,17.11 1.89,18 3,18 L17,18 C18.11,18 19,17.11 19,16 L19,12 L12,12 L12,13 L8,13 Z M18,4 L13.99,4 L13.99,2 L11.99,0 L7.99,0 L5.99,2 L5.99,4 L2,4 C0.9,4 0,4.9 0,6 L0,9 C0,10.11 0.89,11 2,11 L8,11 L8,9 L12,9 L12,11 L18,11 C19.1,11 20,10.1 20,9 L20,6 C20,4.9 19.1,4 18,4 Z M12,4 L8,4 L8,2 L12,2 L12,4 Z"
        id="path-1"
      />
    </SvgIcon>
  );
};

export default LicenceIcon;
