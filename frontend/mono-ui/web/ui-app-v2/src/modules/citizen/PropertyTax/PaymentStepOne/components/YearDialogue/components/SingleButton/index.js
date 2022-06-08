import React from "react";
import { Link } from "react-router-dom";
import { Button } from "components";
import "./index.css";

const SingleButton = ({ label, handleClose }) => {
  return (
    <Link to="/citizen/pt-payment/property-address">
      <Button className="year-range-button" label={label} labelColor="#00bbd3" buttonStyle={{ borderRadius: "50px", border: "1px solid #00bbd3" }} />
    </Link>
  );
};

export default SingleButton;
