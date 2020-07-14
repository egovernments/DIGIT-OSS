import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const styles = {
  color: "rgba(0, 0, 0, 0.87)",
  marginLeft: "3%",
  marginTop: "8%",
  lineHeight: "35px",
  fontSize: "16px"
};

const clickHereStyles = {
  cursor: "pointer",
  textDecoration: "none",
  color: "#FE7A51"
}

function AddLinkForProperty(props) {
  const { url } = props;
  let link = window.location.origin;
  if(process.env.NODE_ENV !== "development"){
    link += "/"+process.env.REACT_APP_NAME.toLowerCase()
  }
  link += `/pt-common-screens/propertySearch?redirectUrl=${url}`
  return (
    <div style={styles}>
      <LabelContainer
        labelName="To Find/Create Property ID"
        labelKey="WS_APPLY_CREATE_MSG" /><span> </span><a href={`${link}`} ><LabelContainer
          style={clickHereStyles}
          labelKey="WS_APPLY_CLICK_HERE" />
      </a>
    </div>
  );
}

export default AddLinkForProperty;
