import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubMenu from "./SubMenu";

const NavBar = ({ open, toggleSidebar, profileItem, menuItems, onClose, Footer }) => {
  const node = useRef();
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();
  Digit.Hooks.useClickOutside(node, open ? onClose : null, open);

  const MenuItem = ({ item }) => {
    let itemComponent;
    if (item.type === "component") {
      itemComponent = item.action;
    } else {
      itemComponent = item.text;
    }
    const Item = () => (
      <span className="menu-item" {...item.populators}>
        {item?.icon && item.icon}
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
      return (
        <Link to={item.link}>
          <Item />
        </Link>
      );
    }
    if (item.type === "dynamic") {
      return <SubMenu item={item} t={t} toggleSidebar={toggleSidebar} />;
    }
    return <Item />;
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
          <div className="drawer-list">
            {menuItems.map((item, index) => (
              <div className={`sidebar-list ${pathname === item.link ? "active" : ""}`} key={index}>
                <MenuItem item={item} />
              </div>
            ))}
          </div>
          <div className="side-bar-footer">{Footer}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
