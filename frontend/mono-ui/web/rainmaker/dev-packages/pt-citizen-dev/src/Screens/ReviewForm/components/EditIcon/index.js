import React from "react";
import { Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const defaultIconStyle = {
  width: 19,
  height: 20,
  marginRight: 8,
  fill: "rgb(44,51,125)",
};

const EditIcon = ({ onIconClick }) => {
  return (
    <div className="rainmaker-displayInline" onClick={onIconClick} style={{ cursor: "pointer", marginRight: 5 }}>
      <Icon style={defaultIconStyle} action="image" name="edit" />
      <Label label="PT_EDIT_TEXT" color="rgb(44,51,125)" fontSize="16px" />
    </div>
  );
};

export default EditIcon;
