import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const CityOutline = (props) => {
  return (
    <SvgIcon className="custom-icon" viewBox="0 -8 35 42" {...props}>
      {/* <path d="M0,21V10L7.5,5L15,10V21H10V14H5V21H0M24,2V21H17V8.93L16,8.27V6H14V6.93L10,4.27V2H24M21,14H19V16H21V14M21,10H19V12H21V10M21,6H19V8H21V6Z" /> */}
      <path
        d="M12,0 L18,0 C19.6568542,0 21,1.34314575 21,3 L21,6 L27,6 C28.6568542,6 30,7.34314575 30,9 L30,25.5 C30,27.1568542 28.6568542,28.5 27,28.5 L3,28.5 C1.335,28.5 0,27.15 0,25.5 L0,9 C0,7.335 1.335,6 3,6 L9,6 L9,3 C9,1.335 10.335,0 12,0 L12,0 Z M18,6 L18,3 L12,3 L12,6 L18,6 Z"
        id="Shape"
      />
    </SvgIcon>
  );
};

export default CityOutline;
