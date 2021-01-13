import React from "react";
import { SuccessSvg } from "./svgindex";
import { ErrorSvg } from "./svgindex";
import PropTypes from "prop-types";

const Successful = (props) => {
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "success-wrap" : "emp-success-wrap"}>
      <header>{props.props.message}</header>
      <div>
        {/* <img src={success} alt="successfull submition"/> */}
        <SuccessSvg />
        <h2>{props?.props?.complaintNumber ? "Complaint No." : props.props.info}</h2>
        <p>{props?.props?.complaintNumber ? props?.props?.complaintNumber : props?.props?.applicationNumber}</p>
      </div>
    </div>
  );
};

const Error = (props) => {
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "error-wrap" : "emp-error-wrap"}>
      <header>{props.props.message}</header>
      <ErrorSvg />
      {/* <img src={error} alt="error while submition"/> */}
    </div>
  );
};

const Banner = (props) => {
  return props.successful ? <Successful props={props} /> : <Error props={props} />;
};

Banner.propTypes = {
  /**
   * Is banner is successful or error?
   */
  successful: PropTypes.bool.isRequired,
  /**
   * Banner message
   */
  message: PropTypes.any.isRequired,
  /**
   * If banner is successful, then show the complaint number
   */
  complaintNumber: PropTypes.any,
};

Banner.defaultProps = {
  successful: true,
};

export default Banner;
