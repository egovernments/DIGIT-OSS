import React from "react";
import "./index.css";
import { Ratings } from "components";

const RatingsComponent = ({ size, count, onChange }) => {
  return (
    <div className="feedback-ratings-cont">
      <Ratings id="feedback-ratings" className="feedback-ratings" size={40} onChange={onChange} count={5} half={false} />
    </div>
  );
};

export default RatingsComponent;
