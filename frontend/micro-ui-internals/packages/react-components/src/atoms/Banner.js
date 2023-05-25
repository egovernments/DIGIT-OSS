import React from "react";
import { SuccessSvg } from "./svgindex";
import { ErrorSvg } from "./svgindex";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Successful = (props) => {
  const { t } = useTranslation();
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "success-wrap" : "emp-success-wrap"}>
      <header>{props.props.message}</header>
      <div>
        {/* <img src={success} alt="successfull submition"/> */}
        {props?.props?.svg || <SuccessSvg />}
        <h2>{props?.props?.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info}</h2>
        <p>{props?.props?.complaintNumber ? props?.props?.complaintNumber : props?.props?.applicationNumber}</p>
      </div>
    </div>
  );
};

const Error = (props) => {
  const { t } = useTranslation();
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "error-wrap" : "emp-error-wrap"}>
      <header>{props.props.message}</header>
      <ErrorSvg />
      {/* <img src={error} alt="error while submition"/> */}
      <h2>{props?.props?.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info}</h2>
      <p>{props?.props?.complaintNumber ? props?.props?.complaintNumber : props?.props?.applicationNumber}</p>
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
