import React from "react";
import { Link } from "react-router-dom";

const CitizenHomeCard = ({ header, links, state, Icon, Info, isInfo = false }) => {
  return (
    <div className="CitizenHomeCard">
      <div className="header">
        <h2>{header}</h2>
        <Icon />
      </div>

      <div className="links">
        {links.map((e, i) => (
          <Link key={i} to={{ pathname: e.link, state }}>
            {e.i18nKey}
          </Link>
        ))}
      </div>
      <div>
        {isInfo ? <Info /> : null} 
      </div>
    </div>
  );
};

export default CitizenHomeCard;
