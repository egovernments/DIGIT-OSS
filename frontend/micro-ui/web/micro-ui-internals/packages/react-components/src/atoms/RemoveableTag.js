import React from "react";
import { Close } from "./svgindex";

const RemoveableTag = ({ text, onClick }) => (
  <div className="tag">
    <span className="text">{text}</span>
    <span onClick={onClick}>
      <Close className="close" />
    </span>
  </div>
);

export default RemoveableTag;
