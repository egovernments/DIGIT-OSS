import React from "react";
import { Phone } from "./svgindex";

const TelePhone = ({ mobile, text }) => (
  <div className="telephone">
    <div>
      <p>{text}</p>
    </div>
    <div className="call">
      <a href={`tel:${mobile}`}>&nbsp;{mobile}</a>
      <Phone />
    </div>
  </div>
);

export default TelePhone;
