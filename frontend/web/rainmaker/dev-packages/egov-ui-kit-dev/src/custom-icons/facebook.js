import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const Facebook = (props) => {
  return (
    <SvgIcon className="custom-icon" {...props}>
      <path d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />;
    </SvgIcon>
  );
};

export default Facebook;
