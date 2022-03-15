import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowForward, ArrowVectorDown, ArrowDirection } from "@egovernments/digit-ui-react-components";

const CitizenSubMenuSideBar = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);

  return (
    <React.Fragment>
      <div className="submenu-container">
        <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
          <div className="actions">
            {item.Icon}
            <span>{item.moduleName || item.displayName}</span>
          </div>
          <div> {item.links && subnav ? <ArrowVectorDown /> : item.links ? <ArrowForward /> : null} </div>
        </div>
      </div>

      {subnav &&
        item.links
          ?.filter((item) => item.url === "url" && item.displayName !== "Home")
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((item, index) => {
            return (
              <Link to={item.link || item.navigationURL} key={index} className={`dropdown-link ${pathname === item.link ? "active" : ""}`}>
                <div className="actions">
                  <ArrowDirection className="icon" />
                  <span>{item.label || item.displayName}</span>
                </div>
              </Link>
            );
          })}
    </React.Fragment>
  );
};

export default CitizenSubMenuSideBar;
