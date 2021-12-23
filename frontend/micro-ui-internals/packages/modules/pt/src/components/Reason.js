import React from "react";

const Reason = ({ headComment, otherComment }) => (
  <div className="checkpoint-comments-wrap">
    <h4>{headComment}</h4>
    <p>{otherComment}</p>
  </div>
);

export default Reason;
