import React from "react";

const Header = (props) => {
  return <header className="h1" style={props.styles}>{props.children}</header>;
};

export default Header;
