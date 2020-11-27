import React, { useRef } from "react";
import { StarFilled } from "./svgindex";
import { StarEmpty } from "./svgindex";

const Rating = (props) => {
  var stars = [];
  const star = useRef(null);

  for (var i = 1; i <= props.maxRating; i++) {
    if (i <= props.currentRating) {
      const index = i;
      // stars.push(<img key={i} src={starfilled} className="rating-star" alt="star filled" ref={star} onClick={(e,ref)=>props.onFeedback(e,ref)}/>)
      stars.push(<StarFilled key={i} className="rating-star" onClick={(e) => props.onFeedback(e, star, index)} />);
    } else {
      const index = i;
      // stars.push(<img key={i} src={starempty} className="rating-star" alt="star empty" ref={star} onClick={(e,ref)=>props.onFeedback(e,ref)}/>)
      stars.push(<StarEmpty key={i} className="rating-star" onClick={(e) => props.onFeedback(e, star, index)} />);
    }
  }

  return (
    <div className={`${props.withText ? "rating-with-text" : "rating-star-wrap"}`}>
      {" "}
      {props.text ? <span>{props.text}&nbsp;</span> : ""} {stars}
    </div>
  );
};

export default Rating;
