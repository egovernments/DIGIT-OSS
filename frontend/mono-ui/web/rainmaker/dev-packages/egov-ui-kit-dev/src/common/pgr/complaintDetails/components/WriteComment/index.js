import React from "react";
import { Icon, TextArea, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import emptyFace from "egov-ui-kit/assets/images/download.png";
import "./index.css";

const iconStyle = {
  marginLeft: "20px",
  height: "20px",
  width: "20px",
  transform: "rotate(-15deg)",
  marginBottom: "5px",
  position: "absolute",
  right: 16,
  top: 12,
};

const textFieldStyle = {
  backgroundColor: "#f2f2f2",
  display: "flex",
  alignItems: "center",
  border: "solid 1px #e6e6e6",
  fontSize: "14px",
};

const imageStyles = {
  width: "33px",
  height: "33px",
  marginRight: "8px",
};

const WriteComment = ({ form, handleFieldChange, submitForm, userImage, currentstatus }) => {
  const fields = form.fields || {};
  return (
    <div disabled={true} style={{ display: "flex", justifyContent: "center", paddingBottom: 16, position: "relative", alignItems: "center" }}>
      <Image style={imageStyles} className="img-circle" size="medium" source={userImage ? userImage : emptyFace} />

      <TextArea
        {...fields.comment}
        hintText={<Label label="CS_COMMON_COMMENTS_PLACEHOLDER2" />}
        style={textFieldStyle}
        onChange={(e, value) => handleFieldChange("comment", value)}
        className="write-complaint-chat-field"
        fullWidth={true}
        multiLine={true}
        underlineShow={false}
        hintStyle={{ left: 5, bottom: "initial", fontSize: 14, top: 12 }}
        inputStyle={{ fontSize: 14, paddingLeft: 5, paddingRight: 40 }}
        rowsMax={3}
      />
      <Icon className="comment-send" action="content" name="send" style={iconStyle} color={"#fe7a51"} onClick={submitForm} />
    </div>
  );
};

export default WriteComment;
