import React from "react";
import { Link } from "react-router-dom";

const CitizenHomeCard = ({ header, links, state, Icon }) => {
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
    </div>
  );
};

export default CitizenHomeCard;
