import React from "react";

const Header = (props) => {
  return <header className="h1" style={props.styles ? {...props.styles, fontSize:"32px", fontFamily:"Roboto Condensed"} : {fontSize : "32px", fontFamily:"Roboto Condensed"}}>{props.children}</header>;
};

export default Header;
