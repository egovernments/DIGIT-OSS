import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowForward, ArrowVectorDown, ArrowDirection } from "@egovernments/digit-ui-react-components";

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);
  return (
    <React.Fragment>
      <div>
        <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
          <div className="actions">
            {item.Icon}
            <span>{item.moduleName}</span>
          </div>
          <div> {item.links && subnav ? <ArrowVectorDown /> : item.links ? <ArrowForward /> : null} </div>
        </div>
      </div>

      {subnav &&
        item.links?.map((item, index) => {
          return (
            <Link to={item.link} key={index} className={`dropdown-link ${pathname === item.link ? "active" : ""}`}>
              <div className="actions">
                <ArrowDirection className="icon" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
    </React.Fragment>
  );
};

export default SubMenu;
