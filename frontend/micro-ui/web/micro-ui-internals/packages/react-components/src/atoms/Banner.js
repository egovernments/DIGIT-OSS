import React from "react";
import { SuccessSvg,TickMark } from "./svgindex";
import { ErrorSvg } from "./svgindex";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Successful = (props) => {
  const { t } = useTranslation();
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "success-wrap" : "emp-success-wrap"} style={props?.props?.style ? props?.props?.style : {}}>
      <header style={props?.props?.headerStyles ? props?.props?.headerStyles : {}}>{props.props.message}</header>
      <div>
        {props.props.whichSvg==="tick"? <div><TickMark fillColor="green" /><br /><br /> </div>: (props?.props?.svg || <SuccessSvg />) } 
        {/* {props?.props?.svg || <SuccessSvg />} */}
        {(props?.props?.complaintNumber || props.props.info) && <h2 style={props?.props?.infoStyles ? props?.props?.infoStyles : {}}>{props?.props?.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info}</h2>}
        {(props?.props?.complaintNumber || props?.props?.applicationNumber) &&<p style={props?.props?.applicationNumberStyles ? props?.props?.applicationNumberStyles : {}}>{props?.props?.complaintNumber ? props?.props?.complaintNumber : props?.props?.applicationNumber}</p>}
        {props?.props?.applicationNumberOne ? <h2 style={props?.props?.infoOneStyles ? props?.props?.infoOneStyles : {}}>{props.props.infoOne}</h2> : null}
        {props?.props?.applicationNumberOne ? <p style={props?.props?.applicationNumberStyles ? props?.props?.applicationNumberStyles : {}}>{props?.props?.applicationNumberOne}</p> : null}
      </div>
    </div>
  );
};

const Error = (props) => {
  const { t } = useTranslation();
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <div className={user_type === "citizen" ? "error-wrap" : "emp-error-wrap"} style={props?.props?.style ? props?.props?.style : {}}>
      <header style={props?.props?.headerStyles ? props?.props?.headerStyles : {}}>{props.props.message}</header>
      <ErrorSvg />
      {/* <img src={error} alt="error while submition"/> */}
      <h2 style={props?.props?.infoStyles ? props?.props?.infoStyles : {}}>{props?.props?.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info}</h2>
      <p style={props?.props?.applicationNumberStyles ? props?.props?.applicationNumberStyles : {}}>{props?.props?.complaintNumber ? props?.props?.complaintNumber : props?.props?.applicationNumber}</p>
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
