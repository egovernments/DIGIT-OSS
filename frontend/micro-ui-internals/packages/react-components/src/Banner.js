import React from "react";
import { SuccessSvg } from "./svgindex";
import { ErrorSvg } from "./svgindex";

const Successful = (props) => {
  return (
    <div className="success-wrap">
      <header>{props.props.message}</header>
      <div>
        {/* <img src={success} alt="successfull submition"/> */}
        <SuccessSvg />
        <h2>Complaint No.</h2>
        <p>{props.props.complaintNumber}</p>
      </div>
    </div>
  );
};

const Error = (props) => {
  return (
    <div className="error-wrap">
      <header>{props.props.message}</header>
      <ErrorSvg />
      {/* <img src={error} alt="error while submition"/> */}
    </div>
  );
};

const Banner = (props) => {
  return props.successful ? <Successful props={props} /> : <Error props={props} />;
};

export default Banner;
