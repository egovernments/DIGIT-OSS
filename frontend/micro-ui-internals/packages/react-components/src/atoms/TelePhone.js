import React from "react";
import { Phone } from "./svgindex";

const TelePhone = ({ mobile, text }) => (
  <React.Fragment>
    {text}
    <div className="telephone">
      <div className="call">
        <a href={`tel:${mobile}`}>{mobile}</a>
        <Phone />
      </div>
    </div>
  </React.Fragment>
);

export default TelePhone;
