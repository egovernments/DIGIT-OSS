import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import get from "lodash/get";

const TlHowItWorks = ({ url }) => {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
       // src={url}
        src="https://s3.ap-south-1.amazonaws.com/ukd-egov-assets/TL_English_UserManual_Citizen.pdf"
        style={{ width: "100%", height: "90%" }}
        frameborder="0"
      />
    </div>
  );
};



export default connect(
  null
)(TlHowItWorks);
