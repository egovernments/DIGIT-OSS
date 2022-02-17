import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowForward, ArrowVectorDown } from "@egovernments/digit-ui-react-components";

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);

  return (
    <React.Fragment>
      <div>
        <Link to={item.href} onClick={item.subNav && showSubnav} className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
          <div className="actions">
            {item.icon}
            <span>{item.element}</span>
          </div>

          <div> {item.subNav && subnav ? <ArrowVectorDown /> : item.subNav ? <ArrowForward /> : null} </div>
        </Link>
      </div>

      {subnav &&
        item.subNav?.map((item, index) => {
          return (
            <Link to={item.href} key={index} className="dropdown-link">
              <div className="actions">
                {item.icon}
                <span>{item.element}</span>
              </div>
            </Link>
          );
        })}
    </React.Fragment>
  );
};

export default SubMenu;
