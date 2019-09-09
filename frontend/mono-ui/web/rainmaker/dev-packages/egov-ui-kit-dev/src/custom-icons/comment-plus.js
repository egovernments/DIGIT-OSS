import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const CommentPlus = (props) => {
  return (
    <SvgIcon className="custom-icon" viewBox="0 -8 35 42" {...props}>
      {/* <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9M11,6V9H8V11H11V14H13V11H16V9H13V6H11Z" /> */}
      <path
        d="M10.5,30 C9.67157288,30 9,29.3284271 9,28.5 L9,24 L3,24 C1.34314575,24 0,22.6568542 0,21 L0,3 C0,1.335 1.35,0 3,0 L27,0 C28.6568542,0 30,1.34314575 30,3 L30,21 C30,22.6568542 28.6568542,24 27,24 L17.85,24 L12.3,29.565 C12,29.85 11.625,30 11.25,30 L10.5,30 L10.5,30 Z M13.5,6 L13.5,10.5 L9,10.5 L9,13.5 L13.5,13.5 L13.5,18 L16.5,18 L16.5,13.5 L21,13.5 L21,10.5 L16.5,10.5 L16.5,6 L13.5,6 Z"
        id="Shape"
      />
    </SvgIcon>
  );
};

export default CommentPlus;
