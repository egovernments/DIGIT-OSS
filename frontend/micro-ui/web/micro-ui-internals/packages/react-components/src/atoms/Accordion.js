import React, { useState } from "react";
import { ArrowIcon } from "./svgindex";
const Accordion = ({ title, children }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="accordion-wrapper" style={{ width: "100%", borderBottom: "1px solid #D6D5D4" }}>
      <div
        className="accordion-title"
        style={{ display: "flex", justifyContent: "space-between", padding: "10px", paddingLeft: "0px" }}
        onClick={() => setOpen(!isOpen)}
      >
        <div className="title">{title}</div>
        <ArrowIcon style={isOpen ? {} : {transform: 'rotate(90deg)'}} />
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};
export default Accordion;