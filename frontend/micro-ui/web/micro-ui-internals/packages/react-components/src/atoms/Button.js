import React from "react";
import PropTypes from "prop-types";

/**
 * Button Component 
 *
 * @author jagankumar-egov
 *
 * Feature :: CORE
 *
 * @example
 *  // Primary button
    <Button label={t(configs?.label)} onButtonClick={()=>{}} type="button" style={{ marginLeft: "10px" }} />
    // Secondary button & Optional with Icon
    <Button label={t(configs?.label)} variation="secondary" icon={<AddFilled />} onButtonClick={()=>{}} type="button" style={{ marginLeft: "10px" }} />
    // Disabled Button
    <Button label={t("Disabled")} onButtonClick={()=>{}} type="button" style={{ marginLeft: "10px" }} isDisabled={true} />
 */

const Button = (props) => {
  let className = props?.variation !== "primary" ? `jk-digit-secondary-btn` : `jk-digit-primary-btn`;
  return (
    <button
      className={`${className} ${(props?.className && props?.className) || ""} ${(props?.isDisabled && "jk-digit-disabled-btn") || ""}`}
      type={props.type || "button"}
      form={props.formId}
      onClick={props.onButtonClick}
      disabled={props?.isDisabled}
      style={props.style ? props.style : null}
    >
      {props?.icon && props.icon}
      <h2 style={{ ...props?.textStyles, ...{ width: "100%" } }}>{props.label}</h2>
    </button>
  );
};

Button.propTypes = {
  /**
   * ButtonSelector content
   */
  label: PropTypes.string.isRequired,
  /**
   * button border theme
   */
  variation: PropTypes.string,
  /**
   * button icon if any
   */
  icon: PropTypes.element,
  /**
   * click handler
   */
  onButtonClick: PropTypes.func.isRequired,
  /**
   * Custom classname
   */
  className: PropTypes.string,
  /**
   * Custom styles
   */
  style: PropTypes.object,
  /**
   * Custom label style or h2 style
   */
  textStyles: PropTypes.object,
};

Button.defaultProps = {
  label: "TEST",
  variation: "primary",
  onButtonClick: () => {},
};

export default Button;
