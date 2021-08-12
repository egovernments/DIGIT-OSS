import React from "react";

const RoundedLabel = ({ count }) => (count ? <div className="roundedLabel">{count}</div> : <React.Fragment></React.Fragment>);

export default RoundedLabel;
