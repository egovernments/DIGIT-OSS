import React, { useRef } from "react";
import { StarFilled } from "./svgindex";
import { StarEmpty } from "./svgindex";
import PropTypes from "prop-types";

const Rating = (props) => {
  var stars = [];
  const star = useRef(null);

  for (var i = 1; i <= props.maxRating; i++) {
    if (i <= props.currentRating) {
      const index = i;
      // stars.push(<img key={i} src={starfilled} className="rating-star" alt="star filled" ref={star} onClick={(e,ref)=>props.onFeedback(e,ref)}/>)
      stars.push(<StarFilled key={i} className="rating-star" styles={props.starStyles} onClick={(e) => props.onFeedback(e, star, index)} />);
    } else {
      const index = i;
      // stars.push(<img key={i} src={starempty} className="rating-star" alt="star empty" ref={star} onClick={(e,ref)=>props.onFeedback(e,ref)}/>)
      stars.push(<StarEmpty key={i} className="rating-star" styles={props.starStyles} onClick={(e) => props.onFeedback(e, star, index)} />);
    }
  }

  return (
    <div className={`${props.withText ? "rating-with-text" : "rating-star-wrap"}`} style={{ ...props.styles }}>
      {props.text ? props.text : ""} {stars}
    </div>
  );
};

Rating.propTypes = {
  maxRating: PropTypes.number,
  currentRating: PropTypes.number,
  onFeedback: PropTypes.func,
};

Rating.defaultProps = {
  maxRating: 5,
  currentRating: 0,
  onFeedback: () => {},
};

export default Rating;
