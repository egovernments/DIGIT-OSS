import React from 'react';
import { useEffect, useState } from "react";
import Rating from "../atoms/Rating";

const StarRating = (props) => {
  const [OptionList, setOptionList] = useState([]);
  const [rating, setRating] = useState(0);

  const feedback = (e, ref, index) => {
    setRating(index);
    const itemDetails = {
      key: index.toString(),
      value: index,
      type: "button"
    }
    props.onRatingSubmit(props.stepDetails, itemDetails)
  };

  useEffect(() => {
    setOptionList(props.data)
  }, [props.data])

  useEffect(() => {
    setOptionList(props.data)
  }, [])

  return (
    <div style={{
      border: "1px solid #d6d5d4",
      backgroundColor: "#fafafa",
      borderRadius: "8px",
      display: "flex",
      padding: "6px 0px 6px 6px",
      width: "188px",
      justifyContent: "center"
    }}>
      <Rating styles={{ width: "90%", marginBottom: "0px" }} currentRating={rating} maxRating={5} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
    </div>
  );
};

export default StarRating;
