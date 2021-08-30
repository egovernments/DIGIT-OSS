import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const BirthDeath = (props) => {
  return (
    <SvgIcon className="custom-icon" viewBox="0 -8 24 24" {...props}>
      <path
        d="M20,4 L20,6 L7,6 L7,0 L16,0 C18.21,0 20,1.79 20,4 Z M0,7 L0,9 L6,9 L6,11 L14,11 L14,9 L20,9 L20,7 L0,7 Z M5.14,5.1 C6.3,3.91 6.28,2.02 5.1,0.86 C3.91,-0.3 2.02,-0.28 0.86,0.9 C-0.3,2.09 -0.28,3.98 0.9,5.14 C2.09,6.3 3.98,6.28 5.14,5.1 Z"
        id="path-1"
      />
    </SvgIcon>
  );
};

export default BirthDeath;
