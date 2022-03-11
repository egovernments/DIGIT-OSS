import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowForward,
  ArrowVectorDown,
  ArrowDirection,
  HomeIcon,
  ComplaintIcon,
  BPAHomeIcon,
  PropertyHouse,
  CaseIcon,
  ReceiptIcon,
  PersonIcon,
  DocumentIconSolid,
  DropIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
} from "@egovernments/digit-ui-react-components";

const SubMenu = ({ item }) => {
  console.log("submenu", item);
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const showSubnav = () => setSubnav(!subnav);
  const IconsObject = {
    home: <HomeIcon />,
    announcement: <ComplaintIcon />,
    business: <BPAHomeIcon />,
    store: <PropertyHouse />,
    assignment: <CaseIcon />,
    receipt: <ReceiptIcon />,
    "business-center": <PersonIcon />,
    description: <DocumentIconSolid />,
    "water-tap": <DropIcon />,
    "collections-bookmark": <CollectionsBookmarIcons />,
    "insert-chart": <FinanceChartIcon />,
    edcr: <CollectionIcon />,
    collections: <CollectionIcon />,
  };
  const leftIconArray = item.icon.leftIcon.split(":")[1];
  const leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.collections;

  console.log("submennnnuu", item);

  const renderSubMenu = () => {
    //render only if the item.icon.path had dot in it

    return item.links
      .filter((item) => item.url === "url" || item.url !== "")
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map((item, index) => {
        debugger;
        console.log("itemmmmmm", item);
        return (
          <Link to={item.link || item.navigationURL} key={index} className={`dropdown-link ${pathname === item.link ? "active" : ""}`}>
            <div className="actions">
              <ArrowDirection className="icon" />
              <span>{item.label || item.displayName}</span>
            </div>
          </Link>
        );
      });
  };

  return (
    <React.Fragment>
      <div className="submenu-container">
        <div onClick={item.links && showSubnav} className={`sidebar-link ${subnav === true ? "active" : ""}`}>
          <div className="actions">
            {item.Icon || leftIcon}
            <span>{item.moduleName || item.displayName}</span>
          </div>
          <div> {item.links && subnav ? <ArrowVectorDown /> : item.links ? <ArrowForward /> : null} </div>
        </div>
      </div>

      {subnav && renderSubMenu()}
    </React.Fragment>
  );
};

export default SubMenu;
