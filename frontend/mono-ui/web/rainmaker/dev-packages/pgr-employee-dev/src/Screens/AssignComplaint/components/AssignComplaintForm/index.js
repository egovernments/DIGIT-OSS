import React from "react";
import HeaderCard from "../HeaderCard";
import ListCard from "../ListCard";

const FeedbackForm = ({ complaint, ...rest }) => {
  return (
    <div className="form-without-button-cont-generic">
      <HeaderCard complaint={complaint} />
      <ListCard {...rest} />
    </div>
  );
};

export default FeedbackForm;
