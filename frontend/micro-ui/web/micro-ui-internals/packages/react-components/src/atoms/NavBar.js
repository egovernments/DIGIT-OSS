import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubMenu from "./SubMenu";
import {
  HomeIcon,
  BPAHomeIcon,
  PersonIcon,
  DocumentIconSolid,
  DropIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  ComplaintIcon,
  SearchIcon,
  CollectionIcon,
  PropertyHouse,
  CaseIcon,
  PTIcon,
  PGRIcon,
  MCollectIcon,
  OBPSIcon,
  WSICon,
  FSMIcon,
  Phone,
  LogoutIcon,
  EditPencilIcon,
  LanguageIcon,
  LoginIcon
} from "./svgindex";
import { BirthIcon, DeathIcon, FirenocIcon } from "..";

const IconsObject = {
  CommonPTIcon: <PTIcon className="icon" />,
  OBPSIcon: <OBPSIcon className="icon" />,
  propertyIcon: <PropertyHouse className="icon" />,
  TLIcon: <CaseIcon className="icon" />,
  PGRIcon: <PGRIcon className="icon" />,
  FSMIcon: <FSMIcon className="icon" />,
  WSIcon: <WSICon className="icon" />,
  BirthIcon: <BirthIcon className="icon" />,
  DeathIcon: <DeathIcon className="icon" />,
  FirenocIcon: <FirenocIcon className="icon" />,
  MCollectIcon: <MCollectIcon className="icon" />,
  BillsIcon: <CollectionIcon className="icon" />,
  home: <HomeIcon className="icon" />,
  announcement: <ComplaintIcon className="icon" />,
  business: <BPAHomeIcon className="icon" />,
  store: <PropertyHouse className="icon" />,
  assignment: <CaseIcon className="icon" />,
  receipt: <CollectionIcon className="icon" />,
  "business-center": <PersonIcon className="icon" />,
  description: <CollectionIcon className="icon" />,
  "water-tap": <DropIcon className="icon" />,
  "collections-bookmark": <CollectionsBookmarIcons className="icon" />,
  "insert-chart": <FinanceChartIcon className="icon" />,
  edcr: <CollectionIcon className="icon" />,
  collections: <CollectionIcon className="icon" />,
  "open-complaints": <ComplaintIcon className="icon" />,
  HomeIcon: <HomeIcon className="icon" />,
  EditPencilIcon: <EditPencilIcon className="icon" />,
  LogoutIcon: <LogoutIcon className="icon" />,
  Phone: <Phone className="icon" />,
  LanguageIcon: <LanguageIcon className="icon" />,
  LoginIcon: <LoginIcon className="icon" />
};
const NavBar = ({ open, toggleSidebar, profileItem, menuItems, onClose, Footer, isEmployee, search, setSearch,isSideBarScroll }) => {
  const node = useRef();
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();
  Digit.Hooks.useClickOutside(node, open ? onClose : null, open);

  if(isSideBarScroll &&  !Digit.clikOusideFired)
  {
    document.getElementById("sideBarMenu").scrollTo(0,0);
  }

  const MenuItem = ({ item }) => {
    let itemComponent;
    if (item.type === "component") {
      itemComponent = item.action;
    } else {
      itemComponent = item.text;
    }
    const leftIconArray = item.icon || item.icon?.type?.name;
    const leftIcon = leftIconArray ? IconsObject[leftIconArray] : IconsObject.BillsIcon;
    const Item = () => (
      <span className="menu-item" {...item.populators}>
        {leftIcon}
        <div className="menu-label">{itemComponent}</div>
      </span>
    );

    if (item.type === "external-link") {
      return (
        <a href={item.link}>
          <Item />
        </a>
      );
    }
    if (item.type === "link") {
      if (item.link.indexOf("/digit-ui") === -1 && isEmployee) {
        const getOrigin = window.location.origin;
        return (
          <a href={getOrigin + "/employee/" + item.link}>
            <Item />
          </a>
        );
      }
      return (
        <Link to={item.link}>
          <Item />
        </Link>
      );
    }

    if (item.type === "dynamic") {
      if (isEmployee) {
        return <SubMenu item={item} t={t} toggleSidebar={toggleSidebar} isEmployee={isEmployee} />;
      }
    }
    return <Item />;
  };

  const renderSearch = () => {
    return (
      <div className="sidebar-list">
        <div className="submenu-container">
          <div className="sidebar-link">
            <div className="actions">
              <SearchIcon className="icon" />
              <input
                className="employee-search-input"
                type="text"
                placeholder={t(`ACTION_TEST_SEARCH`)}
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <div>
        <div
          style={{
            position: "fixed",
            height: "100%",
            width: "100%",
            top: "0px",
            left: `${open ? "0px" : "-100%"}`,
            opacity: "1",
            backgroundColor: "rgba(0, 0, 0, 0.54)",
            willChange: "opacity",
            transform: "translateZ(0px)",
            transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
            zIndex: "1200",
            pointerzevents: "auto",
          }}
        ></div>
        <div
          ref={node}
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "56px",
            height: "calc(100vh - 56px)",
            position: "fixed",
            top: 0,
            left: 0,
            transition: "transform 0.3s ease-in-out",
            background: "#fff",
            zIndex: "1999",
            width: "280px",
            transform: `${open ? "translateX(0)" : "translateX(-450px)"}`,
            boxShadow: "rgb(0 0 0 / 16%) 8px 0px 16px",
          }}
        >
          {profileItem}
          <div className="drawer-list" id="sideBarMenu">
            {isEmployee ? renderSearch() : null}
            {menuItems?.map((item, index) => (
              <div className={`sidebar-list ${pathname === item.link ? "active" : ""}`} key={index}>
                <MenuItem item={item} />
              </div>
            ))}
            <div className={`sidebar-list`}>
              <div className="side-bar-footer">{Footer}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
