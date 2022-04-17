import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PTIcon, OBPSIcon, PropertyHouse, CaseIcon, PGRIcon, FSMIcon, WSICon, MCollectIcon, CollectionIcon } from "./svgindex";

const IconsObject = {
  CommonPTIcon: <PTIcon />,
  OBPSIcon: <OBPSIcon />,
  propertyIcon: <PropertyHouse />,
  TLIcon: <CaseIcon />,
  PGRIcon: <PGRIcon />,
  FSMIcon: <FSMIcon />,
  WSIcon: <WSICon />,
  MCollectIcon: <MCollectIcon />,
  BillsIcon: <CollectionIcon />,
};
const SubMenu = ({ item, t }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);
  const leftIconArray = item.icon;
  const leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.BillsIcon;

  return (
    <React.Fragment>
      <div className="submenu-container">
        <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
          <div className="actions">
            {leftIcon}
            <span>{t(Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${item.moduleName}`))}</span>
          </div>
          <div> {item.links && subnav} </div>
        </div>
      </div>

      {subnav &&
        item.links
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((item, index) => {
            return (
              <Link to={item.link || item.navigationURL} key={index} className={`dropdown-link ${pathname === item.navigationURL ? "active" : ""}`}>
                <div className="actions">
                  <span>{item.label || item.displayName}</span>
                </div>
              </Link>
            );
          })}
    </React.Fragment>
  );
};

export default SubMenu;
