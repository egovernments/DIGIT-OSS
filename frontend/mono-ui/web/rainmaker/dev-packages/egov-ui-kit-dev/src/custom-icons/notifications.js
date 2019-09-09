import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const Notifications = (props) => {
  return (
    <SvgIcon className="custom-icon" {...props}>
      <path d="M12,22A2,2 0 0,0 14,20H10A2,2 0 0,0 12,22M18,16V11C18,7.93 16.36,5.36 13.5,4.68V4A1.5,1.5 0 0,0 12,2.5A1.5,1.5 0 0,0 10.5,4V4.68C7.63,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16Z" />
    </SvgIcon>
  );
};

export default Notifications;
