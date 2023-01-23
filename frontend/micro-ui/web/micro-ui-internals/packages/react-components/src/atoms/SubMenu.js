import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PTIcon,
  OBPSIcon,
  PropertyHouse,
  CaseIcon,
  PGRIcon,
  FSMIcon,
  WSICon,
  MCollectIcon,
  CollectionIcon,
  HomeIcon,
  ComplaintIcon,
  PersonIcon,
  DocumentIconSolid,
  DropIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
} from "./svgindex";

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
  home: <HomeIcon />,
  announcement: <ComplaintIcon />,
  business: <ComplaintIcon />,
  store: <PropertyHouse />,
  assignment: <CaseIcon />,
  receipt: <CollectionIcon />,
  "business-center": <PersonIcon />,
  description: <DocumentIconSolid />,
  "water-tap": <DropIcon />,
  "collections-bookmark": <CollectionsBookmarIcons />,
  "insert-chart": <FinanceChartIcon />,
  edcr: <CollectionIcon />,
  collections: <CollectionIcon />,
};
const SubMenu = ({ item, t, isEmployee }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);

  const leftIconCitizenArray = item.icon;
  const leftIconCitizen = IconsObject[leftIconCitizenArray] || IconsObject.BillsIcon;

  const leftIconEmployeeItems = item?.icon?.split?.(":")?.[1] || "";

  const leftIconEmployee = IconsObject[leftIconEmployeeItems] || IconsObject.collections;

  return (
    <React.Fragment>
      <div className="submenu-container">
        <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
          <div className="actions">
            {isEmployee ? leftIconEmployee : leftIconCitizen}
            <span>{isEmployee ? item.moduleName : t(Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${item.moduleName}`))}</span>
          </div>
          <div> {item.links && subnav} </div>
        </div>
      </div>

      {subnav &&
        item.links
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((item, index) => {
            if (item.navigationURL.indexOf(`/${window?.contextPath}`) === -1) {
              const getOrigin = window.location.origin;
              return (
                <a
                  key={index + 1}
                  className={`dropdown-link ${pathname === item.link ? "active" : ""}`}
                  href={getOrigin + "/employee/" + item.navigationURL}
                >
                  <div className="actions">
                    <span>{item.label || item.displayName}</span>
                  </div>
                </a>
              );
            }
            return (
              <Link
                to={item.link || item.navigationURL}
                key={index + 1}
                className={`dropdown-link ${pathname === item.navigationURL ? "active" : ""}`}
              >
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
